export interface Nego {
  nego_id: number;
  nego_master_dokumen_id: number;
  nego_uraian_kegiatan: string;
  nego_volume: string;
  nego_waktu: string;
  nego_hps_harga_satuan: number;
  nego_hps_jumlah_harga: number;
  nego_pnw_harga_satuan: number;
  nego_pnw_jumlah_harga: number;
  nego_negosiasi_harga_satuan: number;
  nego_negosiasi_jumlah_harga: number;
  nego_created_at: Date | string | null;
  nego_created_by: number | null;
  nego_updated_at: Date | string | null;
  nego_updated_by: number | null;
  nego_deleted_at: Date | string | null;
  nego_deleted_by: number | null;

}

export interface CreateNegoInput {
  nego_master_dokumen_id: number;
  nego_uraian_kegiatan: string;
  nego_volume: string;
  nego_waktu: string;
  nego_hps_harga_satuan: number;
  nego_hps_jumlah_harga: number;
  nego_pnw_harga_satuan: number;
  nego_pnw_jumlah_harga: number;
  nego_negosiasi_harga_satuan: number;
  nego_negosiasi_jumlah_harga: number;
  nego_created_by?: number | null;
}

export interface UpdateNegoInput {
  nego_id: number;
  nego_master_dokumen_id: number;
  nego_uraian_kegiatan: string;
  nego_volume: string;
  nego_waktu: string;
  nego_hps_harga_satuan: number;
  nego_hps_jumlah_harga: number;
  nego_pnw_harga_satuan: number;
  nego_pnw_jumlah_harga: number;
  nego_negosiasi_harga_satuan: number;
  nego_negosiasi_jumlah_harga: number;
  nego_updated_by?: number | null;
}

export interface NegoListResult {
  data: Nego[];
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
