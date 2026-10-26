export interface Perusahaan {
  psh_id: number;
  psh_nama: string;
  psh_nama_pimpinan: string;
  psh_jabatan: string;
  psh_alamat: string;
  psh_created_at?: string | Date;
  psh_created_by?: number | null;
  psh_updated_at?: string | Date;
  psh_updated_by?: number | null;
  psh_deleted_at?: string | Date | null;
  psh_deleted_by?: number | null;
}

export interface CreatePerusahaanInput {
  psh_nama: string;
  psh_nama_pimpinan: string;
  psh_jabatan: string;
  psh_alamat: string;
  psh_created_by?: number | null;
}

export interface UpdatePerusahaanInput {
  psh_id: number;
  psh_nama: string;
  psh_nama_pimpinan: string;
  psh_jabatan: string;
  psh_alamat: string;
  psh_updated_by?: number | null;
}

export interface PerusahaanListResult {
  data: Perusahaan[];
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
