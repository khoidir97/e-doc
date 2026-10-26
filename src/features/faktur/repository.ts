import pool, { initDatabase } from '@/lib/db';
import {
  Faktur,
  CreateFakturInput,
  UpdateFakturInput,
  FakturHeader,
  FakturWithDetails,
  UpsertFakturHeaderInput,
} from './types';

import { MasterDokumenRepository } from '../master-dokumen/repository';

export class FakturHeaderRepository {
  static async findByMasterDokumenId(mdk_id: number): Promise<FakturHeader | null> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT * FROM faktur WHERE fak_master_dokumen_id = ? AND fak_deleted_at IS NULL ORDER BY fak_id DESC LIMIT 1`,
      [mdk_id]
    );
    return rows.length > 0 ? (rows[0] as FakturHeader) : null;
  }

  static async upsert(input: UpsertFakturHeaderInput, userId?: number | null): Promise<number> {
    await initDatabase();
    const existing = await this.findByMasterDokumenId(input.fak_master_dokumen_id);
    const tglFaktur = input.fak_tanggal_faktur ? new Date(input.fak_tanggal_faktur) : null;

    if (existing) {
      await pool.query(
        `UPDATE faktur SET
          fak_nomor_faktur = ?,
          fak_tanggal_faktur = ?,
          fak_updated_by = ?,
          fak_updated_at = NOW()
         WHERE fak_id = ?`,
        [
          input.fak_nomor_faktur ?? null,
          tglFaktur,
          userId ?? null,
          existing.fak_id,
        ]
      );
      return existing.fak_id;
    } else {
      const [result]: any = await pool.query(
        `INSERT INTO faktur
          (fak_master_dokumen_id, fak_nomor_faktur, fak_tanggal_faktur, fak_created_by)
         VALUES (?, ?, ?, ?)`,
        [
          input.fak_master_dokumen_id,
          input.fak_nomor_faktur ?? null,
          tglFaktur,
          userId ?? null,
        ]
      );
      return result.insertId;
    }
  }
}

export class FakturRepository {
  static async findMany(search = '', limit = 10, offset = 0): Promise<{ data: any[]; total: number }> {
    await initDatabase();

    let whereClause = 'WHERE s.fkt_deleted_at IS NULL';
    const params: any[] = [];

    if (search.trim()) {
      whereClause += ' AND (s.fkt_jenis_spesifikasi LIKE ? OR m.mdk_uraian_belanja LIKE ? OR m.mdk_no_dpa LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    const [countRows] = await pool.query<any[]>(
      `SELECT COUNT(*) as total 
       FROM detail_faktur s
       LEFT JOIN master_dokumen m ON s.fkt_master_dokumen_id = m.mdk_id 
       ${whereClause}`,
      params
    );
    const total = countRows[0]?.total || 0;

    const dataParams = [...params, Number(limit), Number(offset)];
    const [rows] = await pool.query<any[]>(
      `SELECT s.fkt_id, s.fkt_faktur_id, s.fkt_master_dokumen_id, s.fkt_jenis_spesifikasi, s.fkt_unit, s.fkt_hari, s.fkt_harga_satuan, s.fkt_total, s.fkt_created_at,
              m.mdk_uraian_belanja, m.mdk_no_dpa, b.bdg_nama AS mdk_bagian, b.bdg_nama, m.mdk_pagu_anggaran
       FROM detail_faktur s
       LEFT JOIN master_dokumen m ON s.fkt_master_dokumen_id = m.mdk_id
       LEFT JOIN bidang b ON m.mdk_bidang_id = b.bdg_id
       ${whereClause} 
       ORDER BY s.fkt_id DESC 
       LIMIT ? OFFSET ?`,
      dataParams
    );

    return {
      data: rows,
      total,
    };
  }

  static async findByMasterDokumenId(mdk_id: number): Promise<Faktur[]> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT fkt_id, fkt_faktur_id, fkt_master_dokumen_id, fkt_jenis_spesifikasi, fkt_unit, fkt_hari, fkt_harga_satuan, fkt_total, fkt_created_at 
       FROM detail_faktur 
       WHERE fkt_master_dokumen_id = ? AND fkt_deleted_at IS NULL 
       ORDER BY fkt_id ASC`,
      [mdk_id]
    );
    return rows as Faktur[];
  }

  static async findFakturWithDetailsByMasterDokumenId(mdk_id: number): Promise<FakturWithDetails> {
    await initDatabase();

    // 1. Fetch Master Dokumen info using repository
    const masterDokumen = await MasterDokumenRepository.findById(mdk_id);

    // 2. Fetch Faktur Header
    const header = await FakturHeaderRepository.findByMasterDokumenId(mdk_id);

    // 3. Fetch Detail Rows
    const details = await this.findByMasterDokumenId(mdk_id);

    return {
      header,
      details,
      masterDokumen,
    };
  }

  static async findById(fkt_id: number): Promise<Faktur | null> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT fkt_id, fkt_faktur_id, fkt_master_dokumen_id, fkt_jenis_spesifikasi, fkt_unit, fkt_hari, fkt_harga_satuan, fkt_total, fkt_created_at 
       FROM detail_faktur 
       WHERE fkt_id = ? AND fkt_deleted_at IS NULL 
       LIMIT 1`,
      [fkt_id]
    );
    if (!rows || rows.length === 0) return null;
    return rows[0] as Faktur;
  }

  static async saveBatch(
    data: {
      fkt_master_dokumen_id: number;
      fak_nomor_faktur?: string | null;
      fak_tanggal_faktur?: string | Date | null;
      items: { fkt_id?: number; fkt_jenis_spesifikasi: string; fkt_unit: number; fkt_hari: string; fkt_harga_satuan: number; fkt_total: number }[];
    },
    userId?: number | null
  ): Promise<boolean> {
    await initDatabase();

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const { fkt_master_dokumen_id, fak_nomor_faktur = null, fak_tanggal_faktur = null, items } = data;

      // 1. Upsert Header
      let fakId: number;
      const [existingHeader] = await connection.query<any[]>(
        `SELECT fak_id FROM faktur WHERE fak_master_dokumen_id = ? AND fak_deleted_at IS NULL LIMIT 1`,
        [fkt_master_dokumen_id]
      );

      const tglFaktur = fak_tanggal_faktur ? new Date(fak_tanggal_faktur) : null;

      if (existingHeader && existingHeader.length > 0) {
        fakId = existingHeader[0].fak_id;
        await connection.query(
          `UPDATE faktur SET fak_nomor_faktur = ?, fak_tanggal_faktur = ?, fak_updated_by = ?, fak_updated_at = NOW() WHERE fak_id = ?`,
          [fak_nomor_faktur, tglFaktur, userId ?? null, fakId]
        );
      } else {
        const [insertHeaderRes]: any = await connection.query(
          `INSERT INTO faktur (fak_master_dokumen_id, fak_nomor_faktur, fak_tanggal_faktur, fak_created_by) VALUES (?, ?, ?, ?)`,
          [fkt_master_dokumen_id, fak_nomor_faktur, tglFaktur, userId ?? null]
        );
        fakId = insertHeaderRes.insertId;
      }

      // 2. Soft delete current Detail items for this mdk_id
      await connection.query(
        `UPDATE detail_faktur 
         SET fkt_deleted_at = NOW(), fkt_deleted_by = ? 
         WHERE fkt_master_dokumen_id = ? AND fkt_deleted_at IS NULL`,
        [userId ?? null, fkt_master_dokumen_id]
      );

      // 3. Insert new Detail items with foreign key fkt_faktur_id
      for (const item of items) {
        if (item.fkt_jenis_spesifikasi.trim()) {
          await connection.query(
            `INSERT INTO detail_faktur (fkt_faktur_id, fkt_master_dokumen_id, fkt_jenis_spesifikasi, fkt_unit, fkt_hari, fkt_harga_satuan, fkt_total, fkt_created_by) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              fakId,
              fkt_master_dokumen_id,
              item.fkt_jenis_spesifikasi.trim(),
              Number(item.fkt_unit) || 0,
              item.fkt_hari ?? '',
              Number(item.fkt_harga_satuan) || 0,
              Number(item.fkt_total) || 0,
              userId ?? null,
            ]
          );
        }
      }

      await connection.commit();
      return true;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  static async insert(input: CreateFakturInput): Promise<number> {
    await initDatabase();
    const [result]: any = await pool.query(
      `INSERT INTO detail_faktur (fkt_faktur_id, fkt_master_dokumen_id, fkt_jenis_spesifikasi, fkt_unit, fkt_hari, fkt_harga_satuan, fkt_total, fkt_created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.fkt_faktur_id ?? null,
        input.fkt_master_dokumen_id,
        input.fkt_jenis_spesifikasi,
        input.fkt_unit,
        input.fkt_hari,
        input.fkt_harga_satuan,
        input.fkt_total,
        input.fkt_created_by ?? null,
      ]
    );
    return result.insertId;
  }

  static async update(input: UpdateFakturInput): Promise<boolean> {
    await initDatabase();
    const [result]: any = await pool.query(
      `UPDATE detail_faktur 
       SET fkt_faktur_id = ?, fkt_master_dokumen_id = ?, fkt_jenis_spesifikasi = ?, fkt_unit = ?, fkt_hari = ?, fkt_harga_satuan = ?, fkt_total = ?, fkt_updated_by = ?, fkt_updated_at = NOW() 
       WHERE fkt_id = ? AND fkt_deleted_at IS NULL`,
      [
        input.fkt_faktur_id ?? null,
        input.fkt_master_dokumen_id,
        input.fkt_jenis_spesifikasi,
        input.fkt_unit,
        input.fkt_hari,
        input.fkt_harga_satuan,
        input.fkt_total,
        input.fkt_updated_by ?? null,
        input.fkt_id,
      ]
    );
    return result.affectedRows > 0;
  }

  static async softDelete(fkt_id: number, deletedBy?: number | null): Promise<boolean> {
    await initDatabase();
    const [result]: any = await pool.query(
      `UPDATE detail_faktur 
       SET fkt_deleted_at = NOW(), fkt_deleted_by = ?
       WHERE fkt_id = ? AND fkt_deleted_at IS NULL`,
      [deletedBy ?? null, fkt_id]
    );
    return result.affectedRows > 0;
  }
}
