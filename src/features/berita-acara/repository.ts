import pool, { initDatabase } from '@/lib/db';
import { BeritaAcara, BeritaAcaraHeader, CreateBeritaAcaraInput, UpdateBeritaAcaraInput } from './types';

export class BeritaAcaraRepository {
  static async findHeaderByMasterDokumenId(mdk_id: number): Promise<BeritaAcaraHeader | null> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT bac_id, bac_master_dokumen_id, bac_nomor_surat, bac_paragraf_pertama, bac_paragraf_kedua, bac_hasil_pemeriksaan, bac_tanggal, bac_created_at
       FROM berita_acara 
       WHERE bac_master_dokumen_id = ? AND bac_deleted_at IS NULL 
       ORDER BY bac_id DESC 
       LIMIT 1`,
      [mdk_id]
    );
    if (!rows || rows.length === 0) return null;
    return rows[0] as BeritaAcaraHeader;
  }

  static async findMany(search = '', limit = 10, offset = 0): Promise<{ data: any[]; total: number }> {
    await initDatabase();

    let whereClause = 'WHERE s.dba_deleted_at IS NULL';
    const params: any[] = [];

    if (search.trim()) {
      whereClause += ' AND (s.dba_uraian LIKE ? OR m.mdk_uraian_belanja LIKE ? OR m.mdk_no_dpa LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    const [countRows] = await pool.query<any[]>(
      `SELECT COUNT(*) as total 
       FROM detail_berita_acara s
       LEFT JOIN master_dokumen m ON s.dba_master_dokumen_id = m.mdk_id 
       ${whereClause}`,
      params
    );
    const total = countRows[0]?.total || 0;

    const dataParams = [...params, Number(limit), Number(offset)];
    const [rows] = await pool.query<any[]>(
      `SELECT s.dba_id, s.dba_berita_acara_id, s.dba_master_dokumen_id, s.dba_uraian, s.dba_volume, s.dba_satuan, s.dba_status_pemeriksaan, s.dba_created_at,
              m.mdk_uraian_pekerjaan, m.mdk_no_dpa, b.bdg_nama AS mdk_bagian, b.bdg_nama, m.mdk_pagu_anggaran
       FROM detail_berita_acara s
       LEFT JOIN master_dokumen m ON s.dba_master_dokumen_id = m.mdk_id
       LEFT JOIN bidang b ON m.mdk_bidang_id = b.bdg_id
       ${whereClause} 
       ORDER BY s.dba_id DESC 
       LIMIT ? OFFSET ?`,
      dataParams
    );

    return {
      data: rows,
      total,
    };
  }

  static async findByMasterDokumenId(mdk_id: number): Promise<BeritaAcara[]> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT dba_id, dba_berita_acara_id, dba_master_dokumen_id, dba_uraian, dba_volume, dba_satuan, dba_status_pemeriksaan, dba_created_at 
       FROM detail_berita_acara 
       WHERE dba_master_dokumen_id = ? AND dba_deleted_at IS NULL 
       ORDER BY dba_id ASC`,
      [mdk_id]
    );
    return rows as BeritaAcara[];
  }

  static async findById(dba_id: number): Promise<BeritaAcara | null> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT dba_id, dba_berita_acara_id, dba_master_dokumen_id, dba_uraian, dba_volume, dba_satuan, dba_status_pemeriksaan, dba_created_at 
       FROM detail_berita_acara 
       WHERE dba_id = ? AND dba_deleted_at IS NULL 
       LIMIT 1`,
      [dba_id]
    );
    if (!rows || rows.length === 0) return null;
    return rows[0] as BeritaAcara;
  }

  static async saveBatch(
    mdk_id: number,
    header: { bac_nomor_surat: string; bac_paragraf_pertama: string; bac_paragraf_kedua: string; bac_hasil_pemeriksaan: string; bac_tanggal: Date | string },
    items: { dba_uraian: string; dba_volume: string; dba_satuan: string; dba_status_pemeriksaan: string }[],
    userId?: number | null
  ): Promise<boolean> {
    await initDatabase();

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Check existing header record in berita_acara table
      const [existingHeader] = await connection.query<any[]>(
        `SELECT bac_id FROM berita_acara WHERE bac_master_dokumen_id = ? AND bac_deleted_at IS NULL LIMIT 1`,
        [mdk_id]
      );

      let beritaAcaraId: number;

      if (existingHeader && existingHeader.length > 0) {
        beritaAcaraId = existingHeader[0].bac_id;
        await connection.query(
          `UPDATE berita_acara 
           SET bac_nomor_surat = ?, bac_paragraf_pertama = ?, bac_paragraf_kedua = ?, bac_hasil_pemeriksaan = ?, bac_tanggal = ?, bac_updated_at = NOW(), bac_updated_by = ?
           WHERE bac_id = ?`,
          [
            header.bac_nomor_surat || '',
            header.bac_paragraf_pertama || '',
            header.bac_paragraf_kedua || '',
            header.bac_hasil_pemeriksaan || '',
            header.bac_tanggal,
            userId ?? null,
            beritaAcaraId,
          ]
        );
      } else {
        const [insertHeaderResult]: any = await connection.query(
          `INSERT INTO berita_acara (bac_master_dokumen_id, bac_nomor_surat, bac_paragraf_pertama, bac_paragraf_kedua, bac_hasil_pemeriksaan, bac_tanggal, bac_created_by)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            mdk_id,
            header.bac_nomor_surat || '',
            header.bac_paragraf_pertama || '',
            header.bac_paragraf_kedua || '',
            header.bac_hasil_pemeriksaan || '',
            header.bac_tanggal,
            userId ?? null,
          ]
        );
        beritaAcaraId = insertHeaderResult.insertId;
      }

      // 2. Soft delete existing detail items for this mdk_id
      await connection.query(
        `UPDATE detail_berita_acara 
         SET dba_deleted_at = NOW(), dba_deleted_by = ? 
         WHERE dba_master_dokumen_id = ? AND dba_deleted_at IS NULL`,
        [userId ?? null, mdk_id]
      );

      // 3. Insert new detail_berita_acara items with foreign key dba_berita_acara_id
      for (const item of items) {
        if (item.dba_uraian.trim()) {
          await connection.query(
            `INSERT INTO detail_berita_acara (dba_berita_acara_id, dba_master_dokumen_id, dba_uraian, dba_volume, dba_satuan, dba_status_pemeriksaan, dba_created_by) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              beritaAcaraId,
              mdk_id,
              item.dba_uraian.trim(),
              item.dba_volume.trim(),
              item.dba_satuan.trim(),
              item.dba_status_pemeriksaan.trim(),
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

  static async insert(input: CreateBeritaAcaraInput): Promise<number> {
    await initDatabase();
    const [result]: any = await pool.query(
      `INSERT INTO detail_berita_acara (dba_berita_acara_id, dba_master_dokumen_id, dba_uraian, dba_volume, dba_satuan, dba_status_pemeriksaan, dba_created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [input.dba_berita_acara_id ?? null, input.dba_master_dokumen_id, input.dba_uraian, input.dba_volume, input.dba_satuan, input.dba_status_pemeriksaan, input.dba_created_by ?? null]
    );
    return result.insertId;
  }

  static async update(input: UpdateBeritaAcaraInput): Promise<boolean> {
    await initDatabase();
    const [result]: any = await pool.query(
      `UPDATE detail_berita_acara 
       SET dba_berita_acara_id = ?, dba_master_dokumen_id = ?, dba_uraian = ?, dba_volume = ?, dba_satuan = ?, dba_status_pemeriksaan = ?, dba_updated_by = ?, dba_updated_at = NOW() 
       WHERE dba_id = ? AND dba_deleted_at IS NULL`,
      [input.dba_berita_acara_id ?? null, input.dba_master_dokumen_id, input.dba_uraian, input.dba_volume, input.dba_satuan, input.dba_status_pemeriksaan, input.dba_updated_by ?? null, input.dba_id]
    );
    return result.affectedRows > 0;
  }

  static async softDelete(dba_id: number, deletedBy?: number | null): Promise<boolean> {
    await initDatabase();
    const [result]: any = await pool.query(
      `UPDATE detail_berita_acara 
       SET dba_deleted_at = NOW(), dba_deleted_by = ?
       WHERE dba_id = ? AND dba_deleted_at IS NULL`,
      [deletedBy ?? null, dba_id]
    );
    return result.affectedRows > 0;
  }
}
