import pool, { initDatabase } from '@/lib/db';
import { Permohonan, SavePermohonanPayload, KakOptionItem } from './types';

export class PermohonanRepository {
  static async findByKakId(kakId: number): Promise<Permohonan | null> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT * FROM permohonan WHERE pmh_kak_id = ? AND pmh_deleted_at IS NULL LIMIT 1`,
      [kakId]
    );
    return rows.length > 0 ? (rows[0] as Permohonan) : null;
  }

  static async findById(pmhId: number): Promise<Permohonan | null> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT * FROM permohonan WHERE pmh_id = ? AND pmh_deleted_at IS NULL LIMIT 1`,
      [pmhId]
    );
    return rows.length > 0 ? (rows[0] as Permohonan) : null;
  }

  static async getKakOptions(): Promise<KakOptionItem[]> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT 
         k.kak_id,
         k.kak_master_dokumen_id,
         COALESCE(k.kak_pekerjaan, m.mdk_pekerjaan, m.mdk_uraian_belanja) AS kak_pekerjaan,
         COALESCE(k.kak_program, m.mdk_program) AS kak_program,
         COALESCE(k.kak_kegiatan, m.mdk_kegiatan) AS kak_kegiatan,
         k.kak_metode_pemilihan,
         COALESCE(k.kak_tahun_anggaran, '2026') AS kak_tahun_anggaran,
         m.mdk_uraian_belanja,
         m.mdk_pekerjaan,
         COALESCE(m.mdk_pagu_anggaran, 0) AS mdk_pagu_anggaran,
         COALESCE(kb.total_biaya_kak, 0) AS total_biaya_kak,
         COALESCE(hps.total_hps, 0) AS total_hps,
         CASE WHEN p.pmh_id IS NOT NULL THEN 1 ELSE 0 END AS has_permohonan
       FROM kerangka_acuan_kerja k
       LEFT JOIN master_dokumen m ON k.kak_master_dokumen_id = m.mdk_id
       LEFT JOIN (
         SELECT kpb_kak_id, SUM(kpb_jumlah) AS total_biaya_kak
         FROM detail_kak_perkiraan_biaya
         WHERE kpb_deleted_at IS NULL
         GROUP BY kpb_kak_id
       ) kb ON k.kak_id = kb.kpb_kak_id
       LEFT JOIN (
         SELECT hps_master_dokumen_id, SUM(hps_harga_perkiraan_sendiri) AS total_hps
         FROM detail_harga_perkiraan_sendiri
         WHERE hps_deleted_at IS NULL
         GROUP BY hps_master_dokumen_id
       ) hps ON k.kak_master_dokumen_id = hps.hps_master_dokumen_id
       LEFT JOIN permohonan p ON k.kak_id = p.pmh_kak_id AND p.pmh_deleted_at IS NULL
       WHERE k.kak_deleted_at IS NULL
       ORDER BY k.kak_id DESC`
    );
    return rows as KakOptionItem[];
  }

  static async save(payload: SavePermohonanPayload, userId?: number | null): Promise<number> {
    await initDatabase();
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      let pmhId: number | null = payload.pmh_id ? Number(payload.pmh_id) : null;

      // Check existing permohonan for this kakId if not explicitly provided
      if (!pmhId && payload.pmh_kak_id) {
        const [existing]: any = await connection.query(
          `SELECT pmh_id FROM permohonan WHERE pmh_kak_id = ? AND pmh_deleted_at IS NULL LIMIT 1`,
          [payload.pmh_kak_id]
        );
        if (existing.length > 0) {
          pmhId = existing[0].pmh_id;
        }
      }

      if (pmhId) {
        await connection.query(
          `UPDATE permohonan SET
            pmh_kak_id = ?,
            pmh_tanggal = ?,
            pmh_nomor = ?,
            pmh_sifat = ?,
            pmh_lampiran = ?,
            pmh_hal = ?,
            pmh_paragraf1 = ?,
            pmh_kode_rup = ?,
            pmh_nama_paket = ?,
            pmh_pagu_anggaran = ?,
            pmh_hps = ?,
            pmh_metode_pemilihan = ?,
            pmh_sumber_dana = ?,
            pmh_paragraf2 = ?,
            pmh_updated_by = ?,
            pmh_updated_at = NOW()
          WHERE pmh_id = ?`,
          [
            payload.pmh_kak_id,
            payload.pmh_tanggal || null,
            payload.pmh_nomor || null,
            payload.pmh_sifat || null,
            payload.pmh_lampiran || null,
            payload.pmh_hal || null,
            payload.pmh_paragraf1 || null,
            payload.pmh_kode_rup || null,
            payload.pmh_nama_paket || null,
            Number(payload.pmh_pagu_anggaran) || 0,
            Number(payload.pmh_hps) || 0,
            payload.pmh_metode_pemilihan || null,
            payload.pmh_sumber_dana || null,
            payload.pmh_paragraf2 || null,
            userId ?? null,
            pmhId,
          ]
        );
      } else {
        const [insertResult]: any = await connection.query(
          `INSERT INTO permohonan
            (pmh_kak_id, pmh_tanggal, pmh_nomor, pmh_sifat, pmh_lampiran, pmh_hal,
             pmh_paragraf1, pmh_kode_rup, pmh_nama_paket, pmh_pagu_anggaran, pmh_hps,
             pmh_metode_pemilihan, pmh_sumber_dana, pmh_paragraf2, pmh_created_by, pmh_created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            payload.pmh_kak_id,
            payload.pmh_tanggal || null,
            payload.pmh_nomor || null,
            payload.pmh_sifat || null,
            payload.pmh_lampiran || null,
            payload.pmh_hal || null,
            payload.pmh_paragraf1 || null,
            payload.pmh_kode_rup || null,
            payload.pmh_nama_paket || null,
            Number(payload.pmh_pagu_anggaran) || 0,
            Number(payload.pmh_hps) || 0,
            payload.pmh_metode_pemilihan || null,
            payload.pmh_sumber_dana || null,
            payload.pmh_paragraf2 || null,
            userId ?? null,
          ]
        );
        pmhId = Number(insertResult.insertId);
      }

      if (!pmhId) {
        throw new Error('Gagal mendapatkan ID Permohonan yang disimpan.');
      }

      await connection.commit();
      return pmhId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  static async delete(pmhId: number, userId?: number | null): Promise<boolean> {
    await initDatabase();
    await pool.query(
      `UPDATE permohonan SET pmh_deleted_at = NOW(), pmh_deleted_by = ? WHERE pmh_id = ?`,
      [userId ?? null, pmhId]
    );
    return true;
  }
}
