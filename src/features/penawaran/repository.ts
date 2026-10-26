import pool, { initDatabase } from '@/lib/db';
import { Penawaran, CreatePenawaranInput, UpdatePenawaranInput } from './types';

export class PenawaranRepository {
  static async findMany(search = '', limit = 10, offset = 0): Promise<{ data: any[]; total: number }> {
    await initDatabase();

    let whereClause = 'WHERE s.pnw_deleted_at IS NULL';
    const params: any[] = [];

    if (search.trim()) {
      whereClause += ' AND (s.pnw_uraian_pekerjaan LIKE ? OR m.mdk_uraian_belanja LIKE ? OR m.mdk_no_dpa LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    const [countRows] = await pool.query<any[]>(
      `SELECT COUNT(*) as total 
       FROM penawaran s
       LEFT JOIN master_dokumen m ON s.pnw_master_dokumen_id = m.mdk_id 
       ${whereClause}`,
      params
    );
    const total = countRows[0]?.total || 0;

    const dataParams = [...params, Number(limit), Number(offset)];
    const [rows] = await pool.query<any[]>(
      `SELECT s.pnw_id, s.pnw_master_dokumen_id, s.pnw_uraian_pekerjaan, s.pnw_volume, s.pnw_waktu, s.pnw_harga_satuan, s.pnw_harga_perkiraan_sendiri, s.pnw_created_at,
              m.mdk_uraian_belanja, m.mdk_no_dpa, b.bdg_nama AS mdk_bagian, b.bdg_nama, m.mdk_pagu_anggaran
       FROM penawaran s
       LEFT JOIN master_dokumen m ON s.pnw_master_dokumen_id = m.mdk_id
       LEFT JOIN bidang b ON m.mdk_bidang_id = b.bdg_id
       ${whereClause} 
       ORDER BY s.pnw_id DESC 
       LIMIT ? OFFSET ?`,
      dataParams
    );

    return {
      data: rows,
      total,
    };
  }

  static async findByMasterDokumenId(mdk_id: number): Promise<Penawaran[]> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT pnw_id, pnw_master_dokumen_id, pnw_uraian_pekerjaan, pnw_volume, pnw_waktu, pnw_harga_satuan, pnw_harga_perkiraan_sendiri, pnw_created_at 
       FROM penawaran 
       WHERE pnw_master_dokumen_id = ? AND pnw_deleted_at IS NULL 
       ORDER BY pnw_id ASC`,
      [mdk_id]
    );
    return rows as Penawaran[];
  }

  static async findById(pnw_id: number): Promise<Penawaran | null> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT pnw_id, pnw_master_dokumen_id, pnw_uraian_pekerjaan, pnw_volume, pnw_waktu, pnw_harga_satuan, pnw_harga_perkiraan_sendiri, pnw_created_at 
       FROM penawaran 
       WHERE pnw_id = ? AND pnw_deleted_at IS NULL 
       LIMIT 1`,
      [pnw_id]
    );
    if (!rows || rows.length === 0) return null;
    return rows[0] as Penawaran;
  }

  static async saveBatch(
    mdk_id: number,
    items: { pnw_uraian_pekerjaan: string; pnw_volume: string; pnw_waktu: string; pnw_harga_satuan: number; pnw_harga_perkiraan_sendiri: number }[],
    userId?: number | null
  ): Promise<boolean> {
    await initDatabase();

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Soft delete current Penawaran items for this mdk_id
      await connection.query(
        `UPDATE penawaran 
         SET pnw_deleted_at = NOW(), pnw_deleted_by = ? 
         WHERE pnw_master_dokumen_id = ? AND pnw_deleted_at IS NULL`,
        [userId ?? null, mdk_id]
      );

      // Insert new items
      for (const item of items) {
        if (item.pnw_uraian_pekerjaan.trim()) {
          await connection.query(
            `INSERT INTO penawaran (pnw_master_dokumen_id, pnw_uraian_pekerjaan, pnw_volume, pnw_waktu, pnw_harga_satuan, pnw_harga_perkiraan_sendiri, pnw_created_by) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [mdk_id, item.pnw_uraian_pekerjaan.trim(), item.pnw_volume.trim(), item.pnw_waktu.trim(), Number(item.pnw_harga_satuan) || 0, Number(item.pnw_harga_perkiraan_sendiri) || 0, userId ?? null]
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

  static async insert(input: CreatePenawaranInput): Promise<number> {
    await initDatabase();
    const [result]: any = await pool.query(
      `INSERT INTO penawaran (pnw_master_dokumen_id, pnw_uraian_pekerjaan, pnw_volume, pnw_waktu, pnw_harga_satuan, pnw_harga_perkiraan_sendiri, pnw_created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [input.pnw_master_dokumen_id, input.pnw_uraian_pekerjaan, input.pnw_volume, input.pnw_waktu, input.pnw_harga_satuan, input.pnw_harga_perkiraan_sendiri, input.pnw_created_by ?? null]
    );
    return result.insertId;
  }

  static async update(input: UpdatePenawaranInput): Promise<boolean> {
    await initDatabase();
    const [result]: any = await pool.query(
      `UPDATE penawaran 
       SET pnw_master_dokumen_id = ?, pnw_uraian_pekerjaan = ?, pnw_volume = ?, pnw_waktu = ?, pnw_harga_satuan = ?, pnw_harga_perkiraan_sendiri = ?, pnw_updated_by = ?, pnw_updated_at = NOW() 
       WHERE pnw_id = ? AND pnw_deleted_at IS NULL`,
      [input.pnw_master_dokumen_id, input.pnw_uraian_pekerjaan, input.pnw_volume, input.pnw_waktu, input.pnw_harga_satuan, input.pnw_harga_perkiraan_sendiri, input.pnw_updated_by ?? null, input.pnw_id]
    );
    return result.affectedRows > 0;
  }

  static async softDelete(pnw_id: number, deletedBy?: number | null): Promise<boolean> {
    await initDatabase();
    const [result]: any = await pool.query(
      `UPDATE penawaran 
       SET pnw_deleted_at = NOW(), pnw_deleted_by = ?
       WHERE pnw_id = ? AND pnw_deleted_at IS NULL`,
      [deletedBy ?? null, pnw_id]
    );
    return result.affectedRows > 0;
  }
}
