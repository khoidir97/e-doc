export interface Kwitansi {
    kwt_id: number
    kwt_master_dokumen_id: number
    kwt_buku_kas_umum_no: string
    kwt_uang_sejumlah: number;
    kwt_sudah_terima_dari: string;
    kwt_tanggal_lunas_dibayar: string | Date | null
    kwt_tanggal_terima_uang: string | Date | null
    kwt_no_sp2d: string;
    kwt_status_lunas: number;
    kwt_created_at: string | Date | null
    kwt_created_by: number | null
    kwt_updated_at: string | Date | null
    kwt_updated_by: number | null
    kwt_deleted_at: string | Date | null
    kwt_deleted_by: number | null

}

export interface CreateKwitansiInput {
    kwt_master_dokumen_id: number;
    kwt_buku_kas_umum_no: string;
    kwt_uang_sejumlah: number;
    kwt_sudah_terima_dari: string;
    kwt_tanggal_lunas_dibayar: string | Date;
    kwt_tanggal_terima_uang: string | Date;
    kwt_no_sp2d: string;
    kwt_status_lunas: number;
    kwt_created_at: string | Date;
    kwt_created_by: number;
    kwt_updated_at: string | Date | null;
    kwt_updated_by: number | null;
    kwt_deleted_at: string | Date | null;
    kwt_deleted_by: number | null;
}

export interface UpdateKwitansiInput {
    kwt_id: number;
    kwt_master_dokumen_id: number;
    kwt_buku_kas_umum_no: string;
    kwt_uang_sejumlah: number;
    kwt_sudah_terima_dari: string;
    kwt_tanggal_lunas_dibayar: string | Date | null;
    kwt_tanggal_terima_uang: string | Date | null;
    kwt_no_sp2d: string;
    kwt_status_lunas: number;
    kwt_created_at: string | Date | null;
    kwt_created_by: number | null;
    kwt_updated_at: string | Date | null;
    kwt_updated_by: number | null;
    kwt_deleted_at: string | Date | null;
    kwt_deleted_by: number | null;
}

export interface KwitansiListResult {
    data: Kwitansi[];
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
