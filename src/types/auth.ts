export interface User {
  pgw_id: number;
  pgw_bdg_id?: number | null;
  pgw_nip: string;
  pgw_nama: string;
  pgw_jabatan: string;
  pgw_password?: string;
  pgw_role: number;
  pgw_created_at?: string | Date;
  pgw_created_by?: number | null;
  pgw_updated_at?: string | Date;
  pgw_updated_by?: number | null;
  pgw_deleted_at?: string | Date | null;
  pgw_deleted_by?: number | null;
}

export interface AuthUser {
  pgw_id: number;
  pgw_bdg_id?: number | null;
  pgw_nip: string;
  pgw_nama: string;
  pgw_jabatan: string;
  pgw_role: number;
}

export interface LoginPayload {
  pgw_nip?: string;
  pgw_nama?: string;
  pgw_jabatan?: string;
  pgw_password?: string;
  password?: string;
  rememberMe?: boolean;
}

export interface RegisterPayload {
  pgw_nip?: string;
  pgw_nama?: string;
  pgw_jabatan?: string;
  pgw_password?: string;
  password?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  user?: AuthUser;
}
