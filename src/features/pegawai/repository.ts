import pool, { initDatabase } from '@/lib/db';
import { Pegawai, CreatePegawaiInput, UpdatePegawaiInput } from './types';

export class PegawaiRepository {
  static async findMany(search = '', limit = 10, offset = 0): Promise<{ data: Pegawai[]; total: number }> {
    await initDatabase();

    let whereClause = 'WHERE pgw_deleted_at IS NULL';
    const params: any[] = [];

    if (search.trim()) {
      whereClause += ' AND (pgw_nip LIKE ? OR pgw_nama LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term);
    }

    // Count query
    const [countRows] = await pool.query<any[]>(
      `SELECT COUNT(*) as total FROM pegawai ${whereClause}`,
      params
    );
    const total = countRows[0]?.total || 0;

    // Data query
    const dataParams = [...params, Number(limit), Number(offset)];
    const [rows] = await pool.query<any[]>(
      `SELECT pgw_id, pgw_nip, pgw_nama, pgw_jabatan, pgw_role, pgw_status_pegawai, pgw_created_at, pgw_updated_at 
       FROM pegawai 
       ${whereClause} 
       ORDER BY pgw_id DESC 
       LIMIT ? OFFSET ?`,
      dataParams
    );

    return {
      data: rows as Pegawai[],
      total,
    };
  }

  static async findById(pgw_id: number): Promise<Pegawai | null> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT pgw_id, pgw_nip, pgw_nama, pgw_jabatan, pgw_role, pgw_status_pegawai, pgw_created_at, pgw_updated_at 
       FROM pegawai 
       WHERE pgw_id = ? AND pgw_deleted_at IS NULL 
       LIMIT 1`,
      [pgw_id]
    );
    if (!rows || rows.length === 0) return null;
    return rows[0] as Pegawai;
  }

  static async findByNip(pgw_nip: string): Promise<Pegawai | null> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT pgw_id, pgw_nip, pgw_nama, pgw_jabatan, pgw_role, pgw_status_pegawai 
       FROM pegawai 
       WHERE pgw_nip = ? and pgw_deleted_at is null
       LIMIT 1`,
      [pgw_nip]
    );
    if (!rows || rows.length === 0) return null;
    return rows[0] as Pegawai;
  }

  static async insert(input: CreatePegawaiInput): Promise<number> {
    await initDatabase();
    const [result]: any = await pool.query(
      `INSERT INTO pegawai (pgw_nip, pgw_nama, pgw_jabatan, pgw_password, pgw_role, pgw_status_pegawai, pgw_created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [input.pgw_nip, input.pgw_nama, input.pgw_jabatan, input.pgw_password, input.pgw_role || 0, input.pgw_status_pegawai || 0, input.pgw_created_by ?? null]
    );
    return result.insertId;
  }

  static async update(input: UpdatePegawaiInput): Promise<boolean> {
    await initDatabase();

    if (input.pgw_password) {
      const [result]: any = await pool.query(
        `UPDATE pegawai 
         SET pgw_nip = ?, pgw_nama = ?, pgw_jabatan = ?, pgw_password = ?, pgw_role = ?, pgw_status_pegawai = ?, pgw_updated_by = ?, pgw_updated_at = NOW() 
         WHERE pgw_id = ? AND pgw_deleted_at IS NULL`,
        [input.pgw_nip, input.pgw_nama, input.pgw_jabatan, input.pgw_password, input.pgw_role, input.pgw_status_pegawai, input.pgw_updated_by ?? null, input.pgw_id]
      );
      return result.affectedRows > 0;
    } else {
      const [result]: any = await pool.query(
        `UPDATE pegawai 
         SET pgw_nip = ?, pgw_nama = ?, pgw_jabatan = ?, pgw_role = ?, pgw_status_pegawai = ?, pgw_updated_by = ?, pgw_updated_at = NOW() 
         WHERE pgw_id = ? AND pgw_deleted_at IS NULL`,
        [input.pgw_nip, input.pgw_nama, input.pgw_jabatan, input.pgw_role, input.pgw_status_pegawai, input.pgw_updated_by ?? null, input.pgw_id]
      );
      return result.affectedRows > 0;
    }
  }

  static async softDelete(pgw_id: number, deletedBy?: number | null): Promise<boolean> {
    await initDatabase();
    const [result]: any = await pool.query(
      `UPDATE pegawai 
       SET pgw_deleted_at = NOW(), pgw_deleted_by = ?
       WHERE pgw_id = ? AND pgw_deleted_at IS NULL`,
      [deletedBy ?? null, pgw_id]
    );
    return result.affectedRows > 0;
  }
}
