"use client";

import React, { useState } from 'react';
import { MasterDokumen } from '../types';
import { formatRupiah } from '@/lib/terbilang';

interface MasterDokumenHeaderDetailProps {
  masterDokumen: MasterDokumen;
}

export const MasterDokumenHeaderDetail: React.FC<MasterDokumenHeaderDetailProps> = ({ masterDokumen }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'anggaran' | 'kegiatan' | 'pejabat' | 'rekanan'>('anggaran');

  const handleCopy = (text: string, label: string) => {
    if (!text || text === '-') return;
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="w-full space-y-4">
      {/* Sleek High-Density Hero Card Container */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 p-4 sm:p-5 shadow-xs border border-gray-200 dark:border-gray-800 space-y-4">
        {/* Header Badges & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 text-xs font-semibold text-teal-700 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/60">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
              Master Dokumen #{masterDokumen.mdk_id}
            </span>

            {masterDokumen.mdk_is_lock === 1 && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/60 shadow-xs">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Terkunci (Locked)
              </span>
            )}

            {masterDokumen.mdk_apbd && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {masterDokumen.mdk_apbd}
              </span>
            )}

            {(masterDokumen.bdg_nama || masterDokumen.mdk_bagian) && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {masterDokumen.bdg_nama || masterDokumen.mdk_bagian}
              </span>
            )}
          </div>

          {/* Toggle Expand Control */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all cursor-pointer border border-gray-200 dark:border-gray-700"
          >
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
            <span>{isExpanded ? 'Sembunyikan Detail' : 'Tampilkan Detail Lengkap'}</span>
            <span className="rounded-md bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 text-[10px] font-bold text-gray-800 dark:text-gray-100">
              24 Data
            </span>
          </button>
        </div>

        {/* Primary Title Header Area */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            <span>Uraian Pekerjaan & Belanja</span>
            {masterDokumen.mdk_kode_sub_kegiatan && (
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                {masterDokumen.mdk_kode_sub_kegiatan}
              </span>
            )}
          </div>
          <h5 className="text-sm sm:text-sm font-extrabold text-gray-500 dark:text-amber-500 leading-snug">
            {masterDokumen.mdk_uraian_belanja || masterDokumen.mdk_kegiatan || 'Detail Master Dokumen'}
          </h5>
          {masterDokumen.mdk_pekerjaan && (
            <p className="text-xs text-gray-500 dark:text-gray-400 italic">
              &ldquo;{masterDokumen.mdk_pekerjaan} | {masterDokumen.mdk_volume} {masterDokumen.st_nama || masterDokumen.mdk_satuan} &rdquo;
            </p>
          )}
        </div>

        {/* High-Density 5-Column Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {/* Card 1: Pagu Anggaran */}
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex flex-col justify-between space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              Pagu Anggaran
            </span>
            <div className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 truncate">
              {formatRupiah(masterDokumen.mdk_pagu_anggaran)}
            </div>
          </div>

          {/* Card 2: No DPA */}
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-800/60 border border-indigo-100 dark:border-indigo-800/80 flex flex-col justify-between space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">No. DPA</span>
              <button
                type="button"
                onClick={() => handleCopy(masterDokumen.mdk_no_dpa, 'dpa')}
                className="text-indigo-400 hover:text-indigo-700 dark:hover:text-white transition-colors text-[10px] cursor-pointer flex items-center gap-1"
                title="Salin No DPA"
              >
                {copiedField === 'dpa' ? (
                  <span className="text-emerald-600 font-bold">Tersalin!</span>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-xs font-mono font-bold text-indigo-900 dark:text-white truncate">
              {masterDokumen.mdk_no_dpa || '-'}
            </p>
          </div>

          {/* Card 3: Rekening Belanja */}
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-800/60 border border-amber-100 dark:border-amber-800/80 flex flex-col justify-between space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 dark:text-amber-400">Rekening</span>
              <button
                type="button"
                onClick={() => handleCopy(masterDokumen.mdk_rekening_belanja, 'rek')}
                className="text-amber-400 hover:text-amber-700 dark:hover:text-white transition-colors text-[10px] cursor-pointer flex items-center gap-1"
                title="Salin Rekening"
              >
                {copiedField === 'rek' ? (
                  <span className="text-emerald-600 font-bold">Tersalin!</span>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-xs font-mono font-bold text-amber-900 dark:text-white truncate">
              {masterDokumen.mdk_rekening_belanja || '-'}
            </p>
          </div>

          {/* Card 4: Perusahaan Rekanan */}
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-800/60 border border-blue-100 dark:border-blue-800/80 flex flex-col justify-between space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 dark:text-blue-400">Penyedia</span>
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 truncate">
              {masterDokumen.mdk_nama_perusahaan || '-'}
            </p>
          </div>

          {/* Card 5: Pejabat (PPK) */}
          <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-800/60 border border-cyan-100 dark:border-cyan-800/80 flex flex-col justify-between space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-500 dark:text-cyan-400">Pejabat (PPK)</span>
            <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 truncate">
              {masterDokumen.mdk_nama_pejabat || '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Expanded Full Details Section */}
      {isExpanded && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-3 duration-300">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">

            <button
              type="button"
              onClick={() => setActiveTab('anggaran')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${activeTab === 'anggaran'
                ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-xs font-bold'
                : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800'
                }`}
            >
              <span>📋</span> Dokumen & Anggaran
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('kegiatan')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${activeTab === 'kegiatan'
                ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-xs font-bold'
                : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800'
                }`}
            >
              <span>🎯</span> Program & Kegiatan
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pejabat')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${activeTab === 'pejabat'
                ? 'bg-amber-600 dark:bg-amber-500 text-white shadow-xs font-bold'
                : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800'
                }`}
            >
              <span>👥</span> Tim Pejabat & Pengelola
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('rekanan')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${activeTab === 'rekanan'
                ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-xs font-bold'
                : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800'
                }`}
            >
              <span>🏢</span> Perusahaan / Rekanan
            </button>
          </div>

          {/* Details Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {/* Section 1: Dokumen & Anggaran */}
            {(activeTab === 'anggaran') && (
              <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs space-y-3 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all">
                <div className="flex items-center gap-2.5 border-b border-gray-100 dark:border-gray-800 pb-2.5">
                  <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
                      Informasi Dokumen & Anggaran
                    </h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      Rincian anggaran, DPA, dan status APBD
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800/80 space-y-0.5">
                    <span className="text-gray-500 dark:text-gray-400 block text-[10px] font-bold uppercase tracking-wider">
                      Uraian Belanja
                    </span>
                    <p className="text-emerald-600 dark:text-amber font-bold leading-snug">
                      {masterDokumen.mdk_uraian_belanja || '-'}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800/80 space-y-0.5">
                    <span className="text-gray-500 dark:text-gray-400 block text-[10px] font-bold uppercase tracking-wider">
                      No. DPA
                    </span>
                    <strong className="text-emerald-600 dark:text-emerald font-mono font-bold block text-xs">
                      {masterDokumen.mdk_no_dpa || '-'}
                    </strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800/80 space-y-0.5">
                    <span className="text-gray-500 dark:text-gray-400 block text-[10px] font-bold uppercase tracking-wider">
                      Rekening Belanja
                    </span>
                    <strong className="text-emerald-600 dark:text-emerald font-mono font-bold block text-xs truncate">
                      {masterDokumen.mdk_rekening_belanja || '-'}
                    </strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800/80 space-y-0.5">
                    <span className="text-gray-500 dark:text-gray-400 block text-[10px] font-bold uppercase tracking-wider">
                      Pagu Anggaran
                    </span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold block text-xs">
                      {formatRupiah(masterDokumen.mdk_pagu_anggaran)}
                    </strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800/80 space-y-0.5">
                    <span className="text-gray-500 dark:text-gray-400 block text-[10px] font-bold uppercase tracking-wider">
                      Sumber / Status APBD
                    </span>
                    <span className="inline-block font-bold text-emerald-600 dark:text-emerald text-xs">
                      {masterDokumen.mdk_apbd || '-'}
                    </span>
                  </div>

                  {masterDokumen.mdk_keterangan && (
                    <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800/80 space-y-0.5">
                      <span className="text-gray-500 dark:text-gray-400 block text-[10px] font-bold uppercase tracking-wider">
                        Keterangan / Catatan
                      </span>
                      <p className="text-emerald-600 dark:text-emerald italic text-xs">
                        {masterDokumen.mdk_keterangan}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Section 2: Struktur Program & Kegiatan */}
            {(activeTab === 'kegiatan') && (
              <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs space-y-3 hover:border-blue-300 dark:hover:border-blue-800 transition-all">
                <div className="flex items-center gap-2.5 border-b border-gray-100 dark:border-gray-800 pb-2.5">
                  <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
                      Struktur Program & Kegiatan
                    </h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      Hierarki kode program, kegiatan, & sub kegiatan
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800/80">
                    <span className="text-gray-500 dark:text-gray-400 block text-[10px] font-bold uppercase tracking-wider mb-0.5">
                      Bagian / Bidang
                    </span>
                    <strong className="text-gray-900 dark:text-white font-bold block text-xs">
                      {masterDokumen.bdg_nama || masterDokumen.mdk_bagian || '-'}
                    </strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800/80 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                        Program
                      </span>
                      {masterDokumen.mdk_kode_program && (
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                          {masterDokumen.mdk_kode_program}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-900 dark:text-white font-bold">
                      {masterDokumen.mdk_program || '-'}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800/80 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                        Kegiatan
                      </span>
                      {masterDokumen.mdk_kode_kegiatan && (
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                          {masterDokumen.mdk_kode_kegiatan}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-900 dark:text-white font-bold">
                      {masterDokumen.mdk_kegiatan || '-'}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800/80 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                        Sub Kegiatan
                      </span>
                      {masterDokumen.mdk_kode_sub_kegiatan && (
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                          {masterDokumen.mdk_kode_sub_kegiatan}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-900 dark:text-white font-bold">
                      {masterDokumen.mdk_sub_kegiatan || '-'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Section 3: Tim Pejabat & Pengelola */}
            {(activeTab === 'pejabat') && (
              <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs space-y-3 hover:border-amber-300 dark:hover:border-amber-800 transition-all">
                <div className="flex items-center gap-2.5 border-b border-gray-100 dark:border-gray-800 pb-2.5">
                  <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
                      Tim Pejabat & Pengelola
                    </h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      PA/KPA, PPTK, Pejabat Pengadaan, & Bendahara
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {/* Pejabat Pembuat Komitmen / PA / KPA */}
                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800/80 space-y-0.5">
                    <span className="text-gray-500 dark:text-gray-400 block text-[10px] font-bold uppercase tracking-wider">
                      Pejabat (PA / KPA / PPK)
                    </span>
                    <strong className="text-teal-500 dark:text-teal-400 font-bold block">
                      {masterDokumen.mdk_nama_pejabat || '-'}
                    </strong>
                    {masterDokumen.mdk_nip_pejabat && (
                      <span className="text-[10px] font-mono text-gray-600 dark:text-gray-400 block">
                        NIP. {masterDokumen.mdk_nip_pejabat}
                      </span>
                    )}
                  </div>

                  {/* PPTK */}
                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800/80 space-y-0.5">
                    <span className="text-gray-500 dark:text-gray-400 block text-[10px] font-bold uppercase tracking-wider">
                      PPTK
                    </span>
                    <strong className="text-teal-500 dark:text-teal-400 font-bold block">
                      {masterDokumen.mdk_nama_pptk || '-'}
                    </strong>
                    {masterDokumen.mdk_nip_pptk && (
                      <span className="text-[10px] font-mono text-gray-600 dark:text-gray-400 block">
                        NIP. {masterDokumen.mdk_nip_pptk}
                      </span>
                    )}
                  </div>

                  {/* Pejabat Pengadaan */}
                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800/80 space-y-0.5">
                    <span className="text-gray-500 dark:text-gray-400 block text-[10px] font-bold uppercase tracking-wider">
                      Pejabat Pengadaan
                    </span>
                    <strong className="text-teal-500 dark:text-teal-400 font-bold block">
                      {masterDokumen.mdk_nama_pejabat_pengadaan || '-'}
                    </strong>
                    {masterDokumen.mdk_nip_pejabat_pengadaan && (
                      <span className="text-[10px] font-mono text-gray-600 dark:text-gray-400 block">
                        NIP. {masterDokumen.mdk_nip_pejabat_pengadaan}
                      </span>
                    )}
                  </div>

                  {/* Bendahara */}
                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800/80 space-y-0.5">
                    <span className="text-gray-500 dark:text-gray-400 block text-[10px] font-bold uppercase tracking-wider">
                      Bendahara
                    </span>
                    <strong className="text-teal-500 dark:text-teal-400 font-bold block">
                      {masterDokumen.mdk_nama_bendahara || '-'}
                    </strong>
                    {masterDokumen.mdk_nip_bendahara && (
                      <span className="text-[10px] font-mono text-gray-600 dark:text-gray-400 block">
                        NIP. {masterDokumen.mdk_nip_bendahara}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Section 4: Penyedia / Perusahaan Rekanan */}
            {(activeTab === 'rekanan') && (
              <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs space-y-3 hover:border-emerald-300 dark:hover:border-emerald-800 transition-all">
                <div className="flex items-center gap-2.5 border-b border-gray-100 dark:border-gray-800 pb-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
                      Perusahaan / Penyedia Rekanan
                    </h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      Identitas penyedia jasa & pimpinan
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800/80 space-y-0.5">
                    <span className="text-gray-500 dark:text-gray-400 block text-[10px] font-bold uppercase tracking-wider">
                      Nama Perusahaan / Rekanan
                    </span>
                    <strong className="text-gray-900 dark:text-white font-bold block text-sm">
                      {masterDokumen.mdk_nama_perusahaan || '-'}
                    </strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800/80 space-y-0.5">
                    <span className="text-gray-500 dark:text-gray-400 block text-[10px] font-bold uppercase tracking-wider">
                      Direktur / Penanggung Jawab
                    </span>
                    <strong className="text-gray-900 dark:text-white font-bold block text-xs">
                      {masterDokumen.mdk_nama_pimpinan_perusahaan || '-'}
                    </strong>
                  </div>

                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800/80 space-y-0.5">
                    <span className="text-gray-500 dark:text-gray-400 block text-[10px] font-bold uppercase tracking-wider">
                      Alamat Perusahaan
                    </span>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-xs">
                      {masterDokumen.mdk_alamat || '-'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
