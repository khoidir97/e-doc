import pool, { initDatabase } from '@/lib/db';
import { NotaPencairanDana, CreateNotaPencairanDanaInput, UpdateNotaPencairanDanaInput } from './types';

export class NotaPencairanDanaRepository {
  static async findMany(search = '', limit = 10, offset = 0): Promise<{ data: any[]; total: number }> {
    await initDatabase();

    let whereClause = 'WHERE s.dpd_deleted_at IS NULL';
    const params: any[] = [];

    if (search.trim()) {
      whereClause += ' AND (s.dpd_uraian LIKE ? OR m.mdk_uraian_belanja LIKE ? OR m.mdk_no_dpa LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    const [countRows] = await pool.query<any[]>(
      `SELECT COUNT(*) as total 
       FROM nota_pencairan_dana s
       LEFT JOIN master_dokumen m ON s.dpd_master_dokumen_id = m.mdk_id 
       ${whereClause}`,
      params
    );
    const total = countRows[0]?.total || 0;

    const dataParams = [...params, Number(limit), Number(offset)];
    const [rows] = await pool.query<any[]>(
      `SELECT s.dpd_id, s.dpd_master_dokumen_id, s.dpd_uraian, s.dpd_dpa_volume, s.dpd_dpa_satuan, s.dpd_dpa_nilai, s.dpd_belum_volume, s.dpd_belum_nilai, s.dpd_saatini_volume, s.dpd_saatini_nilai, s.dpd_saatini_ppn, s.dpd_saatini_pph23, s.dpd_saatini_total_pajak, s.dpd_saatini_pembayaran, s.dpd_sisa_volume, s.dpd_sisa_nilai, s.dpd_created_at,
              m.mdk_uraian_belanja, m.mdk_no_dpa, b.bdg_nama AS mdk_bagian, b.bdg_nama, m.mdk_pagu_anggaran, m.mdk_volume, m.mdk_satuan
       FROM nota_pencairan_dana s
       LEFT JOIN master_dokumen m ON s.dpd_master_dokumen_id = m.mdk_id
       LEFT JOIN bidang b ON m.mdk_bidang_id = b.bdg_id
       ${whereClause} 
       ORDER BY s.dpd_id DESC 
       LIMIT ? OFFSET ?`,
      dataParams
    );

    return {
      data: rows,
      total,
    };
  }

  static async findByMasterDokumenId(mdk_id: number): Promise<NotaPencairanDana[]> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT dpd_id, dpd_master_dokumen_id, dpd_uraian, dpd_dpa_volume, dpd_dpa_satuan, dpd_dpa_nilai, dpd_belum_volume, dpd_belum_nilai, dpd_saatini_volume, dpd_saatini_nilai, dpd_saatini_ppn, dpd_saatini_pph23, dpd_saatini_total_pajak, dpd_saatini_pembayaran, dpd_sisa_volume, dpd_sisa_nilai, dpd_created_at 
       FROM nota_pencairan_dana 
       WHERE dpd_master_dokumen_id = ? AND dpd_deleted_at IS NULL 
       ORDER BY dpd_id ASC`,
      [mdk_id]
    );
    return rows as NotaPencairanDana[];
  }

  static async findById(dpd_id: number): Promise<NotaPencairanDana | null> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT dpd_id, dpd_master_dokumen_id, dpd_uraian, dpd_dpa_volume, dpd_dpa_satuan, dpd_dpa_nilai, dpd_belum_volume, dpd_belum_nilai, dpd_saatini_volume, dpd_saatini_nilai, dpd_saatini_ppn, dpd_saatini_pph23, dpd_saatini_total_pajak, dpd_saatini_pembayaran, dpd_sisa_volume, dpd_sisa_nilai, dpd_created_at 
       FROM nota_pencairan_dana 
       WHERE dpd_id = ? AND dpd_deleted_at IS NULL 
       LIMIT 1`,
      [dpd_id]
    );
    if (!rows || rows.length === 0) return null;
    return rows[0] as NotaPencairanDana;
  }

  static async saveBatch(
    mdk_id: number,
    items: { dpd_uraian: string; dpd_dpa_volume: string; dpd_dpa_satuan: string; dpd_dpa_nilai: number; dpd_belum_volume: string | null; dpd_belum_nilai: number | null; dpd_saatini_volume: string | null; dpd_saatini_nilai: number | null; dpd_saatini_ppn: number | null; dpd_saatini_pph23: number | null; dpd_saatini_total_pajak: number | null; dpd_saatini_pembayaran: number | null; dpd_sisa_volume: string | null; dpd_sisa_nilai: number | null }[],
    userId?: number | null
  ): Promise<boolean> {
    await initDatabase();

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Soft delete current NotaPencairanDana items for this mdk_id
      await connection.query(
        `UPDATE nota_pencairan_dana 
         SET dpd_deleted_at = NOW(), dpd_deleted_by = ? 
         WHERE dpd_master_dokumen_id = ? AND dpd_deleted_at IS NULL`,
        [userId ?? null, mdk_id]
      );

      // Insert new items
      for (const item of items) {
        if (item.dpd_uraian.trim()) {
          await connection.query(
            `INSERT INTO nota_pencairan_dana (
               dpd_master_dokumen_id, dpd_uraian, dpd_dpa_volume, dpd_dpa_satuan, dpd_dpa_nilai, 
               dpd_belum_volume, dpd_belum_nilai, dpd_saatini_volume, dpd_saatini_nilai, 
               dpd_saatini_ppn, dpd_saatini_pph23, dpd_saatini_total_pajak, dpd_saatini_pembayaran, 
               dpd_sisa_volume, dpd_sisa_nilai, dpd_created_by
             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              mdk_id,
              item.dpd_uraian.trim(),
              String(item.dpd_dpa_volume || '').trim(),
              String(item.dpd_dpa_satuan || '').trim(),
              Number(item.dpd_dpa_nilai) || 0,
              String(item.dpd_belum_volume || ''),
              Number(item.dpd_belum_nilai) || 0,
              String(item.dpd_saatini_volume || ''),
              Number(item.dpd_saatini_nilai) || 0,
              Number(item.dpd_saatini_ppn) || 0,
              Number(item.dpd_saatini_pph23) || 0,
              Number(item.dpd_saatini_total_pajak) || 0,
              Number(item.dpd_saatini_pembayaran) || 0,
              String(item.dpd_sisa_volume || ''),
              Number(item.dpd_sisa_nilai) || 0,
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

  static async insert(input: CreateNotaPencairanDanaInput): Promise<number> {
    await initDatabase();
    const [result]: any = await pool.query(
      `INSERT INTO nota_pencairan_dana (
         dpd_master_dokumen_id, dpd_uraian, dpd_dpa_volume, dpd_dpa_satuan, dpd_dpa_nilai, 
         dpd_belum_volume, dpd_belum_nilai, dpd_saatini_volume, dpd_saatini_nilai, 
         dpd_saatini_ppn, dpd_saatini_pph23, dpd_saatini_total_pajak, dpd_saatini_pembayaran, 
         dpd_sisa_volume, dpd_sisa_nilai, dpd_created_by
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.dpd_master_dokumen_id,
        input.dpd_uraian,
        input.dpd_dpa_volume,
        input.dpd_dpa_satuan,
        input.dpd_dpa_nilai,
        input.dpd_belum_volume,
        input.dpd_belum_nilai,
        input.dpd_saatini_volume,
        input.dpd_saatini_nilai,
        input.dpd_saatini_ppn,
        input.dpd_saatini_pph23,
        input.dpd_saatini_total_pajak,
        input.dpd_saatini_pembayaran,
        input.dpd_sisa_volume,
        input.dpd_sisa_nilai,
        input.dpd_created_by ?? null,
      ]
    );
    return result.insertId;
  }

  static async update(input: UpdateNotaPencairanDanaInput): Promise<boolean> {
    await initDatabase();
    const [result]: any = await pool.query(
      `UPDATE nota_pencairan_dana 
       SET dpd_master_dokumen_id = ?, dpd_uraian = ?, dpd_dpa_volume = ?, dpd_dpa_satuan = ?, dpd_dpa_nilai = ?, dpd_belum_volume = ?, dpd_belum_nilai = ?, dpd_saatini_volume = ?, dpd_saatini_nilai = ?, dpd_saatini_ppn = ?, dpd_saatini_pph23 = ?, dpd_saatini_total_pajak = ?, dpd_saatini_pembayaran = ?, dpd_sisa_volume = ?, dpd_sisa_nilai = ?, dpd_updated_by = ?, dpd_updated_at = NOW() 
       WHERE dpd_id = ? AND dpd_deleted_at IS NULL`,
      [
        input.dpd_master_dokumen_id,
        input.dpd_uraian,
        input.dpd_dpa_volume,
        input.dpd_dpa_satuan,
        input.dpd_dpa_nilai,
        input.dpd_belum_volume,
        input.dpd_belum_nilai,
        input.dpd_saatini_volume,
        input.dpd_saatini_nilai,
        input.dpd_saatini_ppn,
        input.dpd_saatini_pph23,
        input.dpd_saatini_total_pajak,
        input.dpd_saatini_pembayaran,
        input.dpd_sisa_volume,
        input.dpd_sisa_nilai,
        input.dpd_updated_by ?? null,
        input.dpd_id,
      ]
    );
    return result.affectedRows > 0;
  }

  static async softDelete(dpd_id: number, deletedBy?: number | null): Promise<boolean> {
    await initDatabase();
    const [result]: any = await pool.query(
      `UPDATE nota_pencairan_dana 
       SET dpd_deleted_at = NOW(), dpd_deleted_by = ?
       WHERE dpd_id = ? AND dpd_deleted_at IS NULL`,
      [deletedBy ?? null, dpd_id]
    );
    return result.affectedRows > 0;
  }
}
