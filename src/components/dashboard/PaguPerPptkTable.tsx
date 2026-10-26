"use client";

import React from "react";
import { PaguPerPptk } from "@/features/dashboard/types";
import { formatRupiah } from "./EDocMetrics";

interface PaguPerPptkTableProps {
  data: PaguPerPptk[];
}

export const PaguPerPptkTable: React.FC<PaguPerPptkTableProps> = ({ data }) => {
  const totals = data.reduce(
    (summary, item) => ({
      total_pagu: summary.total_pagu + item.total_pagu,
      total_terpakai: summary.total_terpakai + item.total_terpakai,
      total_dokumen: summary.total_dokumen + item.total_dokumen,
    }),
    { total_pagu: 0, total_terpakai: 0, total_dokumen: 0 },
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex flex-col gap-1 border-b border-gray-100 px-5 py-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between md:px-6">
        <div>
          <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Rekap Anggaran per PPTK
          </h2>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Pagu dokumen dan realisasi terpakai berdasarkan pembayaran NPD
          </p>
        </div>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {data.length} PPTK · {totals.total_dokumen} dokumen
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <th scope="col" className="px-5 py-3 md:px-6">PPTK</th>
              <th scope="col" className="px-3 py-3 text-center">Dokumen</th>
              <th scope="col" className="px-3 py-3 text-right">Total Pagu</th>
              <th scope="col" className="px-3 py-3 text-right">Terpakai (NPD)</th>
              <th scope="col" className="px-5 py-3 text-right md:px-6">Terserap</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                  Data pegawai dengan jabatan PPTK belum tersedia.
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const percentage = item.total_pagu > 0
                  ? (item.total_terpakai / item.total_pagu) * 100
                  : 0;
                const isOverBudget = percentage > 100;

                return (
                  <tr key={item.pgw_id} className="transition-colors hover:bg-gray-50/70 dark:hover:bg-white/[0.02]">
                    <th scope="row" className="px-5 py-3.5 font-medium text-gray-800 dark:text-white/90 md:px-6">
                      {item.pgw_nama}
                    </th>
                    <td className="px-3 py-3.5 text-center text-gray-600 dark:text-gray-300">
                      {item.total_dokumen}
                    </td>
                    <td className="px-3 py-3.5 text-right font-medium tabular-nums text-gray-700 dark:text-gray-200">
                      {formatRupiah(item.total_pagu)}
                    </td>
                    <td className="px-3 py-3.5 text-right font-semibold tabular-nums text-gray-800 dark:text-white/90">
                      {formatRupiah(item.total_terpakai)}
                    </td>
                    <td className="px-5 py-3.5 md:px-6">
                      <div className="flex items-center justify-end gap-2">
                        <div
                          className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
                          role="progressbar"
                          aria-label={`Realisasi anggaran ${item.pgw_nama}`}
                          aria-valuenow={Math.round(percentage)}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className={`h-full rounded-full ${isOverBudget ? "bg-red-500" : "bg-blue-600"}`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                        <span className={`w-12 text-right text-xs font-semibold tabular-nums ${isOverBudget ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"}`}>
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {data.length > 0 && (
            <tfoot className="border-t border-gray-200 bg-gray-50/70 dark:border-gray-800 dark:bg-white/[0.02]">
              <tr>
                <th scope="row" className="px-5 py-3.5 text-xs font-bold uppercase tracking-wide text-gray-700 dark:text-gray-200 md:px-6">
                  Total
                </th>
                <td className="px-3 py-3.5 text-center font-semibold text-gray-700 dark:text-gray-200">
                  {totals.total_dokumen}
                </td>
                <td className="px-3 py-3.5 text-right font-bold tabular-nums text-gray-800 dark:text-white/90">
                  {formatRupiah(totals.total_pagu)}
                </td>
                <td className="px-3 py-3.5 text-right font-bold tabular-nums text-gray-800 dark:text-white/90">
                  {formatRupiah(totals.total_terpakai)}
                </td>
                <td className="px-5 py-3.5 text-right text-xs font-semibold tabular-nums text-gray-500 dark:text-gray-400 md:px-6">
                  {totals.total_pagu > 0
                    ? `${((totals.total_terpakai / totals.total_pagu) * 100).toFixed(1)}%`
                    : "0.0%"}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </section>
  );
};
