export interface KerangkaAcuanKerja {
  kak_id: number;
  kak_master_dokumen_id: number | null;
  kak_program: string | null;
  kak_kode_program: string | null;
  kak_kegiatan: string | null;
  kak_kode_kegiatan: string | null;
  kak_sub_kegiatan: string | null;
  kak_rekening: string | null;
  kak_kode_rekening: string | null;
  kak_pekerjaan: string | null;
  kak_tahun_anggaran: string | null;
  kak_latar_belakang: string | null;
  kak_maksud_dan_tujuan: string | null;
  kak_referensi_hukum: string | null;
  kak_target_sasaran: string | null;
  kak_nama_organisasi_dan_pengadaan: string | null;
  kak_sumber_dana_perkiraan_biaya: string | null;
  kak_perkiraan_biaya_id: number | null;
  kak_ruang_lingkup_lokasi_pekerjaan: string | null;
  kak_jangka_waktu_pelaksanaan: string | null;
  kak_metode_pemilihan: string | null;
  kak_spesifikasi_teknis_id: number | null;
  kak_persyaratan_kualifikasi_penyedia: string | null;
  kak_penutup: string | null;
  kak_created_at: string | Date | null;
  kak_created_by: number | null;
  kak_updated_at: string | Date | null;
  kak_updated_by: number | null;
  kak_deleted_at: string | Date | null;
  kak_deleted_by: number | null;
}

export interface DetailKakPerkiraanBiaya {
  kpb_id?: number;
  kpb_kak_id?: number;
  kpb_uraian: string;
  kpb_volume: number;
  kpb_harga: number;
  kpb_jumlah: number;
  kpb_created_at?: string | Date;
  kpb_created_by?: number | null;
  kpb_updated_at?: string | Date | null;
  kpb_updated_by?: number | null;
  kpb_deleted_at?: string | Date | null;
  kpb_deleted_by?: number | null;
}

export interface DetailKakSpesifikasiTeknis {
  kst_id?: number;
  kst_kak_id?: number;
  kst_uraian: string;
  kst_spesifikasi: string;
  kst_created_at?: string | Date;
  kst_created_by?: number | null;
  kst_updated_at?: string | Date | null;
  kst_updated_by?: number | null;
  kst_deleted_at?: string | Date | null;
  kst_deleted_by?: number | null;
}

export interface KerangkaAcuanKerjaWithDetails {
  kak: KerangkaAcuanKerja | null;
  perkiraanBiayaList: DetailKakPerkiraanBiaya[];
  spesifikasiTeknisList: DetailKakSpesifikasiTeknis[];
}

export interface SaveKakPayload {
  kak_id?: number | null;
  kak_master_dokumen_id?: number | null;
  kak_program?: string | null;
  kak_kode_program?: string | null;
  kak_kegiatan?: string | null;
  kak_kode_kegiatan?: string | null;
  kak_sub_kegiatan?: string | null;
  kak_rekening?: string | null;
  kak_kode_rekening?: string | null;
  kak_pekerjaan?: string | null;
  kak_tahun_anggaran?: string | null;
  kak_latar_belakang?: string | null;
  kak_maksud_dan_tujuan?: string | null;
  kak_referensi_hukum?: string | null;
  kak_target_sasaran?: string | null;
  kak_nama_organisasi_dan_pengadaan?: string | null;
  kak_sumber_dana_perkiraan_biaya?: string | null;
  kak_perkiraan_biaya_id?: number | null;
  kak_ruang_lingkup_lokasi_pekerjaan?: string | null;
  kak_jangka_waktu_pelaksanaan?: string | null;
  kak_metode_pemilihan?: string | null;
  kak_spesifikasi_teknis_id?: number | null;
  kak_persyaratan_kualifikasi_penyedia?: string | null;
  kak_penutup?: string | null;
  perkiraanBiayaList: {
    kpb_id?: number;
    kpb_uraian: string;
    kpb_volume: number;
    kpb_harga: number;
    kpb_jumlah: number;
  }[];
  spesifikasiTeknisList: {
    kst_id?: number;
    kst_uraian: string;
    kst_spesifikasi: string;
  }[];
}

export interface ActionResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

