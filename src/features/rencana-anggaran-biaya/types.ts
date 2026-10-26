export interface RencanaAnggaranBiaya {
  rab_id: number;
  rab_master_dokumen_id: number;
  rab_uraian_pekerjaan: string;
  rab_volume: string;
  rab_waktu: string;
  rab_harga_satuan: number;
  rab_harga_perkiraan_sendiri: number;
  rab_created_at: Date | string | null;
  rab_created_by: number | null;
  rab_updated_at: Date | string | null;
  rab_updated_by: number | null;
  rab_deleted_at: Date | string | null;
  rab_deleted_by: number | null;
}

export interface CreateRencanaAnggaranBiayaInput {
  rab_master_dokumen_id: number;
  rab_uraian_pekerjaan: string;
  rab_volume: string;
  rab_waktu: string;
  rab_harga_satuan: number;
  rab_harga_perkiraan_sendiri: number;
  rab_created_by?: number | null;
}

export interface UpdateRencanaAnggaranBiayaInput {
  rab_id: number;
  rab_master_dokumen_id: number;
  rab_uraian_pekerjaan: string;
  rab_volume: string;
  rab_waktu: string;
  rab_harga_satuan: number;
  rab_harga_perkiraan_sendiri: number;
  rab_updated_by?: number | null;
}

export interface RencanaAnggaranBiayaListResult {
  data: RencanaAnggaranBiaya[];
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
