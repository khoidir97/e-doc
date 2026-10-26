"use client";

import React, { useState } from "react";
import { PaguPerBidang } from "@/features/dashboard/types";
import { formatRupiah } from "./EDocMetrics";
import { DokumenByBidangModal } from "./DokumenByBidangModal";

interface PaguPerBidangTableProps {
  data: PaguPerBidang[];
}

// Warna dot per index (rotating)
const DOT_COLORS = [
  "bg-brand-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-pink-500",
  "bg-violet-500",
];

export const PaguPerBidangTable: React.FC<PaguPerBidangTableProps> = ({ data }) => {
  const [selectedBidang, setSelectedBidang] = useState<{ id: number; nama: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (item: PaguPerBidang) => {
    setSelectedBidang({ id: item.bdg_id, nama: item.bdg_nama });
    setIsModalOpen(true);
  };

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800 md:px-6">
        <h2 className="text-base font-semibold tracking-tight text-gray-800 dark:text-white">
          Rincian Pagu Per Bidang
        </h2>
        <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
          Klik nama bidang atau jumlah dokumen untuk melihat rincian
        </p>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full min-w-[440px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <th
                scope="col"
                className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 md:px-6"
              >
                Bidang
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500"
              >
                Dok.
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500"
              >
                Total Pagu
              </th>
              <th
                scope="col"
                className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 md:px-6"
              >
                Porsi
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50 dark:divide-gray-800/60">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-12 text-center text-sm text-gray-400 dark:text-gray-500"
                >
                  <svg
                    className="mx-auto mb-2 h-8 w-8 opacity-30"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Data bidang belum tersedia
                </td>
              </tr>
            ) : (
              data.map((item, idx) => (
                <tr
                  key={item.bdg_id || idx}
                  className="group transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]"
                >
                  {/* Nama Bidang */}
                  <td className="px-5 py-3 md:px-6">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="flex items-center gap-2.5 text-left text-sm font-medium text-gray-700 transition-colors hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-gray-200 dark:hover:text-brand-400"
                      title={`Lihat rincian dokumen ${item.bdg_nama}`}
                    >
                      <span
                        aria-hidden="true"
                        className={`inline-block h-2 w-2 shrink-0 rounded-full ${DOT_COLORS[idx % DOT_COLORS.length]}`}
                      />
                      <span className="truncate">{item.bdg_nama}</span>
                    </button>
                  </td>

                  {/* Jumlah Dokumen */}
                  <td className="px-3 py-3 text-center">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="inline-flex items-center gap-1 rounded-lg border border-brand-100 bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-brand-800/60 dark:bg-brand-950/40 dark:text-brand-300 dark:hover:bg-brand-900/60"
                      title={`Lihat ${item.total_dokumen} dokumen ${item.bdg_nama}`}
                    >
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      {item.total_dokumen}
                    </button>
                  </td>

                  {/* Total Pagu */}
                  <td className="px-3 py-3 text-right text-sm font-semibold tabular-nums text-gray-700 dark:text-gray-200">
                    {formatRupiah(item.total_pagu)}
                  </td>

                  {/* Porsi % + mini bar */}
                  <td className="px-5 py-3 md:px-6">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-semibold tabular-nums text-gray-500 dark:text-gray-400">
                        {item.persentase}%
                      </span>
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <div
                          className={`h-full rounded-full ${DOT_COLORS[idx % DOT_COLORS.length]}`}
                          style={{ width: `${Math.min(item.persentase, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <DokumenByBidangModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bdgId={selectedBidang?.id ?? null}
        bdgNama={selectedBidang?.nama ?? ""}
      />
    </section>
  );
};
