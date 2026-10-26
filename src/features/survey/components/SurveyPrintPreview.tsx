"use client";

import React from 'react';
import { SurveyHeader, DetailSurvey } from '../types';
import { formatRupiah } from '@/lib/terbilang';
import { KopSuratBpkad } from '@/components/common/KopSuratBpkad';
import { formatDateIndonesian } from '@/lib/date';

interface SurveyPrintPreviewProps {
  header: SurveyHeader | null;
  details: DetailSurvey[];
  masterDokumen?: any;
  onClose: () => void;
}

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

export const SurveyPrintPreview: React.FC<SurveyPrintPreviewProps> = ({
  header,
  details,
  masterDokumen,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const namaKegiatan = header?.srv_nama_kegiatan || masterDokumen?.mdk_kegiatan || masterDokumen?.mdk_uraian_belanja || '-';
  const paketPekerjaan = header?.srv_paket_pekerjaan || masterDokumen?.mdk_uraian_belanja || '-';
  const namaPerusahaan = header?.srv_nama_perusahaan || masterDokumen?.mdk_nama_perusahaan || masterDokumen?.psh_nama || '-';
  const alamatPerusahaan = header?.srv_alamat_perusahaan || masterDokumen?.mdk_alamat || '-';
  const direkturPerusahaan = masterDokumen?.mdk_direktur_perusahaan || 'Direktur';

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static print:inset-auto">
      <div className="relative bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden print:shadow-none print:w-full print:max-w-none print:max-h-none print:rounded-none print:bg-white print:text-black">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/80 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔍</span>
            <div>
              <h2 className="font-bold text-sm text-gray-900 dark:text-white">Cetak Berita Acara Survei Harga</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Preview dokumen resmi survei harga pasar</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Cetak / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              title="Tutup Preview"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Document Container */}
        <div className="p-8 sm:p-12 overflow-y-auto print:overflow-visible print:m-0 print:p-[15mm] font-serif leading-relaxed text-black bg-white text-xs">
          <style jsx global>{`
            @media print {
              html, body {
                background: white !important;
                color: black !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              header, footer, nav, aside {
                display: none !important;
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
            <div className="pl-4 space-y-1 my-2">
              <div className="grid grid-cols-[140px_10px_1fr] items-start">
                <span>Nama Kegiatan</span>
                <span>:</span>
                <span className="font-bold uppercase">{namaKegiatan}</span>
              </div>
              <div className="grid grid-cols-[140px_10px_1fr] items-start">
                <span>Paket Pekerjaan</span>
                <span>:</span>
                <span className="font-bold uppercase">{paketPekerjaan}</span>
              </div>
            </div>

            <p className="text-justify leading-relaxed mt-4">
              Berkaitan dengan hal tersebut diatas, maka pada hari ini <strong className="font-semibold">{hariDisplay}</strong> Tanggal <strong className="font-semibold">{tanggalDisplay}</strong> Kami mengadakan survei harga barang/jasa kepada :
            </p>

            <div className="pl-4 space-y-1 my-2">
              <div className="grid grid-cols-[140px_10px_1fr] items-start">
                <span>Nama Perusahaan</span>
                <span>:</span>
                <span className="font-bold uppercase">{namaPerusahaan}</span>
              </div>
              <div className="grid grid-cols-[140px_10px_1fr] items-start">
                <span>Alamat</span>
                <span>:</span>
                <span>{alamatPerusahaan}</span>
              </div>
            </div>

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
              <div>
                <p className="font-bold underline uppercase">{direkturPerusahaan}</p>
                <p className="text-[11px]">Direktur</p>
              </div>
            </div>

            {/* Pihak Yg Mensurvei (PPTK) */}
            <div className="text-center space-y-16">
              <div>
                <p className="font-bold uppercase">PIHAK YG MENSURVEI</p>
                <p className="font-semibold">Pejabat Pelaksana Teknis Kegiatan,</p>
              </div>
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
            <div>
              <p className="font-bold underline uppercase">{masterDokumen?.mdk_nama_pejabat_pengadaan || '...................................................'}</p>
              <p className="text-[11px]">NIP. {masterDokumen?.mdk_nip_pejabat_pengadaan || '...................................................'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
