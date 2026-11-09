"use client";

import React, { useEffect, useState, use } from 'react';
import { getPenawaranWithDetailsAction } from '@/features/penawaran/actions';
import { Penawaran } from '@/features/penawaran/types';
import { MasterDokumen } from '@/features/master-dokumen/types';
import { formatRupiah, isBelowPajakThreshold, terbilang } from '@/lib/terbilang';

export default function PenawaranPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const mdkId = Number(resolvedParams.id);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    items: Penawaran[];
    masterDokumen: MasterDokumen | null;
    hpsItems: any[];
  } | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!mdkId) return;
      setLoading(true);
      const res = await getPenawaranWithDetailsAction(mdkId);
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
          <p className="text-sm font-medium text-gray-600">Memuat Dokumen Penawaran PDF...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.masterDokumen) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center text-red-500 font-semibold">
          Dokumen Penawaran tidak ditemukan atau gagal dimuat.
        </div>
      </div>
    );
  }

  const { items, masterDokumen, hpsItems } = data;

  // Calculation Metrics
  const jumlahPenawaran = items.reduce((sum, item) => sum + (Number(item.pnw_harga_perkiraan_sendiri) || 0), 0);
  const ppnPenawaran = isBelowPajakThreshold(jumlahPenawaran) ? Math.round(jumlahPenawaran * 0.11) : 0;
  const totalKeseluruhan = jumlahPenawaran + ppnPenawaran;
  const pembulatan = totalKeseluruhan;
  const terbilangText = terbilang(pembulatan);

  // HPS Total for metadata
  const totalHpsNominal = hpsItems.length > 0
    ? hpsItems.reduce((sum, item) => sum + (Number(item.hps_harga_perkiraan_sendiri) || 0), 0) * 1.11
    : Number(masterDokumen.mdk_pagu_anggaran) || 0;

  const namaPerusahaan = masterDokumen.mdk_nama_perusahaan || (masterDokumen as any).psh_nama || 'PT SIBAYAK RIAU WISATA';
  const namaPimpinanPerusahaan = masterDokumen.mdk_nama_pimpinan_perusahaan || 'ELIAKIM SITEPU, SP';
  const jabatanPimpinanPerusahaan = masterDokumen.mdk_jabatan_pimpinan_perusahaan || 'Direktur';
  const alamatPerusahaan = masterDokumen.mdk_alamat || '-';
  const subHeaderBelanja = masterDokumen.mdk_uraian_belanja || 'Pekerjaan / Belanja';

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 print:py-0 print:bg-white">
      {/* Floating Control Bar */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 dark:bg-gray-800/90 text-white px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-4 print:hidden">
        <span className="text-xs font-semibold">Dokumen Penawaran PDF</span>
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

      {/* Printable Document Container (A4 Portrait) */}
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

        {/* Kop Perusahaan */}
        <div className="text-center font-bold uppercase tracking-wide text-sm border-b-2 border-black pb-2 mb-6">
          <h1 className="text-base font-extrabold">{namaPerusahaan}</h1>
          <p className="text-xs font-normal lowercase capitalize text-gray-700">{alamatPerusahaan}</p>
        </div>

        {/* Title */}
        <div className="text-center my-6">
          <h2 className="font-extrabold text-base underline tracking-wider uppercase">
            PENAWARAN
          </h2>
        </div>

        {/* Metadata Table */}
        <div className="mb-6">
          <table className="w-full text-xs border-collapse">
            <tbody>
              <tr>
                <td className="w-32 py-1 font-semibold">Kegiatan</td>
                <td className="w-4 py-1 text-center">:</td>
                <td className="py-1 font-medium">{masterDokumen.mdk_kegiatan || '-'}</td>
              </tr>
              <tr>
                <td className="py-1 font-semibold">Sub Kegiatan</td>
                <td className="py-1 text-center">:</td>
                <td className="py-1 font-medium">{masterDokumen.mdk_sub_kegiatan || '-'}</td>
              </tr>
              <tr>
                <td className="py-1 font-semibold align-top">Pekerjaan</td>
                <td className="py-1 text-center align-top">:</td>
                <td className="py-1 font-medium leading-relaxed">{masterDokumen.mdk_uraian_belanja || '-'}</td>
              </tr>
              <tr>
                <td className="py-1 font-semibold">HPS</td>
                <td className="py-1 text-center">:</td>
                <td className="py-1 font-bold">{formatRupiah(totalHpsNominal)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Main Penawaran Table */}
        <div className="my-4">
          <table className="w-full border-collapse border border-black text-xs">
            <thead>
              <tr className="bg-gray-100 font-bold text-center border-b border-black">
                <th className="border border-black px-2 py-2.5 w-10 uppercase">No</th>
                <th className="border border-black px-3 py-2.5 uppercase text-center">Uraian Pekerjaan</th>
                <th className="border border-black px-2 py-2.5 w-20 uppercase text-center">Vol</th>
                <th className="border border-black px-2 py-2.5 w-20 uppercase text-center">Waktu</th>
                <th className="border border-black px-3 py-2.5 w-32 uppercase text-center">Harga satuan</th>
                <th className="border border-black px-3 py-2.5 w-40 uppercase text-center">Harga Perkiraan Sendiri</th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1: Sub Header Row for Uraian Belanja */}
              <tr className="font-bold border-b border-black bg-gray-50">
                <td className="border border-black px-2 py-2 text-center"></td>
                <td colSpan={5} className="border border-black px-3 py-2 underline tracking-wide">
                  {subHeaderBelanja}
                </td>
              </tr>

              {/* Detail Items */}
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="border border-black px-4 py-6 text-center italic text-gray-500">
                    Belum ada rincian item Penawaran.
                  </td>
                </tr>
              ) : (
                items.map((item, idx) => (
                  <tr key={idx} className="align-top border-b border-dashed border-gray-400">
                    <td className="border border-black px-2 py-2 text-center font-medium">{idx + 1}</td>
                    <td className="border border-black px-3 py-2 leading-relaxed">{item.pnw_uraian_pekerjaan}</td>
                    <td className="border border-black px-2 py-2 text-center font-medium">{item.pnw_volume || '-'}</td>
                    <td className="border border-black px-2 py-2 text-center font-medium">{item.pnw_waktu || '-'}</td>
                    <td className="border border-black px-3 py-2 text-right font-mono">
                      {formatRupiah(item.pnw_harga_satuan)}
                    </td>
                    <td className="border border-black px-3 py-2 text-right font-mono font-semibold">
                      {formatRupiah(item.pnw_harga_perkiraan_sendiri)}
                    </td>
                  </tr>
                ))
              )}

              {/* Summary Rows (Jumlah, PPN, Total Keseluruhan, Pembulatan) */}
              <tr className="font-bold border-t-2 border-black">
                <td colSpan={4} className="border-none"></td>
                <td className="border border-black px-3 py-1.5 text-right uppercase">Jumlah</td>
                <td className="border border-black px-3 py-1.5 text-right font-mono font-bold">
                  {formatRupiah(jumlahPenawaran)}
                </td>
              </tr>
              <tr className="font-bold">
                <td colSpan={4} className="border-none"></td>
                <td className="border border-black px-3 py-1.5 text-right uppercase">PPN</td>
                <td className="border border-black px-3 py-1.5 text-right font-mono font-bold">
                  {formatRupiah(ppnPenawaran)}
                </td>
              </tr>
              <tr className="font-bold bg-gray-50">
                <td colSpan={4} className="border-none"></td>
                <td className="border border-black px-3 py-1.5 text-right uppercase">Total Keseluruhan</td>
                <td className="border border-black px-3 py-1.5 text-right font-mono font-extrabold">
                  {formatRupiah(totalKeseluruhan)}
                </td>
              </tr>
              <tr className="font-bold bg-gray-100">
                <td colSpan={4} className="border-none"></td>
                <td className="border border-black px-3 py-1.5 text-right uppercase">Pembulatan</td>
                <td className="border border-black px-3 py-1.5 text-right font-mono font-extrabold text-sm">
                  {formatRupiah(pembulatan)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Below Table: Terbilang & Signature */}
        <div className="mt-6 space-y-6">
          <div className="text-xs">
            <span className="font-semibold block mb-0.5">Terbilang :</span>
            <p className="italic font-bold text-sm text-gray-900 tracking-wide bg-gray-50/80 p-2.5 rounded border border-gray-200 inline-block">
              {terbilangText || 'Nol Rupiah'}
            </p>
          </div>

          {/* Signature Block (Penyedia / Perusahaan) */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-xs break-inside-avoid">
            <div></div>
            <div className="text-center space-y-16">
              <div>
                <p className="font-medium">Hormat kami,</p>
                <p className="font-bold uppercase mt-0.5">{namaPerusahaan}</p>
              </div>
              <br /><br /><br /><br /><br /><br />
              <div>
                <p className="font-bold underline uppercase text-sm">{namaPimpinanPerusahaan || '....................................................'}</p>
                <p className="text-[11px] font-medium mt-0.5">{jabatanPimpinanPerusahaan}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
