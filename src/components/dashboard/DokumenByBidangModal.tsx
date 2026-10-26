"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Modal } from '@/components/ui/modal';
import { formatRupiah } from '@/lib/terbilang';
import { getDokumenByBidangAction } from '@/features/dashboard/actions';

interface DokumenByBidangModalProps {
  isOpen: boolean;
  onClose: () => void;
  bdgId: number | null;
  bdgNama: string;
}

export const DokumenByBidangModal: React.FC<DokumenByBidangModalProps> = ({
  isOpen,
  onClose,
  bdgId,
  bdgNama,
}) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isOpen && bdgId !== null) {
      setLoading(true);
      setSearch('');
      getDokumenByBidangAction(bdgId).then((res) => {
        if (res.success && res.data) {
          setDocuments(res.data);
        } else {
          setDocuments([]);
        }
        setLoading(false);
      });
    }
  }, [isOpen, bdgId]);

  if (!isOpen) return null;

  const filteredDocs = documents.filter((doc) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      doc.mdk_no_dpa?.toLowerCase().includes(q) ||
      doc.mdk_pekerjaan?.toLowerCase().includes(q) ||
      doc.mdk_uraian_belanja?.toLowerCase().includes(q) ||
      doc.mdk_program?.toLowerCase().includes(q)
    );
  });

  const totalPaguFiltered = filteredDocs.reduce((acc, curr) => acc + (curr.mdk_pagu_anggaran || 0), 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl p-6 lg:p-8">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-brand-500"></span>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Rincian Dokumen - {bdgNama}
              </h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Daftar Master Dokumen yang terdaftar pada bidang ini ({documents.length} Dokumen)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-bold">
              Total Pagu: {formatRupiah(totalPaguFiltered)}
            </span>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Cari No. DPA, Pekerjaan, Uraian, Program..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
          <svg
            className="w-4 h-4 absolute left-3 top-2.5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Table / List Area */}
        <div className="max-h-[380px] overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-800">
          {loading ? (
            <div className="py-12 text-center text-xs text-gray-400 flex flex-col items-center justify-center gap-2">
              <svg className="animate-spin h-6 w-6 text-brand-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Memuat dokumen...</span>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-400">
              Tidak ada dokumen ditemukan.
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="py-2.5 px-3">No</th>
                  <th className="py-2.5 px-3">No. DPA</th>
                  <th className="py-2.5 px-3">Pekerjaan / Uraian</th>
                  <th className="py-2.5 px-3 text-right">Pagu Anggaran</th>
                  <th className="py-2.5 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-gray-800 dark:text-gray-200">
                {filteredDocs.map((doc, idx) => (
                  <tr key={doc.mdk_id || idx} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                    <td className="py-2.5 px-3 text-gray-400">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-mono font-medium text-brand-600 dark:text-brand-400">
                      {doc.mdk_no_dpa || '-'}
                    </td>
                    <td className="py-2.5 px-3 max-w-[280px]">
                      <div className="font-semibold text-gray-900 dark:text-white truncate" title={doc.mdk_pekerjaan || doc.mdk_uraian_belanja}>
                        {doc.mdk_pekerjaan || doc.mdk_uraian_belanja || '-'}
                      </div>
                      <div className="text-[10px] text-gray-400 truncate" title={doc.mdk_program}>
                        {doc.mdk_program || '-'}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold">
                      {formatRupiah(doc.mdk_pagu_anggaran)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <Link
                        href={`/master-dokumen/${doc.mdk_id}`}
                        onClick={onClose}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 dark:text-blue-400 text-[11px] font-medium transition-all"
                        title="Buka rincian sub-menu dokumen"
                      >
                        <span>Buka</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </Modal>
  );
};
