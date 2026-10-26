"use client";

import React, { useEffect, useState, use, useMemo } from 'react';
import { getKwitansiByMasterDokumenIdAction } from '@/features/kwitansi/actions';
import { getMasterDokumenOptionsAction } from '@/features/faktur/actions';
import { KwitansiOfficialSheet } from '@/features/kwitansi/components/KwitansiOfficialSheet';
import { MasterDokumen } from '@/features/master-dokumen/types';
import { Kwitansi } from '@/features/kwitansi/types';

export default function KwitansiPrintPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ kwt_id?: string; kwt_index?: string; all?: string }>;
}) {
  const resolvedParams = use(params);
  const resolvedSearchParams = searchParams ? use(searchParams) : {};
  const mdkId = Number(resolvedParams.id);
  const todayYmd = new Date().toISOString().split('T')[0];

  const [loading, setLoading] = useState(true);
  const [masterDokumen, setMasterDokumen] = useState<MasterDokumen | null>(null);
  const [kwitansiList, setKwitansiList] = useState<Kwitansi[]>([]);
  const [pakDibayar, setPakDibayar] = useState<number | null>(null);
  const [negoJumlah, setNegoJumlah] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!mdkId) return;
      setLoading(true);

      const [mdkRes, kwtRes] = await Promise.all([
        getMasterDokumenOptionsAction(),
        getKwitansiByMasterDokumenIdAction(mdkId),
      ]);

      if (mdkRes.success && mdkRes.data) {
        const found = mdkRes.data.find((m: MasterDokumen) => m.mdk_id === mdkId) || null;
        setMasterDokumen(found);
      }

      if (kwtRes.success && kwtRes.data) {
        setKwitansiList(kwtRes.data.kwitansiList || []);
        setPakDibayar(kwtRes.data.pak_dibayar);
        setNegoJumlah(kwtRes.data.nego_jumlah ?? null);
      }

      setLoading(false);
    }
    loadData();
  }, [mdkId]);

  useEffect(() => {
    if (!loading && masterDokumen) {
      const timer = setTimeout(() => window.print(), 600);
      return () => clearTimeout(timer);
    }
  }, [loading, masterDokumen]);

  const sheetsToRender = useMemo(() => {
    if (!kwitansiList || kwitansiList.length === 0) {
      const uangSejumlahRaw =
        negoJumlah && negoJumlah > 0
          ? negoJumlah
          : pakDibayar && pakDibayar > 0
          ? pakDibayar
          : masterDokumen?.mdk_pagu_anggaran;
      return [
        {
          noBukuKas: '',
          uangSejumlah: uangSejumlahRaw ? Number(uangSejumlahRaw) : undefined,
          sudahTerimaDari: '',
          tanggalLunasDibayar: todayYmd,
          tanggalTerimaUang: todayYmd,
        },
      ];
    }

    let targetItems = kwitansiList;
    if (resolvedSearchParams.kwt_id) {
      const targetId = Number(resolvedSearchParams.kwt_id);
      const found = kwitansiList.filter((k) => k.kwt_id === targetId);
      if (found.length > 0) targetItems = found;
    } else if (resolvedSearchParams.kwt_index !== undefined) {
      const idx = Number(resolvedSearchParams.kwt_index);
      if (kwitansiList[idx]) targetItems = [kwitansiList[idx]];
    }

    return targetItems.map((kwt) => {
      const uangSejumlahRaw =
        kwt.kwt_uang_sejumlah && Number(kwt.kwt_uang_sejumlah) > 0
          ? kwt.kwt_uang_sejumlah
          : negoJumlah && negoJumlah > 0
          ? negoJumlah
          : pakDibayar && pakDibayar > 0
          ? pakDibayar
          : masterDokumen?.mdk_pagu_anggaran;

      const d1 = kwt.kwt_tanggal_lunas_dibayar ? new Date(kwt.kwt_tanggal_lunas_dibayar as string) : null;
      const d2 = kwt.kwt_tanggal_terima_uang ? new Date(kwt.kwt_tanggal_terima_uang as string) : null;

      return {
        noBukuKas: kwt.kwt_buku_kas_umum_no || '',
        uangSejumlah: uangSejumlahRaw ? Number(uangSejumlahRaw) : undefined,
        sudahTerimaDari: kwt.kwt_sudah_terima_dari || '',
        tanggalLunasDibayar: d1 && !isNaN(d1.getTime()) ? d1.toISOString().split('T')[0] : todayYmd,
        tanggalTerimaUang: d2 && !isNaN(d2.getTime()) ? d2.toISOString().split('T')[0] : todayYmd,
      };
    });
  }, [kwitansiList, resolvedSearchParams, pakDibayar, masterDokumen, todayYmd]);

  // 1 kwitansi = 1 halaman/kertas
  const pageChunks = sheetsToRender;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-gray-600">Memuat Kwitansi PDF...</p>
        </div>
      </div>
    );
  }

  if (!masterDokumen) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center text-red-500 font-semibold">
          Dokumen Kwitansi tidak ditemukan atau gagal dimuat.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 print:py-0 print:bg-white space-y-8">
      {/* Floating Control Bar */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 text-white px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-4 print:hidden">
        <span className="text-xs font-semibold">
          Kwitansi PDF ({pageChunks.length} Halaman · {pageChunks.length} Kwitansi)
        </span>
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
          .print\\:hidden { display: none !important; }
          .page-break-after {
            page-break-after: always !important;
            break-after: page !important;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}</style>

      {/* A4 Page Container — 1 kwitansi per halaman/kertas */}
      {pageChunks.map((sheet, pageIndex) => (
        <div
          key={pageIndex}
          className={`mx-auto bg-white text-black shadow-xl print:shadow-none print:m-0 print:p-0 flex flex-col justify-start ${
            pageIndex < pageChunks.length - 1 ? 'page-break-after mb-8' : ''
          }`}
          style={{
            width: '210mm',
            minHeight: '297mm',
            padding: '8mm 10mm',
            boxSizing: 'border-box',
          }}
        >
          <div className="w-full">
            <KwitansiOfficialSheet
              masterDokumen={masterDokumen}
              noBukuKas={sheet.noBukuKas}
              uangSejumlah={sheet.uangSejumlah}
              sudahTerimaDari={sheet.sudahTerimaDari}
              tanggalLunasDibayar={sheet.tanggalLunasDibayar}
              tanggalTerimaUang={sheet.tanggalTerimaUang}
              isEditable={false}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
