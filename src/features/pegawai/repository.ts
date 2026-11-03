import pool, { initDatabase } from '@/lib/db';
import { Pegawai, CreatePegawaiInput, UpdatePegawaiInput } from './types';

export class PegawaiRepository {
  static async findMany(search = '', limit = 10, offset = 0): Promise<{ data: Pegawai[]; total: number }> {
    await initDatabase();

    let whereClause = 'WHERE p.pgw_deleted_at IS NULL';
    const params: any[] = [];

    if (search.trim()) {
      whereClause += ' AND (p.pgw_nip LIKE ? OR p.pgw_nama LIKE ? OR b.bdg_nama LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    // Count query
    const [countRows] = await pool.query<any[]>(
      `SELECT COUNT(*) as total 
       FROM pegawai p 
       LEFT JOIN bidang b ON p.pgw_bdg_id = b.bdg_id 
       ${whereClause}`,
      params
    );
    const total = countRows[0]?.total || 0;

    // Data query
    const dataParams = [...params, Number(limit), Number(offset)];
    const [rows] = await pool.query<any[]>(
      `SELECT p.pgw_id, p.pgw_bdg_id, p.pgw_nip, p.pgw_nama, p.pgw_jabatan, p.pgw_role, p.pgw_status_pegawai, p.pgw_created_at, p.pgw_updated_at,
              b.bdg_nama
       FROM pegawai p
       LEFT JOIN bidang b ON p.pgw_bdg_id = b.bdg_id
       ${whereClause} 
       ORDER BY p.pgw_id DESC 
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
      `SELECT p.pgw_id, p.pgw_bdg_id, p.pgw_nip, p.pgw_nama, p.pgw_jabatan, p.pgw_role, p.pgw_status_pegawai, p.pgw_created_at, p.pgw_updated_at,
              b.bdg_nama
       FROM pegawai p
       LEFT JOIN bidang b ON p.pgw_bdg_id = b.bdg_id
       WHERE p.pgw_id = ? AND p.pgw_deleted_at IS NULL 
       LIMIT 1`,
      [pgw_id]
    );
    if (!rows || rows.length === 0) return null;
    return rows[0] as Pegawai;
  }

  static async findByNip(pgw_nip: string): Promise<Pegawai | null> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT p.pgw_id, p.pgw_bdg_id, p.pgw_nip, p.pgw_nama, p.pgw_jabatan, p.pgw_role, p.pgw_status_pegawai,
              b.bdg_nama
       FROM pegawai p
       LEFT JOIN bidang b ON p.pgw_bdg_id = b.bdg_id
       WHERE p.pgw_nip = ? AND p.pgw_deleted_at IS NULL
       LIMIT 1`,
      [pgw_nip]
    );
    if (!rows || rows.length === 0) return null;
    return rows[0] as Pegawai;
  }

  static async insert(input: CreatePegawaiInput): Promise<number> {
    await initDatabase();
    const [result]: any = await pool.query(
      `INSERT INTO pegawai (pgw_nip, pgw_bdg_id, pgw_nama, pgw_jabatan, pgw_password, pgw_role, pgw_status_pegawai, pgw_created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [input.pgw_nip, input.pgw_bdg_id ?? null, input.pgw_nama, input.pgw_jabatan, input.pgw_password, input.pgw_role || 0, input.pgw_status_pegawai || 0, input.pgw_created_by ?? null]
    );
    return result.insertId;
  }

  static async update(input: UpdatePegawaiInput): Promise<boolean> {
    await initDatabase();

    if (input.pgw_password) {
      const [result]: any = await pool.query(
        `UPDATE pegawai 
         SET pgw_nip = ?, pgw_bdg_id = ?, pgw_nama = ?, pgw_jabatan = ?, pgw_password = ?, pgw_role = ?, pgw_status_pegawai = ?, pgw_updated_by = ?, pgw_updated_at = NOW() 
         WHERE pgw_id = ? AND pgw_deleted_at IS NULL`,
        [input.pgw_nip, input.pgw_bdg_id ?? null, input.pgw_nama, input.pgw_jabatan, input.pgw_password, input.pgw_role, input.pgw_status_pegawai, input.pgw_updated_by ?? null, input.pgw_id]
      );
      return result.affectedRows > 0;
    } else {
      const [result]: any = await pool.query(
        `UPDATE pegawai 
         SET pgw_nip = ?, pgw_bdg_id = ?, pgw_nama = ?, pgw_jabatan = ?, pgw_role = ?, pgw_status_pegawai = ?, pgw_updated_by = ?, pgw_updated_at = NOW() 
         WHERE pgw_id = ? AND pgw_deleted_at IS NULL`,
        [input.pgw_nip, input.pgw_bdg_id ?? null, input.pgw_nama, input.pgw_jabatan, input.pgw_role, input.pgw_status_pegawai, input.pgw_updated_by ?? null, input.pgw_id]
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
