import pool, { initDatabase } from '@/lib/db';
import { Perusahaan, CreatePerusahaanInput, UpdatePerusahaanInput } from './types';

export class PerusahaanRepository {
  static async findMany(search = '', limit = 10, offset = 0): Promise<{ data: Perusahaan[]; total: number }> {
    await initDatabase();

    let whereClause = 'WHERE psh_deleted_at IS NULL';
    const params: any[] = [];

    if (search.trim()) {
      whereClause += ' AND (psh_nama LIKE ? OR psh_alamat LIKE ? )';
      const term = `%${search.trim()}%`;
      params.push(term, term);
    }

    // Count query
    const [countRows] = await pool.query<any[]>(
      `SELECT COUNT(*) as total FROM perusahaan ${whereClause}`,
      params
    );
    const total = countRows[0]?.total || 0;

    // Data query
    const dataParams = [...params, Number(limit), Number(offset)];
    const [rows] = await pool.query<any[]>(
      `SELECT psh_id, psh_nama, psh_nama_pimpinan, psh_jabatan, psh_alamat, psh_npwp, psh_nomor_rekening, psh_nama_rekening, psh_nama_bank, psh_created_at, psh_updated_at 
       FROM perusahaan
       ${whereClause} 
       ORDER BY psh_id DESC 
       LIMIT ? OFFSET ?`,
      dataParams
    );

    return {
      data: rows as Perusahaan[],
      total,
    };
  }

  static async findById(psh_id: number): Promise<Perusahaan | null> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT psh_id, psh_nama, psh_nama_pimpinan, psh_jabatan, psh_alamat, psh_npwp, psh_nomor_rekening, psh_nama_rekening, psh_nama_bank, psh_created_at, psh_updated_at 
       FROM perusahaan
       WHERE psh_id = ? AND psh_deleted_at IS NULL 
       LIMIT 1`,
      [psh_id]
    );
    if (!rows || rows.length === 0) return null;
    return rows[0] as Perusahaan;
  }

  static async findByName(psh_nama: string): Promise<Perusahaan | null> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT psh_id, psh_nama, psh_nama_pimpinan, psh_jabatan, psh_alamat, psh_npwp, psh_nomor_rekening, psh_nama_rekening, psh_nama_bank 
       FROM perusahaan
       WHERE psh_nama = ? AND psh_deleted_at IS NULL 
       LIMIT 1`,
      [psh_nama]
    );
    if (!rows || rows.length === 0) return null;
    return rows[0] as Perusahaan;
  }

  static async insert(input: CreatePerusahaanInput): Promise<number> {
    await initDatabase();
    const [result]: any = await pool.query(
      `INSERT INTO perusahaan (psh_nama, psh_nama_pimpinan, psh_jabatan, psh_alamat, psh_npwp, psh_nomor_rekening, psh_nama_rekening, psh_nama_bank, psh_created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [input.psh_nama, input.psh_nama_pimpinan, input.psh_jabatan, input.psh_alamat, input.psh_npwp, input.psh_nomor_rekening, input.psh_nama_rekening, input.psh_nama_bank, input.psh_created_by ?? null]
    );
    return result.insertId;
  }

  static async update(input: UpdatePerusahaanInput): Promise<boolean> {
    await initDatabase();
    const [result]: any = await pool.query(
      `UPDATE perusahaan
       SET psh_nama = ?, psh_nama_pimpinan = ?, psh_jabatan = ?, psh_alamat = ?, psh_npwp = ?, psh_nomor_rekening = ?, psh_nama_rekening = ?, psh_nama_bank = ?, psh_updated_by = ?, psh_updated_at = NOW() 
       WHERE psh_id = ? AND psh_deleted_at IS NULL`,
      [input.psh_nama, input.psh_nama_pimpinan, input.psh_jabatan, input.psh_alamat, input.psh_npwp, input.psh_nomor_rekening, input.psh_nama_rekening, input.psh_nama_bank, input.psh_updated_by ?? null, input.psh_id]
    );
    return result.affectedRows > 0;
  }

  static async softDelete(psh_id: number, deletedBy?: number | null): Promise<boolean> {
    await initDatabase();
    const [result]: any = await pool.query(
      `UPDATE perusahaan
       SET psh_deleted_at = NOW(), psh_deleted_by = ?
       WHERE psh_id = ? AND psh_deleted_at IS NULL`,
      [deletedBy ?? null, psh_id]
    );
    return result.affectedRows > 0;
  }
}
