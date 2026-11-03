import { NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import { AuthUser } from '@/types/auth';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'e-doc-secret-key-change-this-in-production-123456'
);

const COOKIE_NAME = 'token';

export async function signToken(user: AuthUser, rememberMe = true): Promise<string> {
  const expirationTime = rememberMe ? '7d' : '1d';
  return new SignJWT({
    pgw_id: user.pgw_id,
    pgw_bdg_id: user.pgw_bdg_id,
    pgw_nip: user.pgw_nip,
    pgw_nama: user.pgw_nama,
    pgw_jabatan: user.pgw_jabatan,
    pgw_role: user.pgw_role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      pgw_id: payload.pgw_id as number,
      pgw_bdg_id: payload.pgw_bdg_id as number | undefined | null,
      pgw_nip: payload.pgw_nip as string,
      pgw_nama: payload.pgw_nama as string,
      pgw_jabatan: payload.pgw_jabatan as string,
      pgw_role: payload.pgw_role as number,
    };
  } catch {
    return null;
  }
}

export function attachAuthCookie(
  response: NextResponse,
  token: string,
  rememberMe = true
): void {
  const maxAgeSeconds = rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60;
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: maxAgeSeconds,
  });
}

export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  });
}
