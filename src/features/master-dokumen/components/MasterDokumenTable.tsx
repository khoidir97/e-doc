"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { MasterDokumen } from '../types';

interface MasterDokumenTableProps {
  data: MasterDokumen[];
  loading: boolean;
  onEdit: (masterDokumen: MasterDokumen) => void;
  onDelete: (masterDokumen: MasterDokumen) => void;
  onCopy?: (masterDokumen: MasterDokumen) => void;
  onPrint?: (masterDokumen: MasterDokumen) => void;
  onToggleLock?: (masterDokumen: MasterDokumen) => void;
  userRole?: number | null;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (newPage: number) => void;
}

export const MasterDokumenTable: React.FC<MasterDokumenTableProps> = ({
  data,
  loading,
  onEdit,
  onDelete,
  onCopy,
  onPrint,
  onToggleLock,
  userRole,
  page,
  totalPages,
  total,
  onPageChange,
}) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-all">
      {/* Scrollable Container with sleek scrollbar */}
      <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
        <table className="w-full text-left border-collapse ">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/60 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <th className="px-4 py-3.5 text-center w-12">No</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Bidang & Pagu Anggaran</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Program & Sub Kegiatan</th>
              <th className="px-5 py-3.5 whitespace-nowrap">Uraian & Rek. Belanja</th>
              <th className="px-5 py-3.5 whitespace-nowrap">No. DPA & APBD</th>
              <th className="px-5 py-3.5 text-center whitespace-nowrap">Detail</th>
              <th className="px-5 py-3.5 text-right pr-6 sticky right-0 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-xs">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-xs">
            {loading ? (
              // Skeleton loading rows
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-4 py-4 text-center">
                    <div className="h-4 w-4 bg-gray-200 dark:bg-gray-800 rounded mx-auto"></div>
                  </td>
                  <td className="px-5 py-4 space-y-2">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    <div className="h-3 w-24 bg-gray-100 dark:bg-gray-800/60 rounded"></div>
                  </td>
                  <td className="px-5 py-4 space-y-2">
                    <div className="h-4 w-40 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    <div className="h-3 w-28 bg-gray-100 dark:bg-gray-800/60 rounded"></div>
                  </td>
                  <td className="px-5 py-4 space-y-2">
                    <div className="h-4 w-36 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    <div className="h-3 w-20 bg-gray-100 dark:bg-gray-800/60 rounded"></div>
                  </td>
                  <td className="px-5 py-4 space-y-2">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto"></div>
                  </td>
                  <td className="px-5 py-4 text-right pr-6 sticky right-0 bg-white dark:bg-gray-900">
                    <div className="h-6 w-14 bg-gray-200 dark:bg-gray-800 rounded ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                    <div className="p-4 rounded-full bg-brand-50 text-brand-500 dark:bg-brand-900/30 dark:text-brand-400">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Belum ada Data Master Dokumen</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      Belum ada data master dokumen yang tersimpan. Klik tombol <span className="font-semibold text-brand-600 dark:text-brand-400">"+ Tambah"</span> untuk memasukkan data baru.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const isExpanded = expandedId === item.mdk_id;
                return (
                  <React.Fragment key={item.mdk_id}>
                    <tr
                      className={`transition-colors border-b border-gray-100 dark:border-gray-800/60 ${isExpanded ? 'bg-brand-50/40 dark:bg-brand-900/10' : 'hover:bg-gray-50/80 dark:hover:bg-gray-800/40'
                        }`}
                    >
                      {/* No */}
                      <td className="px-4 py-3.5 text-center text-gray-500 dark:text-gray-400 font-medium">
                        {(page - 1) * 10 + index + 1}
                      </td>

                      {/* Bagian & Pagu */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white" title={item.mdk_bagian}>
                          {item.mdk_is_lock === 1 && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/60" title="Dokumen Dikunci">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                              Locked
                            </span>
                          )}
                          <span>{item.mdk_bagian || '-'}</span>
                        </div>
                        <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {formatRupiah(item.mdk_pagu_anggaran)}
                        </div>
                      </td>

                      {/* Program & Sub Kegiatan */}
                      <td className="px-5 py-3.5">
                        {item.mdk_sub_kegiatan ? (
                          <>
                            <div className="font-medium text-gray-800 dark:text-gray-200" title={item.mdk_sub_kegiatan}>
                              {item.mdk_sub_kegiatan}
                            </div>
                            <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5" title={item.mdk_program}>
                              {item.mdk_kode_program ? <span className="font-mono font-semibold text-gray-600 dark:text-gray-400 mr-1">[{item.mdk_kode_program}]</span> : null}
                              {item.mdk_program || '-'}
                            </div>
                          </>
                        ) : (
                          <div className="text-gray-800 dark:text-gray-200" title={item.mdk_program}>
                            {item.mdk_program || '-'}
                          </div>
                        )}
                      </td>

                      {/* Uraian & Rek Belanja */}
                      <td className="px-5 py-3.5">
                        <div className="text-gray-800 dark:text-gray-200 font-medium" title={item.mdk_uraian_belanja}>
                          {item.mdk_uraian_belanja.slice(0, 50) + '...' || '-'}
                        </div>
                        {item.mdk_rekening_belanja && (
                          <div className="text-[11px] font-mono text-gray-500 dark:text-gray-400 mt-0.5">
                            {item.mdk_pekerjaan}
                          </div>
                        )}
                      </td>

                      {/* No DPA & APBD */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="font-medium text-gray-800 dark:text-gray-200">
                          {item.mdk_no_dpa || '-'}
                        </div>
                        {item.mdk_apbd && (
                          <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/40">
                            {item.mdk_apbd}
                          </div>
                        )}
                      </td>

                      {/* Detail Expand Toggle Button */}
                      <td className="px-5 py-3.5 text-center whitespace-nowrap">
                        <button
                          onClick={() => toggleExpand(item.mdk_id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${isExpanded
                            ? 'bg-brand-500 text-white shadow-xs'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300'
                            }`}
                        >
                          <span>{isExpanded ? 'Tutup' : 'Detail'}</span>
                          <svg
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </td>

                      {/* Action Buttons */}
                      <td className="px-5 py-3.5 text-right pr-6 sticky right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xs shadow-xs">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Lock / Unlock Toggle Button (Only accessible for userRole === 0) */}
                          {userRole === 0 && onToggleLock && (
                            <button
                              onClick={() => onToggleLock(item)}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${item.mdk_is_lock === 1
                                  ? 'text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400'
                                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                              title={item.mdk_is_lock === 1 ? 'Dokumen Terkunci (Klik untuk Buka Kunci)' : 'Dokumen Terbuka (Klik untuk Kunci)'}
                            >
                              {item.mdk_is_lock === 1 ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                </svg>
                              )}
                            </button>
                          )}

                          <Link
                            href={`/master-dokumen/${item.mdk_id}`}
                            className="p-1.5 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/30 transition-colors cursor-pointer"
                            title="Buka Detail Sub-Menu (Survey, RAB, HPS, Penawaran, Nego, Perhitungan, Kwitansi, Faktur)"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>

                          {/* Edit button: disabled if locked */}
                          {item.mdk_is_lock === 1 ? (
                            <button
                              disabled
                              className="p-1.5 rounded-lg text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-50"
                              title="Dokumen Terkunci - Tidak dapat diedit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          ) : (
                            <button
                              onClick={() => onEdit(item)}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-brand-600 hover:bg-brand-50 dark:text-gray-400 dark:hover:text-brand-400 dark:hover:bg-brand-900/20 transition-colors cursor-pointer"
                              title="Edit Master Dokumen"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          )}

                          {onCopy && (
                            <button
                              onClick={() => onCopy(item)}
                              className="p-1.5 rounded-lg text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/30 transition-colors cursor-pointer"
                              title="Copy / Duplikat Master Dokumen"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          )}

                          {item.mdk_is_lock === 1 ? (
                            <button
                              disabled
                              className="p-1.5 rounded-lg text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-50"
                              title="Dokumen Terkunci - Tidak dapat dihapus"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          ) : (
                            <button
                              onClick={() => onDelete(item)}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                              title="Hapus Master Dokumen"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* EXPANDED ACCORDION ROW FOR FULL 24 FIELDS DETAILS */}
                    {isExpanded && (
                      <tr className="bg-slate-50/70 dark:bg-gray-800/30 border-b border-gray-200/80 dark:border-gray-700/60">
                        <td colSpan={7} className="px-6 py-4">
                          <div className="p-4 rounded-xl bg-white dark:bg-gray-800/90 border border-gray-200/80 dark:border-gray-700 shadow-xs space-y-4">
                            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700/80 pb-3">
                              <div className="flex items-center gap-2">
                                <span className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </span>
                                <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                                  Rincian Lengkap Master Dokumen #{item.mdk_id}
                                </h4>
                              </div>
                              <span className="text-[11px] text-gray-400 font-mono">
                                Bagian: {item.mdk_bagian || '-'}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                              {/* Section 1: Pejabat & Internal */}
                              <div className="p-3 rounded-lg bg-gray-50/80 dark:bg-gray-900/50 space-y-2 border border-gray-100 dark:border-gray-800">
                                <div className="font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200/60 dark:border-gray-700/60 pb-1 flex items-center gap-1.5">
                                  <span>👤 Pejabat & Internal</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400 block text-[10px]">Pejabat Utama:</span>
                                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                                    {item.mdk_nama_pejabat || (item.mdk_nama_pejabat_id > 0 ? `ID: ${item.mdk_nama_pejabat_id}` : '-')}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400 block text-[10px]">Pejabat Pengadaan:</span>
                                  <span className="font-medium text-gray-800 dark:text-gray-200">{item.mdk_nama_pejabat_pengadaan || '-'}</span>
                                  {item.mdk_nip_pejabat_pengadaan && (
                                    <span className="block text-[10px] text-gray-500">NIP: {item.mdk_nip_pejabat_pengadaan}</span>
                                  )}
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400 block text-[10px]">PPTK:</span>
                                  <span className="font-medium text-gray-800 dark:text-gray-200">
                                    {item.mdk_nama_pptk || (item.mdk_nama_pptk_id > 0 ? `ID: ${item.mdk_nama_pptk_id}` : '-')}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400 block text-[10px]">Bendahara/Pembantu Bendahara:</span>
                                  <span className="font-medium text-gray-800 dark:text-gray-200">
                                    {item.mdk_nama_bendahara || (item.mdk_nama_bendahara_id > 0 ? `ID: ${item.mdk_nama_bendahara_id}` : '-')}
                                  </span>
                                </div>
                              </div>

                              {/* Section 2: Penyedia / Rekanan */}
                              <div className="p-3 rounded-lg bg-gray-50/80 dark:bg-gray-900/50 space-y-2 border border-gray-100 dark:border-gray-800">
                                <div className="font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200/60 dark:border-gray-700/60 pb-1 flex items-center gap-1.5">
                                  <span>🏢 Perusahaan / Penyedia</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400 block text-[10px]">Nama Perusahaan:</span>
                                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                                    {item.mdk_nama_perusahaan || (item.mdk_nama_perusahaan_id > 0 ? `ID: ${item.mdk_nama_perusahaan_id}` : '-')}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400 block text-[10px]">Direktur / Pimpinan:</span>
                                  <span className="font-medium text-gray-800 dark:text-gray-200">{item.mdk_nama_pimpinan_perusahaan || '-'}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400 block text-[10px]">Alamat:</span>
                                  <span className="text-gray-700 dark:text-gray-300">{item.mdk_alamat || '-'}</span>
                                </div>
                              </div>

                              {/* Section 3: Hierarki Program */}
                              <div className="p-3 rounded-lg bg-gray-50/80 dark:bg-gray-900/50 space-y-2 border border-gray-100 dark:border-gray-800">
                                <div className="font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200/60 dark:border-gray-700/60 pb-1 flex items-center gap-1.5">
                                  <span>📋 Program & Kegiatan</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400 block text-[10px]">Program:</span>
                                  <span className="font-medium text-gray-800 dark:text-gray-200">
                                    {item.mdk_kode_program ? `[${item.mdk_kode_program}] ` : ''}{item.mdk_program || '-'}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400 block text-[10px]">Kegiatan:</span>
                                  <span className="font-medium text-gray-800 dark:text-gray-200">
                                    {item.mdk_kode_kegiatan ? `[${item.mdk_kode_kegiatan}] ` : ''}{item.mdk_kegiatan || '-'}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400 block text-[10px]">Sub Kegiatan:</span>
                                  <span className="font-medium text-gray-800 dark:text-gray-200">
                                    {item.mdk_kode_sub_kegiatan ? `[${item.mdk_kode_sub_kegiatan}] ` : ''}{item.mdk_sub_kegiatan || '-'}
                                  </span>
                                </div>
                              </div>

                              {/* Section 4: Anggaran & Belanja */}
                              <div className="p-3 rounded-lg bg-gray-50/80 dark:bg-gray-900/50 space-y-2 border border-gray-100 dark:border-gray-800">
                                <div className="font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200/60 dark:border-gray-700/60 pb-1 flex items-center gap-1.5">
                                  <span>💰 Anggaran & Dokumen</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400 block text-[10px]">Pagu Anggaran:</span>
                                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatRupiah(item.mdk_pagu_anggaran)}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400 block text-[10px]">Uraian Belanja:</span>
                                  <span className="font-medium text-gray-800 dark:text-gray-200">{item.mdk_uraian_belanja || '-'}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400 block text-[10px]">Rekening Belanja:</span>
                                  <span className="font-mono text-gray-800 dark:text-gray-200">{item.mdk_rekening_belanja || '-'}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400 block text-[10px]">Keterangan:</span>
                                  <span className="text-gray-600 dark:text-gray-400">{item.mdk_keterangan || '-'}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400 block text-[10px]">Volume:</span>
                                  <span className="text-gray-600 dark:text-gray-400">{item.mdk_volume || '-'}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400 block text-[10px]">Satuan:</span>
                                  <span className="text-gray-600 dark:text-gray-400">{item.mdk_satuan || '-'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-3.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 text-xs text-gray-500 dark:text-gray-400">
        <div>
          Menampilkan <span className="font-semibold text-gray-800 dark:text-gray-200">{data.length > 0 ? (page - 1) * 10 + 1 : 0}</span> -{' '}
          <span className="font-semibold text-gray-800 dark:text-gray-200">{Math.min(page * 10, total)}</span> dari{' '}
          <span className="font-semibold text-gray-800 dark:text-gray-200">{total}</span> data master dokumen
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1 || loading}
            onClick={() => onPageChange(page - 1)}
            className="px-3.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-40 transition-colors cursor-pointer font-medium shadow-xs"
          >
            Sebelumnya
          </button>
          <span className="px-2 font-semibold text-gray-800 dark:text-white">
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages || loading}
            onClick={() => onPageChange(page + 1)}
            className="px-3.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-40 transition-colors cursor-pointer font-medium shadow-xs"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
};
