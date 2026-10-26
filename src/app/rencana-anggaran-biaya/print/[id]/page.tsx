"use client";

import React, { useEffect, useState, use } from 'react';
import { getRencanaAnggaranBiayaWithDetailsAction } from '@/features/rencana-anggaran-biaya/actions';
import { RencanaAnggaranBiaya } from '@/features/rencana-anggaran-biaya/types';
import { MasterDokumen } from '@/features/master-dokumen/types';
import { formatRupiah, terbilang } from '@/lib/terbilang';
import { KopSuratBpkad } from '@/components/common/KopSuratBpkad';

export default function RencanaAnggaranBiayaPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const mdkId = Number(resolvedParams.id);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    items: RencanaAnggaranBiaya[];
    masterDokumen: MasterDokumen | null;
  } | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!mdkId) return;
      setLoading(true);
      const res = await getRencanaAnggaranBiayaWithDetailsAction(mdkId);
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
          <p className="text-sm font-medium text-gray-600">Memuat Dokumen Rencana Anggaran Biaya (RAB) PDF...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.masterDokumen) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center text-red-500 font-semibold">
          Dokumen Rencana Anggaran Biaya tidak ditemukan atau gagal dimuat.
        </div>
      </div>
    );
  }

  const { items, masterDokumen } = data;

  const totalHargaRab = items.reduce((sum, item) => sum + (Number(item.rab_harga_perkiraan_sendiri) || 0), 0);
  const terbilangText = terbilang(totalHargaRab);
  const labelPejabat = masterDokumen.mdk_jabatan_pejabat?.trim().toUpperCase() === 'PA'
    ? 'Pengguna Anggaran'
    : 'Kuasa Pengguna Anggaran';
  const kodeRekeningHeader = masterDokumen.mdk_no_dpa || masterDokumen.mdk_rekening_belanja || masterDokumen.mdk_kode_sub_kegiatan || '5.02.01.2.08.0003';

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 print:py-0 print:bg-white">
      {/* Floating Control Bar */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 dark:bg-gray-800/90 text-white px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-4 print:hidden">
        <span className="text-xs font-semibold">Rencana Anggaran Biaya (RAB)</span>
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

      {/* Printable Document Container (A4 / Excel style) */}
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

        {/* Title */}
        <div className="text-center my-6">
          <h2 className="font-extrabold text-base underline tracking-wider uppercase">RENCANA ANGGARAN BIAYA</h2>
        </div>

        {/* Metadata Header Table */}
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
                <td className="py-1 font-semibold">Pagu Anggaran</td>
                <td className="py-1 text-center">:</td>
                <td className="py-1 font-bold">{formatRupiah(masterDokumen.mdk_pagu_anggaran)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Main RAB Table */}
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
              {/* Row 1: Kode Rekening Sub Header Row */}
              <tr className="font-bold border-b border-black bg-gray-50">
                <td className="border border-black px-2 py-2 text-center"></td>
                <td colSpan={5} className="border border-black px-3 py-2 underline tracking-wider">
                  {kodeRekeningHeader}
                </td>
              </tr>

              {/* Detail Items */}
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="border border-black px-4 py-6 text-center italic text-gray-500">
                    Belum ada rincian item Rencana Anggaran Biaya.
                  </td>
                </tr>
              ) : (
                items.map((item, idx) => {
                  return (
                    <tr key={idx} className="align-top border-b border-dashed border-gray-400">
                      <td className="border border-black px-2 py-2 text-center font-medium">{idx + 1}</td>
                      <td className="border border-black px-3 py-2 leading-relaxed">{item.rab_uraian_pekerjaan}</td>
                      <td className="border border-black px-2 py-2 text-center font-medium">{item.rab_volume || '-'}</td>
                      <td className="border border-black px-2 py-2 text-center font-medium">{item.rab_waktu || '-'}</td>
                      <td className="border border-black px-3 py-2 text-right font-mono">
                        {formatRupiah(item.rab_harga_satuan)}
                      </td>
                      <td className="border border-black px-3 py-2 text-right font-mono font-semibold">
                        {formatRupiah(item.rab_harga_perkiraan_sendiri)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot>
              <tr className="font-bold border-t-2 border-black bg-gray-100">
                <td colSpan={5} className="border border-black px-4 py-2.5 text-center font-extrabold uppercase tracking-wide">
                  Jumlah
                </td>
                <td className="border border-black px-3 py-2.5 text-right font-mono font-bold text-sm">
                  {formatRupiah(totalHargaRab)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Below Table: Terbilang & Signatures */}
        <div className="mt-4 space-y-6">
          <div className="text-xs">
            <span className="font-semibold block mb-0.5">Terbilang :</span>
            <p className="italic font-bold text-sm text-gray-900 tracking-wide bg-gray-50/80 p-2 rounded border border-gray-200 inline-block">
              {terbilangText || 'Nol Rupiah'}
            </p>
          </div>

          {/* Signature Block */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-xs break-inside-avoid">
            <div></div>
            <div className="text-center space-y-16">
              <div>
                <p className="font-bold uppercase">{masterDokumen.bdg_nama || masterDokumen.mdk_bagian || 'Sekretaris BPKAD'}</p>
                <p className="font-bold uppercase">PENGELOLA KEUANGAN DAN ASET DAERAH</p>
                <p className="font-bold uppercase">KOTA PEKANBARU</p>
                <p className="font-semibold text-gray-700">Selaku {labelPejabat}</p>
              </div>
              <br /><br /><br /><br />
              <div>
                <p className="font-bold underline uppercase text-sm">{masterDokumen.mdk_nama_pejabat || 'DANIEL PERDANA, S.E'}</p>
                <p className="text-[11px] font-mono mt-0.5">
                  NIP. {masterDokumen.mdk_nip_pejabat || '197507242001121006'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
