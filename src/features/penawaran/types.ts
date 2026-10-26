export interface Penawaran {
  pnw_id: number;
  pnw_master_dokumen_id: number;
  pnw_uraian_pekerjaan: string;
  pnw_volume: string;
  pnw_waktu: string;
  pnw_harga_satuan: number;
  pnw_harga_perkiraan_sendiri: number;
  pnw_created_at: Date | string | null;
  pnw_created_by: number | null;
  pnw_updated_at: Date | string | null;
  pnw_updated_by: number | null;
  pnw_deleted_at: Date | string | null;
  pnw_deleted_by: number | null;
}

export interface CreatePenawaranInput {
  pnw_master_dokumen_id: number;
  pnw_uraian_pekerjaan: string;
  pnw_volume: string;
  pnw_waktu: string;
  pnw_harga_satuan: number;
  pnw_harga_perkiraan_sendiri: number;
  pnw_created_by?: number | null;
}

export interface UpdatePenawaranInput {
  pnw_id: number;
  pnw_master_dokumen_id: number;
  pnw_uraian_pekerjaan: string;
  pnw_volume: string;
  pnw_waktu: string;
  pnw_harga_satuan: number;
  pnw_harga_perkiraan_sendiri: number;
  pnw_updated_by?: number | null;
}

export interface PenawaranListResult {
  data: Penawaran[];
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
