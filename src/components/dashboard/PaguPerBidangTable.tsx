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
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Rincian Pagu Per Bidang
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Detail alokasi anggaran dan jumlah dokumen per bidang (Klik jumlah dokumen untuk rincian)
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 text-xs font-semibold uppercase text-gray-400">
              <th className="pb-3 pl-1">Bidang</th>
              <th className="pb-3 text-center">Dokumen</th>
              <th className="pb-3 text-right">Total Pagu</th>
              <th className="pb-3 text-right pr-1">Porsi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-xs text-gray-400">
                  Data bidang belum tersedia.
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr key={item.bdg_id || idx} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pl-1 font-medium text-gray-800 dark:text-white/90">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="flex items-center gap-2 hover:text-brand-600 dark:hover:text-brand-400 text-left transition-colors cursor-pointer"
                      title={`Lihat rincian dokumen ${item.bdg_nama}`}
                    >
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500/80"></span>
                      <span>{item.bdg_nama}</span>
                    </button>
                  </td>
                  <td className="py-3 text-center text-gray-600 dark:text-gray-300 font-medium">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950/40 dark:hover:bg-brand-900/60 dark:text-brand-300 text-xs font-bold transition-all cursor-pointer shadow-xs border border-brand-200/60 dark:border-brand-800/60"
                      title={`Lihat rincian ${item.total_dokumen} dokumen ${item.bdg_nama}`}
                    >
                      <svg className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{item.total_dokumen} Dok</span>
                    </button>
                  </td>
                  <td className="py-3 text-right font-semibold text-gray-800 dark:text-white/90">
                    {formatRupiah(item.total_pagu)}
                  </td>
                  <td className="py-3 text-right pr-1">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 bg-gray-100 rounded-full h-1.5 dark:bg-gray-800 overflow-hidden">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${Math.min(item.persentase, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 font-medium w-10 text-right">
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
    </div>
  );
};
