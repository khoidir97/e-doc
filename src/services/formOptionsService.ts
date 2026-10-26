/**
 * formOptionsService.ts
 *
 * Service untuk mengambil data pilihan (options/dropdown) yang dibutuhkan
 * oleh form MasterDokumen dan form-form lainnya.
 *
 * Menggunakan `apiClient` yang sudah dilengkapi dengan X-API-KEY header.
 *
 * Penggunaan:
 *   import { FormOptionsService } from '@/services/formOptionsService';
 *
 *   // Ambil semua data sekaligus (direkomendasikan)
 *   const options = await FormOptionsService.getAll();
 *
 *   // Atau ambil per-kategori
 *   const pegawai = await FormOptionsService.getPegawai({ search: 'budi', limit: 100 });
 */

import { apiClient } from '@/lib/apiClient';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PegawaiOption {
  pgw_id: number;
  pgw_nip: string;
  pgw_nama: string;
  pgw_jabatan: string;
  pgw_role: number;
}

export interface PerusahaanOption {
  prs_id: number;
  prs_nama: string;
  prs_alamat?: string;
  prs_npwp?: string;
  prs_nama_pimpinan?: string;
  prs_jabatan_pimpinan?: string;
}

export interface BidangOption {
  bdg_id: number;
  bdg_nama: string;
  bdg_kode?: string;
}

export interface FormOptionsResult {
  pegawai: PegawaiOption[];
  perusahaan: PerusahaanOption[];
  bidang: BidangOption[];
}

export interface GetListParams {
  search?: string;
  page?: number;
  limit?: number;
}

interface ListApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const FormOptionsService = {
  /**
   * Ambil daftar pegawai untuk dropdown.
   * @param params - Filter opsional: search, page, limit
   */
  async getPegawai(params: GetListParams = {}): Promise<PegawaiOption[]> {
    const { search = '', page = 1, limit = 500 } = params;

    const res = await apiClient.get<ListApiResponse<PegawaiOption>>('/api/pegawai', {
      params: { search, page, limit },
    });

    return res.data?.data ?? [];
  },

  /**
   * Ambil daftar perusahaan untuk dropdown.
   * @param params - Filter opsional: search, page, limit
   */
  async getPerusahaan(params: GetListParams = {}): Promise<PerusahaanOption[]> {
    const { search = '', page = 1, limit = 500 } = params;

    const res = await apiClient.get<ListApiResponse<PerusahaanOption>>('/api/perusahaan', {
      params: { search, page, limit },
    });

    return res.data?.data ?? [];
  },

  /**
   * Ambil daftar bidang untuk dropdown.
   * @param params - Filter opsional: search, page, limit
   */
  async getBidang(params: GetListParams = {}): Promise<BidangOption[]> {
    const { search = '', page = 1, limit = 500 } = params;

    const res = await apiClient.get<ListApiResponse<BidangOption>>('/api/bidang', {
      params: { search, page, limit },
    });

    return res.data?.data ?? [];
  },

  /**
   * Ambil semua data pilihan form sekaligus secara paralel.
   * Lebih efisien dari memanggil satu per satu karena menggunakan Promise.allSettled
   * sehingga gagalnya satu fetch tidak menghentikan yang lain.
   *
   * @example
   * const { pegawai, perusahaan, bidang } = await FormOptionsService.getAll();
   */
  async getAll(params: GetListParams = {}): Promise<FormOptionsResult> {
    const [pegawaiResult, perusahaanResult, bidangResult] = await Promise.allSettled([
      FormOptionsService.getPegawai(params),
      FormOptionsService.getPerusahaan(params),
      FormOptionsService.getBidang(params),
    ]);

    return {
      pegawai:
        pegawaiResult.status === 'fulfilled'
          ? pegawaiResult.value
          : (console.error('Gagal mengambil data pegawai:', (pegawaiResult as PromiseRejectedResult).reason), []),
      perusahaan:
        perusahaanResult.status === 'fulfilled'
          ? perusahaanResult.value
          : (console.error('Gagal mengambil data perusahaan:', (perusahaanResult as PromiseRejectedResult).reason), []),
      bidang:
        bidangResult.status === 'fulfilled'
          ? bidangResult.value
          : (console.error('Gagal mengambil data bidang:', (bidangResult as PromiseRejectedResult).reason), []),
    };
  },
};
