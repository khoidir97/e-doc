import pool, { initDatabase } from '@/lib/db';
import { SurveyHeader, DetailSurvey, SurveyWithDetails, CreateSurveyInput, UpdateSurveyInput } from './types';

export class SurveyRepository {
  static async findMany(search = '', limit = 10, offset = 0): Promise<{ data: any[]; total: number }> {
    await initDatabase();

    let whereClause = 'WHERE s.srv_deleted_at IS NULL';
    const params: any[] = [];

    if (search.trim()) {
      whereClause += ' AND (s.srv_nama_kegiatan LIKE ? OR s.srv_paket_pekerjaan LIKE ? OR s.srv_nama_perusahaan LIKE ? OR m.mdk_no_dpa LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    const [countRows] = await pool.query<any[]>(
      `SELECT COUNT(*) as total 
       FROM survey s 
       LEFT JOIN master_dokumen m ON s.srv_master_dokumen_id = m.mdk_id 
       ${whereClause}`,
      params
    );
    const total = countRows[0]?.total || 0;

    const dataParams = [...params, Number(limit), Number(offset)];
    const [rows] = await pool.query<any[]>(
      `SELECT s.*,
              m.mdk_uraian_belanja, m.mdk_no_dpa, b.bdg_nama AS mdk_bagian, m.mdk_pagu_anggaran,
              (SELECT COUNT(*) FROM detail_survey ds WHERE (ds.dsrv_survey_id = s.srv_id OR ds.dsrv_master_dokumen_id = s.srv_master_dokumen_id) AND ds.dsrv_deleted_at IS NULL) as total_items,
              (SELECT SUM(ds.dsrv_harga_survey) FROM detail_survey ds WHERE (ds.dsrv_survey_id = s.srv_id OR ds.dsrv_master_dokumen_id = s.srv_master_dokumen_id) AND ds.dsrv_deleted_at IS NULL) as total_harga
       FROM survey s
       LEFT JOIN master_dokumen m ON s.srv_master_dokumen_id = m.mdk_id
       LEFT JOIN bidang b ON m.mdk_bidang_id = b.bdg_id
       ${whereClause} 
       ORDER BY s.srv_id DESC 
       LIMIT ? OFFSET ?`,
      dataParams
    );

    return {
      data: rows,
      total,
    };
  }

  static async findSurveyWithDetailsByMasterDokumenId(mdk_id: number): Promise<SurveyWithDetails> {
    await initDatabase();

    // 1. Get Master Dokumen info with joined details (perusahaan, pptk, pejabat pengadaan)
    const [mdkRows] = await pool.query<any[]>(
      `SELECT 
         md.*,
         p_pejabat.pgw_nama AS mdk_nama_pejabat,
         p_pejabat.pgw_nip AS mdk_nip_pejabat,
         p_pptk.pgw_nama AS mdk_nama_pptk,
         p_pptk.pgw_nip AS mdk_nip_pptk,
         p_bendahara.pgw_nama AS mdk_nama_bendahara,
         p_bendahara.pgw_nip AS mdk_nip_bendahara,
         p_sh.psh_nama AS mdk_nama_perusahaan,
         p_sh.psh_nama AS psh_nama,
         p_sh.psh_alamat AS psh_alamat,
         b.bdg_nama AS bdg_nama
       FROM master_dokumen md
       LEFT JOIN pegawai p_pejabat ON md.mdk_nama_pejabat_id = p_pejabat.pgw_id
       LEFT JOIN pegawai p_pptk ON md.mdk_nama_pptk_id = p_pptk.pgw_id
       LEFT JOIN pegawai p_bendahara ON md.mdk_nama_bendahara_id = p_bendahara.pgw_id
       LEFT JOIN perusahaan p_sh ON md.mdk_nama_perusahaan_id = p_sh.psh_id
       LEFT JOIN bidang b ON md.mdk_bidang_id = b.bdg_id
       WHERE md.mdk_id = ? AND md.mdk_deleted_at IS NULL 
       LIMIT 1`,
      [mdk_id]
    );

    const masterDokumen = mdkRows && mdkRows.length > 0 ? mdkRows[0] : null;

    // 2. Query Survey Header
    const [srvRows] = await pool.query<any[]>(
      `SELECT * FROM survey 
       WHERE (srv_master_dokumen_id = ? OR srv_master_dokument_id = ?) AND srv_deleted_at IS NULL 
       LIMIT 1`,
      [mdk_id, mdk_id]
    );

    let header: SurveyHeader | null = srvRows && srvRows.length > 0 ? (srvRows[0] as SurveyHeader) : null;

    // Auto populate default header from Master Dokumen if header doesn't exist yet
    if (!header && masterDokumen) {
      header = {
        srv_id: 0,
        srv_master_dokumen_id: mdk_id,
        srv_nomor: '',
        srv_nama_kegiatan: masterDokumen.mdk_kegiatan || masterDokumen.mdk_sub_kegiatan || masterDokumen.mdk_program || masterDokumen.mdk_uraian_belanja || '',
        srv_paket_pekerjaan: masterDokumen.mdk_uraian_belanja || '',
        srv_tanggal_mulai: null,
        srv_tanggal_selesai: null,
        srv_nama_perusahaan: masterDokumen.mdk_nama_perusahaan || masterDokumen.psh_nama || '',
        srv_alamat_perusahaan: masterDokumen.mdk_alamat || masterDokumen.psh_alamat || '',
      };
    } else if (header && masterDokumen) {
      if (!header.srv_nomor) {
        header.srv_nomor = '';
      }
      if (!header.srv_nama_kegiatan || !header.srv_nama_kegiatan.trim()) {
        header.srv_nama_kegiatan = masterDokumen.mdk_kegiatan || masterDokumen.mdk_sub_kegiatan || masterDokumen.mdk_program || masterDokumen.mdk_uraian_belanja || '';
      }
      if (!header.srv_paket_pekerjaan || !header.srv_paket_pekerjaan.trim()) {
        header.srv_paket_pekerjaan = masterDokumen.mdk_uraian_belanja || '';
      }
      if (!header.srv_nama_perusahaan || !header.srv_nama_perusahaan.trim()) {
        header.srv_nama_perusahaan = masterDokumen.mdk_nama_perusahaan || masterDokumen.psh_nama || '';
      }
      if (!header.srv_alamat_perusahaan || !header.srv_alamat_perusahaan.trim()) {
        header.srv_alamat_perusahaan = masterDokumen.mdk_alamat || masterDokumen.psh_alamat || '';
      }
    }

    // 3. Query Survey Details
    let details: DetailSurvey[] = [];
    if (header && header.srv_id > 0) {
      const [dsrvRows] = await pool.query<any[]>(
        `SELECT * FROM detail_survey 
         WHERE (dsrv_survey_id = ? OR dsrv_master_dokumen_id = ?) AND dsrv_deleted_at IS NULL 
         ORDER BY dsrv_id ASC`,
        [header.srv_id, mdk_id]
      );
      details = dsrvRows as DetailSurvey[];
    } else {
      const [dsrvRows] = await pool.query<any[]>(
        `SELECT * FROM detail_survey 
         WHERE dsrv_master_dokumen_id = ? AND dsrv_deleted_at IS NULL 
         ORDER BY dsrv_id ASC`,
        [mdk_id]
      );
      details = dsrvRows as DetailSurvey[];
    }

    return {
      header,
      details,
      masterDokumen,
    };
  }

  static async findByMasterDokumenId(mdk_id: number): Promise<DetailSurvey[]> {
    const res = await this.findSurveyWithDetailsByMasterDokumenId(mdk_id);
    return res.details;
  }

  static async findById(dsrv_id: number): Promise<DetailSurvey | null> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT * FROM detail_survey 
       WHERE dsrv_id = ? AND dsrv_deleted_at IS NULL 
       LIMIT 1`,
      [dsrv_id]
    );
    if (!rows || rows.length === 0) return null;
    return rows[0] as DetailSurvey;
  }

  static async saveBatch(
    data: {
      srv_master_dokumen_id: number;
      srv_nomor?: string;
      srv_nama_kegiatan?: string;
      srv_paket_pekerjaan?: string;
      srv_tanggal_mulai?: string | null;
      srv_tanggal_selesai?: string | null;
      srv_nama_perusahaan?: string;
      srv_alamat_perusahaan?: string;
      items: { dsrv_id?: number; dsrv_jenis_spesifikasi: string; dsrv_harga_survey: number }[];
    },
    userId?: number | null
  ): Promise<boolean> {
    await initDatabase();

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const {
        srv_master_dokumen_id,
        srv_nomor = '',
        srv_nama_kegiatan = '',
        srv_paket_pekerjaan = '',
        srv_tanggal_mulai = null,
        srv_tanggal_selesai = null,
        srv_nama_perusahaan = '',
        srv_alamat_perusahaan = '',
        items,
      } = data;

      // 1. Check existing survey header
      const [srvRows] = await connection.query<any[]>(
        `SELECT srv_id FROM survey WHERE (srv_master_dokumen_id = ? OR srv_master_dokument_id = ?) AND srv_deleted_at IS NULL LIMIT 1`,
        [srv_master_dokumen_id, srv_master_dokumen_id]
      );

      let surveyId: number;

      if (srvRows && srvRows.length > 0) {
        surveyId = srvRows[0].srv_id;
        await connection.query(
          `UPDATE survey 
           SET srv_master_dokumen_id = ?,
               srv_master_dokument_id = ?,
               srv_nomor = ?,
               srv_nama_kegiatan = ?, 
               srv_paket_pekerjaan = ?, 
               srv_tanggal_mulai = ?, 
               srv_tanggal_selesai = ?, 
               srv_nama_perusahaan = ?, 
               srv_alamat_perusahaan = ?, 
               srv_updated_by = ?, 
               srv_updated_at = NOW() 
           WHERE srv_id = ?`,
          [
            srv_master_dokumen_id,
            srv_master_dokumen_id,
            srv_nomor,
            srv_nama_kegiatan,
            srv_paket_pekerjaan,
            srv_tanggal_mulai || null,
            srv_tanggal_selesai || null,
            srv_nama_perusahaan,
            srv_alamat_perusahaan,
            userId ?? null,
            surveyId,
          ]
        );
      } else {
        const [insertRes]: any = await connection.query(
          `INSERT INTO survey (
             srv_master_dokumen_id, srv_master_dokument_id, srv_nomor, srv_nama_kegiatan, srv_paket_pekerjaan, 
             srv_tanggal_mulai, srv_tanggal_selesai, srv_nama_perusahaan, srv_alamat_perusahaan, 
             srv_created_by
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            srv_master_dokumen_id,
            srv_master_dokumen_id,
            srv_nomor,
            srv_nama_kegiatan,
            srv_paket_pekerjaan,
            srv_tanggal_mulai || null,
            srv_tanggal_selesai || null,
            srv_nama_perusahaan,
            srv_alamat_perusahaan,
            userId ?? null,
          ]
        );
        surveyId = insertRes.insertId;
      }

      // 2. Soft delete current survey details for this survey header / mdk_id
      await connection.query(
        `UPDATE detail_survey 
         SET dsrv_deleted_at = NOW(), dsrv_deleted_by = ? 
         WHERE (dsrv_survey_id = ? OR dsrv_master_dokumen_id = ?) AND dsrv_deleted_at IS NULL`,
        [userId ?? null, surveyId, srv_master_dokumen_id]
      );

      // 3. Insert new detail items
      for (const item of items) {
        if (item.dsrv_jenis_spesifikasi.trim()) {
          await connection.query(
            `INSERT INTO detail_survey (
               dsrv_survey_id, dsrv_master_dokumen_id, dsrv_jenis_spesifikasi, dsrv_harga_survey, dsrv_created_by
             ) VALUES (?, ?, ?, ?, ?)`,
            [
              surveyId,
              srv_master_dokumen_id,
              item.dsrv_jenis_spesifikasi.trim(),
              Number(item.dsrv_harga_survey) || 0,
              userId ?? null,
            ]
          );
        }
      }

      await connection.commit();
      return true;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  static async insert(input: CreateSurveyInput): Promise<number> {
    await initDatabase();
    const [result]: any = await pool.query(
      `INSERT INTO detail_survey (dsrv_survey_id, dsrv_master_dokumen_id, dsrv_jenis_spesifikasi, dsrv_harga_survey, dsrv_created_by) 
       VALUES (?, ?, ?, ?, ?)`,
      [input.dsrv_survey_id, input.dsrv_master_dokumen_id ?? null, input.dsrv_jenis_spesifikasi, input.dsrv_harga_survey, input.dsrv_created_by ?? null]
    );
    return result.insertId;
  }

  static async update(input: UpdateSurveyInput): Promise<boolean> {
    await initDatabase();
    const [result]: any = await pool.query(
      `UPDATE detail_survey 
       SET dsrv_jenis_spesifikasi = ?, dsrv_harga_survey = ?, dsrv_updated_by = ?, dsrv_updated_at = NOW() 
       WHERE dsrv_id = ? AND dsrv_deleted_at IS NULL`,
      [input.dsrv_jenis_spesifikasi, input.dsrv_harga_survey, input.dsrv_updated_by ?? null, input.dsrv_id]
    );
    return result.affectedRows > 0;
  }

  static async softDelete(dsrv_id: number, deletedBy?: number | null): Promise<boolean> {
    await initDatabase();
    const [result]: any = await pool.query(
      `UPDATE detail_survey 
       SET dsrv_deleted_at = NOW(), dsrv_deleted_by = ?
       WHERE dsrv_id = ? AND dsrv_deleted_at IS NULL`,
      [deletedBy ?? null, dsrv_id]
    );
    return result.affectedRows > 0;
  }
}
