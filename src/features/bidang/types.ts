export interface Bidang {
  bdg_id: number;
  bdg_nama: string;
  bdg_keterangan: string;
  bdg_created_at?: string | Date;
  bdg_created_by?: number | null;
  bdg_updated_at?: string | Date;
  bdg_updated_by?: number | null;
  bdg_deleted_at?: string | Date | null;
  bdg_deleted_by?: number | null;
}

export interface CreateBidangInput {
  bdg_nama: string;
  bdg_keterangan: string;
  bdg_created_by?: number | null;
}

export interface UpdateBidangInput {
  bdg_id: number;
  bdg_nama: string;
  bdg_keterangan: string;
  bdg_updated_by?: number | null;
}

export interface BidangListResult {
  data: Bidang[];
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
