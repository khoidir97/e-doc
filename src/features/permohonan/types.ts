import { KerangkaAcuanKerja } from '../kerangka-acuan-kerja/types';
import { MasterDokumen } from '../master-dokumen/types';

export interface Permohonan {
  pmh_id: number;
  pmh_kak_id: number;
  pmh_tanggal: string | Date | null;
  pmh_nomor: string | null;
  pmh_sifat: string | null;
  pmh_lampiran: string | null;
  pmh_hal: string | null;
  pmh_paragraf1: string | null;
  pmh_kode_rup: string | null;
  pmh_nama_paket: string | null;
  pmh_pagu_anggaran: number;
  pmh_hps: number;
  pmh_metode_pemilihan: string | null;
  pmh_sumber_dana: string | null;
  pmh_paragraf2: string | null;
  pmh_created_at: string | Date | null;
  pmh_created_by: number | null;
  pmh_updated_at: string | Date | null;
  pmh_updated_by: number | null;
  pmh_deleted_at: string | Date | null;
  pmh_deleted_by: number | null;
}

export interface SavePermohonanPayload {
  pmh_id?: number | null;
  pmh_kak_id: number;
  pmh_tanggal?: string | null;
  pmh_nomor?: string | null;
  pmh_sifat?: string | null;
  pmh_lampiran?: string | null;
  pmh_hal?: string | null;
  pmh_paragraf1?: string | null;
  pmh_kode_rup?: string | null;
  pmh_nama_paket?: string | null;
  pmh_pagu_anggaran?: number;
  pmh_hps?: number;
  pmh_metode_pemilihan?: string | null;
  pmh_sumber_dana?: string | null;
  pmh_paragraf2?: string | null;
}

export interface PermohonanWithDetails {
  permohonan: Permohonan | null;
  kak: KerangkaAcuanKerja | null;
  masterDokumen: MasterDokumen | null;
  totalBiayaKak: number;
  totalHps: number;
}

export interface KakOptionItem {
  kak_id: number;
  kak_pekerjaan: string | null;
  kak_program: string | null;
  kak_kegiatan: string | null;
  kak_metode_pemilihan: string | null;
  kak_tahun_anggaran: string | null;
  kak_master_dokumen_id: number | null;
  mdk_uraian_belanja?: string | null;
  mdk_pekerjaan?: string | null;
  mdk_pagu_anggaran?: number | null;
  total_biaya_kak?: number;
  total_hps?: number;
  has_permohonan?: boolean;
}

export interface ActionResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}
