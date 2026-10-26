import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, clearAuthCookie } from '@/services/authService';
import { findUserById } from '@/services/userService';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Tidak terotentikasi' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      const response = NextResponse.json(
        { success: false, message: 'Sesi tidak valid atau telah berakhir' },
        { status: 401 }
      );
      clearAuthCookie(response);
      return response;
    }

    const user = await findUserById(payload.pgw_id);
    if (!user) {
      const response = NextResponse.json(
        { success: false, message: 'Pengguna tidak ditemukan' },
        { status: 404 }
      );
      clearAuthCookie(response);
      return response;
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan internal server' },
      { status: 500 }
    );
  }
}
