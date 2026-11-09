import pool, { initDatabase } from '@/lib/db';
import { MasterDokumen, CreateMasterDokumenInput, UpdateMasterDokumenInput } from './types';

export class MasterDokumenRepository {
  static async findMany(search = '', limit = 10, offset = 0, filterBdgId?: number | null): Promise<{ data: MasterDokumen[]; total: number }> {
    await initDatabase();

    let whereClause = 'WHERE md.mdk_deleted_at IS NULL';
    const params: any[] = [];

    if (filterBdgId !== undefined && filterBdgId !== null) {
      whereClause += ' AND md.mdk_bidang_id = ?';
      params.push(filterBdgId);
    }

    if (search.trim()) {
      whereClause += ' AND (md.mdk_bidang_id LIKE ? OR md.mdk_program LIKE ? OR md.mdk_kegiatan LIKE ? OR md.mdk_no_dpa LIKE ? OR p_pejabat.pgw_nama LIKE ? OR p_sh.psh_nama LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term, term, term);
    }

    // Count query
    const [countRows] = await pool.query<any[]>(
      `SELECT COUNT(*) as total 
       FROM master_dokumen md 
       LEFT JOIN pegawai p_pejabat ON md.mdk_nama_pejabat_id = p_pejabat.pgw_id
       LEFT JOIN perusahaan p_sh ON md.mdk_nama_perusahaan_id = p_sh.psh_id
       ${whereClause}`,
      params
    );
    const total = countRows[0]?.total || 0;

    // Data query
    const dataParams = [...params, Number(limit), Number(offset)];
    const [rows] = await pool.query<any[]>(
      `SELECT 
         md.*,
         p_pejabat.pgw_nama AS mdk_nama_pejabat,
         p_pejabat.pgw_nip AS mdk_nip_pejabat,
         p_pejabat.pgw_jabatan AS mdk_jabatan_pejabat,
         p_pptk.pgw_nama AS mdk_nama_pptk,
         p_pptk.pgw_nip AS mdk_nip_pptk,
         p_bendahara.pgw_nama AS mdk_nama_bendahara,
         p_bendahara.pgw_nip AS mdk_nip_bendahara,
         p_bendahara.pgw_jabatan AS mdk_jabatan_bendahara,
         p_pejabat_pengadaan.pgw_nama AS mdk_nama_pejabat_pengadaan,
         p_pejabat_pengadaan.pgw_nip AS mdk_nip_pejabat_pengadaan,
         p_sh.psh_nama AS mdk_nama_perusahaan,
         p_sh.psh_nama AS psh_nama,
         p_sh.psh_alamat AS psh_alamat,
         p_sh.psh_npwp AS psh_npwp,
         p_sh.psh_nomor_rekening AS psh_nomor_rekening,
         p_sh.psh_nama_rekening AS psh_nama_rekening,
         p_sh.psh_nama_bank AS psh_nama_bank,
         b.bdg_nama AS bdg_nama,
         b.bdg_nama AS mdk_bagian,
         s.st_nama AS st_nama
       FROM master_dokumen md
       LEFT JOIN pegawai p_pejabat ON md.mdk_nama_pejabat_id = p_pejabat.pgw_id
       LEFT JOIN pegawai p_pptk ON md.mdk_nama_pptk_id = p_pptk.pgw_id
       LEFT JOIN pegawai p_bendahara ON md.mdk_nama_bendahara_id = p_bendahara.pgw_id
       LEFT JOIN pegawai p_pejabat_pengadaan ON md.mdk_nama_pejabat_pengadaan_id = p_pejabat_pengadaan.pgw_id
       LEFT JOIN perusahaan p_sh ON md.mdk_nama_perusahaan_id = p_sh.psh_id
       LEFT JOIN bidang b ON md.mdk_bidang_id = b.bdg_id
       LEFT JOIN satuan s ON md.mdk_satuan = s.st_id
       ${whereClause} 
       ORDER BY md.mdk_id DESC 
       LIMIT ? OFFSET ?`,
      dataParams
    );

    return {
      data: rows as MasterDokumen[],
      total,
    };
  }

  static async findById(mdk_id: number): Promise<MasterDokumen | null> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT 
         md.*,
         p_pejabat.pgw_nama AS mdk_nama_pejabat,
         p_pejabat.pgw_nip AS mdk_nip_pejabat,
         p_pejabat.pgw_jabatan AS mdk_jabatan_pejabat,
         p_pptk.pgw_nama AS mdk_nama_pptk,
         p_pptk.pgw_nip AS mdk_nip_pptk,
         p_bendahara.pgw_nama AS mdk_nama_bendahara,
         p_bendahara.pgw_nip AS mdk_nip_bendahara,
         p_bendahara.pgw_jabatan AS mdk_jabatan_bendahara,
         p_pejabat_pengadaan.pgw_nama AS mdk_nama_pejabat_pengadaan,
         p_pejabat_pengadaan.pgw_nip AS mdk_nip_pejabat_pengadaan,
         p_sh.psh_nama AS mdk_nama_perusahaan,
         p_sh.psh_nama AS psh_nama,
         p_sh.psh_alamat AS psh_alamat,
         p_sh.psh_npwp AS psh_npwp,
         p_sh.psh_nomor_rekening AS psh_nomor_rekening,
         p_sh.psh_nama_rekening AS psh_nama_rekening,
         p_sh.psh_nama_bank AS psh_nama_bank,
         b.bdg_nama AS bdg_nama,
         b.bdg_nama AS mdk_bagian,
         s.st_nama AS st_nama
       FROM master_dokumen md
       LEFT JOIN pegawai p_pejabat ON md.mdk_nama_pejabat_id = p_pejabat.pgw_id
       LEFT JOIN pegawai p_pptk ON md.mdk_nama_pptk_id = p_pptk.pgw_id
       LEFT JOIN pegawai p_bendahara ON md.mdk_nama_bendahara_id = p_bendahara.pgw_id
       LEFT JOIN pegawai p_pejabat_pengadaan ON md.mdk_nama_pejabat_pengadaan_id = p_pejabat_pengadaan.pgw_id
       LEFT JOIN perusahaan p_sh ON md.mdk_nama_perusahaan_id = p_sh.psh_id
       LEFT JOIN bidang b ON md.mdk_bidang_id = b.bdg_id
       LEFT JOIN satuan s ON md.mdk_satuan = s.st_id
       WHERE md.mdk_id = ? AND md.mdk_deleted_at IS NULL 
       LIMIT 1`,
      [mdk_id]
    );
    if (!rows || rows.length === 0) return null;
    return rows[0] as MasterDokumen;
  }

  static async insert(input: CreateMasterDokumenInput): Promise<number> {
    await initDatabase();
    const [result]: any = await pool.query(
      `INSERT INTO master_dokumen (
        mdk_nama_pejabat_id, mdk_bidang_id, mdk_pagu_anggaran, 
        mdk_nama_pejabat_pengadaan_id, mdk_nama_pptk_id, 
        mdk_nama_bendahara_id, mdk_nama_perusahaan_id, mdk_nama_pimpinan_perusahaan, mdk_pekerjaan,
        mdk_jabatan_pimpinan_perusahaan, mdk_alamat, mdk_program, mdk_kode_program, 
        mdk_kegiatan, mdk_kode_kegiatan, mdk_sub_kegiatan, mdk_kode_sub_kegiatan, 
        mdk_uraian_belanja, mdk_rekening_belanja, 
        mdk_kode_level1, mdk_nama_level1,
        mdk_kode_level2, mdk_nama_level2,
        mdk_kode_level3, mdk_nama_level3,
        mdk_kode_level4, mdk_nama_level4,
        mdk_kode_level5, mdk_nama_level5,
        mdk_keterangan, mdk_apbd, mdk_no_dpa, mdk_volume, mdk_satuan, 
        mdk_created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.mdk_nama_pejabat_id ?? 0,
        input.mdk_bidang_id ?? 0,
        input.mdk_pagu_anggaran ?? 0,
        input.mdk_nama_pejabat_pengadaan_id ?? 0,
        input.mdk_nama_pptk_id ?? 0,
        input.mdk_nama_bendahara_id ?? 0,
        input.mdk_nama_perusahaan_id ?? 0,
        input.mdk_nama_pimpinan_perusahaan ?? '',
        input.mdk_pekerjaan ?? '',
        input.mdk_jabatan_pimpinan_perusahaan ?? '',
        input.mdk_alamat ?? '',
        input.mdk_program ?? '',
        input.mdk_kode_program ?? '',
        input.mdk_kegiatan ?? '',
        input.mdk_kode_kegiatan ?? '',
        input.mdk_sub_kegiatan ?? '',
        input.mdk_kode_sub_kegiatan ?? '',
        input.mdk_uraian_belanja ?? '',
        input.mdk_rekening_belanja ?? '',
        input.mdk_kode_level1 ?? '',
        input.mdk_nama_level1 ?? '',
        input.mdk_kode_level2 ?? '',
        input.mdk_nama_level2 ?? '',
        input.mdk_kode_level3 ?? '',
        input.mdk_nama_level3 ?? '',
        input.mdk_kode_level4 ?? '',
        input.mdk_nama_level4 ?? '',
        input.mdk_kode_level5 ?? '',
        input.mdk_nama_level5 ?? '',
        input.mdk_keterangan ?? '',
        input.mdk_apbd ?? '',
        input.mdk_no_dpa ?? '',
        input.mdk_volume ?? '',
        input.mdk_satuan ?? 0,
        input.mdk_created_by ?? null,
      ]
    );
    return result.insertId;
  }

  static async update(input: UpdateMasterDokumenInput): Promise<boolean> {
    await initDatabase();
    const [result]: any = await pool.query(
      `UPDATE master_dokumen 
       SET mdk_nama_pejabat_id = ?, mdk_bidang_id = ?, mdk_pagu_anggaran = ?, 
           mdk_nama_pejabat_pengadaan_id = ?, mdk_nama_pptk_id = ?, 
           mdk_nama_bendahara_id = ?, mdk_nama_perusahaan_id = ?, mdk_nama_pimpinan_perusahaan = ?, 
           mdk_jabatan_pimpinan_perusahaan = ?, mdk_pekerjaan = ?, mdk_alamat = ?, mdk_program = ?, 
           mdk_kode_program = ?, mdk_kegiatan = ?, mdk_kode_kegiatan = ?, mdk_sub_kegiatan = ?, 
           mdk_kode_sub_kegiatan = ?, mdk_uraian_belanja = ?, mdk_rekening_belanja = ?, 
           mdk_kode_level1 = ?, mdk_nama_level1 = ?,
           mdk_kode_level2 = ?, mdk_nama_level2 = ?,
           mdk_kode_level3 = ?, mdk_nama_level3 = ?,
           mdk_kode_level4 = ?, mdk_nama_level4 = ?,
           mdk_kode_level5 = ?, mdk_nama_level5 = ?,
           mdk_keterangan = ?, mdk_apbd = ?, mdk_no_dpa = ?, mdk_volume = ?, mdk_satuan = ?, mdk_updated_by = ?, mdk_updated_at = NOW() 
       WHERE mdk_id = ? AND mdk_deleted_at IS NULL`,
      [
        input.mdk_nama_pejabat_id ?? 0,
        input.mdk_bidang_id ?? 0,
        input.mdk_pagu_anggaran ?? 0,
        input.mdk_nama_pejabat_pengadaan_id ?? 0,
        input.mdk_nama_pptk_id ?? 0,
        input.mdk_nama_bendahara_id ?? 0,
        input.mdk_nama_perusahaan_id ?? 0,
        input.mdk_nama_pimpinan_perusahaan ?? '',
        input.mdk_jabatan_pimpinan_perusahaan ?? '',
        input.mdk_pekerjaan ?? '',
        input.mdk_alamat ?? '',
        input.mdk_program ?? '',
        input.mdk_kode_program ?? '',
        input.mdk_kegiatan ?? '',
        input.mdk_kode_kegiatan ?? '',
        input.mdk_sub_kegiatan ?? '',
        input.mdk_kode_sub_kegiatan ?? '',
        input.mdk_uraian_belanja ?? '',
        input.mdk_rekening_belanja ?? '',
        input.mdk_kode_level1 ?? '',
        input.mdk_nama_level1 ?? '',
        input.mdk_kode_level2 ?? '',
        input.mdk_nama_level2 ?? '',
        input.mdk_kode_level3 ?? '',
        input.mdk_nama_level3 ?? '',
        input.mdk_kode_level4 ?? '',
        input.mdk_nama_level4 ?? '',
        input.mdk_kode_level5 ?? '',
        input.mdk_nama_level5 ?? '',
        input.mdk_keterangan ?? '',
        input.mdk_apbd ?? '',
        input.mdk_no_dpa ?? '',
        input.mdk_volume ?? '',
        input.mdk_satuan ?? 0,
        input.mdk_updated_by ?? null,
        input.mdk_id,
      ]
    );
    return result.affectedRows > 0;
  }

  static async softDelete(mdk_id: number, deletedBy?: number | null): Promise<boolean> {
    await initDatabase();
    const [result]: any = await pool.query(
      `UPDATE master_dokumen 
       SET mdk_deleted_at = NOW(), mdk_deleted_by = ?
       WHERE mdk_id = ? AND mdk_deleted_at IS NULL`,
      [deletedBy ?? null, mdk_id]
    );
    return result.affectedRows > 0;
  }

  static async updateLockStatus(mdk_id: number, isLock: number, updatedBy?: number | null): Promise<boolean> {
    await initDatabase();
    const [result]: any = await pool.query(
      `UPDATE master_dokumen 
       SET mdk_is_lock = ?, mdk_updated_by = ?, mdk_updated_at = NOW()
       WHERE mdk_id = ? AND mdk_deleted_at IS NULL`,
      [isLock ? 1 : 0, updatedBy ?? null, mdk_id]
    );
    return result.affectedRows > 0;
  }
}
