module.exports=[115,(a,b,c)=>{b.exports=a.x("mysql2-3d80281e5ed34ca6/promise",()=>require("mysql2-3d80281e5ed34ca6/promise"))},54799,(a,b,c)=>{b.exports=a.x("crypto",()=>require("crypto"))},37936,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"registerServerReference",{enumerable:!0,get:function(){return d.registerServerReference}});let d=a.r(11857)},13095,(a,b,c)=>{"use strict";function d(a){for(let b=0;b<a.length;b++){let c=a[b];if("function"!=typeof c)throw Object.defineProperty(Error(`A "use server" file can only export async functions, found ${typeof c}.
Read more: https://nextjs.org/docs/messages/invalid-use-server-value`),"__NEXT_ERROR_CODE",{value:"E352",enumerable:!1,configurable:!0})}}Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"ensureServerEntryExports",{enumerable:!0,get:function(){return d}})},39325,a=>{"use strict";var b=a.i(61469);let c=["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];class d{static async getDashboardData(){await (0,b.initDatabase)();let a=new Date().getFullYear(),[[d],[e],[f],[g],[h],[i],[j],[k],[l]]=await Promise.all([b.default.query(`SELECT COALESCE(SUM(mdk_pagu_anggaran), 0) AS total_pagu, COUNT(*) AS total_dokumen 
         FROM master_dokumen 
         WHERE mdk_deleted_at IS NULL`),b.default.query(`SELECT COALESCE(SUM(dpd_saatini_pembayaran), 0) AS total_realisasi 
         FROM nota_pencairan_dana 
         WHERE dpd_deleted_at IS NULL`),b.default.query(`SELECT COALESCE(SUM(CAST(kwt_uang_sejumlah AS DECIMAL(18,2))), 0) AS total_kwitansi 
         FROM kwitansi 
         WHERE kwt_deleted_at IS NULL`),b.default.query("SELECT COUNT(*) AS total_bidang FROM bidang WHERE bdg_deleted_at IS NULL"),b.default.query("SELECT COUNT(*) AS total_perusahaan FROM perusahaan WHERE psh_deleted_at IS NULL"),b.default.query("SELECT COUNT(*) AS total_pegawai FROM pegawai WHERE pgw_deleted_at IS NULL"),b.default.query(`SELECT 
           b.bdg_id, 
           b.bdg_nama, 
           COALESCE(SUM(md.mdk_pagu_anggaran), 0) AS total_pagu,
           COUNT(md.mdk_id) AS total_dokumen
         FROM bidang b
         LEFT JOIN master_dokumen md ON md.mdk_bidang_id = b.bdg_id AND md.mdk_deleted_at IS NULL
         WHERE b.bdg_deleted_at IS NULL
         GROUP BY b.bdg_id, b.bdg_nama
         ORDER BY total_pagu DESC`),b.default.query(`SELECT 
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
         LIMIT 6`),b.default.query(`SELECT 
           MONTH(mdk_created_at) AS bulan,
           COALESCE(SUM(mdk_pagu_anggaran), 0) AS total_pagu,
           COUNT(*) AS total_dokumen
         FROM master_dokumen
         WHERE mdk_deleted_at IS NULL AND YEAR(mdk_created_at) = ?
         GROUP BY MONTH(mdk_created_at)
         ORDER BY bulan ASC`,[a])]),m=Number(d[0]?.total_pagu||0),n=Number(d[0]?.total_dokumen||0),o=Math.max(Number(e[0]?.total_realisasi||0),Number(f[0]?.total_kwitansi||0)),p=Number(g[0]?.total_bidang||0),q=Number(h[0]?.total_perusahaan||0),r=Number(i[0]?.total_pegawai||0),s=0,t=0,u=j.map(a=>{let b=Number(a.total_pagu||0),c=Number(a.total_dokumen||0);s+=b,t+=c;let d=m>0?Number((b/m*100).toFixed(1)):0;return{bdg_id:a.bdg_id,bdg_nama:a.bdg_nama||"Tidak Ditentukan",total_pagu:b,total_dokumen:c,persentase:d}}),v=m-s,w=n-t;if(w>0||v>0){let a=m>0?Number((Math.max(0,v)/m*100).toFixed(1)):0;u.push({bdg_id:0,bdg_nama:"Lainnya / Belum Ditentukan",total_pagu:Math.max(0,v),total_dokumen:Math.max(0,w),persentase:a})}let x=k.map(a=>({mdk_id:a.mdk_id,mdk_no_dpa:a.mdk_no_dpa||"-",mdk_program:a.mdk_program||"-",mdk_kegiatan:a.mdk_kegiatan||"-",mdk_pagu_anggaran:Number(a.mdk_pagu_anggaran||0),mdk_created_at:a.mdk_created_at,bdg_nama:a.bdg_nama})),y=new Map;return l.forEach(a=>{y.set(Number(a.bulan),{total_pagu:Number(a.total_pagu||0),total_dokumen:Number(a.total_dokumen||0)})}),{summary:{totalPagu:m,totalDokumen:n,totalRealisasi:o,totalBidang:p,totalPerusahaan:q,totalPegawai:r},paguPerBidang:u,recentDokumen:x,monthlyTrend:Array.from({length:12},(a,b)=>{let d=b+1,e=y.get(d)||{total_pagu:0,total_dokumen:0};return{bulan:d,nama_bulan:c[b],total_pagu:e.total_pagu,total_dokumen:e.total_dokumen}})}}static async getDokumenByBidang(a){await (0,b.initDatabase)();let c=`
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
    `,d=[];a>0?(c+=" AND md.mdk_bidang_id = ?",d.push(a)):0===a&&(c+=" AND (md.mdk_bidang_id IS NULL OR md.mdk_bidang_id = 0 OR b.bdg_id IS NULL)"),c+=" ORDER BY md.mdk_id DESC";let[e]=await b.default.query(c,d);return e.map(a=>({mdk_id:a.mdk_id,mdk_no_dpa:a.mdk_no_dpa||"-",mdk_uraian_belanja:a.mdk_uraian_belanja||"-",mdk_pekerjaan:a.mdk_pekerjaan||"-",mdk_program:a.mdk_program||"-",mdk_kegiatan:a.mdk_kegiatan||"-",mdk_sub_kegiatan:a.mdk_sub_kegiatan||"-",mdk_pagu_anggaran:Number(a.mdk_pagu_anggaran||0),mdk_created_at:a.mdk_created_at,bdg_nama:a.bdg_nama}))}}a.s(["DashboardRepository",()=>d])},51754,a=>{"use strict";var b=a.i(37936),c=a.i(39325);async function d(){try{let a=await c.DashboardRepository.getDashboardData();return{success:!0,message:"Data dashboard berhasil dimuat",data:a}}catch(a){return console.error("[getDashboardDataAction] Error:",a),{success:!1,message:a.message||"Gagal memuat data dashboard"}}}async function e(a){try{let b=await c.DashboardRepository.getDokumenByBidang(a);return{success:!0,message:"Berhasil memuat rincian dokumen",data:b}}catch(a){return console.error("[getDokumenByBidangAction] Error:",a),{success:!1,message:a.message||"Gagal memuat rincian dokumen"}}}(0,a.i(13095).ensureServerEntryExports)([d,e]),(0,b.registerServerReference)(d,"0090bc00a62504048f53460a527ec7fb7269040ac8",null),(0,b.registerServerReference)(e,"40a54d65ee4ee0a04732ac33f24a557384d01abddb",null),a.s([],72945),a.i(72945),a.s(["0090bc00a62504048f53460a527ec7fb7269040ac8",()=>d,"40a54d65ee4ee0a04732ac33f24a557384d01abddb",()=>e],51754)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__4048f66f._.js.map