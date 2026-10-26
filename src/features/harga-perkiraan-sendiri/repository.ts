import pool, { initDatabase } from '@/lib/db';
import { HargaPerkiraanSendiri, CreateHargaPerkiraanSendiriInput, UpdateHargaPerkiraanSendiriInput } from './types';

export class HargaPerkiraanSendiriRepository {
  static async findMany(search = '', limit = 10, offset = 0): Promise<{ data: any[]; total: number }> {
    await initDatabase();

    let whereClause = 'WHERE s.hps_deleted_at IS NULL';
    const params: any[] = [];

    if (search.trim()) {
      whereClause += ' AND (s.hps_uraian_pekerjaan LIKE ? OR m.mdk_uraian_belanja LIKE ? OR m.mdk_no_dpa LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    const [countRows] = await pool.query<any[]>(
      `SELECT COUNT(*) as total 
       FROM detail_harga_perkiraan_sendiri s
       LEFT JOIN master_dokumen m ON s.hps_master_dokumen_id = m.mdk_id 
       ${whereClause}`,
      params
    );
    const total = countRows[0]?.total || 0;

    const dataParams = [...params, Number(limit), Number(offset)];
    const [rows] = await pool.query<any[]>(
      `SELECT s.hps_id, s.hps_master_dokumen_id, s.hps_uraian_pekerjaan, s.hps_volume, s.hps_waktu, s.hps_harga_satuan, s.hps_harga_perkiraan_sendiri, s.hps_created_at,
              m.mdk_uraian_belanja, m.mdk_no_dpa, b.bdg_nama AS mdk_bagian, b.bdg_nama, m.mdk_pagu_anggaran
       FROM detail_harga_perkiraan_sendiri s
       LEFT JOIN master_dokumen m ON s.hps_master_dokumen_id = m.mdk_id
       LEFT JOIN bidang b ON m.mdk_bidang_id = b.bdg_id
       ${whereClause} 
       ORDER BY s.hps_id DESC 
       LIMIT ? OFFSET ?`,
      dataParams
    );

    return {
      data: rows,
      total,
    };
  }

  static async findByMasterDokumenId(mdk_id: number): Promise<HargaPerkiraanSendiri[]> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT hps_id, hps_master_dokumen_id, hps_uraian_pekerjaan, hps_volume, hps_waktu, hps_harga_satuan, hps_harga_perkiraan_sendiri, hps_created_at 
       FROM detail_harga_perkiraan_sendiri 
       WHERE hps_master_dokumen_id = ? AND hps_deleted_at IS NULL 
       ORDER BY hps_id ASC`,
      [mdk_id]
    );
    return rows as HargaPerkiraanSendiri[];
  }

  static async findById(hps_id: number): Promise<HargaPerkiraanSendiri | null> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT hps_id, hps_master_dokumen_id, hps_uraian_pekerjaan, hps_volume, hps_waktu, hps_harga_satuan, hps_harga_perkiraan_sendiri, hps_created_at 
       FROM detail_harga_perkiraan_sendiri 
       WHERE hps_id = ? AND hps_deleted_at IS NULL 
       LIMIT 1`,
      [hps_id]
    );
    if (!rows || rows.length === 0) return null;
    return rows[0] as HargaPerkiraanSendiri;
  }

  static async saveBatch(
    mdk_id: number,
    items: { hps_uraian_pekerjaan: string; hps_volume: string; hps_waktu: string; hps_harga_satuan: number; hps_harga_perkiraan_sendiri: number }[],
    userId?: number | null
  ): Promise<boolean> {
    await initDatabase();

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Soft delete current HargaPerkiraanSendiri items for this mdk_id
      await connection.query(
        `UPDATE detail_harga_perkiraan_sendiri 
         SET hps_deleted_at = NOW(), hps_deleted_by = ? 
         WHERE hps_master_dokumen_id = ? AND hps_deleted_at IS NULL`,
        [userId ?? null, mdk_id]
      );

      // Insert new items
      for (const item of items) {
        if (item.hps_uraian_pekerjaan.trim()) {
          await connection.query(
            `INSERT INTO detail_harga_perkiraan_sendiri (hps_master_dokumen_id, hps_uraian_pekerjaan, hps_volume, hps_waktu, hps_harga_satuan, hps_harga_perkiraan_sendiri, hps_created_by) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [mdk_id, item.hps_uraian_pekerjaan.trim(), item.hps_volume.trim(), item.hps_waktu.trim(), Number(item.hps_harga_satuan) || 0, Number(item.hps_harga_perkiraan_sendiri) || 0, userId ?? null]
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

  static async insert(input: CreateHargaPerkiraanSendiriInput): Promise<number> {
    await initDatabase();
    const [result]: any = await pool.query(
      `INSERT INTO detail_harga_perkiraan_sendiri (hps_master_dokumen_id, hps_uraian_pekerjaan, hps_volume, hps_waktu, hps_harga_satuan, hps_harga_perkiraan_sendiri, hps_created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [input.hps_master_dokumen_id, input.hps_uraian_pekerjaan, input.hps_volume, input.hps_waktu, input.hps_harga_satuan, input.hps_harga_perkiraan_sendiri, input.hps_created_by ?? null]
    );
    return result.insertId;
  }

  static async update(input: UpdateHargaPerkiraanSendiriInput): Promise<boolean> {
    await initDatabase();
    const [result]: any = await pool.query(
      `UPDATE detail_harga_perkiraan_sendiri 
       SET hps_master_dokumen_id = ?, hps_uraian_pekerjaan = ?, hps_volume = ?, hps_waktu = ?, hps_harga_satuan = ?, hps_harga_perkiraan_sendiri = ?, hps_updated_by = ?, hps_updated_at = NOW() 
       WHERE hps_id = ? AND hps_deleted_at IS NULL`,
      [input.hps_master_dokumen_id, input.hps_uraian_pekerjaan, input.hps_volume, input.hps_waktu, input.hps_harga_satuan, input.hps_harga_perkiraan_sendiri, input.hps_updated_by ?? null, input.hps_id]
    );
    return result.affectedRows > 0;
  }

  static async softDelete(hps_id: number, deletedBy?: number | null): Promise<boolean> {
    await initDatabase();
    const [result]: any = await pool.query(
      `UPDATE detail_harga_perkiraan_sendiri 
       SET hps_deleted_at = NOW(), hps_deleted_by = ?
       WHERE hps_id = ? AND hps_deleted_at IS NULL`,
      [deletedBy ?? null, hps_id]
    );
    return result.affectedRows > 0;
  }
}
