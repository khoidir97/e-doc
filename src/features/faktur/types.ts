// Interface for table `faktur` (header dokumen)
export interface FakturHeader {
  fak_id: number;
  fak_master_dokumen_id: number;
  fak_nomor_faktur: string | null;
  fak_tanggal_faktur: string | Date | null;
  fak_created_at?: Date | string | null;
  fak_created_by?: number | null;
  fak_updated_at?: Date | string | null;
  fak_updated_by?: number | null;
  fak_deleted_at?: Date | string | null;
  fak_deleted_by?: number | null;
}

// Interface for table `detail_faktur` (item rows)
export interface Faktur {
  fkt_id: number;
  fkt_faktur_id?: number | null;
  fkt_master_dokumen_id: number;
  fkt_jenis_spesifikasi: string;
  fkt_unit: number;
  fkt_hari: string;
  fkt_harga_satuan: number;
  fkt_total: number;
  fkt_created_at?: Date | string | null;
  fkt_created_by?: number | null;
  fkt_updated_at?: Date | string | null;
  fkt_updated_by?: number | null;
  fkt_deleted_at?: Date | string | null;
  fkt_deleted_by?: number | null;
}

export type DetailFaktur = Faktur;

export interface FakturWithDetails {
  header: FakturHeader | null;
  details: Faktur[];
  masterDokumen?: any;
}

export interface CreateFakturInput {
  fkt_faktur_id?: number | null;
  fkt_master_dokumen_id: number;
  fkt_jenis_spesifikasi: string;
  fkt_unit: number;
  fkt_hari: string;
  fkt_harga_satuan: number;
  fkt_total: number;
  fkt_created_by?: number | null;
}

export interface UpdateFakturInput {
  fkt_id: number;
  fkt_faktur_id?: number | null;
  fkt_master_dokumen_id: number;
  fkt_jenis_spesifikasi: string;
  fkt_unit: number;
  fkt_hari: string;
  fkt_harga_satuan: number;
  fkt_total: number;
  fkt_updated_by?: number | null;
}

export interface UpsertFakturHeaderInput {
  fak_id?: number;
  fak_master_dokumen_id: number;
  fak_nomor_faktur?: string | null;
  fak_tanggal_faktur?: string | Date | null;
}

export interface FakturListResult {
  data: Faktur[];
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
