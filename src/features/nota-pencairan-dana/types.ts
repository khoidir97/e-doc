export interface NotaPencairanDana {
  dpd_id: number;
  dpd_master_dokumen_id: number;
  dpd_uraian: string;
  dpd_dpa_volume: string;
  dpd_dpa_satuan: string;
  dpd_dpa_nilai: number;
  dpd_belum_volume: string;
  dpd_belum_nilai: number;
  dpd_saatini_volume: string;
  dpd_saatini_nilai: number;
  dpd_saatini_ppn: number;
  dpd_saatini_pph23: number;
  dpd_saatini_total_pajak: number;
  dpd_saatini_pembayaran: number;
  dpd_sisa_volume: string;
  dpd_sisa_nilai: number;
  dpd_created_at: Date | string;
  dpd_created_by: number | null;
  dpd_updated_at: Date | string | null;
  dpd_updated_by: number | null;
  dpd_deleted_at: Date | string | null;
  dpd_deleted_by: number | null;
}

export interface CreateNotaPencairanDanaInput {
  dpd_master_dokumen_id: number;
  dpd_uraian: string;
  dpd_dpa_volume: string;
  dpd_dpa_satuan: string;
  dpd_dpa_nilai: number;
  dpd_belum_volume: string;
  dpd_belum_nilai: number;
  dpd_saatini_volume: string;
  dpd_saatini_nilai: number;
  dpd_saatini_ppn: number;
  dpd_saatini_pph23: number;
  dpd_saatini_total_pajak: number;
  dpd_saatini_pembayaran: number;
  dpd_sisa_volume: string;
  dpd_sisa_nilai: number;
  dpd_created_by?: number | null;
}

export interface UpdateNotaPencairanDanaInput {
  dpd_id: number;
  dpd_master_dokumen_id: number;
  dpd_uraian: string;
  dpd_dpa_volume: string;
  dpd_dpa_satuan: string;
  dpd_dpa_nilai: number;
  dpd_belum_volume: string;
  dpd_belum_nilai: number;
  dpd_saatini_volume: string;
  dpd_saatini_nilai: number;
  dpd_saatini_ppn: number;
  dpd_saatini_pph23: number;
  dpd_saatini_total_pajak: number;
  dpd_saatini_pembayaran: number;
  dpd_sisa_volume: string;
  dpd_sisa_nilai: number;
  dpd_updated_by?: number | null;
}

export interface NotaPencairanDanaListResult {
  data: NotaPencairanDana[];
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


