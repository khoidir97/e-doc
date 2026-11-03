export interface Pegawai {
  pgw_id: number;
  pgw_bdg_id?: number | null;
  bdg_nama?: string;
  pgw_nip: string;
  pgw_nama: string;
  pgw_jabatan: string;
  pgw_role: number;
  pgw_status_pegawai: number;
  pgw_created_at?: string | Date;
  pgw_created_by?: number | null;
  pgw_updated_at?: string | Date;
  pgw_updated_by?: number | null;
  pgw_deleted_at?: string | Date | null;
  pgw_deleted_by?: number | null;
}

export interface CreatePegawaiInput {
  pgw_nip: string;
  pgw_bdg_id?: number | null;
  pgw_nama: string;
  pgw_jabatan: string;
  pgw_password: string;
  pgw_role: number;
  pgw_status_pegawai: number;
  pgw_created_by?: number | null;
}

export interface UpdatePegawaiInput {
  pgw_id: number;
  pgw_nip: string;
  pgw_bdg_id?: number | null;
  pgw_nama: string;
  pgw_jabatan: string;
  pgw_password?: string;
  pgw_role: number;
  pgw_status_pegawai: number;
  pgw_updated_by?: number | null;
}

export interface PegawaiListResult {
  data: Pegawai[];
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
