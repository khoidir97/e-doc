import { NextRequest, NextResponse } from 'next/server';
import { findUserByNip, createUser } from '@/services/userService';
import { signToken, attachAuthCookie } from '@/services/authService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const pgw_nip = (body.pgw_nip || '').trim();
    const pgw_nama = body.pgw_nama || '';
    const pgw_jabatan = body.pgw_jabatan || '-';
    const password = body.pgw_password || body.password;

    if (!pgw_nip || !pgw_nama || !password) {
      return NextResponse.json(
        { success: false, message: 'Username, Nama dan Password wajib diisi.' },
        { status: 400 }
      );
    }

    const existing = await findUserByNip(pgw_nip);
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Username sudah terdaftar.' },
        { status: 400 }
      );
    }

    const newAuthUser = await createUser(pgw_nip, pgw_nama, pgw_jabatan, password, 1);
    const token = await signToken(newAuthUser, true);

    const response = NextResponse.json({
      success: true,
      message: 'Registrasi berhasil!',
      user: newAuthUser,
    });

    attachAuthCookie(response, token, true);
    return response;
  } catch (error: any) {
    console.error('[API Error] Registration failed:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan internal server.' },
      { status: 500 }
    );
  }
}
