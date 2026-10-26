import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/services/authService';
import { findUserByNip, verifyPassword } from '@/services/userService';
import pool, { initDatabase } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    // Auth check via cookie
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Tidak terotentikasi.' }, { status: 401 });
    }

    const authUser = await verifyToken(token);
    if (!authUser) {
      return NextResponse.json({ success: false, message: 'Sesi tidak valid atau telah berakhir.' }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ success: false, message: 'Semua field wajib diisi.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ success: false, message: 'Password baru minimal 6 karakter.' }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ success: false, message: 'Konfirmasi password tidak cocok.' }, { status: 400 });
    }

    // Get full user record (including hashed password)
    const fullUser = await findUserByNip(authUser.pgw_nip);
    if (!fullUser) {
      return NextResponse.json({ success: false, message: 'Pengguna tidak ditemukan.' }, { status: 404 });
    }

    // Verify current password
    const isValid = await verifyPassword(currentPassword, fullUser.pgw_password);
    if (!isValid) {
      return NextResponse.json({ success: false, message: 'Password saat ini tidak benar.' }, { status: 400 });
    }

    // Hash new password and update
    await initDatabase();
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE pegawai SET pgw_password = ?, pgw_updated_at = NOW() WHERE pgw_id = ? AND pgw_deleted_at IS NULL',
      [hashedPassword, authUser.pgw_id]
    );

    return NextResponse.json({ success: true, message: 'Password berhasil diubah.' });
  } catch (err) {
    console.error('change-password error:', err);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}
