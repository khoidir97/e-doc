"use client";

import React, { useEffect, useState, use } from 'react';
import {
  getKerangkaAcuanKerjaByMasterDokumenAction,
  getKerangkaAcuanKerjaByIdAction,
} from '@/features/kerangka-acuan-kerja/actions';
import {
  DetailKakPerkiraanBiaya,
  DetailKakSpesifikasiTeknis,
  KerangkaAcuanKerja,
} from '@/features/kerangka-acuan-kerja/types';
import { MasterDokumen } from '@/features/master-dokumen/types';
import { formatRupiah, terbilang } from '@/lib/terbilang';
import { KopSuratBpkad } from '@/components/common/KopSuratBpkad';

export default function KerangkaAcuanKerjaPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const rawId = resolvedParams.id;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    kak: KerangkaAcuanKerja | null;
    perkiraanBiayaList: DetailKakPerkiraanBiaya[];
    spesifikasiTeknisList: DetailKakSpesifikasiTeknis[];
    masterDokumen: MasterDokumen | null;
  } | null>(null);

  // Editable fields for printing
  const [tanggalSurat, setTanggalSurat] = useState(() => {
    const d = new Date();
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  });

  useEffect(() => {
    async function loadData() {
      if (!rawId) return;
      setLoading(true);

      if (rawId.startsWith('kak-')) {
        const kakId = Number(rawId.replace('kak-', ''));
        const res = await getKerangkaAcuanKerjaByIdAction(kakId);
        if (res.success && res.data) {
          setData({
            kak: res.data.kakDetails.kak,
            perkiraanBiayaList: res.data.kakDetails.perkiraanBiayaList,
            spesifikasiTeknisList: res.data.kakDetails.spesifikasiTeknisList,
            masterDokumen: res.data.masterDokumen,
          });
        }
      } else {
        const numId = Number(rawId);
        // Try by master dokumen first
        const res = await getKerangkaAcuanKerjaByMasterDokumenAction(numId);
        if (res.success && res.data && res.data.kakDetails.kak) {
          setData({
            kak: res.data.kakDetails.kak,
            perkiraanBiayaList: res.data.kakDetails.perkiraanBiayaList,
            spesifikasiTeknisList: res.data.kakDetails.spesifikasiTeknisList,
            masterDokumen: res.data.masterDokumen,
          });
        } else {
          // Fallback: try by kakId
          const resKak = await getKerangkaAcuanKerjaByIdAction(numId);
          if (resKak.success && resKak.data) {
            setData({
              kak: resKak.data.kakDetails.kak,
              perkiraanBiayaList: resKak.data.kakDetails.perkiraanBiayaList,
              spesifikasiTeknisList: resKak.data.kakDetails.spesifikasiTeknisList,
              masterDokumen: resKak.data.masterDokumen,
            });
          }
        }
      }

      setLoading(false);
    }
    loadData();
  }, [rawId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-gray-600">Memuat Dokumen Kerangka Acuan Kerja (KAK)...</p>
        </div>
      </div>
    );
  }

  if (!data || (!data.kak && !data.masterDokumen)) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center text-red-500 font-semibold">
          Dokumen tidak ditemukan atau gagal dimuat.
        </div>
      </div>
    );
  }

  const { kak, perkiraanBiayaList, spesifikasiTeknisList, masterDokumen } = data;

  const namaPekerjaan = kak?.kak_pekerjaan || masterDokumen?.mdk_pekerjaan || masterDokumen?.mdk_uraian_belanja || 'Pengadaan Barang / Jasa';
  const program = kak?.kak_program || masterDokumen?.mdk_program || '-';
  const kegiatan = kak?.kak_kegiatan || masterDokumen?.mdk_kegiatan || '-';
  const subKegiatan = kak?.kak_sub_kegiatan || masterDokumen?.mdk_sub_kegiatan || '-';
  const kodeRekening = kak?.kak_kode_rekening || masterDokumen?.mdk_rekening_belanja || '-';
  const tahunAnggaran = kak?.kak_tahun_anggaran || masterDokumen?.mdk_apbd?.match(/\b(20\d\d)\b/)?.[1] || new Date().getFullYear().toString();

  // Metrics
  const totalBiaya = perkiraanBiayaList.reduce((acc, curr) => acc + (Number(curr.kpb_jumlah) || 0), 0);
  const terbilangText = terbilang(totalBiaya);

  const isPA = masterDokumen?.mdk_jabatan_pejabat?.trim().toUpperCase() === 'PA';
  const labelKpaPpk = isPA ? 'Pengguna Anggaran (PA)' : 'Kuasa Pengguna Anggaran (KPA)';
  const namaPejabat = masterDokumen?.mdk_nama_pejabat || 'DANIEL PERDANA, SE';
  const nipPejabat = masterDokumen?.mdk_nip_pejabat || '197507242001121006';

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 print:py-0 print:bg-white text-black font-serif">
      {/* Floating Control Bar */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 dark:bg-gray-800/90 text-white px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-4 print:hidden">
        <span className="text-xs font-semibold">Cetak Dokumen KAK</span>
        <div className="h-4 w-px bg-gray-700"></div>
        <button
          onClick={() => window.print()}
          className="px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Cetak / Simpan PDF
        </button>
        <button
          onClick={() => window.close()}
          className="px-3.5 py-1.5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold text-xs transition-all cursor-pointer"
        >
          Tutup Tab
        </button>
      </div>

      <style jsx global>{`
        @media print {
          html, body {
            background: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .page-break {
            page-break-before: always;
            break-before: page;
          }
          .page-break-after {
            page-break-after: always;
            break-after: page;
          }
          .avoid-break {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          @page {
            size: A4 portrait;
            margin: 15mm 15mm 15mm 15mm;
          }
        }

        .kak-content ul {
          list-style-type: disc !important;
          margin-left: 1.35rem !important;
          padding-left: 0.2rem !important;
        }
        .kak-content ol {
          list-style-type: decimal !important;
          margin-left: 1.35rem !important;
          padding-left: 0.2rem !important;
        }
        .kak-content p {
          margin-bottom: 0.45rem !important;
          line-height: 1.6 !important;
        }
        .kak-content li {
          margin-bottom: 0.35rem !important;
          line-height: 1.55 !important;
        }
      `}</style>

      {/* ======================================================== */}
      {/* HALAMAN 1: COVER KERANGKA ACUAN KERJA (KAK) / TOR        */}
      {/* ======================================================== */}
      <div className="page-break-after mx-auto max-w-[210mm] min-h-[297mm] bg-white text-black p-8 sm:p-12 shadow-xl print:shadow-none print:m-0 print:p-0 flex flex-col justify-between">
        {/* Outer Double Frame matching PDF cover */}
        <div className="border-4 border-double border-black p-6 sm:p-8 flex-1 flex flex-col justify-between">
          {/* Top: Kop Surat BPKAD */}
          <KopSuratBpkad />

          {/* Middle: Title */}
          <div className="text-center my-12 space-y-1">
            <h1 className="font-extrabold text-xl sm:text-2xl tracking-wide uppercase">
              KERANGKA ACUAN KERJA (KAK)
            </h1>
            <p className="font-semibold text-base sm:text-lg italic tracking-wider">
              Term Of Reference (TOR)
            </p>
          </div>

          {/* Bottom: Metadata Table */}
          <div className="my-8 pl-4 sm:pl-8">
            <table className="w-full text-[13px] border-collapse leading-relaxed">
              <tbody>
                <tr>
                  <td className="w-40 py-2 align-top font-bold">SKPD</td>
                  <td className="w-4 py-2 align-top text-center font-bold">:</td>
                  <td className="py-2 align-top font-bold">
                    Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru
                  </td>
                </tr>
                <tr>
                  <td className="py-2 align-top font-bold">Program</td>
                  <td className="py-2 align-top text-center font-bold">:</td>
                  <td className="py-2 align-top font-bold">{program}</td>
                </tr>
                <tr>
                  <td className="py-2 align-top font-bold">Kegiatan</td>
                  <td className="py-2 align-top text-center font-bold">:</td>
                  <td className="py-2 align-top font-bold">{kegiatan}</td>
                </tr>
                <tr>
                  <td className="py-2 align-top font-bold">Sub Kegiatan</td>
                  <td className="py-2 align-top text-center font-bold">:</td>
                  <td className="py-2 align-top font-bold">{subKegiatan}</td>
                </tr>
                <tr>
                  <td className="py-2 align-top font-bold">Pekerjaan</td>
                  <td className="py-2 align-top text-center font-bold">:</td>
                  <td className="py-2 align-top font-bold">{namaPekerjaan}</td>
                </tr>
                <tr>
                  <td className="py-2 align-top font-bold">Kode Rekening</td>
                  <td className="py-2 align-top text-center font-bold">:</td>
                  <td className="py-2 align-top font-mono font-bold">
                    {kodeRekening}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 align-top font-bold">Tahun Anggaran</td>
                  <td className="py-2 align-top text-center font-bold">:</td>
                  <td className="py-2 align-top font-bold">{tahunAnggaran}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Decorative Bottom Spacing */}
          <div className="h-6"></div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* HALAMAN 2 DST: ISI KERANGKA ACUAN KERJA (12 POIN)        */}
      {/* ======================================================== */}
      <div className="mx-auto max-w-[210mm] bg-white text-black p-8 sm:p-12 shadow-xl print:shadow-none print:m-0 print:p-0 leading-relaxed text-[12px] mt-8 print:mt-0">
        {/* Header Isi KAK */}
        <div className="text-center mb-6">
          <h2 className="font-extrabold text-sm sm:text-base tracking-wider uppercase">
            KERANGKA ACUAN KERJA (KAK)
          </h2>
          <h3 className="font-extrabold text-sm uppercase">PENGADAAN BARANG</h3>
          <p className="font-bold text-xs uppercase mt-0.5">
            PEKERJAAN : {namaPekerjaan}
          </p>
        </div>

        {/* 12 Sections in Clean 3-Column Table Format matching the PDF */}
        <table className="w-full border-collapse text-[12px]">
          <tbody>
            {/* 1. LATAR BELAKANG */}
            <tr className="avoid-break">
              <td className="w-44 py-2 align-top font-bold uppercase tracking-tight">
                1. LATAR BELAKANG
              </td>
              <td className="w-4 py-2 align-top text-center font-bold">:</td>
              <td className="py-2 align-top text-justify leading-relaxed kak-content">
                <div dangerouslySetInnerHTML={{ __html: kak?.kak_latar_belakang || '-' }} />
              </td>
            </tr>

            {/* 2. MAKSUD DAN TUJUAN */}
            <tr className="avoid-break">
              <td className="py-2 align-top font-bold uppercase tracking-tight">
                2. MAKSUD DAN TUJUAN
              </td>
              <td className="py-2 align-top text-center font-bold">:</td>
              <td className="py-2 align-top text-justify leading-relaxed kak-content">
                <div dangerouslySetInnerHTML={{ __html: kak?.kak_maksud_dan_tujuan || '-' }} />
              </td>
            </tr>

            {/* 3. REFERENSI HUKUM */}
            <tr className="avoid-break">
              <td className="py-2 align-top font-bold uppercase tracking-tight">
                3. REFERENSI HUKUM
              </td>
              <td className="py-2 align-top text-center font-bold">:</td>
              <td className="py-2 align-top text-justify leading-relaxed kak-content">
                <div dangerouslySetInnerHTML={{ __html: kak?.kak_referensi_hukum || '-' }} />
              </td>
            </tr>

            {/* 4. TARGET / SASARAN */}
            <tr className="avoid-break">
              <td className="py-2 align-top font-bold uppercase tracking-tight">
                4. TARGET/ SASARAN
              </td>
              <td className="py-2 align-top text-center font-bold">:</td>
              <td className="py-2 align-top text-justify leading-relaxed kak-content">
                <div dangerouslySetInnerHTML={{ __html: kak?.kak_target_sasaran || '-' }} />
              </td>
            </tr>

            {/* 5. NAMA ORGANISASI PENGADAAN JASA LAINNYA */}
            <tr className="avoid-break">
              <td className="py-2 align-top font-bold uppercase tracking-tight leading-snug">
                5. NAMA ORGANISASI PENGADAAN JASA LAINNYA
              </td>
              <td className="py-2 align-top text-center font-bold">:</td>
              <td className="py-2 align-top text-justify leading-relaxed kak-content">
                <div dangerouslySetInnerHTML={{ __html: kak?.kak_nama_organisasi_dan_pengadaan || '-' }} />
              </td>
            </tr>

            {/* 6. SUMBER DANA DAN PERKIRAAN BIAYA */}
            <tr className="avoid-break">
              <td className="py-2 align-top font-bold uppercase tracking-tight leading-snug">
                6. SUMBER DANA DAN PERKIRAAN BIAYA
              </td>
              <td className="py-2 align-top text-center font-bold">:</td>
              <td className="py-2 align-top text-justify leading-relaxed">
                {/* Intro Teks */}
                <div className="kak-content mb-3" dangerouslySetInnerHTML={{ __html: kak?.kak_sumber_dana_perkiraan_biaya || '-' }} />

                {/* Tabel Perkiraan Biaya */}
                <div className="my-2">
                  <table className="w-full border-collapse border border-black text-[11px]">
                    <thead>
                      <tr className="border-b border-black text-center font-bold bg-gray-50/50">
                        <th className="border border-black px-2 py-1.5 w-10">No</th>
                        <th className="border border-black px-3 py-1.5 text-center">Uraian</th>
                        <th className="border border-black px-2 py-1.5 w-14 text-center">Vol</th>
                        <th className="border border-black px-3 py-1.5 w-28 text-center">Harga</th>
                        <th className="border border-black px-3 py-1.5 w-32 text-center">Jumlah</th>
                      </tr>
                    </thead>
                    <tbody>
                      {perkiraanBiayaList.map((item, idx) => (
                        <tr key={idx} className="border-b border-black">
                          <td className="border border-black px-2 py-1.5 text-center">{idx + 1}</td>
                          <td className="border border-black px-3 py-1.5 leading-snug">{item.kpb_uraian}</td>
                          <td className="border border-black px-2 py-1.5 text-center">{item.kpb_volume}</td>
                          <td className="border border-black px-3 py-1.5 text-right font-mono">
                            {formatRupiah(item.kpb_harga).replace('Rp ', '')}
                          </td>
                          <td className="border border-black px-3 py-1.5 text-right font-mono font-semibold">
                            {formatRupiah(item.kpb_jumlah).replace('Rp ', '')}
                          </td>
                        </tr>
                      ))}
                      {/* TOTAL */}
                      <tr className="font-bold border-t border-black bg-gray-50/50">
                        <td colSpan={4} className="border border-black px-3 py-1.5 text-center uppercase">
                          TOTAL
                        </td>
                        <td className="border border-black px-3 py-1.5 text-right font-mono font-bold">
                          {formatRupiah(totalBiaya).replace('Rp ', '')},-
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="italic font-serif mt-1 text-[11px]">
                  Terbilang : {terbilangText} Rupiah
                </p>
              </td>
            </tr>

            {/* 7. RUANG LINGKUP DAN LOKASI PEKERJAAN */}
            <tr className="avoid-break">
              <td className="py-2 align-top font-bold uppercase tracking-tight leading-snug">
                7. RUANG LINGKUP DAN LOKASI PEKERJAAN
              </td>
              <td className="py-2 align-top text-center font-bold">:</td>
              <td className="py-2 align-top text-justify leading-relaxed kak-content">
                <div dangerouslySetInnerHTML={{ __html: kak?.kak_ruang_lingkup_lokasi_pekerjaan || '-' }} />
              </td>
            </tr>

            {/* 8. JANGKA WAKTU PELAKSANAAN */}
            <tr className="avoid-break">
              <td className="py-2 align-top font-bold uppercase tracking-tight leading-snug">
                8. JANGKA WAKTU PELAKSANAAN
              </td>
              <td className="py-2 align-top text-center font-bold">:</td>
              <td className="py-2 align-top text-justify leading-relaxed kak-content">
                <div dangerouslySetInnerHTML={{ __html: kak?.kak_jangka_waktu_pelaksanaan || '-' }} />
              </td>
            </tr>

            {/* 9. METODA PEMILIHAN */}
            <tr className="avoid-break">
              <td className="py-2 align-top font-bold uppercase tracking-tight leading-snug">
                9. METODA PEMILIHAN
              </td>
              <td className="py-2 align-top text-center font-bold">:</td>
              <td className="py-2 align-top font-normal">
                {kak?.kak_metode_pemilihan || 'e-Purchasing'}
              </td>
            </tr>

            {/* 10. SPESIFIKASI TEKNIS */}
            <tr className="avoid-break">
              <td className="py-2 align-top font-bold uppercase tracking-tight leading-snug">
                10. SPESIFIKASI TEKNIS
              </td>
              <td className="py-2 align-top text-center font-bold">:</td>
              <td className="py-2 align-top text-justify leading-relaxed">
                <table className="w-full border-collapse border border-black text-[11px] my-1">
                  <thead>
                    <tr className="border-b border-black text-center font-bold bg-gray-50/50">
                      <th className="border border-black px-2 py-1.5 w-10">No</th>
                      <th className="border border-black px-3 py-1.5 w-52 text-center">Uraian</th>
                      <th className="border border-black px-3 py-1.5 text-center">Spesifikasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {spesifikasiTeknisList.map((item, idx) => (
                      <tr key={idx} className="border-b border-black">
                        <td className="border border-black px-2 py-2 text-center align-top">{idx + 1}</td>
                        <td className="border border-black px-3 py-2 align-top font-medium leading-snug">
                          {item.kst_uraian}
                        </td>
                        <td className="border border-black px-3 py-2 align-top leading-relaxed whitespace-pre-line">
                          {item.kst_spesifikasi}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>

            {/* 11. PERSYARATAN KUALIFIKASI PENYEDIA */}
            <tr className="avoid-break">
              <td className="py-2 align-top font-bold uppercase tracking-tight leading-snug">
                11. PERSYARATAN KUALIFIKASI PENYEDIA
              </td>
              <td className="py-2 align-top text-center font-bold">:</td>
              <td className="py-2 align-top text-justify leading-relaxed kak-content">
                <div dangerouslySetInnerHTML={{ __html: kak?.kak_persyaratan_kualifikasi_penyedia || '-' }} />
              </td>
            </tr>

            {/* 12. PENUTUP */}
            <tr className="avoid-break">
              <td className="py-2 align-top font-bold uppercase tracking-tight leading-snug">
                12. PENUTUP
              </td>
              <td className="py-2 align-top text-center font-bold">:</td>
              <td className="py-2 align-top text-justify leading-relaxed kak-content">
                <div dangerouslySetInnerHTML={{ __html: kak?.kak_penutup || '-' }} />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Tanda Tangan PPK di Akhir Dokumen */}
        <div className="avoid-break pt-8 flex justify-end">
          <div className="w-80 text-left text-[12px] space-y-1">
            <div className="flex items-center gap-1">
              <span>Pekanbaru,</span>
              <input
                type="text"
                value={tanggalSurat}
                onChange={(e) => setTanggalSurat(e.target.value)}
                className="border-b border-gray-400 focus:outline-none print:border-none print:w-auto font-serif"
              />
            </div>
            <div className="pt-2">
              <p className="font-semibold">{labelKpaPpk}</p>
              <p className="font-normal">Selaku</p>
              <p className="font-semibold">Pejabat Pembuat Komitmen (PPK)</p>
              <p className="font-semibold">BPKAD Kota Pekanbaru</p>
            </div>
            <div className="pt-20">
              <p className="font-bold underline uppercase text-sm">
                {namaPejabat}
              </p>
              <p className="text-[11px] font-mono mt-0.5">
                NIP. {nipPejabat}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

