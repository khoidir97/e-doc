import pool, { initDatabase } from '@/lib/db';
import { Kwitansi } from './types';
import { formatDateYYYYMMDD } from '@/lib/date';
import { isBelowPajakThreshold } from '@/lib/terbilang';

export class KwitansiRepository {
  static async findByMasterDokumenId(mdk_id: number): Promise<Kwitansi | null> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT * FROM kwitansi 
       WHERE kwt_master_dokumen_id = ? AND kwt_deleted_at IS NULL 
       ORDER BY kwt_id ASC LIMIT 1`,
      [mdk_id]
    );
    if (!rows || rows.length === 0) return null;
    return rows[0] as Kwitansi;
  }

  static async findAllByMasterDokumenId(mdk_id: number): Promise<Kwitansi[]> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT * FROM kwitansi 
       WHERE kwt_master_dokumen_id = ? AND kwt_deleted_at IS NULL 
       ORDER BY kwt_id ASC`,
      [mdk_id]
    );
    return (rows || []) as Kwitansi[];
  }

  static async findById(kwt_id: number): Promise<Kwitansi | null> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT * FROM kwitansi 
       WHERE kwt_id = ? AND kwt_deleted_at IS NULL 
       LIMIT 1`,
      [kwt_id]
    );
    if (!rows || rows.length === 0) return null;
    return rows[0] as Kwitansi;
  }

  static async findPakDibayarByMasterDokumenId(mdk_id: number): Promise<{ pak_dibayar: number | null; pkt_no_spk_kwitansi: string | null; nego_jumlah: number | null }> {
    await initDatabase();
    let pak_dibayar: number | null = null;
    let pkt_no_spk_kwitansi: string | null = null;
    let nego_jumlah: number | null = null;

    try {
      const [negoRows] = await pool.query<any[]>(
        `SELECT nego_negosiasi_jumlah_harga 
         FROM nego 
         WHERE nego_master_dokumen_id = ? AND nego_deleted_at IS NULL`,
        [mdk_id]
      );
      if (negoRows && negoRows.length > 0) {
        const totalNego = negoRows.reduce((s, i) => s + (Number(i.nego_negosiasi_jumlah_harga) || 0), 0);
        const ppnNego = isBelowPajakThreshold(totalNego) ? Math.round(totalNego * 0.11) : 0;
        const jumlahNego = totalNego + ppnNego;
        if (jumlahNego > 0) {
          nego_jumlah = jumlahNego;
        }
      }
    } catch (err) {
      console.error('[KwitansiRepository] Error fetching nego_jumlah:', err);
    }

    try {
      const [pakRows] = await pool.query<any[]>(
        `SELECT SUM(pak_dibayar) as total_dibayar, COUNT(*) as count 
         FROM detail_perhitungan_paket 
         WHERE pak_master_dokumen_id = ? AND pak_deleted_at IS NULL`,
        [mdk_id]
      );
      if (pakRows && pakRows.length > 0 && pakRows[0].count > 0 && pakRows[0].total_dibayar !== null) {
        const val = Number(pakRows[0].total_dibayar);
        pak_dibayar = isNaN(val) ? null : val;
      }
    } catch (err) {
      console.error('[KwitansiRepository] Error fetching pak_dibayar:', err);
    }

    try {
      const [pktRows] = await pool.query<any[]>(
        `SELECT pkt_no_spk_kwitansi 
         FROM perhitungan_paket 
         WHERE pkt_master_dokumen_id = ? AND pkt_deleted_at IS NULL 
         ORDER BY pkt_id DESC LIMIT 1`,
        [mdk_id]
      );
      if (pktRows && pktRows.length > 0) {
        pkt_no_spk_kwitansi = pktRows[0].pkt_no_spk_kwitansi || null;
      }
    } catch (err) {
      console.error('[KwitansiRepository] Error fetching pkt_no_spk_kwitansi:', err);
    }

    return { pak_dibayar, pkt_no_spk_kwitansi, nego_jumlah };
  }

  static async create(
    mdk_id: number,
    bukuKasNo: string,
    uangSejumlah: number | string,
    sudahTerimaDari: string,
    yaituKet: string,
    tanggalLunasDibayar?: string | Date | null,
    tanggalTerimaUang?: string | Date | null,
    noSp2d?: string | null,
    statusLunas?: number | null,
    userId?: number | null
  ): Promise<Kwitansi | null> {
    await initDatabase();
    const tglLunas = tanggalLunasDibayar ? (formatDateYYYYMMDD(tanggalLunasDibayar) || null) : null;
    const tglTerima = tanggalTerimaUang ? (formatDateYYYYMMDD(tanggalTerimaUang) || null) : null;
    const nominalInt = Math.round(Number(uangSejumlah)) || 0;
    const cleanBukuKasNo = (bukuKasNo || '').trim();
    const cleanNoSp2d = (noSp2d || '').trim();
    const cleanStatusLunas = Number(statusLunas) === 1 ? 1 : 0;

    const [result]: any = await pool.query(
      `INSERT INTO kwitansi (kwt_master_dokumen_id, kwt_buku_kas_umum_no, kwt_sudah_terima_dari, kwt_yaitu, kwt_uang_sejumlah, kwt_tanggal_lunas_dibayar, kwt_tanggal_terima_uang, kwt_no_sp2d, kwt_status_lunas, kwt_created_at, kwt_created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
      [mdk_id, cleanBukuKasNo, sudahTerimaDari, yaituKet, nominalInt, tglLunas, tglTerima, cleanNoSp2d, cleanStatusLunas, userId ?? null]
    );

    if (result.insertId > 0) {
      return await this.findById(result.insertId);
    }
    return null;
  }

  static async update(
    kwt_id: number,
    bukuKasNo: string,
    uangSejumlah: number | string,
    sudahTerimaDari: string,
    yaituKet: string,
    tanggalLunasDibayar?: string | Date | null,
    tanggalTerimaUang?: string | Date | null,
    noSp2d?: string | null,
    statusLunas?: number | null,
    userId?: number | null
  ): Promise<boolean> {
    await initDatabase();
    const tglLunas = tanggalLunasDibayar ? (formatDateYYYYMMDD(tanggalLunasDibayar) || null) : null;
    const tglTerima = tanggalTerimaUang ? (formatDateYYYYMMDD(tanggalTerimaUang) || null) : null;
    const nominalInt = Math.round(Number(uangSejumlah)) || 0;
    const cleanBukuKasNo = (bukuKasNo || '').trim();
    const cleanNoSp2d = (noSp2d || '').trim();
    const cleanStatusLunas = Number(statusLunas) === 1 ? 1 : 0;

    const [result]: any = await pool.query(
      `UPDATE kwitansi 
       SET kwt_buku_kas_umum_no = ?, kwt_uang_sejumlah = ?, kwt_sudah_terima_dari = ?, kwt_yaitu = ?, kwt_tanggal_lunas_dibayar = ?, kwt_tanggal_terima_uang = ?, kwt_no_sp2d = ?, kwt_status_lunas = ?, kwt_updated_by = ?, kwt_updated_at = NOW() 
       WHERE kwt_id = ? AND kwt_deleted_at IS NULL`,
      [cleanBukuKasNo, nominalInt, sudahTerimaDari, yaituKet, tglLunas, tglTerima, cleanNoSp2d, cleanStatusLunas, userId ?? null, kwt_id]
    );
    return result.affectedRows > 0;
  }

  static async delete(kwt_id: number, userId?: number | null): Promise<boolean> {
    await initDatabase();
    const [result]: any = await pool.query(
      `UPDATE kwitansi 
       SET kwt_deleted_at = NOW(), kwt_deleted_by = ? 
       WHERE kwt_id = ? AND kwt_deleted_at IS NULL`,
      [userId ?? null, kwt_id]
    );
    return result.affectedRows > 0;
  }

  static async upsert(
    mdk_id: number,
    bukuKasNo: string,
    uangSejumlah: number | string,
    sudahTerimaDari: string,
    yaituKet: string,
    tanggalLunasDibayar?: string | Date | null,
    tanggalTerimaUang?: string | Date | null,
    noSp2d?: string | null,
    statusLunas?: number | null,
    userId?: number | null
  ): Promise<boolean> {
    await initDatabase();
    const existing = await this.findByMasterDokumenId(mdk_id);
    if (existing) {
      return await this.update(existing.kwt_id, bukuKasNo, uangSejumlah, sudahTerimaDari, yaituKet, tanggalLunasDibayar, tanggalTerimaUang, noSp2d, statusLunas, userId);
    } else {
      const created = await this.create(mdk_id, bukuKasNo, uangSejumlah, sudahTerimaDari, yaituKet, tanggalLunasDibayar, tanggalTerimaUang, noSp2d, statusLunas, userId);
      return created !== null;
    }
  }
}
