import { NextRequest, NextResponse } from 'next/server';
import { findUserByNip, verifyPassword } from '@/services/userService';
import { signToken, attachAuthCookie } from '@/services/authService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const pgw_nip = (body.pgw_nip || '').trim();
    const password = body.pgw_password || body.password;
    const rememberMe = body.rememberMe ?? true;

    if (!pgw_nip || !password) {
      return NextResponse.json(
        { success: false, message: 'Username dan Password wajib diisi.' },
        { status: 400 }
      );
    }

    const user = await findUserByNip(pgw_nip);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Username atau Password salah.' },
        { status: 401 }
      );
    }

    const isMatch = await verifyPassword(password, user.pgw_password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Username atau Password salah.' },
        { status: 401 }
      );
    }

    const authUser = {
      pgw_id: user.pgw_id,
      pgw_nip: user.pgw_nip,
      pgw_nama: user.pgw_nama,
      pgw_jabatan: user.pgw_jabatan,
      pgw_role: user.pgw_role,
    };

    const token = await signToken(authUser, rememberMe);
    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil!',
      user: authUser,
    });

    attachAuthCookie(response, token, rememberMe);
    return response;
  } catch (error: any) {
    console.error('[API Error] Login failed:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan internal server.' },
      { status: 500 }
    );
  }
}
