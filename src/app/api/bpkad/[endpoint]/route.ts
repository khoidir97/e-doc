/**
 * src/app/api/bpkad/[endpoint]/route.ts
 *
 * Next.js API Proxy Route untuk server BPKAD (20.40.40.16).
 *
 * Endpoint & Method Mapping:
 *   GET  /api/bpkad/program          → GET  http://20.40.40.16/Api-Prog
 *   POST /api/bpkad/kegiatan         → POST http://20.40.40.16/Api-Kegiatan    (body: { "KODE_PROGRAM": "5.02.01" })
 *   POST /api/bpkad/sub-kegiatan     → POST http://20.40.40.16/Api-SubKegiatan  (body: { "KODE_KEGIATAN": "5.02.01.2.01" })
 *   POST /api/bpkad/rekening-belanja → POST http://20.40.40.16/Api-RekBel      (body: { "KODE_SUB_KEGIATAN": "5.02.01.2.02.0001" })
 */

import { NextRequest, NextResponse } from 'next/server';

const BPKAD_BASE_URL = (process.env.BPKAD_API_BASE_URL ?? 'http://20.40.40.16').replace(/\/$/, '');
const BPKAD_API_KEY  = process.env.BPKAD_API_KEY ?? process.env.NEXT_PUBLIC_API_KEY ?? 'BPKAD2026JAYA-P1209';

/** Peta endpoint lokal → { path, method } di server BPKAD */
const ENDPOINT_MAP: Record<string, { path: string; method: 'GET' | 'POST' }> = {
  'program':          { path: '/Api-Prog',        method: 'GET'  },
  'kegiatan':         { path: '/Api-Kegiatan',    method: 'POST' },
  'sub-kegiatan':     { path: '/Api-SubKegiatan', method: 'POST' },
  'rekening-belanja': { path: '/Api-RekBel',      method: 'POST' },
  'sp2d':             { path: '/Api-SP2D',        method: 'POST' },
};

const BPKAD_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'x-api-key': BPKAD_API_KEY,
};

/** Normalisasi raw response BPKAD → format ApiResponse standar */
function normalizeResponse(raw: any) {
  return {
    success: raw.status === true,
    message: raw.Info ?? raw.message ?? '',
    data: raw.data ?? [],
  };
}

async function handleProxy(endpoint: string, method: 'GET' | 'POST', body?: unknown) {
  const config = ENDPOINT_MAP[endpoint];

  if (!config) {
    return NextResponse.json(
      { success: false, message: `Endpoint '${endpoint}' tidak dikenali.`, data: [] },
      { status: 404 }
    );
  }

  const targetUrl = `${BPKAD_BASE_URL}${config.path}`;

  try {
    const fetchInit: RequestInit = {
      method: config.method,
      headers: BPKAD_HEADERS,
      cache: 'no-store',
    };

    if (config.method === 'POST' && body !== undefined) {
      fetchInit.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    const response = await fetch(targetUrl, fetchInit);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: `Server BPKAD merespons ${response.status}`, data: [] },
        { status: response.status }
      );
    }

    const raw = await response.json();
    return NextResponse.json(normalizeResponse(raw));

  } catch (error: any) {
    console.error(`[BPKAD Proxy] Gagal fetch ${targetUrl}:`, error?.message ?? error);
    return NextResponse.json(
      {
        success: false,
        message: `Gagal menghubungi server BPKAD: ${error?.message ?? 'Network error'}`,
        data: [],
      },
      { status: 502 }
    );
  }
}

// ─── GET Handler (Program) ───────────────────────────────────────────────────

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ endpoint: string }> }
) {
  const { endpoint } = await params;
  return handleProxy(endpoint, 'GET');
}

// ─── POST Handler (Kegiatan, Sub Kegiatan, Rekening Belanja) ──────────────────

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ endpoint: string }> }
) {
  const { endpoint } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  return handleProxy(endpoint, 'POST', body);
}
