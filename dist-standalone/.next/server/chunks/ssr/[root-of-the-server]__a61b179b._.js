module.exports=[70617,a=>{"use strict";var b=a.i(62555);class c{static async getList(a="",c=1,d=10){let e=Math.max(1,c),f=Math.max(1,Math.min(100,d)),{data:g,total:h}=await b.HargaPerkiraanSendiriRepository.findMany(a,f,(e-1)*f),i=Math.ceil(h/f)||1;return{data:g,total:h,page:e,limit:f,totalPages:i}}static async getByMasterDokumenId(a){return!a||a<=0?[]:await b.HargaPerkiraanSendiriRepository.findByMasterDokumenId(a)}static async saveBatch(a,c,d){if(!a||a<=0)throw Error("Master Dokumen ID tidak valid.");return await b.HargaPerkiraanSendiriRepository.saveBatch(a,c,d)}static async getById(a){let c=await b.HargaPerkiraanSendiriRepository.findById(a);if(!c)throw Error("Data HargaPerkiraanSendiri tidak ditemukan.");return c}static async create(a){return await b.HargaPerkiraanSendiriRepository.insert(a)}static async update(a){if(!await b.HargaPerkiraanSendiriRepository.findById(a.hps_id))throw Error("Data HargaPerkiraanSendiri tidak ditemukan.");return await b.HargaPerkiraanSendiriRepository.update(a)}static async delete(a,c){if(!await b.HargaPerkiraanSendiriRepository.findById(a))throw Error("Data HargaPerkiraanSendiri tidak ditemukan.");return await b.HargaPerkiraanSendiriRepository.softDelete(a,c)}}a.s(["HargaPerkiraanSendiriService",()=>c])},115,(a,b,c)=>{b.exports=a.x("mysql2-3d80281e5ed34ca6/promise",()=>require("mysql2-3d80281e5ed34ca6/promise"))},54799,(a,b,c)=>{b.exports=a.x("crypto",()=>require("crypto"))},37936,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"registerServerReference",{enumerable:!0,get:function(){return d.registerServerReference}});let d=a.r(11857)},13095,(a,b,c)=>{"use strict";function d(a){for(let b=0;b<a.length;b++){let c=a[b];if("function"!=typeof c)throw Object.defineProperty(Error(`A "use server" file can only export async functions, found ${typeof c}.
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
       WHERE mdk_id = ? AND mdk_deleted_at IS NULL`,[+!!c,d??null,a]);return e.affectedRows>0}}a.s(["MasterDokumenRepository",()=>c])},79045,a=>{"use strict";var b=a.i(3334);class c{static async getList(a="",c=1,d=10,e){let f=Math.max(1,c),g=Math.max(1,Math.min(100,d)),{data:h,total:i}=await b.MasterDokumenRepository.findMany(a,g,(f-1)*g,e),j=Math.ceil(i/g)||1;return{data:h,total:i,page:f,limit:g,totalPages:j}}static async getById(a){let c=await b.MasterDokumenRepository.findById(a);if(!c)throw Error("Data Master Dokumen tidak ditemukan.");return c}static async create(a){return await b.MasterDokumenRepository.insert(a)}static async update(a){let c=await b.MasterDokumenRepository.findById(a.mdk_id);if(!c)throw Error("Data Master Dokumen tidak ditemukan.");if(1===c.mdk_is_lock)throw Error("Master Dokumen telah dikunci (Locked) dan tidak dapat diedit.");return await b.MasterDokumenRepository.update(a)}static async delete(a,c){let d=await b.MasterDokumenRepository.findById(a);if(!d)throw Error("Data Master Dokumen tidak ditemukan.");if(1===d.mdk_is_lock)throw Error("Master Dokumen telah dikunci (Locked) dan tidak dapat dihapus.");return await b.MasterDokumenRepository.softDelete(a,c)}static async setLockStatus(a,c,d){if(!await b.MasterDokumenRepository.findById(a))throw Error("Data Master Dokumen tidak ditemukan.");return await b.MasterDokumenRepository.updateLockStatus(a,c,d)}}a.s(["MasterDokumenService",()=>c])},62555,a=>{"use strict";var b=a.i(61469);class c{static async findMany(a="",c=10,d=0){await (0,b.initDatabase)();let e="WHERE s.hps_deleted_at IS NULL",f=[];if(a.trim()){e+=" AND (s.hps_uraian_pekerjaan LIKE ? OR m.mdk_uraian_belanja LIKE ? OR m.mdk_no_dpa LIKE ?)";let b=`%${a.trim()}%`;f.push(b,b,b)}let[g]=await b.default.query(`SELECT COUNT(*) as total 
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
             VALUES (?, ?, ?, ?)`,[b,e.kst_uraian?e.kst_uraian.trim():"",e.kst_spesifikasi?e.kst_spesifikasi.trim():"",c??null]);return await d.commit(),b}catch(a){throw await d.rollback(),a}finally{d.release()}}static async delete(a,c){await (0,b.initDatabase)();let d=await b.default.getConnection();try{return await d.beginTransaction(),await d.query("UPDATE kerangka_acuan_kerja SET kak_deleted_at = NOW(), kak_deleted_by = ? WHERE kak_id = ?",[c??null,a]),await d.query("UPDATE detail_kak_perkiraan_biaya SET kpb_deleted_at = NOW(), kpb_deleted_by = ? WHERE kpb_kak_id = ?",[c??null,a]),await d.query("UPDATE detail_kak_spesifikasi_teknis SET kst_deleted_at = NOW(), kst_deleted_by = ? WHERE kst_kak_id = ?",[c??null,a]),await d.commit(),!0}catch(a){throw await d.rollback(),a}finally{d.release()}}}a.s(["KerangkaAcuanKerjaRepository",()=>c])},3691,a=>{"use strict";var b=a.i(37936),c=a.i(18558),d=a.i(5246),e=a.i(95289),f=a.i(14084);class g{static async getManualKakList(){return await f.KerangkaAcuanKerjaRepository.getManualKakList()}static async getAllKakForSelection(){return await f.KerangkaAcuanKerjaRepository.getAllKakForSelection()}static async getPegawaiList(){return await f.KerangkaAcuanKerjaRepository.getPegawaiList()}static async getByMasterDokumenId(a){let b=await f.KerangkaAcuanKerjaRepository.findByMasterDokumenId(a);if(!b)return{kak:null,perkiraanBiayaList:[],spesifikasiTeknisList:[]};let[c,d]=await Promise.all([f.KerangkaAcuanKerjaRepository.getPerkiraanBiayaByKakId(b.kak_id),f.KerangkaAcuanKerjaRepository.getSpesifikasiTeknisByKakId(b.kak_id)]);return{kak:b,perkiraanBiayaList:c,spesifikasiTeknisList:d}}static async getById(a){let b=await f.KerangkaAcuanKerjaRepository.findById(a);if(!b)return{kak:null,perkiraanBiayaList:[],spesifikasiTeknisList:[]};let[c,d]=await Promise.all([f.KerangkaAcuanKerjaRepository.getPerkiraanBiayaByKakId(b.kak_id),f.KerangkaAcuanKerjaRepository.getSpesifikasiTeknisByKakId(b.kak_id)]);return{kak:b,perkiraanBiayaList:c,spesifikasiTeknisList:d}}static async saveAll(a,b){return await f.KerangkaAcuanKerjaRepository.saveAll(a,b)}static async delete(a,b){return await f.KerangkaAcuanKerjaRepository.delete(a,b)}}var h=a.i(79045),i=a.i(3334),j=a.i(70617),k=a.i(53112);let l=k.z.object({kpb_id:k.z.coerce.number().optional(),kpb_uraian:k.z.string().default(""),kpb_volume:k.z.coerce.number().default(0),kpb_harga:k.z.coerce.number().default(0),kpb_jumlah:k.z.coerce.number().default(0)}),m=k.z.object({kst_id:k.z.coerce.number().optional(),kst_uraian:k.z.string().default(""),kst_spesifikasi:k.z.string().default("")}),n=k.z.object({kak_id:k.z.coerce.number().nullable().optional(),kak_master_dokumen_id:k.z.coerce.number().nullable().optional(),kak_program:k.z.string().nullable().optional(),kak_kode_program:k.z.string().nullable().optional(),kak_kegiatan:k.z.string().nullable().optional(),kak_kode_kegiatan:k.z.string().nullable().optional(),kak_sub_kegiatan:k.z.string().nullable().optional(),kak_kode_sub_kegiatan:k.z.string().nullable().optional(),kak_rekening:k.z.string().nullable().optional(),kak_kode_rekening:k.z.string().nullable().optional(),kak_pekerjaan:k.z.string().nullable().optional(),kak_tahun_anggaran:k.z.string().nullable().optional(),kak_pagu_anggaran:k.z.coerce.number().nullable().optional(),kak_item_belanja:k.z.any().optional(),kak_ppk_pgw_id:k.z.coerce.number().nullable().optional(),kak_latar_belakang:k.z.string().nullable().optional(),kak_maksud_dan_tujuan:k.z.string().nullable().optional(),kak_referensi_hukum:k.z.string().nullable().optional(),kak_target_sasaran:k.z.string().nullable().optional(),kak_nama_organisasi_dan_pengadaan:k.z.string().nullable().optional(),kak_sumber_dana_perkiraan_biaya:k.z.string().nullable().optional(),kak_perkiraan_biaya_id:k.z.coerce.number().nullable().optional(),kak_ruang_lingkup_lokasi_pekerjaan:k.z.string().nullable().optional(),kak_jangka_waktu_pelaksanaan:k.z.string().nullable().optional(),kak_metode_pemilihan:k.z.string().nullable().optional(),kak_spesifikasi_teknis_id:k.z.coerce.number().nullable().optional(),kak_persyaratan_kualifikasi_penyedia:k.z.string().nullable().optional(),kak_penutup:k.z.string().nullable().optional(),perkiraanBiayaList:k.z.array(l).default([]),spesifikasiTeknisList:k.z.array(m).default([])});async function o(){try{let a=await (0,d.cookies)(),b=a.get("token")?.value;if(!b)return null;let c=await (0,e.verifyToken)(b);return c?c.pgw_id:null}catch{return null}}async function p(a){try{let b=await g.getByMasterDokumenId(a),c=await i.MasterDokumenRepository.findById(a);return{success:!0,message:"Berhasil memuat data Kerangka Acuan Kerja (KAK)",data:{kakDetails:b,masterDokumen:c}}}catch(a){return{success:!1,message:a.message||"Gagal memuat data Kerangka Acuan Kerja",data:{kakDetails:{kak:null,perkiraanBiayaList:[],spesifikasiTeknisList:[]},masterDokumen:null}}}}async function q(a){try{let b=await g.getById(a),c=null;return b.kak?.kak_master_dokumen_id&&(c=await i.MasterDokumenRepository.findById(b.kak.kak_master_dokumen_id)),{success:!0,message:"Berhasil memuat data Kerangka Acuan Kerja (KAK)",data:{kakDetails:b,masterDokumen:c}}}catch(a){return{success:!1,message:a.message||"Gagal memuat data Kerangka Acuan Kerja",data:{kakDetails:{kak:null,perkiraanBiayaList:[],spesifikasiTeknisList:[]},masterDokumen:null}}}}async function r(){try{let a=await g.getManualKakList();return{success:!0,message:"Berhasil memuat daftar KAK Manual",data:a}}catch(a){return{success:!1,message:a.message||"Gagal memuat daftar KAK Manual",data:[]}}}async function s(){try{let a=await g.getAllKakForSelection();return{success:!0,message:"Berhasil memuat daftar Kerangka Acuan Kerja (KAK)",data:a}}catch(a){return{success:!1,message:a.message||"Gagal memuat daftar Kerangka Acuan Kerja",data:[]}}}async function t(a){try{let b=n.safeParse(a);if(!b.success)return{success:!1,message:"Validasi form gagal",errors:b.error.flatten().fieldErrors};let d=await o(),e=await g.saveAll(b.data,d);return(0,c.revalidatePath)("/kerangka-acuan-kerja"),a.kak_master_dokumen_id&&(0,c.revalidatePath)(`/kerangka-acuan-kerja/print/${a.kak_master_dokumen_id}`),(0,c.revalidatePath)(`/kerangka-acuan-kerja/print/kak-${e}`),{success:!0,message:"Kerangka Acuan Kerja berhasil disimpan.",data:{kakId:e}}}catch(a){return{success:!1,message:a.message||"Gagal menyimpan Kerangka Acuan Kerja."}}}async function u(a){try{let b=await o();return await g.delete(a,b),(0,c.revalidatePath)("/kerangka-acuan-kerja"),{success:!0,message:"Kerangka Acuan Kerja berhasil dihapus."}}catch(a){return{success:!1,message:a.message||"Gagal menghapus Kerangka Acuan Kerja."}}}async function v(){try{let a,b=await (0,d.cookies)(),c=b.get("token")?.value,f=c?await (0,e.verifyToken)(c):null;f&&0!==f.pgw_role&&(a=f.pgw_bdg_id?Number(f.pgw_bdg_id):0);let g=await h.MasterDokumenService.getList("",1,100,a);return{success:!0,message:"Berhasil mengambil opsi Master Dokumen",data:g.data||[]}}catch(a){return{success:!1,message:a.message||"Gagal mengambil opsi Master Dokumen",data:[]}}}async function w(a){try{let b=await j.HargaPerkiraanSendiriService.getByMasterDokumenId(a);return{success:!0,message:"Berhasil mengambil data HPS",data:b}}catch(a){return{success:!1,message:a.message||"Gagal mengambil data HPS",data:[]}}}async function x(){try{let a=await g.getPegawaiList();return{success:!0,message:"Berhasil mengambil daftar pegawai",data:a}}catch(a){return{success:!1,message:a.message||"Gagal mengambil daftar pegawai",data:[]}}}(0,a.i(13095).ensureServerEntryExports)([p,q,r,s,t,u,v,w,x]),(0,b.registerServerReference)(p,"4014feb10f1cde3b41c3c0186cc5b88aaf3f0ea37c",null),(0,b.registerServerReference)(q,"404c1beae1174cce2d828a4459b8b4011380eae52e",null),(0,b.registerServerReference)(r,"001b127d2d11d148ab2f5680065d5bc198db5e6f39",null),(0,b.registerServerReference)(s,"00dab9939a402d095d3c8e73abb07ec67170b22e45",null),(0,b.registerServerReference)(t,"40f58f882aad61c8af419a489d70f3265abd0982cc",null),(0,b.registerServerReference)(u,"4082800f5aa91ce1418cc771a1ea4bcf99e7eb9c83",null),(0,b.registerServerReference)(v,"008d308c1f747035d745970d87b8c82249e1a4b2dc",null),(0,b.registerServerReference)(w,"4090769509fb4f5172decbfc751d888f9e2b0023f1",null),(0,b.registerServerReference)(x,"009de2523cde2daca63d37887b2abe704de40966af",null),a.s(["getAllKakOptionsAction",()=>s,"getHpsItemsForKakAction",()=>w,"getKerangkaAcuanKerjaByIdAction",()=>q,"getKerangkaAcuanKerjaByMasterDokumenAction",()=>p,"getManualKakListAction",()=>r,"getMasterDokumenOptionsAction",()=>v,"getPegawaiListForKakAction",()=>x,"saveKerangkaAcuanKerjaAction",()=>t],3691)},75651,a=>{"use strict";var b=a.i(3691);a.s([],2252),a.i(2252),a.s(["001b127d2d11d148ab2f5680065d5bc198db5e6f39",()=>b.getManualKakListAction,"008d308c1f747035d745970d87b8c82249e1a4b2dc",()=>b.getMasterDokumenOptionsAction,"009de2523cde2daca63d37887b2abe704de40966af",()=>b.getPegawaiListForKakAction,"4014feb10f1cde3b41c3c0186cc5b88aaf3f0ea37c",()=>b.getKerangkaAcuanKerjaByMasterDokumenAction,"404c1beae1174cce2d828a4459b8b4011380eae52e",()=>b.getKerangkaAcuanKerjaByIdAction,"4090769509fb4f5172decbfc751d888f9e2b0023f1",()=>b.getHpsItemsForKakAction,"40f58f882aad61c8af419a489d70f3265abd0982cc",()=>b.saveKerangkaAcuanKerjaAction],75651)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__a61b179b._.js.map