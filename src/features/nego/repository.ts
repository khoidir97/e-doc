import pool, { initDatabase } from '@/lib/db';
import { Nego, CreateNegoInput, UpdateNegoInput } from './types';

export class NegoRepository {
  static async findMany(search = '', limit = 10, offset = 0): Promise<{ data: any[]; total: number }> {
    await initDatabase();

    let whereClause = 'WHERE s.nego_deleted_at IS NULL';
    const params: any[] = [];

    if (search.trim()) {
      whereClause += ' AND (s.nego_uraian_kegiatan LIKE ? OR m.mdk_uraian_belanja LIKE ? OR m.mdk_no_dpa LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    const [countRows] = await pool.query<any[]>(
      `SELECT COUNT(*) as total 
       FROM nego s
       LEFT JOIN master_dokumen m ON s.nego_master_dokumen_id = m.mdk_id 
       ${whereClause}`,
      params
    );
    const total = countRows[0]?.total || 0;

    const dataParams = [...params, Number(limit), Number(offset)];
    const [rows] = await pool.query<any[]>(
      `SELECT s.nego_id, s.nego_master_dokumen_id, s.nego_uraian_kegiatan, s.nego_volume, s.nego_waktu, s.nego_hps_harga_satuan, s.nego_hps_jumlah_harga, s.nego_pnw_harga_satuan, s.nego_pnw_jumlah_harga, s.nego_negosiasi_harga_satuan, s.nego_negosiasi_jumlah_harga, s.nego_created_at,
              m.mdk_uraian_belanja, m.mdk_no_dpa, b.bdg_nama AS mdk_bagian, b.bdg_nama, m.mdk_pagu_anggaran
       FROM nego s
       LEFT JOIN master_dokumen m ON s.nego_master_dokumen_id = m.mdk_id
       LEFT JOIN bidang b ON m.mdk_bidang_id = b.bdg_id
       ${whereClause} 
       ORDER BY s.nego_id DESC 
       LIMIT ? OFFSET ?`,
      dataParams
    );

    return {
      data: rows,
      total,
    };
  }

  static async findByMasterDokumenId(mdk_id: number): Promise<Nego[]> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT nego_id, nego_master_dokumen_id, nego_uraian_kegiatan, nego_volume, nego_waktu, nego_hps_harga_satuan, nego_hps_jumlah_harga, nego_pnw_harga_satuan, nego_pnw_jumlah_harga, nego_negosiasi_harga_satuan, nego_negosiasi_jumlah_harga, nego_created_at 
       FROM nego
       WHERE nego_master_dokumen_id = ? AND nego_deleted_at IS NULL 
       ORDER BY nego_id ASC`,
      [mdk_id]
    );
    return rows as Nego[];
  }

  static async findById(pnw_id: number): Promise<Nego | null> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT nego_id, nego_master_dokumen_id, nego_uraian_kegiatan, nego_volume, nego_waktu, nego_hps_harga_satuan, nego_hps_jumlah_harga, nego_pnw_harga_satuan, nego_pnw_jumlah_harga, nego_negosiasi_harga_satuan, nego_negosiasi_jumlah_harga, nego_created_at 
       FROM nego
       WHERE nego_id = ? AND nego_deleted_at IS NULL 
       LIMIT 1`,
      [pnw_id]
    );
    if (!rows || rows.length === 0) return null;
    return rows[0] as Nego;
  }

  static async saveBatch(
    mdk_id: number,
    items: { nego_uraian_kegiatan: string; nego_volume: string; nego_waktu: string; nego_hps_harga_satuan: number; nego_hps_jumlah_harga: number; nego_pnw_harga_satuan: number; nego_pnw_jumlah_harga: number; nego_negosiasi_harga_satuan: number; nego_negosiasi_jumlah_harga: number }[],
    userId?: number | null
  ): Promise<boolean> {
    await initDatabase();

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Soft delete current Nego items for this mdk_id
      await connection.query(
        `UPDATE nego
         SET nego_deleted_at = NOW(), nego_deleted_by = ? 
         WHERE nego_master_dokumen_id = ? AND nego_deleted_at IS NULL`,
        [userId ?? null, mdk_id]
      );

      // Insert new items
      for (const item of items) {
        if (item.nego_uraian_kegiatan.trim()) {
          await connection.query(
            `INSERT INTO nego (nego_master_dokumen_id, nego_uraian_kegiatan, nego_volume, nego_waktu, nego_hps_harga_satuan, nego_hps_jumlah_harga, nego_pnw_harga_satuan, nego_pnw_jumlah_harga, nego_negosiasi_harga_satuan, nego_negosiasi_jumlah_harga, nego_created_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [mdk_id, item.nego_uraian_kegiatan.trim(), item.nego_volume.trim(), item.nego_waktu.trim(), Number(item.nego_hps_harga_satuan) || 0, Number(item.nego_hps_jumlah_harga) || 0, Number(item.nego_pnw_harga_satuan) || 0, Number(item.nego_pnw_jumlah_harga) || 0, Number(item.nego_negosiasi_harga_satuan) || 0, Number(item.nego_negosiasi_jumlah_harga) || 0, userId ?? null]
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

  static async insert(input: CreateNegoInput): Promise<number> {
    await initDatabase();
    const [result]: any = await pool.query(
      `INSERT INTO nego (nego_master_dokumen_id, nego_uraian_kegiatan, nego_volume, nego_waktu, nego_hps_harga_satuan, nego_hps_jumlah_harga, nego_pnw_harga_satuan, nego_pnw_jumlah_harga, nego_negosiasi_harga_satuan, nego_negosiasi_jumlah_harga, nego_created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [input.nego_master_dokumen_id, input.nego_uraian_kegiatan, input.nego_volume, input.nego_waktu, input.nego_hps_harga_satuan, input.nego_hps_jumlah_harga, input.nego_pnw_harga_satuan, input.nego_pnw_jumlah_harga, input.nego_negosiasi_harga_satuan, input.nego_negosiasi_jumlah_harga, input.nego_created_by ?? null]
    );
    return result.insertId;
  }

  static async update(input: UpdateNegoInput): Promise<boolean> {
    await initDatabase();
    const [result]: any = await pool.query(
      `UPDATE nego
       SET nego_master_dokumen_id = ?, nego_uraian_kegiatan = ?, nego_volume = ?, nego_waktu = ?, nego_hps_harga_satuan = ?, nego_hps_jumlah_harga = ?, nego_pnw_harga_satuan = ?, nego_pnw_jumlah_harga = ?, nego_negosiasi_harga_satuan = ?, nego_negosiasi_jumlah_harga = ?, nego_updated_by = ?, nego_updated_at = NOW() 
       WHERE nego_id = ? AND nego_deleted_at IS NULL`,
      [input.nego_master_dokumen_id, input.nego_uraian_kegiatan, input.nego_volume, input.nego_waktu, input.nego_hps_harga_satuan, input.nego_hps_jumlah_harga, input.nego_pnw_harga_satuan, input.nego_pnw_jumlah_harga, input.nego_negosiasi_harga_satuan, input.nego_negosiasi_jumlah_harga, input.nego_updated_by ?? null, input.nego_id]
    );
    return result.affectedRows > 0;
  }

  static async softDelete(nego_id: number, deletedBy?: number | null): Promise<boolean> {
    await initDatabase();
    const [result]: any = await pool.query(
      `UPDATE nego
       SET nego_deleted_at = NOW(), nego_deleted_by = ?
       WHERE nego_id = ? AND nego_deleted_at IS NULL`,
      [deletedBy ?? null, nego_id]
    );
    return result.affectedRows > 0;
  }
}
