import pool, { initDatabase } from '@/lib/db';
import { User, AuthUser } from '@/types/auth';
import bcrypt from 'bcryptjs';

export async function findUserByNip(pgw_nip: string): Promise<User | null> {
  await initDatabase();
  const [rows] = await pool.query<any[]>(
    'SELECT pgw_id, pgw_bdg_id, pgw_nip, pgw_nama, pgw_jabatan, pgw_password, pgw_role, pgw_created_at FROM pegawai WHERE pgw_nip = ? AND pgw_deleted_at IS NULL LIMIT 1',
    [pgw_nip]
  );
  if (!rows || rows.length === 0) return null;
  return rows[0] as User;
}

export async function findUserById(pgw_id: number): Promise<AuthUser | null> {
  await initDatabase();
  const [rows] = await pool.query<any[]>(
    'SELECT pgw_id, pgw_bdg_id, pgw_nip, pgw_nama, pgw_jabatan, pgw_role FROM pegawai WHERE pgw_id = ? AND pgw_deleted_at IS NULL LIMIT 1',
    [pgw_id]
  );
  if (!rows || rows.length === 0) return null;
  return rows[0] as AuthUser;
}

export async function createUser(pgw_nip: string, pgw_nama: string, pgw_jabatan: string, plainPassword: string, role = 1, bdg_id: number | null = null): Promise<AuthUser> {
  await initDatabase();
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const [result]: any = await pool.query(
    'INSERT INTO pegawai (pgw_nip, pgw_bdg_id, pgw_nama, pgw_jabatan, pgw_password, pgw_role) VALUES (?, ?, ?, ?, ?, ?)',
    [pgw_nip, bdg_id, pgw_nama, pgw_jabatan, hashedPassword, role]
  );

  return {
    pgw_id: result.insertId,
    pgw_bdg_id: bdg_id,
    pgw_nip,
    pgw_nama,
    pgw_jabatan,
    pgw_role: role,
  };
}

export async function verifyPassword(plainPassword: string, hashedPassword?: string): Promise<boolean> {
  if (!hashedPassword) return false;
  return bcrypt.compare(plainPassword, hashedPassword);
}
