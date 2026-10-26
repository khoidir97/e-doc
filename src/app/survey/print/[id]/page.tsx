"use client";

import React, { useEffect, useState, use } from 'react';
import { getSurveyWithDetailsAction } from '@/features/survey/actions';
import { SurveyHeader, DetailSurvey } from '@/features/survey/types';
import { formatRupiah } from '@/lib/terbilang';
import { KopSuratBpkad } from '@/components/common/KopSuratBpkad';
import { formatDateIndonesian } from '@/lib/date';

function getDayName(dateStr?: string | null): string {
  if (!dateStr) return '....................';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '....................';
    return d.toLocaleDateString('id-ID', { weekday: 'long' });
  } catch {
    return '....................';
  }
}

export default function SurveyPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const mdkId = Number(resolvedParams.id);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    header: SurveyHeader | null;
    details: DetailSurvey[];
    masterDokumen?: any;
  } | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!mdkId) return;
      setLoading(true);
      const res = await getSurveyWithDetailsAction(mdkId);
      if (res.success && res.data) {
        setData(res.data);
      }
      setLoading(false);
    }
    loadData();
  }, [mdkId]);

  useEffect(() => {
    if (!loading && data) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-gray-600">Memuat Dokumen Survei Harga PDF...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center text-red-500 font-semibold">
          Dokumen tidak ditemukan atau gagal dimuat.
        </div>
      </div>
    );
  }

  const { header, details, masterDokumen } = data;

  const namaKegiatan = header?.srv_nama_kegiatan || masterDokumen?.mdk_kegiatan || masterDokumen?.mdk_uraian_belanja || '-';
  const paketPekerjaan = header?.srv_paket_pekerjaan || masterDokumen?.mdk_uraian_belanja || '-';
  const namaPerusahaan = header?.srv_nama_perusahaan || masterDokumen?.mdk_nama_perusahaan || masterDokumen?.psh_nama || '-';
  const alamatPerusahaan = header?.srv_alamat_perusahaan || masterDokumen?.mdk_alamat || '-';
  const namaPimpinanPerusahaan = masterDokumen?.mdk_nama_pimpinan_perusahaan || '';
  const jabatanPimpinanPerusahaan = masterDokumen?.mdk_jabatan_pimpinan_perusahaan || 'Direktur';

  const tglMulai = header?.srv_tanggal_mulai;
  const tglSelesai = header?.srv_tanggal_selesai;

  let tanggalDisplay = '............................';
  let hariDisplay = '....................';

  if (tglMulai && tglSelesai && tglMulai !== tglSelesai) {
    hariDisplay = `${getDayName(tglMulai)} s.d. ${getDayName(tglSelesai)}`;
    tanggalDisplay = `${formatDateIndonesian(tglMulai)} s/d ${formatDateIndonesian(tglSelesai)}`;
  } else if (tglMulai) {
    hariDisplay = getDayName(tglMulai);
    tanggalDisplay = formatDateIndonesian(tglMulai);
  }

  const totalHargaSurvey = details.reduce((sum, item) => sum + (Number(item.dsrv_harga_survey) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 print:py-0 print:bg-white">
      {/* Floating Control Bar for New Tab Screen View */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 dark:bg-gray-800/90 text-white px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-4 print:hidden">
        <span className="text-xs font-semibold">Berita Acara Survei Harga</span>
        <div className="h-4 w-px bg-gray-700"></div>
        <button
          onClick={() => window.print()}
          className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
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

      {/* Printable Document A4 Container */}
      <div className="mx-auto max-w-[210mm] bg-white text-black p-8 sm:p-12 shadow-xl print:shadow-none print:m-0 print:p-[15mm] font-serif leading-relaxed text-xs">
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
            @page {
              size: A4 portrait;
              margin: 0;
            }
          }
        `}</style>

        {/* Kop Surat BPKAD Kota Pekanbaru */}
        <KopSuratBpkad />

        {/* Judul Dokumen */}
        <div className="text-center my-4">
          <h3 className="font-extrabold text-sm underline tracking-wider uppercase">BERITA ACARA SURVEI HARGA</h3>
          <p className="text-xs font-medium mt-0.5">
            Nomor : {header?.srv_nomor ? header.srv_nomor : '...................................................'}
          </p>
        </div>

        {/* Paragraf Pembuka */}
        <div className="mt-6 space-y-2 text-xs">
          <p className="text-justify leading-relaxed">
            Sehubungan dengan proses pengadaan Barang / jasa Pemerintah pada Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu Kota Pekanbaru, dengan rincian sebagai berikut :
          </p>

          <table>
            <tbody>
              <tr>
                <td className='w-64'>Nama Kegiatan</td>
                <td className='w-2'>:</td>
                <td className='uppercase'>{namaKegiatan}</td>
              </tr>
              <tr>
                <td>Paket Pekerjaan</td>
                <td>:</td>
                <td className='uppercase'>{paketPekerjaan}</td>
              </tr>
            </tbody>
          </table>

          <p className="text-justify leading-relaxed mt-4">
            Berkaitan dengan hal tersebut diatas, maka pada hari ini <strong className="font-semibold">{hariDisplay}</strong> Tanggal <strong className="font-semibold">{tanggalDisplay}</strong> Kami mengadakan survei harga barang/jasa kepada :
          </p>


          <table>
            <tbody>
              <tr>
                <td className='w-64'>Nama Perusahaan</td>
                <td className='w-2'>:</td>
                <td className='uppercase'>{namaPerusahaan}</td>
              </tr>
              <tr>
                <td>Alamat</td>
                <td>:</td>
                <td>{alamatPerusahaan}</td>
              </tr>
            </tbody>
          </table>

          <p className="mt-4 font-semibold">Dengan hasil survei sebagai berikut :</p>
        </div>

        {/* Tabel Hasil Survei */}
        <div className="my-4">
          <table className="w-full border-collapse border border-black text-xs">
            <thead>
              <tr className="bg-gray-100 font-bold text-center border-b border-black">
                <th className="border border-black px-2 py-2 w-12 uppercase">NO.</th>
                <th className="border border-black px-4 py-2 uppercase">JENIS DAN SPESIFIKASI BARANG/JASA</th>
                <th className="border border-black px-4 py-2 w-48 uppercase">HARGA SURVEI</th>
              </tr>
            </thead>
            <tbody>
              {details.length === 0 ? (
                <tr>
                  <td colSpan={3} className="border border-black px-4 py-6 text-center italic text-gray-500">
                    Belum ada data barang / spesifikasi yang diisi.
                  </td>
                </tr>
              ) : (
                details.map((item, idx) => (
                  <tr key={idx} className="align-top">
                    <td className="border border-black px-2 py-2 text-center font-medium">{idx + 1}</td>
                    <td className="border border-black px-4 py-2">{item.dsrv_jenis_spesifikasi}</td>
                    <td className="border border-black px-4 py-2 text-right font-mono font-semibold">
                      {formatRupiah(item.dsrv_harga_survey)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {details.length > 0 && (
              <tfoot>
                <tr className="font-bold bg-gray-50">
                  <td colSpan={2} className="border border-black px-4 py-2 text-right uppercase">Total Hasil Survei</td>
                  <td className="border border-black px-4 py-2 text-right font-mono font-bold">
                    {formatRupiah(totalHargaSurvey)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Penutup */}
        <p className="my-6 text-xs text-justify">
          Demikian Berita Acara Survey ini dibuat untuk dapat dipergunakan sebagaimana mestinya.
        </p>

        {/* Tanda Tangan Section */}
        <div className="mt-8 grid grid-cols-2 gap-8 text-xs break-inside-avoid">
          {/* Pihak Yang Disurvei */}
          <div className="text-center space-y-16">
            <div>
              <p className="font-bold uppercase">PIHAK YANG DISURVEI</p>
              <p className="font-bold uppercase mt-1">{namaPerusahaan !== '-' ? namaPerusahaan : ''}</p>
            </div>
            <br /><br /><br /><br /><br /><br />
            <div>
              <p className="font-bold underline uppercase">{namaPimpinanPerusahaan || '....................................................'}</p>
              <p className="text-[11px]">{jabatanPimpinanPerusahaan}</p>
            </div>
          </div>

          {/* Pihak Yg Mensurvei (PPTK) */}
          <div className="text-center space-y-16">
            <div>
              <p className="font-bold uppercase">PIHAK YG MENSURVEI</p>
              <p className="font-semibold">Pejabat Pelaksana Teknis Kegiatan,</p>
            </div>
            <br /><br /><br /><br /><br /><br />
            <div>
              <p className="font-bold underline uppercase">{masterDokumen?.mdk_nama_pptk || '...................................................'}</p>
              <p className="text-[11px]">NIP. {masterDokumen?.mdk_nip_pptk || '...................................................'}</p>
            </div>
          </div>
        </div>

        {/* Mengetahui Pejabat Pengadaan */}
        <div className="mt-12 text-center space-y-16 break-inside-avoid">
          <div>
            <p className="font-semibold">Mengetahui</p>
            <p className="font-bold">Pejabat Pengadaan Barang dan Jasa</p>
            <p className="text-[11px]">dilingkungan DPMPTSP Kota Pekanbaru</p>
          </div>
          <br /><br /><br /><br /><br /><br />
          <div>
            <p className="font-bold underline uppercase">{masterDokumen?.mdk_nama_pejabat_pengadaan || '...................................................'}</p>
            <p className="text-[11px]">NIP. {masterDokumen?.mdk_nip_pejabat_pengadaan || '...................................................'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
