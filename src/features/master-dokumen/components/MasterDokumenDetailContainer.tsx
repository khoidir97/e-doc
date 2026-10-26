"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { MasterDokumen } from '../types';
import { getMasterDokumenByIdAction } from '../actions';
import { MasterDokumenHeaderDetail } from './MasterDokumenHeaderDetail';

// Import Feature Containers
import { SurveyContainer } from '@/features/survey/components/SurveyContainer';
import { RencanaAnggaranBiayaContainer } from '@/features/rencana-anggaran-biaya/components/RencanaAnggaranBiayaContainer';
import { HargaPerkiraanSendiriContainer } from '@/features/harga-perkiraan-sendiri/components/HargaPerkiraanSendiriContainer';
import { PenawaranContainer } from '@/features/penawaran/components/PenawaranContainer';
import { NegoContainer } from '@/features/nego/components/NegoContainer';
import { PerhitunganPaketContainer } from '@/features/perhitungan-paket/components/PerhitunganPaketContainer';
import { KwitansiContainer } from '@/features/kwitansi/components/KwitansiContainer';
import { FakturContainer } from '@/features/faktur/components/FakturContainer';
import { BeritaAcaraContainer } from '@/features/berita-acara/components/BeritaAcaraContainer';
import { NotaPencairanDanaContainer } from '@/features/nota-pencairan-dana/components/NotaPencairanDanaContainer';

export type DetailTabType =
  | 'survey'
  | 'rab'
  | 'hps'
  | 'penawaran'
  | 'nego'
  | 'perhitungan'
  | 'kwitansi'
  | 'faktur'
  | 'npd'
  | 'berita';

interface MasterDokumenDetailContainerProps {
  mdkId: number;
}

const TABS: { id: DetailTabType; label: string; description: string }[] = [
  { id: 'survey', label: 'Survey', description: 'Survey Harga Pasar & Rekap Penyedia' },
  { id: 'rab', label: 'RAB', description: 'Rencana Anggaran Biaya Rincian Belanja' },
  { id: 'hps', label: 'HPS', description: 'Harga Perkiraan Sendiri Pejabat Pengadaan' },
  { id: 'penawaran', label: 'Penawaran', description: 'Surat & Daftar Penawaran Harga Penyedia' },
  { id: 'nego', label: 'Nego', description: 'Berita Acara Negosiasi Harga' },
  { id: 'perhitungan', label: 'Perhitungan Paket', description: 'Perhitungan Paket Pekerjaan & SPK' },
  { id: 'kwitansi', label: 'Kuitansi', description: 'Bukti Kuitansi Lunas Dibayar' },
  { id: 'faktur', label: 'Faktur', description: 'Faktur / Nota Pembelian Jasa/Barang' },
  { id: 'npd', label: 'Nota Pencairan Dana', description: 'Nota Pencairan Dana (NPD) Sekretaris' },
  { id: 'berita', label: 'Berita Acara', description: 'Berita Acara Serah Terima Pekerjaan' },
];

const TAB_ICONS: Record<DetailTabType, React.ReactNode> = {
  survey: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  rab: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  hps: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 11h.01M7 15h.01M11 7h.01M11 11h.01M11 15h.01M15 7h.01M15 11h.01M15 15h.01M19 7h.01M19 11h.01M19 15h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  penawaran: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  nego: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  perhitungan: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M12 7h.01M15 7h.01M16 21H8a2 2 0 01-2-2V5a2 2 0 012-2h8a2 2 0 012 2v14a2 2 0 01-2 2z" />
    </svg>
  ),
  kwitansi: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  faktur: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
    </svg>
  ),
  npd: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  berita: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const TAB_PRINT_URLS: Record<DetailTabType, string> = {
  survey: '/survey/print',
  rab: '/rencana-anggaran-biaya/print',
  hps: '/harga-perkiraan-sendiri/print',
  penawaran: '/penawaran/print',
  nego: '/nego/print',
  perhitungan: '/perhitungan-paket/print',
  kwitansi: '/kwitansi/print',
  faktur: '/faktur/print',
  npd: '/nota-pencairan-dana/print',
  berita: '/berita-acara/print',
};

export const MasterDokumenDetailContainer: React.FC<MasterDokumenDetailContainerProps> = ({ mdkId }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as DetailTabType) || 'survey';

  const [masterDokumen, setMasterDokumen] = useState<MasterDokumen | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTabType>(
    TABS.some((t) => t.id === initialTab) ? initialTab : 'survey'
  );

  useEffect(() => {
    async function loadMasterDokumen() {
      setLoading(true);
      setError(null);
      const res = await getMasterDokumenByIdAction(mdkId);
      if (res.success && res.data) {
        setMasterDokumen(res.data);
      } else {
        setError(res.message || 'Data Master Dokumen tidak ditemukan.');
      }
      setLoading(false);
    }
    if (mdkId) {
      loadMasterDokumen();
    }
  }, [mdkId]);

  const handleTabChange = (tabId: DetailTabType) => {
    setActiveTab(tabId);
    router.replace(`/master-dokumen/${mdkId}?tab=${tabId}`, { scroll: false });
  };

  const activeIndex = TABS.findIndex((t) => t.id === activeTab);
  const activeTabInfo = TABS[activeIndex] || TABS[0];

  const handlePrevTab = () => {
    if (activeIndex > 0) {
      handleTabChange(TABS[activeIndex - 1].id);
    }
  };

  const handleNextTab = () => {
    if (activeIndex < TABS.length - 1) {
      handleTabChange(TABS[activeIndex + 1].id);
    }
  };

  const printUrl = `${TAB_PRINT_URLS[activeTab]}/${mdkId}`;

  return (
    <div className="p-2 sm:p-4 w-full max-w-full space-y-4 overflow-hidden">
      <style jsx>{`
        @keyframes tabFadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-tab-fade {
          animation: tabFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/master-dokumen"
            className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-xs cursor-pointer flex items-center justify-center shrink-0"
            title="Kembali ke Daftar Master Dokumen"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div className="min-w-0">
            {/* <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-2 py-0.5 rounded-md shrink-0">
                E-Dokumen Perjalanan
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-xs text-gray-500 font-mono shrink-0">ID #{mdkId}</span>
            </div> */}
            <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mt-0.5 truncate">
              {loading ? 'Memuat Dokumen...' : masterDokumen?.mdk_kegiatan || 'Detail Master Dokumen'}
            </h1>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800 text-sm flex items-center gap-3 shadow-xs">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Master Dokumen Header & Full Detail Cards */}
      {masterDokumen && (
        <MasterDokumenHeaderDetail masterDokumen={masterDokumen} />
      )}

      {/* Fully Responsive Wrap-Grid Sub-Menu Tab Bar (No Horizontal Scrollbar!) */}
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200/90 dark:border-gray-800/90 rounded-2xl p-1.5 shadow-sm">
        <nav className="flex flex-wrap items-center gap-1 sm:gap-1.5 w-full">
          {TABS.map((tab, idx) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 min-w-[75px] sm:min-w-[95px] max-w-full px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl font-semibold text-xs transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer select-none ${isActive
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-sm scale-[1.01]'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white bg-gray-50/50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800/60'
                  }`}
              >
                {/* <span className={`text-[10px] font-mono px-1 py-0.2 rounded shrink-0 ${
                  isActive ? 'bg-white/20 text-white font-bold' : 'bg-gray-200/70 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}>
                  {String(idx + 1).padStart(2, '0')}
                </span> */}
                <span className="flex items-center gap-1 truncate text-[11px] sm:text-xs">
                  <span className="shrink-0">{TAB_ICONS[tab.id]}</span>
                  <span className="truncate">{tab.label}</span>
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Active Tab Banner Card with Step Navigation & Print Action */}
      <div className="bg-gradient-to-r from-blue-900/10 via-indigo-900/5 to-transparent dark:from-blue-950/40 dark:via-indigo-950/20 dark:to-transparent border border-blue-100 dark:border-blue-900/30 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs max-w-full overflow-hidden">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20 shrink-0">
            {TAB_ICONS[activeTabInfo.id]}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded-md shrink-0">
                Tabs {activeIndex + 1} dari {TABS.length}
              </span>
              <span className="text-xs text-gray-400 font-mono">•</span>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">
                {activeTabInfo.label}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
              {activeTabInfo.description}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button
            onClick={handlePrevTab}
            disabled={activeIndex === 0}
            className={`p-1.5 sm:p-2 rounded-xl border text-xs font-medium transition-all flex items-center gap-1 ${activeIndex === 0
              ? 'opacity-40 border-gray-200 dark:border-gray-800 text-gray-400 cursor-not-allowed'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer shadow-xs'
              }`}
            title="Langkah Sebelumnya"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Sebelumnya</span>
          </button>

          <button
            onClick={handleNextTab}
            disabled={activeIndex === TABS.length - 1}
            className={`p-1.5 sm:p-2 rounded-xl border text-xs font-medium transition-all flex items-center gap-1 ${activeIndex === TABS.length - 1
              ? 'opacity-40 border-gray-200 dark:border-gray-800 text-gray-400 cursor-not-allowed'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer shadow-xs'
              }`}
            title="Langkah Berikutnya"
          >
            <span className="hidden sm:inline">Berikutnya</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <a
            href={printUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer ml-1"
            title="Cetak atau Simpan PDF untuk Dokumen Ini"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span className="whitespace-nowrap">Cetak PDF</span>
          </a>
        </div>
      </div>

      {/* Smooth Animated Active Tab Content */}
      <div key={activeTab} className="min-h-[450px] animate-tab-fade max-w-full overflow-hidden">
        {activeTab === 'survey' && (
          <SurveyContainer initialMasterDokumenId={mdkId} hideMasterDokumenSelector />
        )}
        {activeTab === 'rab' && (
          <RencanaAnggaranBiayaContainer initialMasterDokumenId={mdkId} hideMasterDokumenSelector />
        )}
        {activeTab === 'hps' && (
          <HargaPerkiraanSendiriContainer initialMasterDokumenId={mdkId} hideMasterDokumenSelector />
        )}
        {activeTab === 'penawaran' && (
          <PenawaranContainer initialMasterDokumenId={mdkId} hideMasterDokumenSelector />
        )}
        {activeTab === 'nego' && (
          <NegoContainer initialMasterDokumenId={mdkId} hideMasterDokumenSelector />
        )}
        {activeTab === 'perhitungan' && (
          <PerhitunganPaketContainer initialMasterDokumenId={mdkId} hideMasterDokumenSelector />
        )}
        {activeTab === 'kwitansi' && (
          <KwitansiContainer initialMasterDokumenId={mdkId} hideMasterDokumenSelector />
        )}
        {activeTab === 'faktur' && (
          <FakturContainer initialMasterDokumenId={mdkId} hideMasterDokumenSelector />
        )}
        {activeTab === 'npd' && (
          <NotaPencairanDanaContainer initialMasterDokumenId={mdkId} hideMasterDokumenSelector />
        )}
        {activeTab === 'berita' && (
          <BeritaAcaraContainer initialMasterDokumenId={mdkId} hideMasterDokumenSelector />
        )}
      </div>
    </div>
  );
};
