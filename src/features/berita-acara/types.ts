export interface MasterJenisBeritaAcara {
  mba_id: number;
  mba_kode: string;
  mba_nama: string;
}

export interface MasterBaBuktiPerikatan {
  mbk_id: number;
  mbk_kode: string;
  mbk_nama: string;
}

export interface BeritaAcaraHeader {
  bac_id?: number;
  bac_master_dokumen_id: number;
  bac_master_jenis_ba_id?: string | null;
  bac_bukti_perikatan?: string | null;
  bac_nomor_bukti_perikatan?: string | null;
  bac_nomor_surat_pemeriksaan?: string | null;
  bac_nomor_surat_serah_terima?: string | null;
  bac_nomor_surat?: string; // backwards compatibility / virtual getter
  bac_paragraf_pertama: string;
  bac_paragraf_kedua: string;
  bac_hasil_pemeriksaan: string;
  bac_tanggal: string | Date;
  bac_created_at?: string | Date;
  bac_created_by?: number | null;
  bac_updated_at?: string | Date | null;
  bac_updated_by?: number | null;
  bac_deleted_at?: string | Date | null;
  bac_deleted_by?: number | null;
}

export interface BeritaAcara {
  dba_id: number;
  dba_berita_acara_id: number | null;
  dba_master_dokumen_id: number;
  dba_uraian: string;
  dba_volume: string;
  dba_satuan: string;
  dba_status_pemeriksaan: string;
  dba_created_at?: string | Date;
  dba_created_by?: number | null;
  dba_updated_at?: string | Date | null;
  dba_updated_by?: number | null;
  dba_deleted_at?: string | Date | null;
  dba_deleted_by?: number | null;
}

export interface CreateBeritaAcaraInput {
  dba_berita_acara_id?: number | null;
  dba_master_dokumen_id: number;
  dba_uraian: string;
  dba_volume: string;
  dba_satuan: string;
  dba_status_pemeriksaan: string;
  dba_created_by?: number | null;
}

export interface UpdateBeritaAcaraInput {
  dba_id: number;
  dba_berita_acara_id?: number | null;
  dba_master_dokumen_id: number;
  dba_uraian: string;
  dba_volume: string;
  dba_satuan: string;
  dba_status_pemeriksaan: string;
  dba_updated_by?: number | null;
}

export interface BeritaAcaraFullData {
  header: BeritaAcaraHeader | null;
  items: BeritaAcara[];
}

export interface BeritaAcaraListResult {
  data: BeritaAcara[];
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
