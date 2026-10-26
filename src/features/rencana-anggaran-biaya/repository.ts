import pool, { initDatabase } from '@/lib/db';
import { RencanaAnggaranBiaya, CreateRencanaAnggaranBiayaInput, UpdateRencanaAnggaranBiayaInput } from './types';

export class RencanaAnggaranBiayaRepository {
  static async findMany(search = '', limit = 10, offset = 0): Promise<{ data: any[]; total: number }> {
    await initDatabase();

    let whereClause = 'WHERE s.rab_deleted_at IS NULL';
    const params: any[] = [];

    if (search.trim()) {
      whereClause += ' AND (s.rab_uraian_pekerjaan LIKE ? OR m.mdk_uraian_belanja LIKE ? OR m.mdk_no_dpa LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    const [countRows] = await pool.query<any[]>(
      `SELECT COUNT(*) as total 
       FROM detail_rencana_anggaran_biaya s
       LEFT JOIN master_dokumen m ON s.rab_master_dokumen_id = m.mdk_id 
       ${whereClause}`,
      params
    );
    const total = countRows[0]?.total || 0;

    const dataParams = [...params, Number(limit), Number(offset)];
    const [rows] = await pool.query<any[]>(
      `SELECT s.rab_id, s.rab_master_dokumen_id, s.rab_uraian_pekerjaan, s.rab_volume, s.rab_waktu, s.rab_harga_satuan, s.rab_harga_perkiraan_sendiri, s.rab_created_at,
              m.mdk_uraian_belanja, m.mdk_no_dpa, b.bdg_nama AS mdk_bagian, b.bdg_nama, m.mdk_pagu_anggaran
       FROM detail_rencana_anggaran_biaya s
       LEFT JOIN master_dokumen m ON s.rab_master_dokumen_id = m.mdk_id
       LEFT JOIN bidang b ON m.mdk_bidang_id = b.bdg_id
       ${whereClause} 
       ORDER BY s.rab_id DESC 
       LIMIT ? OFFSET ?`,
      dataParams
    );

    return {
      data: rows,
      total,
    };
  }

  static async findByMasterDokumenId(mdk_id: number): Promise<RencanaAnggaranBiaya[]> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT rab_id, rab_master_dokumen_id, rab_uraian_pekerjaan, rab_volume, rab_waktu, rab_harga_satuan, rab_harga_perkiraan_sendiri, rab_created_at 
       FROM detail_rencana_anggaran_biaya 
       WHERE rab_master_dokumen_id = ? AND rab_deleted_at IS NULL 
       ORDER BY rab_id ASC`,
      [mdk_id]
    );
    return rows as RencanaAnggaranBiaya[];
  }

  static async findById(rab_id: number): Promise<RencanaAnggaranBiaya | null> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT rab_id, rab_master_dokumen_id, rab_uraian_pekerjaan, rab_volume, rab_waktu, rab_harga_satuan, rab_harga_perkiraan_sendiri, rab_created_at 
       FROM detail_rencana_anggaran_biaya 
       WHERE rab_id = ? AND rab_deleted_at IS NULL 
       LIMIT 1`,
      [rab_id]
    );
    if (!rows || rows.length === 0) return null;
    return rows[0] as RencanaAnggaranBiaya;
  }

  static async saveBatch(
    mdk_id: number,
    items: { rab_uraian_pekerjaan: string; rab_volume: string; rab_waktu: string; rab_harga_satuan: number; rab_harga_perkiraan_sendiri: number }[],
    userId?: number | null
  ): Promise<boolean> {
    await initDatabase();

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Soft delete current RencanaAnggaranBiaya items for this mdk_id
      await connection.query(
        `UPDATE detail_rencana_anggaran_biaya 
         SET rab_deleted_at = NOW(), rab_deleted_by = ? 
         WHERE rab_master_dokumen_id = ? AND rab_deleted_at IS NULL`,
        [userId ?? null, mdk_id]
      );

      // Insert new items
      for (const item of items) {
        if (item.rab_uraian_pekerjaan.trim()) {
          await connection.query(
            `INSERT INTO detail_rencana_anggaran_biaya (rab_master_dokumen_id, rab_uraian_pekerjaan, rab_volume, rab_waktu, rab_harga_satuan, rab_harga_perkiraan_sendiri, rab_created_by) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [mdk_id, item.rab_uraian_pekerjaan.trim(), item.rab_volume.trim(), item.rab_waktu.trim(), Number(item.rab_harga_satuan) || 0, Number(item.rab_harga_perkiraan_sendiri) || 0, userId ?? null]
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

  static async insert(input: CreateRencanaAnggaranBiayaInput): Promise<number> {
    await initDatabase();
    const [result]: any = await pool.query(
      `INSERT INTO detail_rencana_anggaran_biaya (rab_master_dokumen_id, rab_uraian_pekerjaan, rab_volume, rab_waktu, rab_harga_satuan, rab_harga_perkiraan_sendiri, rab_created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [input.rab_master_dokumen_id, input.rab_uraian_pekerjaan, input.rab_volume, input.rab_waktu, input.rab_harga_satuan, input.rab_harga_perkiraan_sendiri, input.rab_created_by ?? null]
    );
    return result.insertId;
  }

  static async update(input: UpdateRencanaAnggaranBiayaInput): Promise<boolean> {
    await initDatabase();
    const [result]: any = await pool.query(
      `UPDATE detail_rencana_anggaran_biaya 
       SET rab_master_dokumen_id = ?, rab_uraian_pekerjaan = ?, rab_volume = ?, rab_waktu = ?, rab_harga_satuan = ?, rab_harga_perkiraan_sendiri = ?, rab_updated_by = ?, rab_updated_at = NOW() 
       WHERE rab_id = ? AND rab_deleted_at IS NULL`,
      [input.rab_master_dokumen_id, input.rab_uraian_pekerjaan, input.rab_volume, input.rab_waktu, input.rab_harga_satuan, input.rab_harga_perkiraan_sendiri, input.rab_updated_by ?? null, input.rab_id]
    );
    return result.affectedRows > 0;
  }

  static async softDelete(rab_id: number, deletedBy?: number | null): Promise<boolean> {
    await initDatabase();
    const [result]: any = await pool.query(
      `UPDATE detail_rencana_anggaran_biaya 
       SET rab_deleted_at = NOW(), rab_deleted_by = ?
       WHERE rab_id = ? AND rab_deleted_at IS NULL`,
      [deletedBy ?? null, rab_id]
    );
    return result.affectedRows > 0;
  }
}
