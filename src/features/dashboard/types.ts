export interface DashboardSummary {
  totalPagu: number;
  totalDokumen: number;
  totalRealisasi: number;
  totalBidang: number;
  totalPerusahaan: number;
  totalPegawai: number;
}

export interface PaguPerBidang {
  bdg_id: number;
  bdg_nama: string;
  total_pagu: number;
  total_dokumen: number;
  persentase: number;
}

export interface PaguPerPptk {
  pgw_id: number;
  pgw_nama: string;
  total_pagu: number;
  total_terpakai: number;
  total_dokumen: number;
}

export interface RecentDokumen {
  mdk_id: number;
  mdk_no_dpa: string;
  mdk_program: string;
  mdk_kegiatan: string;
  mdk_pagu_anggaran: number;
  mdk_created_at: string | Date;
  bdg_nama: string;
}

export interface MonthlyTrend {
  bulan: number;
  nama_bulan: string;
  total_pagu: number;
  total_dokumen: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  paguPerBidang: PaguPerBidang[];
  paguPerPptk: PaguPerPptk[];
  recentDokumen: RecentDokumen[];
  monthlyTrend: MonthlyTrend[];
}

export interface ActionResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}
