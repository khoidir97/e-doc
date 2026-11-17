module.exports=[115,(a,b,c)=>{b.exports=a.x("mysql2-3d80281e5ed34ca6/promise",()=>require("mysql2-3d80281e5ed34ca6/promise"))},54799,(a,b,c)=>{b.exports=a.x("crypto",()=>require("crypto"))},37936,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"registerServerReference",{enumerable:!0,get:function(){return d.registerServerReference}});let d=a.r(11857)},13095,(a,b,c)=>{"use strict";function d(a){for(let b=0;b<a.length;b++){let c=a[b];if("function"!=typeof c)throw Object.defineProperty(Error(`A "use server" file can only export async functions, found ${typeof c}.
Read more: https://nextjs.org/docs/messages/invalid-use-server-value`),"__NEXT_ERROR_CODE",{value:"E352",enumerable:!1,configurable:!0})}}Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"ensureServerEntryExports",{enumerable:!0,get:function(){return d}})},3334,a=>{"use strict";var b=a.i(61469);class c{static async findMany(a="",c=10,d=0,e){await (0,b.initDatabase)();let f="WHERE md.mdk_deleted_at IS NULL",g=[];if(null!=e&&(f+=" AND md.mdk_bidang_id = ?",g.push(e)),a.trim()){f+=" AND (md.mdk_bidang_id LIKE ? OR md.mdk_program LIKE ? OR md.mdk_kegiatan LIKE ? OR md.mdk_no_dpa LIKE ? OR p_pejabat.pgw_nama LIKE ? OR p_sh.psh_nama LIKE ?)";let b=`%${a.trim()}%`;g.push(b,b,b,b,b,b)}let[h]=await b.default.query(`SELECT COUNT(*) as total 
       FROM master_dokumen md 
       LEFT JOIN pegawai p_pejabat ON md.mdk_nama_pejabat_id = p_pejabat.pgw_id
       LEFT JOIN perusahaan p_sh ON md.mdk_nama_perusahaan_id = p_sh.psh_id
       ${f}`,g),i=h[0]?.total||0,j=[...g,Number(c),Number(d)],[k]=await b.default.query(`SELECT 
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
       ${f} 
       ORDER BY md.mdk_id DESC 
       LIMIT ? OFFSET ?`,j);return{data:k,total:i}}static async findById(a){await (0,b.initDatabase)();let[c]=await b.default.query(`SELECT 
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
       LIMIT 1`,[a]);return c&&0!==c.length?c[0]:null}static async insert(a){await (0,b.initDatabase)();let c=void 0!==a.mdk_item_barang&&null!==a.mdk_item_barang?"string"==typeof a.mdk_item_barang?a.mdk_item_barang:JSON.stringify(a.mdk_item_barang):null,[d]=await b.default.query(`INSERT INTO master_dokumen (
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
        mdk_item_barang,
        mdk_kak_id,
        mdk_created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,[a.mdk_nama_pejabat_id??0,a.mdk_bidang_id??0,a.mdk_pagu_anggaran??0,a.mdk_nama_pejabat_pengadaan_id??0,a.mdk_nama_pptk_id??0,a.mdk_nama_bendahara_id??0,a.mdk_nama_perusahaan_id??0,a.mdk_nama_pimpinan_perusahaan??"",a.mdk_pekerjaan??"",a.mdk_jabatan_pimpinan_perusahaan??"",a.mdk_alamat??"",a.mdk_program??"",a.mdk_kode_program??"",a.mdk_kegiatan??"",a.mdk_kode_kegiatan??"",a.mdk_sub_kegiatan??"",a.mdk_kode_sub_kegiatan??"",a.mdk_uraian_belanja??"",a.mdk_rekening_belanja??"",a.mdk_kode_level1??"",a.mdk_nama_level1??"",a.mdk_kode_level2??"",a.mdk_nama_level2??"",a.mdk_kode_level3??"",a.mdk_nama_level3??"",a.mdk_kode_level4??"",a.mdk_nama_level4??"",a.mdk_kode_level5??"",a.mdk_nama_level5??"",a.mdk_keterangan??"",a.mdk_apbd??"",a.mdk_no_dpa??"",a.mdk_volume??"",a.mdk_satuan??0,c,a.mdk_kak_id?Number(a.mdk_kak_id):null,a.mdk_created_by??null]),e=d.insertId;return a.mdk_kak_id&&e&&await b.default.query(`UPDATE kerangka_acuan_kerja 
         SET kak_master_dokumen_id = ? 
         WHERE kak_id = ? AND (kak_master_dokumen_id IS NULL OR kak_master_dokumen_id = 0)`,[e,Number(a.mdk_kak_id)]),e}static async update(a){await (0,b.initDatabase)();let c=void 0!==a.mdk_item_barang&&null!==a.mdk_item_barang?"string"==typeof a.mdk_item_barang?a.mdk_item_barang:JSON.stringify(a.mdk_item_barang):null,[d]=await b.default.query(`UPDATE master_dokumen 
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
           mdk_keterangan = ?, mdk_apbd = ?, mdk_no_dpa = ?, mdk_volume = ?, mdk_satuan = ?, 
           mdk_item_barang = ?,
           mdk_kak_id = ?,
           mdk_updated_by = ?, mdk_updated_at = NOW() 
       WHERE mdk_id = ? AND mdk_deleted_at IS NULL`,[a.mdk_nama_pejabat_id??0,a.mdk_bidang_id??0,a.mdk_pagu_anggaran??0,a.mdk_nama_pejabat_pengadaan_id??0,a.mdk_nama_pptk_id??0,a.mdk_nama_bendahara_id??0,a.mdk_nama_perusahaan_id??0,a.mdk_nama_pimpinan_perusahaan??"",a.mdk_jabatan_pimpinan_perusahaan??"",a.mdk_pekerjaan??"",a.mdk_alamat??"",a.mdk_program??"",a.mdk_kode_program??"",a.mdk_kegiatan??"",a.mdk_kode_kegiatan??"",a.mdk_sub_kegiatan??"",a.mdk_kode_sub_kegiatan??"",a.mdk_uraian_belanja??"",a.mdk_rekening_belanja??"",a.mdk_kode_level1??"",a.mdk_nama_level1??"",a.mdk_kode_level2??"",a.mdk_nama_level2??"",a.mdk_kode_level3??"",a.mdk_nama_level3??"",a.mdk_kode_level4??"",a.mdk_nama_level4??"",a.mdk_kode_level5??"",a.mdk_nama_level5??"",a.mdk_keterangan??"",a.mdk_apbd??"",a.mdk_no_dpa??"",a.mdk_volume??"",a.mdk_satuan??0,c,a.mdk_kak_id?Number(a.mdk_kak_id):null,a.mdk_updated_by??null,a.mdk_id]);return a.mdk_kak_id&&a.mdk_id&&await b.default.query(`UPDATE kerangka_acuan_kerja 
         SET kak_master_dokumen_id = ? 
         WHERE kak_id = ? AND (kak_master_dokumen_id IS NULL OR kak_master_dokumen_id = 0)`,[a.mdk_id,Number(a.mdk_kak_id)]),d.affectedRows>0}static async softDelete(a,c){await (0,b.initDatabase)();let[d]=await b.default.query(`UPDATE master_dokumen 
       SET mdk_deleted_at = NOW(), mdk_deleted_by = ?
       WHERE mdk_id = ? AND mdk_deleted_at IS NULL`,[c??null,a]);return d.affectedRows>0}static async updateLockStatus(a,c,d){await (0,b.initDatabase)();let[e]=await b.default.query(`UPDATE master_dokumen 
       SET mdk_is_lock = ?, mdk_updated_by = ?, mdk_updated_at = NOW()
       WHERE mdk_id = ? AND mdk_deleted_at IS NULL`,[+!!c,d??null,a]);return e.affectedRows>0}}a.s(["MasterDokumenRepository",()=>c])},62555,a=>{"use strict";var b=a.i(61469);class c{static async findMany(a="",c=10,d=0){await (0,b.initDatabase)();let e="WHERE s.hps_deleted_at IS NULL",f=[];if(a.trim()){e+=" AND (s.hps_uraian_pekerjaan LIKE ? OR m.mdk_uraian_belanja LIKE ? OR m.mdk_no_dpa LIKE ?)";let b=`%${a.trim()}%`;f.push(b,b,b)}let[g]=await b.default.query(`SELECT COUNT(*) as total 
       FROM detail_harga_perkiraan_sendiri s
       LEFT JOIN master_dokumen m ON s.hps_master_dokumen_id = m.mdk_id 
       ${e}`,f),h=g[0]?.total||0,i=[...f,Number(c),Number(d)],[j]=await b.default.query(`SELECT s.hps_id, s.hps_master_dokumen_id, s.hps_uraian_pekerjaan, s.hps_volume, s.hps_waktu, s.hps_harga_satuan, s.hps_harga_perkiraan_sendiri, s.hps_created_at,
              m.mdk_uraian_belanja, m.mdk_no_dpa, b.bdg_nama AS mdk_bagian, b.bdg_nama, m.mdk_pagu_anggaran
       FROM detail_harga_perkiraan_sendiri s
       LEFT JOIN master_dokumen m ON s.hps_master_dokumen_id = m.mdk_id
       LEFT JOIN bidang b ON m.mdk_bidang_id = b.bdg_id
       ${e} 
       ORDER BY s.hps_id DESC 
       LIMIT ? OFFSET ?`,i);return{data:j,total:h}}static async findByMasterDokumenId(a){await (0,b.initDatabase)();let[c]=await b.default.query(`SELECT hps_id, hps_master_dokumen_id, hps_uraian_pekerjaan, hps_volume, hps_waktu, hps_harga_satuan, hps_harga_perkiraan_sendiri, hps_created_at 
       FROM detail_harga_perkiraan_sendiri 
       WHERE hps_master_dokumen_id = ? AND hps_deleted_at IS NULL 
       ORDER BY hps_id ASC`,[a]);return c}static async findById(a){await (0,b.initDatabase)();let[c]=await b.default.query(`SELECT hps_id, hps_master_dokumen_id, hps_uraian_pekerjaan, hps_volume, hps_waktu, hps_harga_satuan, hps_harga_perkiraan_sendiri, hps_created_at 
       FROM detail_harga_perkiraan_sendiri 
       WHERE hps_id = ? AND hps_deleted_at IS NULL 
       LIMIT 1`,[a]);return c&&0!==c.length?c[0]:null}static async saveBatch(a,c,d){await (0,b.initDatabase)();let e=await b.default.getConnection();try{for(let b of(await e.beginTransaction(),await e.query(`UPDATE detail_harga_perkiraan_sendiri 
         SET hps_deleted_at = NOW(), hps_deleted_by = ? 
         WHERE hps_master_dokumen_id = ? AND hps_deleted_at IS NULL`,[d??null,a]),c))b.hps_uraian_pekerjaan.trim()&&await e.query(`INSERT INTO detail_harga_perkiraan_sendiri (hps_master_dokumen_id, hps_uraian_pekerjaan, hps_volume, hps_waktu, hps_harga_satuan, hps_harga_perkiraan_sendiri, hps_created_by) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,[a,b.hps_uraian_pekerjaan.trim(),b.hps_volume.trim(),b.hps_waktu.trim(),Number(b.hps_harga_satuan)||0,Number(b.hps_harga_perkiraan_sendiri)||0,d??null]);return await e.commit(),!0}catch(a){throw await e.rollback(),a}finally{e.release()}}static async insert(a){await (0,b.initDatabase)();let[c]=await b.default.query(`INSERT INTO detail_harga_perkiraan_sendiri (hps_master_dokumen_id, hps_uraian_pekerjaan, hps_volume, hps_waktu, hps_harga_satuan, hps_harga_perkiraan_sendiri, hps_created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,[a.hps_master_dokumen_id,a.hps_uraian_pekerjaan,a.hps_volume,a.hps_waktu,a.hps_harga_satuan,a.hps_harga_perkiraan_sendiri,a.hps_created_by??null]);return c.insertId}static async update(a){await (0,b.initDatabase)();let[c]=await b.default.query(`UPDATE detail_harga_perkiraan_sendiri 
       SET hps_master_dokumen_id = ?, hps_uraian_pekerjaan = ?, hps_volume = ?, hps_waktu = ?, hps_harga_satuan = ?, hps_harga_perkiraan_sendiri = ?, hps_updated_by = ?, hps_updated_at = NOW() 
       WHERE hps_id = ? AND hps_deleted_at IS NULL`,[a.hps_master_dokumen_id,a.hps_uraian_pekerjaan,a.hps_volume,a.hps_waktu,a.hps_harga_satuan,a.hps_harga_perkiraan_sendiri,a.hps_updated_by??null,a.hps_id]);return c.affectedRows>0}static async softDelete(a,c){await (0,b.initDatabase)();let[d]=await b.default.query(`UPDATE detail_harga_perkiraan_sendiri 
       SET hps_deleted_at = NOW(), hps_deleted_by = ?
       WHERE hps_id = ? AND hps_deleted_at IS NULL`,[c??null,a]);return d.affectedRows>0}}a.s(["HargaPerkiraanSendiriRepository",()=>c])},14084,a=>{"use strict";var b=a.i(61469);class c{static async findByMasterDokumenId(a){await (0,b.initDatabase)();let[c]=await b.default.query(`SELECT k.*,
              p.pgw_nama AS ppk_nama,
              p.pgw_nip AS ppk_nip,
              p.pgw_jabatan AS ppk_jabatan
       FROM kerangka_acuan_kerja k
       LEFT JOIN pegawai p ON k.kak_ppk_pgw_id = p.pgw_id
       WHERE k.kak_master_dokumen_id = ? AND k.kak_deleted_at IS NULL
       LIMIT 1`,[a]);return c.length>0?c[0]:null}static async findById(a){await (0,b.initDatabase)();let[c]=await b.default.query(`SELECT k.*,
              p.pgw_nama AS ppk_nama,
              p.pgw_nip AS ppk_nip,
              p.pgw_jabatan AS ppk_jabatan
       FROM kerangka_acuan_kerja k
       LEFT JOIN pegawai p ON k.kak_ppk_pgw_id = p.pgw_id
       WHERE k.kak_id = ? AND k.kak_deleted_at IS NULL
       LIMIT 1`,[a]);return c.length>0?c[0]:null}static async getPerkiraanBiayaByKakId(a){await (0,b.initDatabase)();let[c]=await b.default.query("SELECT * FROM detail_kak_perkiraan_biaya WHERE kpb_kak_id = ? AND kpb_deleted_at IS NULL ORDER BY kpb_id ASC",[a]);return c}static async getSpesifikasiTeknisByKakId(a){await (0,b.initDatabase)();let[c]=await b.default.query("SELECT * FROM detail_kak_spesifikasi_teknis WHERE kst_kak_id = ? AND kst_deleted_at IS NULL ORDER BY kst_id ASC",[a]);return c}static async getManualKakList(){await (0,b.initDatabase)();let[a]=await b.default.query(`SELECT k.*,
              p.pgw_nama AS ppk_nama,
              p.pgw_nip AS ppk_nip,
              p.pgw_jabatan AS ppk_jabatan
       FROM kerangka_acuan_kerja k
       LEFT JOIN pegawai p ON k.kak_ppk_pgw_id = p.pgw_id
       WHERE (k.kak_master_dokumen_id IS NULL OR k.kak_master_dokumen_id = 0) 
         AND k.kak_deleted_at IS NULL 
       ORDER BY k.kak_id DESC`);return a}static async getPegawaiList(){await (0,b.initDatabase)();let[a]=await b.default.query("SELECT pgw_id, pgw_nama, pgw_nip, pgw_jabatan FROM pegawai WHERE pgw_deleted_at IS NULL ORDER BY pgw_nama ASC");return a}static async getAllKakForSelection(){await (0,b.initDatabase)();let[a]=await b.default.query(`SELECT 
         k.kak_id,
         k.kak_master_dokumen_id,
         COALESCE(NULLIF(TRIM(k.kak_pekerjaan), ''), m.mdk_pekerjaan, CONCAT('KAK #', k.kak_id)) as kak_pekerjaan,
         COALESCE(NULLIF(TRIM(k.kak_program), ''), m.mdk_program, '') as kak_program,
         COALESCE(NULLIF(TRIM(k.kak_kode_program), ''), m.mdk_kode_program, '') as kak_kode_program,
         COALESCE(NULLIF(TRIM(k.kak_kegiatan), ''), m.mdk_kegiatan, '') as kak_kegiatan,
         COALESCE(NULLIF(TRIM(k.kak_kode_kegiatan), ''), m.mdk_kode_kegiatan, '') as kak_kode_kegiatan,
         COALESCE(NULLIF(TRIM(k.kak_sub_kegiatan), ''), m.mdk_sub_kegiatan, '') as kak_sub_kegiatan,
         COALESCE(NULLIF(TRIM(k.kak_kode_sub_kegiatan), ''), m.mdk_kode_sub_kegiatan, '') as kak_kode_sub_kegiatan,
         COALESCE(NULLIF(TRIM(k.kak_rekening), ''), m.mdk_uraian_belanja, m.mdk_rekening_belanja, '') as kak_rekening,
         COALESCE(NULLIF(TRIM(k.kak_kode_rekening), ''), m.mdk_rekening_belanja, '') as kak_kode_rekening,
         COALESCE(NULLIF(TRIM(k.kak_tahun_anggaran), ''), m.mdk_apbd, '2026') as kak_tahun_anggaran,
         COALESCE(
           NULLIF(k.kak_pagu_anggaran, 0),
           (SELECT SUM(kpb_jumlah) FROM detail_kak_perkiraan_biaya WHERE kpb_kak_id = k.kak_id AND kpb_deleted_at IS NULL),
           m.mdk_pagu_anggaran,
           0
         ) as kak_pagu_total
       FROM kerangka_acuan_kerja k
       LEFT JOIN master_dokumen m ON k.kak_master_dokumen_id = m.mdk_id
       WHERE k.kak_deleted_at IS NULL
       ORDER BY k.kak_id DESC`);return a.map(a=>({kak_id:Number(a.kak_id),kak_master_dokumen_id:a.kak_master_dokumen_id?Number(a.kak_master_dokumen_id):null,kak_pekerjaan:a.kak_pekerjaan||"",kak_program:a.kak_program||"",kak_kode_program:a.kak_kode_program||"",kak_kegiatan:a.kak_kegiatan||"",kak_kode_kegiatan:a.kak_kode_kegiatan||"",kak_sub_kegiatan:a.kak_sub_kegiatan||"",kak_kode_sub_kegiatan:a.kak_kode_sub_kegiatan||"",kak_rekening:a.kak_rekening||"",kak_kode_rekening:a.kak_kode_rekening||"",kak_tahun_anggaran:a.kak_tahun_anggaran||"",kak_pagu_total:Number(a.kak_pagu_total)||0}))}static async saveAll(a,c){await (0,b.initDatabase)();let d=await b.default.getConnection();try{await d.beginTransaction();let b=a.kak_id?Number(a.kak_id):null,e=void 0!==a.kak_item_belanja&&null!==a.kak_item_belanja?"string"==typeof a.kak_item_belanja?a.kak_item_belanja:JSON.stringify(a.kak_item_belanja):null;if(!b&&a.kak_master_dokumen_id){let[c]=await d.query("SELECT kak_id FROM kerangka_acuan_kerja WHERE kak_master_dokumen_id = ? AND kak_deleted_at IS NULL LIMIT 1",[a.kak_master_dokumen_id]);c.length>0&&(b=c[0].kak_id)}if(b)await d.query(`UPDATE kerangka_acuan_kerja SET
            kak_master_dokumen_id = ?,
            kak_program = ?,
            kak_kode_program = ?,
            kak_kegiatan = ?,
            kak_kode_kegiatan = ?,
            kak_sub_kegiatan = ?,
            kak_kode_sub_kegiatan = ?,
            kak_rekening = ?,
            kak_kode_rekening = ?,
            kak_pekerjaan = ?,
            kak_tahun_anggaran = ?,
            kak_pagu_anggaran = ?,
            kak_item_belanja = ?,
            kak_ppk_pgw_id = ?,
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
          WHERE kak_id = ?`,[a.kak_master_dokumen_id||null,a.kak_program||null,a.kak_kode_program||null,a.kak_kegiatan||null,a.kak_kode_kegiatan||null,a.kak_sub_kegiatan||null,a.kak_kode_sub_kegiatan||null,a.kak_rekening||null,a.kak_kode_rekening||null,a.kak_pekerjaan||null,a.kak_tahun_anggaran||null,Number(a.kak_pagu_anggaran)||0,e,a.kak_ppk_pgw_id||null,a.kak_latar_belakang||null,a.kak_maksud_dan_tujuan||null,a.kak_referensi_hukum||null,a.kak_target_sasaran||null,a.kak_nama_organisasi_dan_pengadaan||null,a.kak_sumber_dana_perkiraan_biaya||null,a.kak_perkiraan_biaya_id||null,a.kak_ruang_lingkup_lokasi_pekerjaan||null,a.kak_jangka_waktu_pelaksanaan||null,a.kak_metode_pemilihan||null,a.kak_spesifikasi_teknis_id||null,a.kak_persyaratan_kualifikasi_penyedia||null,a.kak_penutup||null,c??null,b]);else{let[f]=await d.query(`INSERT INTO kerangka_acuan_kerja
            (kak_master_dokumen_id, kak_program, kak_kode_program, kak_kegiatan, kak_kode_kegiatan,
             kak_sub_kegiatan, kak_kode_sub_kegiatan, kak_rekening, kak_kode_rekening, kak_pekerjaan, kak_tahun_anggaran,
             kak_pagu_anggaran, kak_item_belanja, kak_ppk_pgw_id, kak_latar_belakang, kak_maksud_dan_tujuan, kak_referensi_hukum,
             kak_target_sasaran, kak_nama_organisasi_dan_pengadaan, kak_sumber_dana_perkiraan_biaya,
             kak_perkiraan_biaya_id, kak_ruang_lingkup_lokasi_pekerjaan, kak_jangka_waktu_pelaksanaan,
             kak_metode_pemilihan, kak_spesifikasi_teknis_id, kak_persyaratan_kualifikasi_penyedia,
             kak_penutup, kak_created_by, kak_created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,[a.kak_master_dokumen_id||null,a.kak_program||null,a.kak_kode_program||null,a.kak_kegiatan||null,a.kak_kode_kegiatan||null,a.kak_sub_kegiatan||null,a.kak_kode_sub_kegiatan||null,a.kak_rekening||null,a.kak_kode_rekening||null,a.kak_pekerjaan||null,a.kak_tahun_anggaran||null,Number(a.kak_pagu_anggaran)||0,e,a.kak_ppk_pgw_id||null,a.kak_latar_belakang||null,a.kak_maksud_dan_tujuan||null,a.kak_referensi_hukum||null,a.kak_target_sasaran||null,a.kak_nama_organisasi_dan_pengadaan||null,a.kak_sumber_dana_perkiraan_biaya||null,a.kak_perkiraan_biaya_id||null,a.kak_ruang_lingkup_lokasi_pekerjaan||null,a.kak_jangka_waktu_pelaksanaan||null,a.kak_metode_pemilihan||null,a.kak_spesifikasi_teknis_id||null,a.kak_persyaratan_kualifikasi_penyedia||null,a.kak_penutup||null,c??null]);b=Number(f.insertId)}if(!b)throw Error("Gagal mendapatkan ID Kerangka Acuan Kerja yang disimpan.");if(await d.query("UPDATE detail_kak_perkiraan_biaya SET kpb_deleted_at = NOW(), kpb_deleted_by = ? WHERE kpb_kak_id = ? AND kpb_deleted_at IS NULL",[c??null,b]),a.perkiraanBiayaList&&a.perkiraanBiayaList.length>0)for(let e of a.perkiraanBiayaList)e.kpb_uraian&&""!==e.kpb_uraian.trim()&&await d.query(`INSERT INTO detail_kak_perkiraan_biaya
              (kpb_kak_id, kpb_uraian, kpb_volume, kpb_harga, kpb_jumlah, kpb_created_by)
             VALUES (?, ?, ?, ?, ?, ?)`,[b,e.kpb_uraian.trim(),Number(e.kpb_volume)||0,Number(e.kpb_harga)||0,Number(e.kpb_jumlah)||0,c??null]);if(await d.query("UPDATE detail_kak_spesifikasi_teknis SET kst_deleted_at = NOW(), kst_deleted_by = ? WHERE kst_kak_id = ? AND kst_deleted_at IS NULL",[c??null,b]),a.spesifikasiTeknisList&&a.spesifikasiTeknisList.length>0)for(let e of a.spesifikasiTeknisList)(e.kst_uraian||e.kst_spesifikasi)&&await d.query(`INSERT INTO detail_kak_spesifikasi_teknis
              (kst_kak_id, kst_uraian, kst_spesifikasi, kst_created_by)
             VALUES (?, ?, ?, ?)`,[b,e.kst_uraian?e.kst_uraian.trim():"",e.kst_spesifikasi?e.kst_spesifikasi.trim():"",c??null]);return await d.commit(),b}catch(a){throw await d.rollback(),a}finally{d.release()}}static async delete(a,c){await (0,b.initDatabase)();let d=await b.default.getConnection();try{return await d.beginTransaction(),await d.query("UPDATE kerangka_acuan_kerja SET kak_deleted_at = NOW(), kak_deleted_by = ? WHERE kak_id = ?",[c??null,a]),await d.query("UPDATE detail_kak_perkiraan_biaya SET kpb_deleted_at = NOW(), kpb_deleted_by = ? WHERE kpb_kak_id = ?",[c??null,a]),await d.query("UPDATE detail_kak_spesifikasi_teknis SET kst_deleted_at = NOW(), kst_deleted_by = ? WHERE kst_kak_id = ?",[c??null,a]),await d.commit(),!0}catch(a){throw await d.rollback(),a}finally{d.release()}}}a.s(["KerangkaAcuanKerjaRepository",()=>c])},79562,a=>{"use strict";var b=a.i(61469);class c{static async findByKakId(a){await (0,b.initDatabase)();let[c]=await b.default.query(`SELECT p.*,
              pgw.pgw_nama AS ppk_nama,
              pgw.pgw_nip AS ppk_nip,
              pgw.pgw_jabatan AS ppk_jabatan
       FROM permohonan p
       LEFT JOIN pegawai pgw ON p.pmh_ppk_pgw_id = pgw.pgw_id
       WHERE p.pmh_kak_id = ? AND p.pmh_deleted_at IS NULL
       LIMIT 1`,[a]);return c.length>0?c[0]:null}static async findById(a){await (0,b.initDatabase)();let[c]=await b.default.query(`SELECT p.*,
              pgw.pgw_nama AS ppk_nama,
              pgw.pgw_nip AS ppk_nip,
              pgw.pgw_jabatan AS ppk_jabatan
       FROM permohonan p
       LEFT JOIN pegawai pgw ON p.pmh_ppk_pgw_id = pgw.pgw_id
       WHERE p.pmh_id = ? AND p.pmh_deleted_at IS NULL
       LIMIT 1`,[a]);return c.length>0?c[0]:null}static async getPegawaiList(){await (0,b.initDatabase)();let[a]=await b.default.query("SELECT pgw_id, pgw_nama, pgw_nip, pgw_jabatan FROM pegawai WHERE pgw_deleted_at IS NULL ORDER BY pgw_nama ASC");return a}static async getKakOptions(){await (0,b.initDatabase)();let[a]=await b.default.query(`SELECT 
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
       ORDER BY k.kak_id DESC`);return a}static async save(a,c){await (0,b.initDatabase)();let d=await b.default.getConnection();try{await d.beginTransaction();let b=a.pmh_id?Number(a.pmh_id):null;if(!b&&a.pmh_kak_id){let[c]=await d.query("SELECT pmh_id FROM permohonan WHERE pmh_kak_id = ? AND pmh_deleted_at IS NULL LIMIT 1",[a.pmh_kak_id]);c.length>0&&(b=c[0].pmh_id)}if(b)await d.query(`UPDATE permohonan SET
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
            pmh_ppk_pgw_id = ?,
            pmh_updated_by = ?,
            pmh_updated_at = NOW()
          WHERE pmh_id = ?`,[a.pmh_kak_id,a.pmh_tanggal||null,a.pmh_nomor||null,a.pmh_sifat||null,a.pmh_lampiran||null,a.pmh_hal||null,a.pmh_paragraf1||null,a.pmh_kode_rup||null,a.pmh_nama_paket||null,Number(a.pmh_pagu_anggaran)||0,Number(a.pmh_hps)||0,a.pmh_metode_pemilihan||null,a.pmh_sumber_dana||null,a.pmh_paragraf2||null,a.pmh_ppk_pgw_id||null,c??null,b]);else{let[e]=await d.query(`INSERT INTO permohonan
            (pmh_kak_id, pmh_tanggal, pmh_nomor, pmh_sifat, pmh_lampiran, pmh_hal,
             pmh_paragraf1, pmh_kode_rup, pmh_nama_paket, pmh_pagu_anggaran, pmh_hps,
             pmh_metode_pemilihan, pmh_sumber_dana, pmh_paragraf2, pmh_ppk_pgw_id, pmh_created_by, pmh_created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,[a.pmh_kak_id,a.pmh_tanggal||null,a.pmh_nomor||null,a.pmh_sifat||null,a.pmh_lampiran||null,a.pmh_hal||null,a.pmh_paragraf1||null,a.pmh_kode_rup||null,a.pmh_nama_paket||null,Number(a.pmh_pagu_anggaran)||0,Number(a.pmh_hps)||0,a.pmh_metode_pemilihan||null,a.pmh_sumber_dana||null,a.pmh_paragraf2||null,a.pmh_ppk_pgw_id||null,c??null]);b=Number(e.insertId)}if(!b)throw Error("Gagal mendapatkan ID Permohonan yang disimpan.");return await d.commit(),b}catch(a){throw await d.rollback(),a}finally{d.release()}}static async delete(a,c){return await (0,b.initDatabase)(),await b.default.query("UPDATE permohonan SET pmh_deleted_at = NOW(), pmh_deleted_by = ? WHERE pmh_id = ?",[c??null,a]),!0}}a.s(["PermohonanRepository",()=>c])},75118,a=>{"use strict";var b=a.i(37936),c=a.i(18558),d=a.i(5246),e=a.i(95289),f=a.i(79562),g=a.i(14084),h=a.i(3334),i=a.i(62555);class j{static async getByKakId(a){let b=await f.PermohonanRepository.findByKakId(a),c=await g.KerangkaAcuanKerjaRepository.findById(a),d=null,e=0;return c?.kak_master_dokumen_id&&(d=await h.MasterDokumenRepository.findById(c.kak_master_dokumen_id),e=(await i.HargaPerkiraanSendiriRepository.findByMasterDokumenId(c.kak_master_dokumen_id)).reduce((a,b)=>a+(Number(b.hps_harga_perkiraan_sendiri)||0),0)),{permohonan:b,kak:c,masterDokumen:d,totalBiayaKak:(await g.KerangkaAcuanKerjaRepository.getPerkiraanBiayaByKakId(a)).reduce((a,b)=>a+(Number(b.kpb_jumlah)||0),0),totalHps:e}}static async getById(a){let b=await f.PermohonanRepository.findById(a);return b?await this.getByKakId(b.pmh_kak_id):{permohonan:null,kak:null,masterDokumen:null,totalBiayaKak:0,totalHps:0}}static async getKakOptions(){return await f.PermohonanRepository.getKakOptions()}static async getPegawaiList(){return await f.PermohonanRepository.getPegawaiList()}static async save(a,b){return await f.PermohonanRepository.save(a,b)}static async delete(a,b){return await f.PermohonanRepository.delete(a,b)}}var k=a.i(53112);let l=k.z.object({pmh_id:k.z.coerce.number().nullable().optional(),pmh_kak_id:k.z.coerce.number().positive("Dokumen Kerangka Acuan Kerja (KAK) harus dipilih"),pmh_tanggal:k.z.string().nullable().optional(),pmh_nomor:k.z.string().nullable().optional(),pmh_sifat:k.z.string().nullable().optional(),pmh_lampiran:k.z.string().nullable().optional(),pmh_hal:k.z.string().nullable().optional(),pmh_paragraf1:k.z.string().nullable().optional(),pmh_kode_rup:k.z.string().nullable().optional(),pmh_nama_paket:k.z.string().nullable().optional(),pmh_pagu_anggaran:k.z.coerce.number().default(0),pmh_hps:k.z.coerce.number().default(0),pmh_metode_pemilihan:k.z.string().nullable().optional(),pmh_sumber_dana:k.z.string().nullable().optional(),pmh_paragraf2:k.z.string().nullable().optional(),pmh_ppk_pgw_id:k.z.coerce.number().nullable().optional()});async function m(){try{let a=await (0,d.cookies)(),b=a.get("token")?.value;if(!b)return null;let c=await (0,e.verifyToken)(b);return c?c.pgw_id:null}catch{return null}}async function n(a){try{let b=await j.getByKakId(a);return{success:!0,message:"Berhasil memuat data Permohonan",data:b}}catch(a){return{success:!1,message:a.message||"Gagal memuat data Permohonan",data:{permohonan:null,kak:null,masterDokumen:null,totalBiayaKak:0,totalHps:0}}}}async function o(a){try{let b=await j.getById(a);return{success:!0,message:"Berhasil memuat data Permohonan",data:b}}catch(a){return{success:!1,message:a.message||"Gagal memuat data Permohonan",data:{permohonan:null,kak:null,masterDokumen:null,totalBiayaKak:0,totalHps:0}}}}async function p(){try{let a=await j.getKakOptions();return{success:!0,message:"Berhasil mengambil opsi KAK",data:a}}catch(a){return{success:!1,message:a.message||"Gagal mengambil opsi KAK",data:[]}}}async function q(){try{let a=await j.getPegawaiList();return{success:!0,message:"Berhasil mengambil daftar pegawai",data:a}}catch(a){return{success:!1,message:a.message||"Gagal mengambil daftar pegawai",data:[]}}}async function r(a){try{let b=l.safeParse(a);if(!b.success)return{success:!1,message:"Validasi form gagal",errors:b.error.flatten().fieldErrors};let d=await m(),e=await j.save(b.data,d);return(0,c.revalidatePath)("/permohonan"),(0,c.revalidatePath)(`/permohonan/print/${e}`),(0,c.revalidatePath)(`/permohonan/print/kak-${a.pmh_kak_id}`),{success:!0,message:"Surat Permohonan (Nota Dinas) berhasil disimpan.",data:{pmhId:e}}}catch(a){return{success:!1,message:a.message||"Gagal menyimpan Surat Permohonan."}}}async function s(a){try{let b=await m();return await j.delete(a,b),(0,c.revalidatePath)("/permohonan"),{success:!0,message:"Surat Permohonan berhasil dihapus."}}catch(a){return{success:!1,message:a.message||"Gagal menghapus Surat Permohonan."}}}(0,a.i(13095).ensureServerEntryExports)([n,o,p,q,r,s]),(0,b.registerServerReference)(n,"401d07aaab947cca2911086ab4a6f9a5d9b30209b6",null),(0,b.registerServerReference)(o,"409cf44276995621d3824a9bb159292ecf37399724",null),(0,b.registerServerReference)(p,"0091e5c81211cf4cdf11c42b43b467084eb8ca29e4",null),(0,b.registerServerReference)(q,"0049c447004670830005a9075f5624b3f3739518ac",null),(0,b.registerServerReference)(r,"4038dc9830e0404cac09fae2fbe971f12ee30def31",null),(0,b.registerServerReference)(s,"40dae787c670a38eded0c3f3402d8c382c544a2080",null),a.s(["getKakOptionsForPermohonanAction",()=>p,"getPegawaiListForPermohonanAction",()=>q,"getPermohonanByIdAction",()=>o,"getPermohonanByKakIdAction",()=>n,"savePermohonanAction",()=>r],75118)},26241,a=>{"use strict";var b=a.i(75118);a.s([],83283),a.i(83283),a.s(["0049c447004670830005a9075f5624b3f3739518ac",()=>b.getPegawaiListForPermohonanAction,"0091e5c81211cf4cdf11c42b43b467084eb8ca29e4",()=>b.getKakOptionsForPermohonanAction,"401d07aaab947cca2911086ab4a6f9a5d9b30209b6",()=>b.getPermohonanByKakIdAction,"4038dc9830e0404cac09fae2fbe971f12ee30def31",()=>b.savePermohonanAction],26241)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__f8d62dc3._.js.map