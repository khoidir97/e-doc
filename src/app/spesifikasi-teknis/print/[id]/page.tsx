"use client";

import React, { useEffect, useState, use } from 'react';
import {
  getSpesifikasiTeknisByIdAction,
  getSpesifikasiTeknisByKakIdAction,
} from '@/features/spesifikasi-teknis/actions';
import { SpesifikasiTeknisWithDetails } from '@/features/spesifikasi-teknis/types';
import { SpesifikasiTeknisSheet } from '@/features/spesifikasi-teknis/components/SpesifikasiTeknisSheet';

export default function SpesifikasiTeknisPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const rawId = resolvedParams.id;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SpesifikasiTeknisWithDetails | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!rawId) return;
      setLoading(true);

      if (rawId.startsWith('kak-')) {
        const kakId = Number(rawId.replace('kak-', ''));
        const res = await getSpesifikasiTeknisByKakIdAction(kakId);
        if (res.success && res.data) {
          setData(res.data);
        }
      } else {
        const numId = Number(rawId);
        // Try by sptId first
        const res = await getSpesifikasiTeknisByIdAction(numId);
        if (res.success && res.data && res.data.spesifikasiTeknis) {
          setData(res.data);
        } else {
          // Fallback try by kakId
          const resKak = await getSpesifikasiTeknisByKakIdAction(numId);
          if (resKak.success && resKak.data) {
            setData(resKak.data);
          }
        }
      }

      setLoading(false);
    }
    loadData();
  }, [rawId]);

  useEffect(() => {
    if (!loading && data && data.kak) {
      const timer = setTimeout(() => {
        window.print();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [loading, data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-gray-600">
            Menyiapkan Dokumen Spesifikasi Teknis E-Purchasing...
          </p>
        </div>
      </div>
    );
  }

  if (!data || !data.kak) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center text-red-500 font-semibold">
          Dokumen Spesifikasi Teknis atau KAK tidak ditemukan.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 print:bg-white text-black py-6 print:py-0">
      {/* Floating Action Bar (Hidden when printing) */}
      <div className="max-w-4xl mx-auto mb-4 px-4 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.close()}
            className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 shadow-sm transition-all cursor-pointer"
          >
            ← Kembali / Tutup
          </button>
          <span className="text-xs font-semibold text-gray-600">
            Dokumen Spesifikasi Teknis E-Purchasing
          </span>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Cetak Dokumen (Print / PDF)
        </button>
      </div>

      {/* Render Document Sheet */}
      <div className="shadow-lg print:shadow-none bg-white max-w-4xl mx-auto print:max-w-none print:w-full">
        <SpesifikasiTeknisSheet
          spesifikasiTeknis={data.spesifikasiTeknis || {}}
          detailTeknis={data.detailTeknis}
          detailJumlah={data.detailJumlah}
          detailPelakuUsaha={data.detailPelakuUsaha}
          kak={data.kak}
          masterDokumen={data.masterDokumen}
          ppkPegawai={data.ppkPegawai}
        />
      </div>
    </div>
  );
}

