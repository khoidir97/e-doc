export interface MasterSatuan {
    st_id: number;
    st_nama?: string;
    st_created_at?: string | Date;
    st_created_by?: number | null;
    st_updated_at?: string | Date;
    st_updated_by?: number | null;
    st_deleted_at?: string | Date | null;
    st_deleted_by?: number | null;
}

export interface MasterSatuanInput {
    st_nama: string;
    st_created_by?: number | null;
}

export interface UpdateMasterSatuanInput {
    st_id: number;
    st_nama: string;
    st_updated_by?: number | null;
}

export interface MasterSatuanListResult {
    data: MasterSatuan[];
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
