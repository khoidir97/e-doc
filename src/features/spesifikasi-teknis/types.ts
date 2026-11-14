import { KerangkaAcuanKerja } from '../kerangka-acuan-kerja/types';
import { MasterDokumen } from '../master-dokumen/types';
import { Pegawai } from '../pegawai/types';

export interface SpesifikasiTeknis {
  spt_id: number;
  spt_kak_id: number;
  spt_paket_pengadaan: string | null;
  spt_satuan_kerja: string | null;
  spt_spt_ppk_pgw_id: number | null;
  spd_id_rup: string | null;
  spt_nama_barang_type: string | null;
  spt_identifikasi_tkdn: string | null;
  spt_prioritas_penggunaan: string | null;
  spt_spesifikasi_jumlah: string | null;
  spt_spesifikasi_waktu_pelaksanaan: string | null;
  spt_spesifikasi_waktu_lokasi_kedatangan: string | null;
  spt_spesifikasi_pelayanan: string | null;
  spt_spesifikasi_lokasi: string | null;
  spt_rencana_poin_negosiasi_teknis: string | null;
  spt_nama_pelaku_usaha: string | null;
  spt_link_katalog: string | null;
  spt_created_at?: string | Date | null;
  spt_created_by?: number | null;
  spt_updated_at?: string | Date | null;
  spt_updated_by?: number | null;
  spt_deleted_at?: string | Date | null;
  spt_deleted_by?: number | null;

  // Joined PPK Info
  ppk_nama?: string | null;
  ppk_nip?: string | null;
  ppk_jabatan?: string | null;
}

export interface DetailSpesifikasiTeknis {
  dpst_id?: number;
  dspt_spt_id?: number;
  dspt_item_barang_jasa: string;
  dspt_spesifikasi: string;
}

export interface DetailSpesifikasiJumlah {
  dspj_id?: number;
  dpsj_spt_id?: number;
  dspj_item_barang_jasa: string;
  dspj_jumlah: number;
  dspj_satuan_id: number | null;
  st_nama?: string | null;
}

export interface DetailDaftarPelakuUsaha {
  dpu_id?: number;
  dpu_spt_id?: number;
  dpu_item: string;
  dpu_nama_pelaku_usaha_potensial: string;
  dpu_link_katalog: string;
  dpu_harga: number;
  dpu_evaluasi_berdasarkan_parameter: string;
}

export interface SpesifikasiTeknisWithDetails {
  spesifikasiTeknis: SpesifikasiTeknis | null;
  detailTeknis: DetailSpesifikasiTeknis[];
  detailJumlah: DetailSpesifikasiJumlah[];
  detailPelakuUsaha: DetailDaftarPelakuUsaha[];
  kak: KerangkaAcuanKerja | null;
  masterDokumen: MasterDokumen | null;
  ppkPegawai: Pegawai | null;
}

export interface SaveSpesifikasiTeknisPayload {
  spt_id?: number | null;
  spt_kak_id: number;
  spt_paket_pengadaan?: string | null;
  spt_satuan_kerja?: string | null;
  spt_spt_ppk_pgw_id?: number | null;
  spd_id_rup?: string | null;
  spt_nama_barang_type?: string | null;
  spt_identifikasi_tkdn?: string | null;
  spt_prioritas_penggunaan?: string | null;
  spt_spesifikasi_jumlah?: string | null;
  spt_spesifikasi_waktu_pelaksanaan?: string | null;
  spt_spesifikasi_waktu_lokasi_kedatangan?: string | null;
  spt_spesifikasi_pelayanan?: string | null;
  spt_spesifikasi_lokasi?: string | null;
  spt_rencana_poin_negosiasi_teknis?: string | null;
  spt_nama_pelaku_usaha?: string | null;
  spt_link_katalog?: string | null;
  detailTeknis: DetailSpesifikasiTeknis[];
  detailJumlah: DetailSpesifikasiJumlah[];
  detailPelakuUsaha: DetailDaftarPelakuUsaha[];
}

export interface KakOptionItemForSpt {
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
  has_spesifikasi_teknis?: boolean;
}

export interface ActionResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

