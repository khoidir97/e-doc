export interface SurveyHeader {
  srv_id: number;
  srv_master_dokumen_id: number;
  srv_nomor: string;
  srv_nama_kegiatan: string;
  srv_paket_pekerjaan: string;
  srv_tanggal_mulai: string | null;
  srv_tanggal_selesai: string | null;
  srv_nama_perusahaan: string;
  srv_alamat_perusahaan: string;
  srv_created_at?: Date | string | null;
  srv_created_by?: number | null;
  srv_updated_at?: Date | string | null;
  srv_updated_by?: number | null;
  srv_deleted_at?: Date | string | null;
  srv_deleted_by?: number | null;
}

export interface DetailSurvey {
  dsrv_id: number;
  dsrv_survey_id: number;
  dsrv_master_dokumen_id?: number;
  dsrv_jenis_spesifikasi: string;
  dsrv_harga_survey: number;
  dsrv_created_at?: Date | string | null;
  dsrv_created_by?: number | null;
  dsrv_updated_at?: Date | string | null;
  dsrv_updated_by?: number | null;
  dsrv_deleted_at?: Date | string | null;
  dsrv_deleted_by?: number | null;
}

export type Survey = DetailSurvey;

export interface SurveyWithDetails {
  header: SurveyHeader | null;
  details: DetailSurvey[];
  masterDokumen?: any;
}

export interface CreateSurveyInput {
  dsrv_survey_id: number;
  dsrv_master_dokumen_id?: number;
  dsrv_jenis_spesifikasi: string;
  dsrv_harga_survey: number;
  dsrv_created_by?: number | null;
}

export interface UpdateSurveyInput {
  dsrv_id: number;
  dsrv_survey_id: number;
  dsrv_master_dokumen_id?: number;
  dsrv_jenis_spesifikasi: string;
  dsrv_harga_survey: number;
  dsrv_updated_by?: number | null;
}

export interface SurveyListResult {
  data: any[];
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

