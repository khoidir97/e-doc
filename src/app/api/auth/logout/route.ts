import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/services/authService';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Logout berhasil!',
  });

  clearAuthCookie(response);
  return response;
}
