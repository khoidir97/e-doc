export interface PerhitunganPaket {
  pak_id: number;
  pak_paket_id: number;
  pak_master_dokumen_id: number;
  pak_nilai_invoice: number;
  pak_dpp: number;
  pak_ppn: number;
  pak_pph23: number;
  pak_dibayar: number;
  pak_created_at: Date | string | null;
  pak_created_by: number | null;
  pak_updated_at: Date | string | null;
  pak_updated_by: number | null;
  pak_deleted_at: Date | string | null;
  pak_deleted_by: number | null;
}

// Interface for table `perhitungan_paket` (header dokumen)
export interface Paket {
  pkt_id: number;
  pkt_master_dokumen_id: number;
  pkt_spk_kwitansi: number | null;
  pkt_no_spk_kwitansi: string | null;
  pkt_tanggal_spk_kwitansi: string | Date | null;
  pkt_bapp: string | null;
  pkt_bast: string | null;
  pkt_bap: string | null;
  pkt_tanggal: string | Date | null;
  pkt_npwp: string | null;
  pkt_no_rekening: string | null;
  pkt_nama_rekening: string | null;
  pkt_nama_bank: string | null;
  pkt_created_at: string | Date | null;
  pkt_created_by: number | null;
  pkt_updated_at: string | Date | null;
  pkt_updated_by: number | null;
  pkt_deleted_at: string | Date | null;
  pkt_deleted_by: number | null;
}

export interface UpsertPaketInput {
  pkt_master_dokumen_id: number;
  pkt_spk_kwitansi?: number | null;
  pkt_no_spk_kwitansi?: string | null;
  pkt_tanggal_spk_kwitansi?: string | null;
  pkt_bapp?: string | null;
  pkt_bast?: string | null;
  pkt_bap?: string | null;
  pkt_tanggal?: string | null;
  pkt_npwp?: string | null;
  pkt_no_rekening?: string | null;
  pkt_nama_rekening?: string | null;
  pkt_nama_bank?: string | null;
  pkt_created_by?: number | null;
  pkt_updated_by?: number | null;
}


export interface CreatePerhitunganPaketInput {
  pak_paket_id?: number | null;
  pak_master_dokumen_id: number;
  pak_nilai_invoice: number;
  pak_dpp: number;
  pak_ppn: number;
  pak_pph23: number;
  pak_dibayar: number;
  pak_created_by?: number | null;
}

export interface UpdatePerhitunganPaketInput {
  pak_id: number;
  pak_paket_id?: number | null;
  pak_master_dokumen_id: number;
  pak_nilai_invoice: number;
  pak_dpp: number;
  pak_ppn: number;
  pak_pph23: number;
  pak_dibayar: number;
  pak_updated_by?: number | null;
}

export interface PerhitunganPaketListResult {
  data: PerhitunganPaket[];
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
