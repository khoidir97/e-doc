export interface MasterDokumen {
  mdk_id: number;
  mdk_nama_pejabat_id: number;
  mdk_nama_pejabat?: string;
  mdk_nip_pejabat?: string;
  mdk_jabatan_pejabat?: string;
  mdk_bidang_id: number;
  mdk_bagian?: string;
  bdg_nama?: string;
  mdk_pagu_anggaran: number;
  mdk_nama_pejabat_pengadaan_id: number;
  mdk_nama_pejabat_pengadaan?: string;
  mdk_nip_pejabat_pengadaan?: string;
  mdk_nama_pptk_id: number;
  mdk_nama_pptk?: string;
  mdk_nip_pptk?: string;
  mdk_nama_bendahara_id: number;
  mdk_nama_bendahara?: string;
  mdk_nip_bendahara?: string;
  mdk_jabatan_bendahara?: string;
  mdk_nama_perusahaan_id: number;
  mdk_nama_perusahaan?: string;
  psh_nama?: string;
  psh_alamat?: string;
  psh_npwp?: string | null;
  psh_nomor_rekening?: string | null;
  psh_nama_rekening?: string | null;
  psh_nama_bank?: string | null;
  mdk_nama_pimpinan_perusahaan?: string;
  mdk_jabatan_pimpinan_perusahaan?: string;
  mdk_pekerjaan?: string;
  mdk_alamat: string;
  mdk_program: string;
  mdk_kode_program: string;
  mdk_kegiatan: string;
  mdk_kode_kegiatan: string;
  mdk_sub_kegiatan: string;
  mdk_kode_sub_kegiatan: string;
  mdk_uraian_belanja: string;
  mdk_rekening_belanja: string;
  mdk_kode_level1: string;
  mdk_nama_level1: string;
  mdk_kode_level2: string;
  mdk_nama_level2: string;
  mdk_kode_level3: string;
  mdk_nama_level3: string;
  mdk_kode_level4: string;
  mdk_nama_level4: string;
  mdk_kode_level5: string;
  mdk_nama_level5: string;
  mdk_keterangan: string;
  mdk_apbd: string;
  mdk_no_dpa: string;
  mdk_volume: string;
  mdk_satuan: number;
  st_nama?: string;
  mdk_is_lock?: number;
  mdk_created_at: string | Date;
  mdk_created_by: number | null;
  mdk_updated_at: string | Date | null;
  mdk_updated_by: number | null;
  mdk_deleted_at: string | Date | null;
  mdk_deleted_by: number | null;
}

export interface CreateMasterDokumenInput {
  mdk_nama_pejabat_id: number;
  mdk_bidang_id: number;
  mdk_pagu_anggaran: number;
  mdk_nama_pejabat_pengadaan_id: number;
  mdk_nama_pptk_id: number;
  mdk_nama_bendahara_id: number;
  mdk_nama_perusahaan_id: number;
  mdk_nama_pimpinan_perusahaan: string;
  mdk_jabatan_pimpinan_perusahaan: string;
  mdk_pekerjaan: string;
  mdk_alamat: string;
  mdk_program: string;
  mdk_kode_program: string;
  mdk_kegiatan: string;
  mdk_kode_kegiatan: string;
  mdk_sub_kegiatan: string;
  mdk_kode_sub_kegiatan: string;
  mdk_uraian_belanja: string;
  mdk_rekening_belanja: string;
  mdk_kode_level1: string;
  mdk_nama_level1: string;
  mdk_kode_level2: string;
  mdk_nama_level2: string;
  mdk_kode_level3: string;
  mdk_nama_level3: string;
  mdk_kode_level4: string;
  mdk_nama_level4: string;
  mdk_kode_level5: string;
  mdk_nama_level5: string;
  mdk_keterangan: string;
  mdk_apbd: string;
  mdk_no_dpa: string;
  mdk_volume: string;
  mdk_satuan: number;
  mdk_created_by?: number | null;
}

export interface UpdateMasterDokumenInput {
  mdk_id: number;
  mdk_nama_pejabat_id: number;
  mdk_bidang_id: number;
  mdk_pagu_anggaran: number;
  mdk_nama_pejabat_pengadaan_id: number;
  mdk_nama_pptk_id: number;
  mdk_nama_bendahara_id: number;
  mdk_nama_perusahaan_id: number;
  mdk_nama_pimpinan_perusahaan: string;
  mdk_jabatan_pimpinan_perusahaan: string;
  mdk_pekerjaan: string;
  mdk_alamat: string;
  mdk_program: string;
  mdk_kode_program: string;
  mdk_kegiatan: string;
  mdk_kode_kegiatan: string;
  mdk_sub_kegiatan: string;
  mdk_kode_sub_kegiatan: string;
  mdk_uraian_belanja: string;
  mdk_rekening_belanja: string;
  mdk_kode_level1: string;
  mdk_nama_level1: string;
  mdk_kode_level2: string;
  mdk_nama_level2: string;
  mdk_kode_level3: string;
  mdk_nama_level3: string;
  mdk_kode_level4: string;
  mdk_nama_level4: string;
  mdk_kode_level5: string;
  mdk_nama_level5: string;
  mdk_keterangan: string;
  mdk_apbd: string;
  mdk_no_dpa: string;
  mdk_volume: string;
  mdk_satuan: number;
  mdk_updated_by?: number | null;
}

export interface DeleteMasterDokumenInput {
  mdk_id: number;
  mdk_deleted_at: string | Date | null;
  mdk_deleted_by: number | null;
}

export interface MasterDokumenListResult {
  data: MasterDokumen[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ActionResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}
