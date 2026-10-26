"use client";

import React, { useState } from "react";
import { PaguPerBidang } from "@/features/dashboard/types";
import { formatRupiah } from "./EDocMetrics";
import { DokumenByBidangModal } from "./DokumenByBidangModal";

interface PaguPerBidangTableProps {
  data: PaguPerBidang[];
}

export const PaguPerBidangTable: React.FC<PaguPerBidangTableProps> = ({ data }) => {
  const [selectedBidang, setSelectedBidang] = useState<{ id: number; nama: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (item: PaguPerBidang) => {
    setSelectedBidang({ id: item.bdg_id, nama: item.bdg_nama });
    setIsModalOpen(true);
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800 md:px-6">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white md:text-lg">
            Rincian Pagu Per Bidang
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Detail alokasi anggaran dan jumlah dokumen per bidang (Klik jumlah dokumen untuk rincian)
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <th scope="col" className="px-5 py-3">Bidang</th>
              <th scope="col" className="px-3 py-3 text-center">Dokumen</th>
              <th scope="col" className="px-3 py-3 text-right">Total Pagu</th>
              <th scope="col" className="px-5 py-3 text-right">Porsi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                  Data bidang belum tersedia.
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr key={item.bdg_id || idx} className="transition-colors hover:bg-gray-50/70 dark:hover:bg-white/[0.02]">
                  <td className="px-5 py-3.5 font-medium text-gray-800 dark:text-white/90">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="flex items-center gap-2 text-left transition-colors hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:hover:text-brand-400"
                      title={`Lihat rincian dokumen ${item.bdg_nama}`}
                    >
                      <span aria-hidden="true" className="inline-block h-2 w-2 shrink-0 rounded-full bg-blue-500/80"></span>
                      <span>{item.bdg_nama}</span>
                    </button>
                  </td>
                  <td className="px-3 py-3.5 text-center font-medium text-gray-600 dark:text-gray-300">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="inline-flex items-center gap-1 rounded-lg border border-brand-200/60 bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 shadow-xs transition-colors hover:bg-brand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-brand-800/60 dark:bg-brand-950/40 dark:text-brand-300 dark:hover:bg-brand-900/60"
                      title={`Lihat rincian ${item.total_dokumen} dokumen ${item.bdg_nama}`}
                    >
                      <svg className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{item.total_dokumen} Dok</span>
                    </button>
                  </td>
                  <td className="px-3 py-3.5 text-right font-semibold tabular-nums text-gray-800 dark:text-white/90">
                    {formatRupiah(item.total_pagu)}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${Math.min(item.persentase, 100)}%` }}
                        ></div>
                      </div>
                      <span className="w-10 text-right text-xs font-medium tabular-nums text-gray-500 dark:text-gray-400">
                        {item.persentase}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Rincian Dokumen Modal */}
      <DokumenByBidangModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bdgId={selectedBidang?.id ?? null}
        bdgNama={selectedBidang?.nama ?? ''}
      />
    </section>
  );
};
