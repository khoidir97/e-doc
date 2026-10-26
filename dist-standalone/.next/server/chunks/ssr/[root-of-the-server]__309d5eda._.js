module.exports=[115,(a,b,c)=>{b.exports=a.x("mysql2-3d80281e5ed34ca6/promise",()=>require("mysql2-3d80281e5ed34ca6/promise"))},54799,(a,b,c)=>{b.exports=a.x("crypto",()=>require("crypto"))},37936,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"registerServerReference",{enumerable:!0,get:function(){return d.registerServerReference}});let d=a.r(11857)},13095,(a,b,c)=>{"use strict";function d(a){for(let b=0;b<a.length;b++){let c=a[b];if("function"!=typeof c)throw Object.defineProperty(Error(`A "use server" file can only export async functions, found ${typeof c}.
Read more: https://nextjs.org/docs/messages/invalid-use-server-value`),"__NEXT_ERROR_CODE",{value:"E352",enumerable:!1,configurable:!0})}}Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"ensureServerEntryExports",{enumerable:!0,get:function(){return d}})},79045,3334,a=>{"use strict";var b=a.i(61469);class c{static async findMany(a="",c=10,d=0){await (0,b.initDatabase)();let e="WHERE md.mdk_deleted_at IS NULL",f=[];if(a.trim()){e+=" AND (md.mdk_bidang_id LIKE ? OR md.mdk_program LIKE ? OR md.mdk_kegiatan LIKE ? OR md.mdk_no_dpa LIKE ? OR p_pejabat.pgw_nama LIKE ? OR p_sh.psh_nama LIKE ?)";let b=`%${a.trim()}%`;f.push(b,b,b,b,b,b)}let[g]=await b.default.query(`SELECT COUNT(*) as total 
       FROM master_dokumen md 
       LEFT JOIN pegawai p_pejabat ON md.mdk_nama_pejabat_id = p_pejabat.pgw_id
       LEFT JOIN perusahaan p_sh ON md.mdk_nama_perusahaan_id = p_sh.psh_id
       ${e}`,f),h=g[0]?.total||0,i=[...f,Number(c),Number(d)],[j]=await b.default.query(`SELECT 
         md.*,
         p_pejabat.pgw_nama AS mdk_nama_pejabat,
         p_pejabat.pgw_nip AS mdk_nip_pejabat,
         p_pejabat.pgw_jabatan AS mdk_jabatan_pejabat,
         p_pptk.pgw_nama AS mdk_nama_pptk,
         p_pptk.pgw_nip AS mdk_nip_pptk,
         p_bendahara.pgw_nama AS mdk_nama_bendahara,
         p_bendahara.pgw_nip AS mdk_nip_bendahara,
         p_pejabat_pengadaan.pgw_nama AS mdk_nama_pejabat_pengadaan,
         p_pejabat_pengadaan.pgw_nip AS mdk_nip_pejabat_pengadaan,
         p_sh.psh_nama AS mdk_nama_perusahaan,
         p_sh.psh_nama AS psh_nama,
         p_sh.psh_alamat AS psh_alamat,
         b.bdg_nama AS bdg_nama,
         b.bdg_nama AS mdk_bagian
       FROM master_dokumen md
       LEFT JOIN pegawai p_pejabat ON md.mdk_nama_pejabat_id = p_pejabat.pgw_id
       LEFT JOIN pegawai p_pptk ON md.mdk_nama_pptk_id = p_pptk.pgw_id
       LEFT JOIN pegawai p_bendahara ON md.mdk_nama_bendahara_id = p_bendahara.pgw_id
       LEFT JOIN pegawai p_pejabat_pengadaan ON md.mdk_nama_pejabat_pengadaan_id = p_pejabat_pengadaan.pgw_id
       LEFT JOIN perusahaan p_sh ON md.mdk_nama_perusahaan_id = p_sh.psh_id
       LEFT JOIN bidang b ON md.mdk_bidang_id = b.bdg_id
       ${e} 
       ORDER BY md.mdk_id DESC 
       LIMIT ? OFFSET ?`,i);return{data:j,total:h}}static async findById(a){await (0,b.initDatabase)();let[c]=await b.default.query(`SELECT 
         md.*,
         p_pejabat.pgw_nama AS mdk_nama_pejabat,
         p_pejabat.pgw_nip AS mdk_nip_pejabat,
         p_pejabat.pgw_jabatan AS mdk_jabatan_pejabat,
         p_pptk.pgw_nama AS mdk_nama_pptk,
         p_pptk.pgw_nip AS mdk_nip_pptk,
         p_bendahara.pgw_nama AS mdk_nama_bendahara,
         p_bendahara.pgw_nip AS mdk_nip_bendahara,
         p_pejabat_pengadaan.pgw_nama AS mdk_nama_pejabat_pengadaan,
         p_pejabat_pengadaan.pgw_nip AS mdk_nip_pejabat_pengadaan,
         p_sh.psh_nama AS mdk_nama_perusahaan,
         p_sh.psh_nama AS psh_nama,
         p_sh.psh_alamat AS psh_alamat,
         b.bdg_nama AS bdg_nama,
         b.bdg_nama AS mdk_bagian
       FROM master_dokumen md
       LEFT JOIN pegawai p_pejabat ON md.mdk_nama_pejabat_id = p_pejabat.pgw_id
       LEFT JOIN pegawai p_pptk ON md.mdk_nama_pptk_id = p_pptk.pgw_id
       LEFT JOIN pegawai p_bendahara ON md.mdk_nama_bendahara_id = p_bendahara.pgw_id
       LEFT JOIN pegawai p_pejabat_pengadaan ON md.mdk_nama_pejabat_pengadaan_id = p_pejabat_pengadaan.pgw_id
       LEFT JOIN perusahaan p_sh ON md.mdk_nama_perusahaan_id = p_sh.psh_id
       LEFT JOIN bidang b ON md.mdk_bidang_id = b.bdg_id
       WHERE md.mdk_id = ? AND md.mdk_deleted_at IS NULL 
       LIMIT 1`,[a]);return c&&0!==c.length?c[0]:null}static async insert(a){await (0,b.initDatabase)();let[c]=await b.default.query(`INSERT INTO master_dokumen (
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
        mdk_keterangan, mdk_apbd, mdk_no_dpa, 
        mdk_created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,[a.mdk_nama_pejabat_id??0,a.mdk_bidang_id??0,a.mdk_pagu_anggaran??0,a.mdk_nama_pejabat_pengadaan_id??0,a.mdk_nama_pptk_id??0,a.mdk_nama_bendahara_id??0,a.mdk_nama_perusahaan_id??0,a.mdk_nama_pimpinan_perusahaan??"",a.mdk_pekerjaan??"",a.mdk_jabatan_pimpinan_perusahaan??"",a.mdk_alamat??"",a.mdk_program??"",a.mdk_kode_program??"",a.mdk_kegiatan??"",a.mdk_kode_kegiatan??"",a.mdk_sub_kegiatan??"",a.mdk_kode_sub_kegiatan??"",a.mdk_uraian_belanja??"",a.mdk_rekening_belanja??"",a.mdk_kode_level1??"",a.mdk_nama_level1??"",a.mdk_kode_level2??"",a.mdk_nama_level2??"",a.mdk_kode_level3??"",a.mdk_nama_level3??"",a.mdk_kode_level4??"",a.mdk_nama_level4??"",a.mdk_kode_level5??"",a.mdk_nama_level5??"",a.mdk_keterangan??"",a.mdk_apbd??"",a.mdk_no_dpa??"",a.mdk_volume??"",a.mdk_satuan??"",a.mdk_created_by??null]);return c.insertId}static async update(a){await (0,b.initDatabase)();let[c]=await b.default.query(`UPDATE master_dokumen 
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
       WHERE mdk_id = ? AND mdk_deleted_at IS NULL`,[a.mdk_nama_pejabat_id??0,a.mdk_bidang_id??0,a.mdk_pagu_anggaran??0,a.mdk_nama_pejabat_pengadaan_id??0,a.mdk_nama_pptk_id??0,a.mdk_nama_bendahara_id??0,a.mdk_nama_perusahaan_id??0,a.mdk_nama_pimpinan_perusahaan??"",a.mdk_jabatan_pimpinan_perusahaan??"",a.mdk_pekerjaan??"",a.mdk_alamat??"",a.mdk_program??"",a.mdk_kode_program??"",a.mdk_kegiatan??"",a.mdk_kode_kegiatan??"",a.mdk_sub_kegiatan??"",a.mdk_kode_sub_kegiatan??"",a.mdk_uraian_belanja??"",a.mdk_rekening_belanja??"",a.mdk_kode_level1??"",a.mdk_nama_level1??"",a.mdk_kode_level2??"",a.mdk_nama_level2??"",a.mdk_kode_level3??"",a.mdk_nama_level3??"",a.mdk_kode_level4??"",a.mdk_nama_level4??"",a.mdk_kode_level5??"",a.mdk_nama_level5??"",a.mdk_keterangan??"",a.mdk_apbd??"",a.mdk_no_dpa??"",a.mdk_volume??"",a.mdk_satuan??"",a.mdk_updated_by??null,a.mdk_id]);return c.affectedRows>0}static async softDelete(a,c){await (0,b.initDatabase)();let[d]=await b.default.query(`UPDATE master_dokumen 
       SET mdk_deleted_at = NOW(), mdk_deleted_by = ?
       WHERE mdk_id = ? AND mdk_deleted_at IS NULL`,[c??null,a]);return d.affectedRows>0}}a.s(["MasterDokumenRepository",()=>c],3334);class d{static async getList(a="",b=1,d=10){let e=Math.max(1,b),f=Math.max(1,Math.min(100,d)),{data:g,total:h}=await c.findMany(a,f,(e-1)*f),i=Math.ceil(h/f)||1;return{data:g,total:h,page:e,limit:f,totalPages:i}}static async getById(a){let b=await c.findById(a);if(!b)throw Error("Data Master Dokumen tidak ditemukan.");return b}static async create(a){return await c.insert(a)}static async update(a){if(!await c.findById(a.mdk_id))throw Error("Data Master Dokumen tidak ditemukan.");return await c.update(a)}static async delete(a,b){if(!await c.findById(a))throw Error("Data Master Dokumen tidak ditemukan.");return await c.softDelete(a,b)}}a.s(["MasterDokumenService",()=>d],79045)},31085,a=>{"use strict";var b=a.i(61469);class c{static async findMany(a="",c=10,d=0){await (0,b.initDatabase)();let e="WHERE s.rab_deleted_at IS NULL",f=[];if(a.trim()){e+=" AND (s.rab_uraian_pekerjaan LIKE ? OR m.mdk_uraian_belanja LIKE ? OR m.mdk_no_dpa LIKE ?)";let b=`%${a.trim()}%`;f.push(b,b,b)}let[g]=await b.default.query(`SELECT COUNT(*) as total 
       FROM detail_rencana_anggaran_biaya s
       LEFT JOIN master_dokumen m ON s.rab_master_dokumen_id = m.mdk_id 
       ${e}`,f),h=g[0]?.total||0,i=[...f,Number(c),Number(d)],[j]=await b.default.query(`SELECT s.rab_id, s.rab_master_dokumen_id, s.rab_uraian_pekerjaan, s.rab_volume, s.rab_waktu, s.rab_harga_satuan, s.rab_harga_perkiraan_sendiri, s.rab_created_at,
              m.mdk_uraian_belanja, m.mdk_no_dpa, b.bdg_nama AS mdk_bagian, b.bdg_nama, m.mdk_pagu_anggaran
       FROM detail_rencana_anggaran_biaya s
       LEFT JOIN master_dokumen m ON s.rab_master_dokumen_id = m.mdk_id
       LEFT JOIN bidang b ON m.mdk_bidang_id = b.bdg_id
       ${e} 
       ORDER BY s.rab_id DESC 
       LIMIT ? OFFSET ?`,i);return{data:j,total:h}}static async findByMasterDokumenId(a){await (0,b.initDatabase)();let[c]=await b.default.query(`SELECT rab_id, rab_master_dokumen_id, rab_uraian_pekerjaan, rab_volume, rab_waktu, rab_harga_satuan, rab_harga_perkiraan_sendiri, rab_created_at 
       FROM detail_rencana_anggaran_biaya 
       WHERE rab_master_dokumen_id = ? AND rab_deleted_at IS NULL 
       ORDER BY rab_id ASC`,[a]);return c}static async findById(a){await (0,b.initDatabase)();let[c]=await b.default.query(`SELECT rab_id, rab_master_dokumen_id, rab_uraian_pekerjaan, rab_volume, rab_waktu, rab_harga_satuan, rab_harga_perkiraan_sendiri, rab_created_at 
       FROM detail_rencana_anggaran_biaya 
       WHERE rab_id = ? AND rab_deleted_at IS NULL 
       LIMIT 1`,[a]);return c&&0!==c.length?c[0]:null}static async saveBatch(a,c,d){await (0,b.initDatabase)();let e=await b.default.getConnection();try{for(let b of(await e.beginTransaction(),await e.query(`UPDATE detail_rencana_anggaran_biaya 
         SET rab_deleted_at = NOW(), rab_deleted_by = ? 
         WHERE rab_master_dokumen_id = ? AND rab_deleted_at IS NULL`,[d??null,a]),c))b.rab_uraian_pekerjaan.trim()&&await e.query(`INSERT INTO detail_rencana_anggaran_biaya (rab_master_dokumen_id, rab_uraian_pekerjaan, rab_volume, rab_waktu, rab_harga_satuan, rab_harga_perkiraan_sendiri, rab_created_by) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,[a,b.rab_uraian_pekerjaan.trim(),b.rab_volume.trim(),b.rab_waktu.trim(),Number(b.rab_harga_satuan)||0,Number(b.rab_harga_perkiraan_sendiri)||0,d??null]);return await e.commit(),!0}catch(a){throw await e.rollback(),a}finally{e.release()}}static async insert(a){await (0,b.initDatabase)();let[c]=await b.default.query(`INSERT INTO detail_rencana_anggaran_biaya (rab_master_dokumen_id, rab_uraian_pekerjaan, rab_volume, rab_waktu, rab_harga_satuan, rab_harga_perkiraan_sendiri, rab_created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,[a.rab_master_dokumen_id,a.rab_uraian_pekerjaan,a.rab_volume,a.rab_waktu,a.rab_harga_satuan,a.rab_harga_perkiraan_sendiri,a.rab_created_by??null]);return c.insertId}static async update(a){await (0,b.initDatabase)();let[c]=await b.default.query(`UPDATE detail_rencana_anggaran_biaya 
       SET rab_master_dokumen_id = ?, rab_uraian_pekerjaan = ?, rab_volume = ?, rab_waktu = ?, rab_harga_satuan = ?, rab_harga_perkiraan_sendiri = ?, rab_updated_by = ?, rab_updated_at = NOW() 
       WHERE rab_id = ? AND rab_deleted_at IS NULL`,[a.rab_master_dokumen_id,a.rab_uraian_pekerjaan,a.rab_volume,a.rab_waktu,a.rab_harga_satuan,a.rab_harga_perkiraan_sendiri,a.rab_updated_by??null,a.rab_id]);return c.affectedRows>0}static async softDelete(a,c){await (0,b.initDatabase)();let[d]=await b.default.query(`UPDATE detail_rencana_anggaran_biaya 
       SET rab_deleted_at = NOW(), rab_deleted_by = ?
       WHERE rab_id = ? AND rab_deleted_at IS NULL`,[c??null,a]);return d.affectedRows>0}}class d{static async getList(a="",b=1,d=10){let e=Math.max(1,b),f=Math.max(1,Math.min(100,d)),{data:g,total:h}=await c.findMany(a,f,(e-1)*f),i=Math.ceil(h/f)||1;return{data:g,total:h,page:e,limit:f,totalPages:i}}static async getByMasterDokumenId(a){return!a||a<=0?[]:await c.findByMasterDokumenId(a)}static async saveBatch(a,b,d){if(!a||a<=0)throw Error("Master Dokumen ID tidak valid.");return await c.saveBatch(a,b,d)}static async getById(a){let b=await c.findById(a);if(!b)throw Error("Data RencanaAnggaranBiaya tidak ditemukan.");return b}static async create(a){return await c.insert(a)}static async update(a){if(!await c.findById(a.rab_id))throw Error("Data RencanaAnggaranBiaya tidak ditemukan.");return await c.update(a)}static async delete(a,b){if(!await c.findById(a))throw Error("Data RencanaAnggaranBiaya tidak ditemukan.");return await c.softDelete(a,b)}}a.s(["RencanaAnggaranBiayaService",()=>d],31085)},58487,a=>{"use strict";var b=a.i(37936),c=a.i(18558),d=a.i(5246),e=a.i(95289),f=a.i(61469),g=a.i(3334);class h{static async findByMasterDokumenId(a){await (0,f.initDatabase)();let[b]=await f.default.query("SELECT * FROM faktur WHERE fak_master_dokumen_id = ? AND fak_deleted_at IS NULL ORDER BY fak_id DESC LIMIT 1",[a]);return b.length>0?b[0]:null}static async upsert(a,b){await (0,f.initDatabase)();let c=await this.findByMasterDokumenId(a.fak_master_dokumen_id),d=a.fak_tanggal_faktur?new Date(a.fak_tanggal_faktur):null;if(c)return await f.default.query(`UPDATE faktur SET
          fak_nomor_faktur = ?,
          fak_tanggal_faktur = ?,
          fak_updated_by = ?,
          fak_updated_at = NOW()
         WHERE fak_id = ?`,[a.fak_nomor_faktur??null,d,b??null,c.fak_id]),c.fak_id;{let[c]=await f.default.query(`INSERT INTO faktur
          (fak_master_dokumen_id, fak_nomor_faktur, fak_tanggal_faktur, fak_created_by)
         VALUES (?, ?, ?, ?)`,[a.fak_master_dokumen_id,a.fak_nomor_faktur??null,d,b??null]);return c.insertId}}}class i{static async findMany(a="",b=10,c=0){await (0,f.initDatabase)();let d="WHERE s.fkt_deleted_at IS NULL",e=[];if(a.trim()){d+=" AND (s.fkt_jenis_spesifikasi LIKE ? OR m.mdk_uraian_belanja LIKE ? OR m.mdk_no_dpa LIKE ?)";let b=`%${a.trim()}%`;e.push(b,b,b)}let[g]=await f.default.query(`SELECT COUNT(*) as total 
       FROM detail_faktur s
       LEFT JOIN master_dokumen m ON s.fkt_master_dokumen_id = m.mdk_id 
       ${d}`,e),h=g[0]?.total||0,i=[...e,Number(b),Number(c)],[j]=await f.default.query(`SELECT s.fkt_id, s.fkt_faktur_id, s.fkt_master_dokumen_id, s.fkt_jenis_spesifikasi, s.fkt_unit, s.fkt_hari, s.fkt_harga_satuan, s.fkt_total, s.fkt_created_at,
              m.mdk_uraian_belanja, m.mdk_no_dpa, b.bdg_nama AS mdk_bagian, b.bdg_nama, m.mdk_pagu_anggaran
       FROM detail_faktur s
       LEFT JOIN master_dokumen m ON s.fkt_master_dokumen_id = m.mdk_id
       LEFT JOIN bidang b ON m.mdk_bidang_id = b.bdg_id
       ${d} 
       ORDER BY s.fkt_id DESC 
       LIMIT ? OFFSET ?`,i);return{data:j,total:h}}static async findByMasterDokumenId(a){await (0,f.initDatabase)();let[b]=await f.default.query(`SELECT fkt_id, fkt_faktur_id, fkt_master_dokumen_id, fkt_jenis_spesifikasi, fkt_unit, fkt_hari, fkt_harga_satuan, fkt_total, fkt_created_at 
       FROM detail_faktur 
       WHERE fkt_master_dokumen_id = ? AND fkt_deleted_at IS NULL 
       ORDER BY fkt_id ASC`,[a]);return b}static async findFakturWithDetailsByMasterDokumenId(a){await (0,f.initDatabase)();let b=await g.MasterDokumenRepository.findById(a);return{header:await h.findByMasterDokumenId(a),details:await this.findByMasterDokumenId(a),masterDokumen:b}}static async findById(a){await (0,f.initDatabase)();let[b]=await f.default.query(`SELECT fkt_id, fkt_faktur_id, fkt_master_dokumen_id, fkt_jenis_spesifikasi, fkt_unit, fkt_hari, fkt_harga_satuan, fkt_total, fkt_created_at 
       FROM detail_faktur 
       WHERE fkt_id = ? AND fkt_deleted_at IS NULL 
       LIMIT 1`,[a]);return b&&0!==b.length?b[0]:null}static async saveBatch(a,b){await (0,f.initDatabase)();let c=await f.default.getConnection();try{let d;await c.beginTransaction();let{fkt_master_dokumen_id:e,fak_nomor_faktur:f=null,fak_tanggal_faktur:g=null,items:h}=a,[i]=await c.query("SELECT fak_id FROM faktur WHERE fak_master_dokumen_id = ? AND fak_deleted_at IS NULL LIMIT 1",[e]),j=g?new Date(g):null;if(i&&i.length>0)d=i[0].fak_id,await c.query("UPDATE faktur SET fak_nomor_faktur = ?, fak_tanggal_faktur = ?, fak_updated_by = ?, fak_updated_at = NOW() WHERE fak_id = ?",[f,j,b??null,d]);else{let[a]=await c.query("INSERT INTO faktur (fak_master_dokumen_id, fak_nomor_faktur, fak_tanggal_faktur, fak_created_by) VALUES (?, ?, ?, ?)",[e,f,j,b??null]);d=a.insertId}for(let a of(await c.query(`UPDATE detail_faktur 
         SET fkt_deleted_at = NOW(), fkt_deleted_by = ? 
         WHERE fkt_master_dokumen_id = ? AND fkt_deleted_at IS NULL`,[b??null,e]),h))a.fkt_jenis_spesifikasi.trim()&&await c.query(`INSERT INTO detail_faktur (fkt_faktur_id, fkt_master_dokumen_id, fkt_jenis_spesifikasi, fkt_unit, fkt_hari, fkt_harga_satuan, fkt_total, fkt_created_by) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,[d,e,a.fkt_jenis_spesifikasi.trim(),Number(a.fkt_unit)||0,a.fkt_hari??"",Number(a.fkt_harga_satuan)||0,Number(a.fkt_total)||0,b??null]);return await c.commit(),!0}catch(a){throw await c.rollback(),a}finally{c.release()}}static async insert(a){await (0,f.initDatabase)();let[b]=await f.default.query(`INSERT INTO detail_faktur (fkt_faktur_id, fkt_master_dokumen_id, fkt_jenis_spesifikasi, fkt_unit, fkt_hari, fkt_harga_satuan, fkt_total, fkt_created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,[a.fkt_faktur_id??null,a.fkt_master_dokumen_id,a.fkt_jenis_spesifikasi,a.fkt_unit,a.fkt_hari,a.fkt_harga_satuan,a.fkt_total,a.fkt_created_by??null]);return b.insertId}static async update(a){await (0,f.initDatabase)();let[b]=await f.default.query(`UPDATE detail_faktur 
       SET fkt_faktur_id = ?, fkt_master_dokumen_id = ?, fkt_jenis_spesifikasi = ?, fkt_unit = ?, fkt_hari = ?, fkt_harga_satuan = ?, fkt_total = ?, fkt_updated_by = ?, fkt_updated_at = NOW() 
       WHERE fkt_id = ? AND fkt_deleted_at IS NULL`,[a.fkt_faktur_id??null,a.fkt_master_dokumen_id,a.fkt_jenis_spesifikasi,a.fkt_unit,a.fkt_hari,a.fkt_harga_satuan,a.fkt_total,a.fkt_updated_by??null,a.fkt_id]);return b.affectedRows>0}static async softDelete(a,b){await (0,f.initDatabase)();let[c]=await f.default.query(`UPDATE detail_faktur 
       SET fkt_deleted_at = NOW(), fkt_deleted_by = ?
       WHERE fkt_id = ? AND fkt_deleted_at IS NULL`,[b??null,a]);return c.affectedRows>0}}class j{static async getList(a="",b=1,c=10){let d=Math.max(1,b),e=Math.max(1,Math.min(100,c)),{data:f,total:g}=await i.findMany(a,e,(d-1)*e),h=Math.ceil(g/e)||1;return{data:f,total:g,page:d,limit:e,totalPages:h}}static async getByMasterDokumenId(a){return!a||a<=0?[]:await i.findByMasterDokumenId(a)}static async getFakturWithDetailsByMasterDokumenId(a){return!a||a<=0?{header:null,details:[]}:await i.findFakturWithDetailsByMasterDokumenId(a)}static async saveBatch(a,b){if(!a.fkt_master_dokumen_id||a.fkt_master_dokumen_id<=0)throw Error("Master Dokumen ID tidak valid.");return await i.saveBatch(a,b)}static async getById(a){let b=await i.findById(a);if(!b)throw Error("Data Faktur tidak ditemukan.");return b}static async create(a){return await i.insert(a)}static async update(a){if(!await i.findById(a.fkt_id))throw Error("Data Faktur tidak ditemukan.");return await i.update(a)}static async delete(a,b){if(!await i.findById(a))throw Error("Data Faktur tidak ditemukan.");return await i.softDelete(a,b)}}var k=a.i(79045),l=a.i(31085),m=a.i(53112);let n=m.z.object({fkt_id:m.z.coerce.number().optional(),fkt_jenis_spesifikasi:m.z.string().min(1,"Jenis dan Spesifikasi Barang wajib diisi"),fkt_unit:m.z.coerce.number().min(0,"Unit tidak boleh negatif"),fkt_hari:m.z.coerce.string().max(200).default(""),fkt_harga_satuan:m.z.coerce.number().min(0,"Harga satuan tidak boleh negatif"),fkt_total:m.z.coerce.number().min(0,"Total tidak boleh negatif")}),o=m.z.object({fkt_master_dokumen_id:m.z.coerce.number().positive("Pilih Master Dokumen yang valid"),fak_nomor_faktur:m.z.string().optional().nullable(),fak_tanggal_faktur:m.z.string().optional().nullable(),items:m.z.array(n)});async function p(){try{let a=await (0,d.cookies)(),b=a.get("token")?.value;if(!b)return null;let c=await (0,e.verifyToken)(b);return c?c.pgw_id:null}catch{return null}}async function q(){try{let a=await k.MasterDokumenService.getList("",1,100);return{success:!0,message:"Berhasil mengambil opsi Master Dokumen",data:a.data}}catch(a){return{success:!1,message:a.message||"Gagal mengambil opsi Master Dokumen",data:[]}}}async function r(a){try{let b=await j.getByMasterDokumenId(a);return{success:!0,message:"Berhasil mengambil data Faktur",data:b}}catch(a){return{success:!1,message:a.message||"Gagal mengambil data Faktur",data:[]}}}async function s(a){try{let b=await j.getFakturWithDetailsByMasterDokumenId(a);return{success:!0,message:"Berhasil mengambil data Faktur beserta rincian.",data:b}}catch(a){return{success:!1,message:a.message||"Gagal mengambil data Faktur",data:{header:null,details:[]}}}}async function t(a){try{let b=await l.RencanaAnggaranBiayaService.getByMasterDokumenId(a);return{success:!0,message:"Berhasil mengambil data Rencana Anggaran Biaya",data:b}}catch(a){return{success:!1,message:a.message||"Gagal mengambil data Rencana Anggaran Biaya",data:[]}}}async function u(a){try{let b=o.safeParse(a);if(!b.success)return{success:!1,message:"Validasi gagal, silakan periksa kelengkapan input.",errors:b.error.flatten().fieldErrors};let d=await p();return await j.saveBatch({fkt_master_dokumen_id:b.data.fkt_master_dokumen_id,fak_nomor_faktur:b.data.fak_nomor_faktur,fak_tanggal_faktur:b.data.fak_tanggal_faktur,items:b.data.items},d),(0,c.revalidatePath)("/faktur"),(0,c.revalidatePath)(`/master-dokumen/${b.data.fkt_master_dokumen_id}`),{success:!0,message:"Berhasil menyimpan data Faktur!"}}catch(a){return{success:!1,message:a.message||"Gagal menyimpan data Faktur"}}}async function v(a="",b=1,c=10){try{let d=await j.getList(a,b,c);return{success:!0,message:"Berhasil mengambil data Faktur",data:d}}catch(a){return{success:!1,message:a.message||"Gagal mengambil data Faktur"}}}async function w(a){try{if(!a||a<=0)return{success:!1,message:"ID Faktur tidak valid."};let b=await p();return await j.delete(a,b),(0,c.revalidatePath)("/faktur"),{success:!0,message:"Berhasil menghapus Faktur."}}catch(a){return{success:!1,message:a.message||"Gagal menghapus Faktur"}}}m.z.object({fkt_master_dokumen_id:m.z.coerce.number().positive(),fkt_jenis_spesifikasi:m.z.string().min(1,"Jenis dan Spesifikasi Barang wajib diisi"),fkt_unit:m.z.coerce.number().min(0),fkt_hari:m.z.coerce.string().max(200).default(""),fkt_harga_satuan:m.z.coerce.number().min(0),fkt_total:m.z.coerce.number().min(0)}),m.z.object({fkt_id:m.z.coerce.number().positive(),fkt_master_dokumen_id:m.z.coerce.number().positive(),fkt_jenis_spesifikasi:m.z.string().min(1,"Jenis dan Spesifikasi Barang wajib diisi"),fkt_unit:m.z.coerce.number().min(0),fkt_hari:m.z.coerce.string().max(200).default(""),fkt_harga_satuan:m.z.coerce.number().min(0),fkt_total:m.z.coerce.number().min(0)}),(0,a.i(13095).ensureServerEntryExports)([q,r,s,t,u,v,w]),(0,b.registerServerReference)(q,"00db1dd02b5c5b7fcb8e7071091f4fac3d2e15b2bb",null),(0,b.registerServerReference)(r,"4067ad0e2ca085a00130b013fc2d21ef269f050249",null),(0,b.registerServerReference)(s,"400a3927d19fbb63a84ec40aeaa55a6402ce2dc325",null),(0,b.registerServerReference)(t,"4083c6fe4e3d53c2a9c59c930c07a9d00aab512ea2",null),(0,b.registerServerReference)(u,"401648bb209d15d27f35acf0133399aee94d821ccb",null),(0,b.registerServerReference)(v,"708722cce90b9e8c15a0dea28ad9d72bd657da6436",null),(0,b.registerServerReference)(w,"40251fb74ca977dc28dd77d20909f3ef97db67da4c",null),a.s(["getFakturWithDetailsAction",()=>s,"getMasterDokumenOptionsAction",()=>q,"getRencanaAnggaranBiayaByMasterDokumenAction",()=>t,"saveFakturBatchAction",()=>u],58487)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__309d5eda._.js.map