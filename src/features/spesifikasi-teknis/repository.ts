import pool, { initDatabase } from '@/lib/db';
import {
  SpesifikasiTeknis,
  DetailSpesifikasiTeknis,
  DetailSpesifikasiJumlah,
  DetailDaftarPelakuUsaha,
  SaveSpesifikasiTeknisPayload,
  KakOptionItemForSpt,
} from './types';

export class SpesifikasiTeknisRepository {
  static async findByKakId(kakId: number): Promise<{
    spesifikasiTeknis: SpesifikasiTeknis | null;
    detailTeknis: DetailSpesifikasiTeknis[];
    detailJumlah: DetailSpesifikasiJumlah[];
    detailPelakuUsaha: DetailDaftarPelakuUsaha[];
  }> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT s.*, 
              p.pgw_nama AS ppk_nama, 
              p.pgw_nip AS ppk_nip, 
              p.pgw_jabatan AS ppk_jabatan
       FROM spesifikasi_teknis s
       LEFT JOIN pegawai p ON s.spt_spt_ppk_pgw_id = p.pgw_id
       WHERE s.spt_kak_id = ? AND s.spt_deleted_at IS NULL
       LIMIT 1`,
      [kakId]
    );

    if (rows.length === 0) {
      return {
        spesifikasiTeknis: null,
        detailTeknis: [],
        detailJumlah: [],
        detailPelakuUsaha: [],
      };
    }

    const spesifikasiTeknis = rows[0] as SpesifikasiTeknis;
    const sptId = spesifikasiTeknis.spt_id;

    // Fetch detail 1: spesifikasi teknis
    const [dtRows] = await pool.query<any[]>(
      `SELECT dpst_id, dspt_spt_id, dspt_item_barang_jasa, dspt_spesifikasi
       FROM detail_spesifikasi_teknis
       WHERE dspt_spt_id = ? AND dspt_deleted_at IS NULL
       ORDER BY dpst_id ASC`,
      [sptId]
    );

    // Fetch detail 2: spesifikasi jumlah
    const [djRows] = await pool.query<any[]>(
      `SELECT d.dspj_id, d.dpsj_spt_id, d.dspj_item_barang_jasa, d.dspj_jumlah, d.dspj_satuan_id,
              s.st_nama
       FROM detail_spesifikasi_jumlah d
       LEFT JOIN satuan s ON d.dspj_satuan_id = s.st_id
       WHERE d.dpsj_spt_id = ? AND d.dspj_deleted_at IS NULL
       ORDER BY d.dspj_id ASC`,
      [sptId]
    );

    // Fetch detail 3: pelaku usaha potensial
    const [dpuRows] = await pool.query<any[]>(
      `SELECT dpu_id, dpu_spt_id, dpu_item, dpu_nama_pelaku_usaha_potensial, dpu_link_katalog, dpu_harga, dpu_evaluasi_berdasarkan_parameter
       FROM detail_daftar_pelaku_usaha
       WHERE dpu_spt_id = ? AND dpu_deleted_at IS NULL
       ORDER BY dpu_id ASC`,
      [sptId]
    );

    return {
      spesifikasiTeknis,
      detailTeknis: dtRows as DetailSpesifikasiTeknis[],
      detailJumlah: djRows as DetailSpesifikasiJumlah[],
      detailPelakuUsaha: dpuRows as DetailDaftarPelakuUsaha[],
    };
  }

  static async findById(sptId: number): Promise<{
    spesifikasiTeknis: SpesifikasiTeknis | null;
    detailTeknis: DetailSpesifikasiTeknis[];
    detailJumlah: DetailSpesifikasiJumlah[];
    detailPelakuUsaha: DetailDaftarPelakuUsaha[];
  }> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT s.*, 
              p.pgw_nama AS ppk_nama, 
              p.pgw_nip AS ppk_nip, 
              p.pgw_jabatan AS ppk_jabatan
       FROM spesifikasi_teknis s
       LEFT JOIN pegawai p ON s.spt_spt_ppk_pgw_id = p.pgw_id
       WHERE s.spt_id = ? AND s.spt_deleted_at IS NULL
       LIMIT 1`,
      [sptId]
    );

    if (rows.length === 0) {
      return {
        spesifikasiTeknis: null,
        detailTeknis: [],
        detailJumlah: [],
        detailPelakuUsaha: [],
      };
    }

    const spesifikasiTeknis = rows[0] as SpesifikasiTeknis;

    const [dtRows] = await pool.query<any[]>(
      `SELECT dpst_id, dspt_spt_id, dspt_item_barang_jasa, dspt_spesifikasi
       FROM detail_spesifikasi_teknis
       WHERE dspt_spt_id = ? AND dspt_deleted_at IS NULL
       ORDER BY dpst_id ASC`,
      [sptId]
    );

    const [djRows] = await pool.query<any[]>(
      `SELECT d.dspj_id, d.dpsj_spt_id, d.dspj_item_barang_jasa, d.dspj_jumlah, d.dspj_satuan_id,
              s.st_nama
       FROM detail_spesifikasi_jumlah d
       LEFT JOIN satuan s ON d.dspj_satuan_id = s.st_id
       WHERE d.dpsj_spt_id = ? AND d.dspj_deleted_at IS NULL
       ORDER BY d.dspj_id ASC`,
      [sptId]
    );

    const [dpuRows] = await pool.query<any[]>(
      `SELECT dpu_id, dpu_spt_id, dpu_item, dpu_nama_pelaku_usaha_potensial, dpu_link_katalog, dpu_harga, dpu_evaluasi_berdasarkan_parameter
       FROM detail_daftar_pelaku_usaha
       WHERE dpu_spt_id = ? AND dpu_deleted_at IS NULL
       ORDER BY dpu_id ASC`,
      [sptId]
    );

    return {
      spesifikasiTeknis,
      detailTeknis: dtRows as DetailSpesifikasiTeknis[],
      detailJumlah: djRows as DetailSpesifikasiJumlah[],
      detailPelakuUsaha: dpuRows as DetailDaftarPelakuUsaha[],
    };
  }

  static async getKakOptions(): Promise<KakOptionItemForSpt[]> {
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
         CASE WHEN s.spt_id IS NOT NULL THEN 1 ELSE 0 END AS has_spesifikasi_teknis
       FROM kerangka_acuan_kerja k
       LEFT JOIN master_dokumen m ON k.kak_master_dokumen_id = m.mdk_id
       LEFT JOIN spesifikasi_teknis s ON k.kak_id = s.spt_kak_id AND s.spt_deleted_at IS NULL
       WHERE k.kak_deleted_at IS NULL
       ORDER BY k.kak_id DESC`
    );
    return rows as KakOptionItemForSpt[];
  }

  static async getSatuanList(): Promise<{ st_id: number; st_nama: string }[]> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT st_id, st_nama FROM satuan WHERE st_deleted_at IS NULL ORDER BY st_nama ASC`
    );
    return rows as { st_id: number; st_nama: string }[];
  }

  static async getPegawaiList(): Promise<{ pgw_id: number; pgw_nama: string; pgw_nip: string; pgw_jabatan: string }[]> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT pgw_id, pgw_nama, pgw_nip, pgw_jabatan FROM pegawai WHERE pgw_deleted_at IS NULL ORDER BY pgw_nama ASC`
    );
    return rows as { pgw_id: number; pgw_nama: string; pgw_nip: string; pgw_jabatan: string }[];
  }

  static async save(
    payload: SaveSpesifikasiTeknisPayload,
    userId?: number | null
  ): Promise<number> {
    await initDatabase();
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      let sptId: number | null = payload.spt_id ? Number(payload.spt_id) : null;

      // Check existing spesifikasi_teknis for this kakId if not provided
      if (!sptId && payload.spt_kak_id) {
        const [existing]: any = await connection.query(
          `SELECT spt_id FROM spesifikasi_teknis WHERE spt_kak_id = ? AND spt_deleted_at IS NULL LIMIT 1`,
          [payload.spt_kak_id]
        );
        if (existing.length > 0) {
          sptId = existing[0].spt_id;
        }
      }

      if (sptId) {
        await connection.query(
          `UPDATE spesifikasi_teknis SET
            spt_kak_id = ?,
            spt_paket_pengadaan = ?,
            spt_satuan_kerja = ?,
            spt_spt_ppk_pgw_id = ?,
            spd_id_rup = ?,
            spt_nama_barang_type = ?,
            spt_identifikasi_tkdn = ?,
            spt_prioritas_penggunaan = ?,
            spt_spesifikasi_jumlah = ?,
            spt_spesifikasi_waktu_pelaksanaan = ?,
            spt_spesifikasi_waktu_lokasi_kedatangan = ?,
            spt_spesifikasi_pelayanan = ?,
            spt_spesifikasi_lokasi = ?,
            spt_rencana_poin_negosiasi_teknis = ?,
            spt_nama_pelaku_usaha = ?,
            spt_link_katalog = ?,
            spt_updated_by = ?,
            spt_updated_at = NOW()
          WHERE spt_id = ?`,
          [
            payload.spt_kak_id,
            payload.spt_paket_pengadaan || null,
            payload.spt_satuan_kerja || null,
            payload.spt_spt_ppk_pgw_id || null,
            payload.spd_id_rup || null,
            payload.spt_nama_barang_type || null,
            payload.spt_identifikasi_tkdn || null,
            payload.spt_prioritas_penggunaan || null,
            payload.spt_spesifikasi_jumlah || null,
            payload.spt_spesifikasi_waktu_pelaksanaan || null,
            payload.spt_spesifikasi_waktu_lokasi_kedatangan || null,
            payload.spt_spesifikasi_pelayanan || null,
            payload.spt_spesifikasi_lokasi || null,
            payload.spt_rencana_poin_negosiasi_teknis || null,
            payload.spt_nama_pelaku_usaha || null,
            payload.spt_link_katalog || null,
            userId ?? null,
            sptId,
          ]
        );
      } else {
        const [insertResult]: any = await connection.query(
          `INSERT INTO spesifikasi_teknis
            (spt_kak_id, spt_paket_pengadaan, spt_satuan_kerja, spt_spt_ppk_pgw_id, spd_id_rup,
             spt_nama_barang_type, spt_identifikasi_tkdn, spt_prioritas_penggunaan, spt_spesifikasi_jumlah,
             spt_spesifikasi_waktu_pelaksanaan, spt_spesifikasi_waktu_lokasi_kedatangan, spt_spesifikasi_pelayanan,
             spt_spesifikasi_lokasi, spt_rencana_poin_negosiasi_teknis, spt_nama_pelaku_usaha, spt_link_katalog,
             spt_created_by, spt_created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            payload.spt_kak_id,
            payload.spt_paket_pengadaan || null,
            payload.spt_satuan_kerja || null,
            payload.spt_spt_ppk_pgw_id || null,
            payload.spd_id_rup || null,
            payload.spt_nama_barang_type || null,
            payload.spt_identifikasi_tkdn || null,
            payload.spt_prioritas_penggunaan || null,
            payload.spt_spesifikasi_jumlah || null,
            payload.spt_spesifikasi_waktu_pelaksanaan || null,
            payload.spt_spesifikasi_waktu_lokasi_kedatangan || null,
            payload.spt_spesifikasi_pelayanan || null,
            payload.spt_spesifikasi_lokasi || null,
            payload.spt_rencana_poin_negosiasi_teknis || null,
            payload.spt_nama_pelaku_usaha || null,
            payload.spt_link_katalog || null,
            userId ?? null,
          ]
        );
        sptId = insertResult.insertId;
      }

      if (!sptId) {
        throw new Error('Gagal menyimpan Header Dokumen Spesifikasi Teknis.');
      }

      // 1. DETAIL SPESIFIKASI TEKNIS
      await connection.query(
        `UPDATE detail_spesifikasi_teknis SET dspt_deleted_at = NOW(), dspt_deleted_by = ? WHERE dspt_spt_id = ? AND dspt_deleted_at IS NULL`,
        [userId ?? null, sptId]
      );

      if (payload.detailTeknis && payload.detailTeknis.length > 0) {
        for (const item of payload.detailTeknis) {
          if (!item.dspt_item_barang_jasa && !item.dspt_spesifikasi) continue;
          await connection.query(
            `INSERT INTO detail_spesifikasi_teknis
              (dspt_spt_id, dspt_item_barang_jasa, dspt_spesifikasi, dspt_created_by, dpst_created_at)
             VALUES (?, ?, ?, ?, NOW())`,
            [
              sptId,
              item.dspt_item_barang_jasa || '',
              item.dspt_spesifikasi || '',
              userId ?? null,
            ]
          );
        }
      }

      // 2. DETAIL SPESIFIKASI JUMLAH
      await connection.query(
        `UPDATE detail_spesifikasi_jumlah SET dspj_deleted_at = NOW(), dspj_deleted_by = ? WHERE dpsj_spt_id = ? AND dspj_deleted_at IS NULL`,
        [userId ?? null, sptId]
      );

      if (payload.detailJumlah && payload.detailJumlah.length > 0) {
        for (const item of payload.detailJumlah) {
          if (!item.dspj_item_barang_jasa) continue;
          await connection.query(
            `INSERT INTO detail_spesifikasi_jumlah
              (dpsj_spt_id, dspj_item_barang_jasa, dspj_jumlah, dspj_satuan_id, dspj_created_by, dspj_created_at)
             VALUES (?, ?, ?, ?, ?, NOW())`,
            [
              sptId,
              item.dspj_item_barang_jasa || '',
              Number(item.dspj_jumlah) || 0,
              item.dspj_satuan_id ? Number(item.dspj_satuan_id) : null,
              userId ?? null,
            ]
          );
        }
      }

      // 3. DETAIL DAFTAR PELAKU USAHA
      await connection.query(
        `UPDATE detail_daftar_pelaku_usaha SET dpu_deleted_at = NOW(), dpu_deleted_by = ? WHERE dpu_spt_id = ? AND dpu_deleted_at IS NULL`,
        [userId ?? null, sptId]
      );

      if (payload.detailPelakuUsaha && payload.detailPelakuUsaha.length > 0) {
        for (const item of payload.detailPelakuUsaha) {
          if (!item.dpu_item && !item.dpu_nama_pelaku_usaha_potensial) continue;
          await connection.query(
            `INSERT INTO detail_daftar_pelaku_usaha
              (dpu_spt_id, dpu_item, dpu_nama_pelaku_usaha_potensial, dpu_link_katalog, dpu_harga, dpu_evaluasi_berdasarkan_parameter, dpu_created_by, dpu_created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
            [
              sptId,
              item.dpu_item || '',
              item.dpu_nama_pelaku_usaha_potensial || '',
              item.dpu_link_katalog || '',
              Number(item.dpu_harga) || 0,
              item.dpu_evaluasi_berdasarkan_parameter || '',
              userId ?? null,
            ]
          );
        }
      }

      await connection.commit();
      return sptId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  static async delete(sptId: number, userId?: number | null): Promise<boolean> {
    await initDatabase();
    await pool.query(
      `UPDATE spesifikasi_teknis SET spt_deleted_at = NOW(), spt_deleted_by = ? WHERE spt_id = ?`,
      [userId ?? null, sptId]
    );
    await pool.query(
      `UPDATE detail_spesifikasi_teknis SET dspt_deleted_at = NOW(), dspt_deleted_by = ? WHERE dspt_spt_id = ?`,
      [userId ?? null, sptId]
    );
    await pool.query(
      `UPDATE detail_spesifikasi_jumlah SET dspj_deleted_at = NOW(), dspj_deleted_by = ? WHERE dpsj_spt_id = ?`,
      [userId ?? null, sptId]
    );
    await pool.query(
      `UPDATE detail_daftar_pelaku_usaha SET dpu_deleted_at = NOW(), dpu_deleted_by = ? WHERE dpu_spt_id = ?`,
      [userId ?? null, sptId]
    );
    return true;
  }
}

