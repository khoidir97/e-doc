export interface HargaPerkiraanSendiri {
  hps_id: number;
  hps_master_dokumen_id: number;
  hps_uraian_pekerjaan: string;
  hps_volume: string;
  hps_waktu: string;
  hps_harga_satuan: number;
  hps_harga_perkiraan_sendiri: number;
  hps_created_at: Date | string | null;
  hps_created_by: number | null;
  hps_updated_at: Date | string | null;
  hps_updated_by: number | null;
  hps_deleted_at: Date | string | null;
  hps_deleted_by: number | null;
}

export interface CreateHargaPerkiraanSendiriInput {
  hps_master_dokumen_id: number;
  hps_uraian_pekerjaan: string;
  hps_volume: string;
  hps_waktu: string;
  hps_harga_satuan: number;
  hps_harga_perkiraan_sendiri: number;
  hps_created_by?: number | null;
}

export interface UpdateHargaPerkiraanSendiriInput {
  hps_id: number;
  hps_master_dokumen_id: number;
  hps_uraian_pekerjaan: string;
  hps_volume: string;
  hps_waktu: string;
  hps_harga_satuan: number;
  hps_harga_perkiraan_sendiri: number;
  hps_updated_by?: number | null;
}

export interface HargaPerkiraanSendiriListResult {
  data: HargaPerkiraanSendiri[];
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
