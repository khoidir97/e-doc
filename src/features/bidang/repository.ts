import pool, { initDatabase } from '@/lib/db';
import { Bidang, CreateBidangInput, UpdateBidangInput } from './types';

export class BidangRepository {
  static async findMany(search = '', limit = 10, offset = 0): Promise<{ data: Bidang[]; total: number }> {
    await initDatabase();

    let whereClause = 'WHERE bdg_deleted_at IS NULL';
    const params: any[] = [];

    if (search.trim()) {
      whereClause += ' AND (bdg_nama LIKE ? OR bdg_keterangan LIKE ? )';
      const term = `%${search.trim()}%`;
      params.push(term, term);
    }

    // Count query
    const [countRows] = await pool.query<any[]>(
      `SELECT COUNT(*) as total FROM bidang ${whereClause}`,
      params
    );
    const total = countRows[0]?.total || 0;

    // Data query
    const dataParams = [...params, Number(limit), Number(offset)];
    const [rows] = await pool.query<any[]>(
      `SELECT bdg_id, bdg_nama, bdg_keterangan, bdg_created_at, bdg_updated_at 
       FROM bidang
       ${whereClause} 
       ORDER BY bdg_id DESC 
       LIMIT ? OFFSET ?`,
      dataParams
    );

    return {
      data: rows as Bidang[],
      total,
    };
  }

  static async findById(bdg_id: number): Promise<Bidang | null> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT bdg_id, bdg_nama, bdg_keterangan, bdg_created_at, bdg_updated_at 
       FROM bidang
       WHERE bdg_id = ? AND bdg_deleted_at IS NULL 
       LIMIT 1`,
      [bdg_id]
    );
    if (!rows || rows.length === 0) return null;
    return rows[0] as Bidang;
  }

  static async findByName(bdg_nama: string): Promise<Bidang | null> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT bdg_id, bdg_nama, bdg_keterangan 
       FROM bidang
       WHERE bdg_nama = ? AND bdg_deleted_at IS NULL 
       LIMIT 1`,
      [bdg_nama]
    );
    if (!rows || rows.length === 0) return null;
    return rows[0] as Bidang;
  }

  static async insert(input: CreateBidangInput): Promise<number> {
    await initDatabase();
    const [result]: any = await pool.query(
      `INSERT INTO bidang (bdg_nama, bdg_keterangan, bdg_created_by)
       VALUES (?, ?, ?)`,
      [input.bdg_nama, input.bdg_keterangan, input.bdg_created_by ?? null]
    );
    return result.insertId;
  }

  static async update(input: UpdateBidangInput): Promise<boolean> {
    await initDatabase();
    const [result]: any = await pool.query(
      `UPDATE bidang
       SET bdg_nama = ?, bdg_keterangan = ?, bdg_updated_by = ?, bdg_updated_at = NOW() 
       WHERE bdg_id = ? AND bdg_deleted_at IS NULL`,
      [input.bdg_nama, input.bdg_keterangan, input.bdg_updated_by ?? null, input.bdg_id]
    );
    return result.affectedRows > 0;
  }

  static async softDelete(bdg_id: number, deletedBy?: number | null): Promise<boolean> {
    await initDatabase();
    const [result]: any = await pool.query(
      `UPDATE bidang
       SET bdg_deleted_at = NOW(), bdg_deleted_by = ?
       WHERE bdg_id = ? AND bdg_deleted_at IS NULL`,
      [deletedBy ?? null, bdg_id]
    );
    return result.affectedRows > 0;
  }
}
