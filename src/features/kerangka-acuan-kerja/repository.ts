import pool, { initDatabase } from '@/lib/db';
import {
  KerangkaAcuanKerja,
  DetailKakPerkiraanBiaya,
  DetailKakSpesifikasiTeknis,
  SaveKakPayload,
  KakOptionItem,
} from './types';

export class KerangkaAcuanKerjaRepository {
  static async findByMasterDokumenId(mdkId: number): Promise<KerangkaAcuanKerja | null> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT * FROM kerangka_acuan_kerja WHERE kak_master_dokumen_id = ? AND kak_deleted_at IS NULL LIMIT 1`,
      [mdkId]
    );
    return rows.length > 0 ? (rows[0] as KerangkaAcuanKerja) : null;
  }

  static async findById(kakId: number): Promise<KerangkaAcuanKerja | null> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT * FROM kerangka_acuan_kerja WHERE kak_id = ? AND kak_deleted_at IS NULL LIMIT 1`,
      [kakId]
    );
    return rows.length > 0 ? (rows[0] as KerangkaAcuanKerja) : null;
  }

  static async getPerkiraanBiayaByKakId(kakId: number): Promise<DetailKakPerkiraanBiaya[]> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT * FROM detail_kak_perkiraan_biaya WHERE kpb_kak_id = ? AND kpb_deleted_at IS NULL ORDER BY kpb_id ASC`,
      [kakId]
    );
    return rows as DetailKakPerkiraanBiaya[];
  }

  static async getSpesifikasiTeknisByKakId(kakId: number): Promise<DetailKakSpesifikasiTeknis[]> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT * FROM detail_kak_spesifikasi_teknis WHERE kst_kak_id = ? AND kst_deleted_at IS NULL ORDER BY kst_id ASC`,
      [kakId]
    );
    return rows as DetailKakSpesifikasiTeknis[];
  }

  static async getManualKakList(): Promise<KerangkaAcuanKerja[]> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT * FROM kerangka_acuan_kerja 
       WHERE (kak_master_dokumen_id IS NULL OR kak_master_dokumen_id = 0) 
         AND kak_deleted_at IS NULL 
       ORDER BY kak_id DESC`
    );
    return rows as KerangkaAcuanKerja[];
  }

  static async getAllKakForSelection(): Promise<KakOptionItem[]> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT 
         k.kak_id,
         k.kak_master_dokumen_id,
         COALESCE(NULLIF(TRIM(k.kak_pekerjaan), ''), m.mdk_pekerjaan, CONCAT('KAK #', k.kak_id)) as kak_pekerjaan,
         COALESCE(NULLIF(TRIM(k.kak_program), ''), m.mdk_program, '') as kak_program,
         COALESCE(NULLIF(TRIM(k.kak_kode_program), ''), m.mdk_kode_program, '') as kak_kode_program,
         COALESCE(NULLIF(TRIM(k.kak_kegiatan), ''), m.mdk_kegiatan, '') as kak_kegiatan,
         COALESCE(NULLIF(TRIM(k.kak_kode_kegiatan), ''), m.mdk_kode_kegiatan, '') as kak_kode_kegiatan,
         COALESCE(NULLIF(TRIM(k.kak_sub_kegiatan), ''), m.mdk_sub_kegiatan, '') as kak_sub_kegiatan,
         COALESCE(m.mdk_kode_sub_kegiatan, '') as kak_kode_sub_kegiatan,
         COALESCE(NULLIF(TRIM(k.kak_rekening), ''), m.mdk_uraian_belanja, m.mdk_rekening_belanja, '') as kak_rekening,
         COALESCE(NULLIF(TRIM(k.kak_kode_rekening), ''), m.mdk_rekening_belanja, '') as kak_kode_rekening,
         COALESCE(NULLIF(TRIM(k.kak_tahun_anggaran), ''), m.mdk_apbd, '2026') as kak_tahun_anggaran,
         COALESCE(
           (SELECT SUM(kpb_jumlah) FROM detail_kak_perkiraan_biaya WHERE kpb_kak_id = k.kak_id AND kpb_deleted_at IS NULL),
           m.mdk_pagu_anggaran,
           0
         ) as kak_pagu_total
       FROM kerangka_acuan_kerja k
       LEFT JOIN master_dokumen m ON k.kak_master_dokumen_id = m.mdk_id
       WHERE k.kak_deleted_at IS NULL
       ORDER BY k.kak_id DESC`
    );
    return rows.map((r) => ({
      kak_id: Number(r.kak_id),
      kak_master_dokumen_id: r.kak_master_dokumen_id ? Number(r.kak_master_dokumen_id) : null,
      kak_pekerjaan: r.kak_pekerjaan || '',
      kak_program: r.kak_program || '',
      kak_kode_program: r.kak_kode_program || '',
      kak_kegiatan: r.kak_kegiatan || '',
      kak_kode_kegiatan: r.kak_kode_kegiatan || '',
      kak_sub_kegiatan: r.kak_sub_kegiatan || '',
      kak_kode_sub_kegiatan: r.kak_kode_sub_kegiatan || '',
      kak_rekening: r.kak_rekening || '',
      kak_kode_rekening: r.kak_kode_rekening || '',
      kak_tahun_anggaran: r.kak_tahun_anggaran || '',
      kak_pagu_total: Number(r.kak_pagu_total) || 0,
    }));
  }

  static async saveAll(payload: SaveKakPayload, userId?: number | null): Promise<number> {
    await initDatabase();
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      let kakId: number | null = payload.kak_id ? Number(payload.kak_id) : null;

      // If kakId not specified, check if existing record for this master dokumen
      if (!kakId && payload.kak_master_dokumen_id) {
        const [existingRows]: any = await connection.query(
          `SELECT kak_id FROM kerangka_acuan_kerja WHERE kak_master_dokumen_id = ? AND kak_deleted_at IS NULL LIMIT 1`,
          [payload.kak_master_dokumen_id]
        );
        if (existingRows.length > 0) {
          kakId = existingRows[0].kak_id;
        }
      }

      if (kakId) {
        await connection.query(
          `UPDATE kerangka_acuan_kerja SET
            kak_master_dokumen_id = ?,
            kak_program = ?,
            kak_kode_program = ?,
            kak_kegiatan = ?,
            kak_kode_kegiatan = ?,
            kak_sub_kegiatan = ?,
            kak_rekening = ?,
            kak_kode_rekening = ?,
            kak_pekerjaan = ?,
            kak_tahun_anggaran = ?,
            kak_latar_belakang = ?,
            kak_maksud_dan_tujuan = ?,
            kak_referensi_hukum = ?,
            kak_target_sasaran = ?,
            kak_nama_organisasi_dan_pengadaan = ?,
            kak_sumber_dana_perkiraan_biaya = ?,
            kak_perkiraan_biaya_id = ?,
            kak_ruang_lingkup_lokasi_pekerjaan = ?,
            kak_jangka_waktu_pelaksanaan = ?,
            kak_metode_pemilihan = ?,
            kak_spesifikasi_teknis_id = ?,
            kak_persyaratan_kualifikasi_penyedia = ?,
            kak_penutup = ?,
            kak_updated_by = ?,
            kak_updated_at = NOW()
          WHERE kak_id = ?`,
          [
            payload.kak_master_dokumen_id || null,
            payload.kak_program || null,
            payload.kak_kode_program || null,
            payload.kak_kegiatan || null,
            payload.kak_kode_kegiatan || null,
            payload.kak_sub_kegiatan || null,
            payload.kak_rekening || null,
            payload.kak_kode_rekening || null,
            payload.kak_pekerjaan || null,
            payload.kak_tahun_anggaran || null,
            payload.kak_latar_belakang || null,
            payload.kak_maksud_dan_tujuan || null,
            payload.kak_referensi_hukum || null,
            payload.kak_target_sasaran || null,
            payload.kak_nama_organisasi_dan_pengadaan || null,
            payload.kak_sumber_dana_perkiraan_biaya || null,
            payload.kak_perkiraan_biaya_id || null,
            payload.kak_ruang_lingkup_lokasi_pekerjaan || null,
            payload.kak_jangka_waktu_pelaksanaan || null,
            payload.kak_metode_pemilihan || null,
            payload.kak_spesifikasi_teknis_id || null,
            payload.kak_persyaratan_kualifikasi_penyedia || null,
            payload.kak_penutup || null,
            userId ?? null,
            kakId,
          ]
        );
      } else {
        const [insertResult]: any = await connection.query(
          `INSERT INTO kerangka_acuan_kerja
            (kak_master_dokumen_id, kak_program, kak_kode_program, kak_kegiatan, kak_kode_kegiatan,
             kak_sub_kegiatan, kak_rekening, kak_kode_rekening, kak_pekerjaan, kak_tahun_anggaran,
             kak_latar_belakang, kak_maksud_dan_tujuan, kak_referensi_hukum,
             kak_target_sasaran, kak_nama_organisasi_dan_pengadaan, kak_sumber_dana_perkiraan_biaya,
             kak_perkiraan_biaya_id, kak_ruang_lingkup_lokasi_pekerjaan, kak_jangka_waktu_pelaksanaan,
             kak_metode_pemilihan, kak_spesifikasi_teknis_id, kak_persyaratan_kualifikasi_penyedia,
             kak_penutup, kak_created_by, kak_created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            payload.kak_master_dokumen_id || null,
            payload.kak_program || null,
            payload.kak_kode_program || null,
            payload.kak_kegiatan || null,
            payload.kak_kode_kegiatan || null,
            payload.kak_sub_kegiatan || null,
            payload.kak_rekening || null,
            payload.kak_kode_rekening || null,
            payload.kak_pekerjaan || null,
            payload.kak_tahun_anggaran || null,
            payload.kak_latar_belakang || null,
            payload.kak_maksud_dan_tujuan || null,
            payload.kak_referensi_hukum || null,
            payload.kak_target_sasaran || null,
            payload.kak_nama_organisasi_dan_pengadaan || null,
            payload.kak_sumber_dana_perkiraan_biaya || null,
            payload.kak_perkiraan_biaya_id || null,
            payload.kak_ruang_lingkup_lokasi_pekerjaan || null,
            payload.kak_jangka_waktu_pelaksanaan || null,
            payload.kak_metode_pemilihan || null,
            payload.kak_spesifikasi_teknis_id || null,
            payload.kak_persyaratan_kualifikasi_penyedia || null,
            payload.kak_penutup || null,
            userId ?? null,
          ]
        );
        kakId = Number(insertResult.insertId);
      }

      if (!kakId) {
        throw new Error('Gagal mendapatkan ID Kerangka Acuan Kerja yang disimpan.');
      }

      // 1. Sync detail_kak_perkiraan_biaya
      // Soft-delete existing items for this kakId first
      await connection.query(
        `UPDATE detail_kak_perkiraan_biaya SET kpb_deleted_at = NOW(), kpb_deleted_by = ? WHERE kpb_kak_id = ? AND kpb_deleted_at IS NULL`,
        [userId ?? null, kakId]
      );

      if (payload.perkiraanBiayaList && payload.perkiraanBiayaList.length > 0) {
        for (const item of payload.perkiraanBiayaList) {
          if (!item.kpb_uraian || item.kpb_uraian.trim() === '') continue;
          await connection.query(
            `INSERT INTO detail_kak_perkiraan_biaya
              (kpb_kak_id, kpb_uraian, kpb_volume, kpb_harga, kpb_jumlah, kpb_created_by)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              kakId,
              item.kpb_uraian.trim(),
              Number(item.kpb_volume) || 0,
              Number(item.kpb_harga) || 0,
              Number(item.kpb_jumlah) || 0,
              userId ?? null,
            ]
          );
        }
      }

      // 2. Sync detail_kak_spesifikasi_teknis
      // Soft-delete existing items for this kakId first
      await connection.query(
        `UPDATE detail_kak_spesifikasi_teknis SET kst_deleted_at = NOW(), kst_deleted_by = ? WHERE kst_kak_id = ? AND kst_deleted_at IS NULL`,
        [userId ?? null, kakId]
      );

      if (payload.spesifikasiTeknisList && payload.spesifikasiTeknisList.length > 0) {
        for (const item of payload.spesifikasiTeknisList) {
          if (!item.kst_uraian && !item.kst_spesifikasi) continue;
          await connection.query(
            `INSERT INTO detail_kak_spesifikasi_teknis
              (kst_kak_id, kst_uraian, kst_spesifikasi, kst_created_by)
             VALUES (?, ?, ?, ?)`,
            [
              kakId,
              item.kst_uraian ? item.kst_uraian.trim() : '',
              item.kst_spesifikasi ? item.kst_spesifikasi.trim() : '',
              userId ?? null,
            ]
          );
        }
      }

      await connection.commit();
      return kakId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  static async delete(kakId: number, userId?: number | null): Promise<boolean> {
    await initDatabase();
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      await connection.query(
        `UPDATE kerangka_acuan_kerja SET kak_deleted_at = NOW(), kak_deleted_by = ? WHERE kak_id = ?`,
        [userId ?? null, kakId]
      );

      await connection.query(
        `UPDATE detail_kak_perkiraan_biaya SET kpb_deleted_at = NOW(), kpb_deleted_by = ? WHERE kpb_kak_id = ?`,
        [userId ?? null, kakId]
      );

      await connection.query(
        `UPDATE detail_kak_spesifikasi_teknis SET kst_deleted_at = NOW(), kst_deleted_by = ? WHERE kst_kak_id = ?`,
        [userId ?? null, kakId]
      );

      await connection.commit();
      return true;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
}

