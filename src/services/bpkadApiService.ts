/**
 * bpkadApiService.ts
 *
 * Service untuk mengambil data referensi dari API BPKAD melalui proxy Next.js.
 *
 * Alur pengambilan data bertingkat:
 *   1. GET  /api/bpkad/program          → semua program
 *   2. POST /api/bpkad/kegiatan         → kegiatan berdasarkan program
 *      body: { "KODE_PROGRAM": "5.02.01" }
 *   3. POST /api/bpkad/sub-kegiatan     → sub kegiatan berdasarkan kegiatan
 *      body: { "KODE_KEGIATAN": "5.02.01.2.01" }
 *   4. POST /api/bpkad/rekening-belanja → rekening belanja berdasarkan sub kegiatan
 *      body: { "KODE_SUB_KEGIATAN": "5.02.01.2.02.0001" }
 *
 * Penggunaan:
 *   import { BpkadApiService } from '@/services/bpkadApiService';
 *
 *   const program     = await BpkadApiService.getProgram();
 *   const kegiatan    = await BpkadApiService.getKegiatan('5.02.01');
 *   const subKegiatan = await BpkadApiService.getSubKegiatan('5.02.01.2.01');
 *   const rekBelanja  = await BpkadApiService.getRekeningBelanja('5.02.01.2.02.0001');
 */

import { apiClient } from '@/lib/apiClient';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Program {
  KODE_PROGRAM: string;
  NAMA_PROGRAM: string;
}

export interface Kegiatan {
  KODE_KEGIATAN: string;
  NAMA_KEGIATAN: string;
  PAGU?: string;
}

export interface SubKegiatan {
  KODE_SUB_KEGIATAN: string;
  NAMA_SUB_KEGIATAN: string;
  PAGU?: string;
}

export interface RekeningBelanja {
  KODE_REKENING: string;
  NAMA_REKENING: string;
  PAGU: string;
  KODE_LEVEL_I?: string;
  NAMA_LEVEL_I?: string;
  KODE_LEVEL_II?: string;
  NAMA_LEVEL_II?: string;
  KODE_LEVEL_III?: string;
  NAMA_LEVEL_III?: string;
  KODE_LEVEL_IV?: string;
  NAMA_LEVEL_IV?: string;
  KODE_LEVEL_V?: string;
  NAMA_LEVEL_V?: string;
}

export interface RincianObjek {
  KODE_STANDAR_HARGA: string;
  NAMA_STANDAR_HARGA: string;
  SPESIFIKASI: string;
  KOOFISIEN: string;
  SATUAN: string;
  HARGA_SATUAN: string;
  PAGU_TOTAL: string;
}

export interface Sp2dItem {
  NOMOR_SP2D: string;
  TANGGAL_SP2D?: string;
  TANGGAL_TRANSFER?: string;
  KETERANGAN?: string;
  PENERIMA?: string;
  PPN?: string | number | null;
  PPH?: string | number | null;
  NILAI?: string | number | null;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const BpkadApiService = {
  /**
   * Ambil daftar Program (Semua).
   * Proxy: GET /api/bpkad/program → GET http://20.40.40.16/Api-Prog
   */
  async getProgram(): Promise<Program[]> {
    const res = await apiClient.get<Program[]>('/api/bpkad/program');
    return res.data ?? [];
  },

  /**
   * Ambil daftar Kegiatan berdasarkan KODE_PROGRAM.
   * Proxy: POST /api/bpkad/kegiatan → POST http://20.40.40.16/Api-Kegiatan
   * Body: { "KODE_PROGRAM": "5.02.01" }
   */
  async getKegiatan(kodeProgram: string): Promise<Kegiatan[]> {
    if (!kodeProgram.trim()) return [];

    const res = await apiClient.post<Kegiatan[]>('/api/bpkad/kegiatan', {
      body: { KODE_PROGRAM: kodeProgram },
    });
    return res.data ?? [];
  },

  /**
   * Ambil daftar Sub Kegiatan berdasarkan KODE_KEGIATAN.
   * Proxy: POST /api/bpkad/sub-kegiatan → POST http://20.40.40.16/Api-SubKegiatan
   * Body: { "KODE_KEGIATAN": "5.02.01.2.01" }
   */
  async getSubKegiatan(kodeKegiatan: string): Promise<SubKegiatan[]> {
    if (!kodeKegiatan.trim()) return [];

    const res = await apiClient.post<SubKegiatan[]>('/api/bpkad/sub-kegiatan', {
      body: { KODE_KEGIATAN: kodeKegiatan },
    });
    return res.data ?? [];
  },

  /**
   * Ambil daftar Rekening Belanja berdasarkan KODE_SUB_KEGIATAN.
   * Proxy: POST /api/bpkad/rekening-belanja → POST http://20.40.40.16/Api-RekBel
   * Body: { "KODE_SUB_KEGIATAN": "5.02.01.2.02.0001" }
   */
  async getRekeningBelanja(kodeSubKegiatan: string): Promise<RekeningBelanja[]> {
    if (!kodeSubKegiatan.trim()) return [];

    const res = await apiClient.post<RekeningBelanja[]>('/api/bpkad/rekening-belanja', {
      body: { KODE_SUB_KEGIATAN: kodeSubKegiatan },
    });
    return res.data ?? [];
  },

  /**
   * Ambil daftar Rincian Objek Belanja berdasarkan KODE_SUB_KEGIATAN & KODE_REKENING.
   * Proxy: POST /api/bpkad/rincian-objek → POST http://20.40.40.16/Api-RO
   * Body: { "KODE_SUB_KEGIATAN": "5.02.01.2.06.0011", "KODE_REKENING": "5.2.02.10.002.00004" }
   */
  async getRincianObjek(kodeSubKegiatan: string, kodeRekening: string): Promise<RincianObjek[]> {
    if (!kodeSubKegiatan.trim() || !kodeRekening.trim()) return [];

    const res = await apiClient.post<RincianObjek[]>('/api/bpkad/rincian-objek', {
      body: {
        KODE_SUB_KEGIATAN: kodeSubKegiatan.trim(),
        KODE_REKENING: kodeRekening.trim(),
      },
    });
    return res.data ?? [];
  },

  /**
   * Ambil daftar SP2D berdasarkan KODE_SUBKEGIATAN.
   * Proxy: POST /api/bpkad/sp2d → POST http://20.40.40.16/Api-SP2D
   * Body: { "KODE_SUBKEGIATAN": "5.02.01.2.02.0001" }
   */
  async getSp2d(kodeSubKegiatan: string): Promise<Sp2dItem[]> {
    if (!kodeSubKegiatan || !kodeSubKegiatan.trim()) return [];

    const res = await apiClient.post<Sp2dItem[]>('/api/bpkad/sp2d', {
      body: { KODE_SUBKEGIATAN: kodeSubKegiatan.trim() },
    });
    return res.data ?? [];
  },
};
