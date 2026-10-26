import pool, { initDatabase } from '@/lib/db';
import { DashboardData, PaguPerBidang, RecentDokumen, MonthlyTrend } from './types';

const NAMA_BULAN = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
];

export class DashboardRepository {
  static async getDashboardData(): Promise<DashboardData> {
    await initDatabase();

    const currentYear = new Date().getFullYear();

    // Execute ALL analytical queries concurrently in parallel using Promise.all
    // to minimize connection roundtrip latency.
    const [
      [paguRows],
      [realisasiNpdRows],
      [realisasiKwtRows],
      [bidangRows],
      [perusahaanRows],
      [pegawaiRows],
      [paguBidangRows],
      [recentRows],
      [trendRows]
    ] = await Promise.all([
      // 1. Total Pagu & Count Master Dokumen
      pool.query<any[]>(
        `SELECT COALESCE(SUM(mdk_pagu_anggaran), 0) AS total_pagu, COUNT(*) AS total_dokumen 
         FROM master_dokumen 
         WHERE mdk_deleted_at IS NULL`
      ),
      // 2. Realisasi NPD
      pool.query<any[]>(
        `SELECT COALESCE(SUM(dpd_saatini_pembayaran), 0) AS total_realisasi 
         FROM nota_pencairan_dana 
         WHERE dpd_deleted_at IS NULL`
      ),
      // 3. Realisasi Kwitansi
      pool.query<any[]>(
        `SELECT COALESCE(SUM(CAST(kwt_uang_sejumlah AS DECIMAL(18,2))), 0) AS total_kwitansi 
         FROM kwitansi 
         WHERE kwt_deleted_at IS NULL`
      ),
      // 4. Count Bidang
      pool.query<any[]>(
        `SELECT COUNT(*) AS total_bidang FROM bidang WHERE bdg_deleted_at IS NULL`
      ),
      // 5. Count Perusahaan
      pool.query<any[]>(
        `SELECT COUNT(*) AS total_perusahaan FROM perusahaan WHERE psh_deleted_at IS NULL`
      ),
      // 6. Count Pegawai
      pool.query<any[]>(
        `SELECT COUNT(*) AS total_pegawai FROM pegawai WHERE pgw_deleted_at IS NULL`
      ),
      // 7. Pagu per Bidang (GROUP BY Bidang)
      pool.query<any[]>(
        `SELECT 
           b.bdg_id, 
           b.bdg_nama, 
           COALESCE(SUM(md.mdk_pagu_anggaran), 0) AS total_pagu,
           COUNT(md.mdk_id) AS total_dokumen
         FROM bidang b
         LEFT JOIN master_dokumen md ON md.mdk_bidang_id = b.bdg_id AND md.mdk_deleted_at IS NULL
         WHERE b.bdg_deleted_at IS NULL
         GROUP BY b.bdg_id, b.bdg_nama
         ORDER BY total_pagu DESC`
      ),
      // 8. Recent Master Dokumen
      pool.query<any[]>(
        `SELECT 
           md.mdk_id,
           md.mdk_no_dpa,
           md.mdk_program,
           md.mdk_kegiatan,
           md.mdk_pagu_anggaran,
           md.mdk_created_at,
           COALESCE(b.bdg_nama, 'Lainnya') AS bdg_nama
         FROM master_dokumen md
         LEFT JOIN bidang b ON md.mdk_bidang_id = b.bdg_id AND b.bdg_deleted_at IS NULL
         WHERE md.mdk_deleted_at IS NULL
         ORDER BY md.mdk_id DESC
         LIMIT 6`
      ),
      // 9. Monthly Trend (Current Year)
      pool.query<any[]>(
        `SELECT 
           MONTH(mdk_created_at) AS bulan,
           COALESCE(SUM(mdk_pagu_anggaran), 0) AS total_pagu,
           COUNT(*) AS total_dokumen
         FROM master_dokumen
         WHERE mdk_deleted_at IS NULL AND YEAR(mdk_created_at) = ?
         GROUP BY MONTH(mdk_created_at)
         ORDER BY bulan ASC`,
        [currentYear]
      )
    ]);

    const totalPagu = Number(paguRows[0]?.total_pagu || 0);
    const totalDokumen = Number(paguRows[0]?.total_dokumen || 0);
    const totalNpd = Number(realisasiNpdRows[0]?.total_realisasi || 0);
    const totalKwt = Number(realisasiKwtRows[0]?.total_kwitansi || 0);
    const totalRealisasi = Math.max(totalNpd, totalKwt);

    const totalBidang = Number(bidangRows[0]?.total_bidang || 0);
    const totalPerusahaan = Number(perusahaanRows[0]?.total_perusahaan || 0);
    const totalPegawai = Number(pegawaiRows[0]?.total_pegawai || 0);

    // Process Pagu per Bidang
    let allocatedPaguSum = 0;
    let allocatedDocSum = 0;

    const paguPerBidang: PaguPerBidang[] = paguBidangRows.map((row) => {
      const pagu = Number(row.total_pagu || 0);
      const docs = Number(row.total_dokumen || 0);
      allocatedPaguSum += pagu;
      allocatedDocSum += docs;

      const persentase = totalPagu > 0 ? Number(((pagu / totalPagu) * 100).toFixed(1)) : 0;
      return {
        bdg_id: row.bdg_id,
        bdg_nama: row.bdg_nama || 'Tidak Ditentukan',
        total_pagu: pagu,
        total_dokumen: docs,
        persentase,
      };
    });

    // Check if there is unallocated pagu or unassigned master_dokumen
    const unassignedPagu = totalPagu - allocatedPaguSum;
    const unassignedCount = totalDokumen - allocatedDocSum;
    if (unassignedCount > 0 || unassignedPagu > 0) {
      const persentase = totalPagu > 0 ? Number(((Math.max(0, unassignedPagu) / totalPagu) * 100).toFixed(1)) : 0;
      paguPerBidang.push({
        bdg_id: 0,
        bdg_nama: 'Lainnya / Belum Ditentukan',
        total_pagu: Math.max(0, unassignedPagu),
        total_dokumen: Math.max(0, unassignedCount),
        persentase,
      });
    }

    // Process Recent Master Dokumen
    const recentDokumen: RecentDokumen[] = recentRows.map((row) => ({
      mdk_id: row.mdk_id,
      mdk_no_dpa: row.mdk_no_dpa || '-',
      mdk_program: row.mdk_program || '-',
      mdk_kegiatan: row.mdk_kegiatan || '-',
      mdk_pagu_anggaran: Number(row.mdk_pagu_anggaran || 0),
      mdk_created_at: row.mdk_created_at,
      bdg_nama: row.bdg_nama,
    }));

    // Process Monthly Trend
    const monthlyTrendMap = new Map<number, { total_pagu: number; total_dokumen: number }>();
    trendRows.forEach((r) => {
      monthlyTrendMap.set(Number(r.bulan), {
        total_pagu: Number(r.total_pagu || 0),
        total_dokumen: Number(r.total_dokumen || 0),
      });
    });

    const monthlyTrend: MonthlyTrend[] = Array.from({ length: 12 }, (_, i) => {
      const bln = i + 1;
      const data = monthlyTrendMap.get(bln) || { total_pagu: 0, total_dokumen: 0 };
      return {
        bulan: bln,
        nama_bulan: NAMA_BULAN[i],
        total_pagu: data.total_pagu,
        total_dokumen: data.total_dokumen,
      };
    });

    return {
      summary: {
        totalPagu,
        totalDokumen,
        totalRealisasi,
        totalBidang,
        totalPerusahaan,
        totalPegawai,
      },
      paguPerBidang,
      recentDokumen,
      monthlyTrend,
    };
  }

  static async getDokumenByBidang(bdg_id: number): Promise<any[]> {
    await initDatabase();
    let query = `
      SELECT 
        md.mdk_id,
        md.mdk_no_dpa,
        md.mdk_uraian_belanja,
        md.mdk_pekerjaan,
        md.mdk_program,
        md.mdk_kegiatan,
        md.mdk_sub_kegiatan,
        md.mdk_pagu_anggaran,
        md.mdk_created_at,
        COALESCE(b.bdg_nama, 'Lainnya / Belum Ditentukan') AS bdg_nama
      FROM master_dokumen md
      LEFT JOIN bidang b ON md.mdk_bidang_id = b.bdg_id AND b.bdg_deleted_at IS NULL
      WHERE md.mdk_deleted_at IS NULL
    `;
    const params: any[] = [];
    if (bdg_id > 0) {
      query += ` AND md.mdk_bidang_id = ?`;
      params.push(bdg_id);
    } else if (bdg_id === 0) {
      query += ` AND (md.mdk_bidang_id IS NULL OR md.mdk_bidang_id = 0 OR b.bdg_id IS NULL)`;
    }
    query += ` ORDER BY md.mdk_id DESC`;

    const [rows] = await pool.query<any[]>(query, params);
    return rows.map((r) => ({
      mdk_id: r.mdk_id,
      mdk_no_dpa: r.mdk_no_dpa || '-',
      mdk_uraian_belanja: r.mdk_uraian_belanja || '-',
      mdk_pekerjaan: r.mdk_pekerjaan || '-',
      mdk_program: r.mdk_program || '-',
      mdk_kegiatan: r.mdk_kegiatan || '-',
      mdk_sub_kegiatan: r.mdk_sub_kegiatan || '-',
      mdk_pagu_anggaran: Number(r.mdk_pagu_anggaran || 0),
      mdk_created_at: r.mdk_created_at,
      bdg_nama: r.bdg_nama,
    }));
  }
}
