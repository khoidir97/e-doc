"use client";

import React, { useState } from "react";
import { PaguPerBidang } from "@/features/dashboard/types";
import { formatRupiah } from "./EDocMetrics";
import { DokumenByBidangModal } from "./DokumenByBidangModal";

interface PaguPerBidangTableProps {
  data: PaguPerBidang[];
}

// Warna dot per index (selaras dengan grafik PaguPerBidangChart)
const DOT_COLORS = [
  "bg-indigo-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-pink-500",
  "bg-purple-500",
];

export const PaguPerBidangTable: React.FC<PaguPerBidangTableProps> = ({ data }) => {
  const [selectedBidang, setSelectedBidang] = useState<{ id: number; nama: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (item: PaguPerBidang) => {
    setSelectedBidang({ id: item.bdg_id, nama: item.bdg_nama });
    setIsModalOpen(true);
  };

  const totalPaguAll = data.reduce((acc, curr) => acc + (curr.total_pagu || 0), 0);
  const totalDokumenAll = data.reduce((acc, curr) => acc + (curr.total_dokumen || 0), 0);

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
            Rincian Pagu Per Bidang
          </h2>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
            Klik nama bidang untuk melihat daftar dokumen aktif
          </p>
        </div>
        <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/50 dark:text-emerald-400">
          {totalDokumenAll} Dokumen
        </span>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
              <th
                scope="col"
                className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500"
              >
                Bidang
              </th>
              <th
                scope="col"
                className="px-3 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500"
              >
                Dokumen
              </th>
              <th
                scope="col"
                className="px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500"
              >
                Total Pagu
              </th>
              <th
                scope="col"
                className="px-5 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500"
              >
                Porsi
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
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
                  className="group transition-colors hover:bg-gray-50/70 dark:hover:bg-white/[0.02]"
                >
                  {/* Nama Bidang */}
                  <td className="px-5 py-2.5">
                    <button
                      type="button"
                      onClick={() => handleOpenModal(item)}
                      className="flex items-center gap-2.5 text-left text-xs font-medium text-gray-800 transition-colors hover:text-indigo-600 focus-visible:outline-none dark:text-gray-200 dark:hover:text-indigo-400 cursor-pointer"
                      title={`Lihat rincian dokumen ${item.bdg_nama}`}
                    >
                      <span
                        aria-hidden="true"
                        className={`inline-block h-2 w-2 shrink-0 rounded-full ${DOT_COLORS[idx % DOT_COLORS.length]}`}
                      />
                      <span className="truncate max-w-[160px] sm:max-w-[200px]">{item.bdg_nama}</span>
                    </button>
                  </td>

                  {/* Jumlah Dokumen Button */}
                  <td className="px-3 py-2.5 text-center">
                    <button
                      type="button"
                      onClick={() => handleOpenModal(item)}
                      className="inline-flex items-center gap-1 rounded-md border border-gray-200/80 bg-gray-50 px-2 py-0.5 text-xs font-semibold text-gray-700 transition-all hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 focus-visible:outline-none dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-400 cursor-pointer"
                      title={`Buka rincian ${item.total_dokumen} dokumen`}
                    >
                      <svg
                        className="h-3 w-3 text-gray-400 group-hover:text-indigo-500"
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
                  <td className="px-3 py-2.5 text-right text-xs font-semibold tabular-nums text-gray-700 dark:text-gray-200">
                    {formatRupiah(item.total_pagu)}
                  </td>

                  {/* Porsi % + mini bar */}
                  <td className="px-5 py-2.5 text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[11px] font-semibold tabular-nums text-gray-500 dark:text-gray-400">
                        {item.persentase}%
                      </span>
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${DOT_COLORS[idx % DOT_COLORS.length]}`}
                          style={{ width: `${Math.min(item.persentase, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>

          {/* Footer Total Row */}
          {data.length > 0 && (
            <tfoot>
              <tr className="border-t border-gray-200/80 bg-gray-50/70 font-semibold text-xs text-gray-800 dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-200">
                <th scope="row" className="px-5 py-3">
                  Total
                </th>
                <td className="px-3 py-3 text-center">
                  <span className="inline-flex items-center rounded-md bg-gray-200/70 dark:bg-gray-700 px-2 py-0.5 text-xs font-bold text-gray-700 dark:text-gray-200">
                    {totalDokumenAll}
                  </span>
                </td>
                <td className="px-3 py-3 text-right tabular-nums font-bold text-gray-900 dark:text-white">
                  {formatRupiah(totalPaguAll)}
                </td>
                <td className="px-5 py-3 text-right tabular-nums text-gray-600 dark:text-gray-400">
                  100%
                </td>
              </tr>
            </tfoot>
          )}
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
