"use client";

import React from "react";
import { PaguPerPptk } from "@/features/dashboard/types";
import { formatRupiah } from "./EDocMetrics";

interface PaguPerPptkTableProps {
  data: PaguPerPptk[];
}

// ─── Inline progress bar component ──────────────────────────
const ProgressBar = ({
  percentage,
  isOverBudget,
}: {
  percentage: number;
  isOverBudget: boolean;
}) => (
  <div className="flex items-center justify-end gap-2.5">
    <div
      className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
      role="progressbar"
      aria-valuenow={Math.round(percentage)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-all duration-700 ${
          isOverBudget
            ? "bg-gradient-to-r from-red-500 to-red-400"
            : "bg-gradient-to-r from-brand-500 to-brand-400"
        }`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
    <span
      className={`w-12 text-right text-xs font-semibold tabular-nums ${
        isOverBudget
          ? "text-red-600 dark:text-red-400"
          : "text-gray-500 dark:text-gray-400"
      }`}
    >
      {percentage.toFixed(1)}%
    </span>
  </div>
);

// ─── Avatar initial component ────────────────────────────────
const AvatarInitial = ({ name }: { name: string }) => {
  const initial = name?.charAt(0)?.toUpperCase() ?? "?";
  const hues = [
    "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300",
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  ];
  // pick color by char code so it's stable per name
  const colorClass = hues[(name?.charCodeAt(0) ?? 0) % hues.length];

  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${colorClass}`}
    >
      {initial}
    </span>
  );
};

// ─── PaguPerPptkTable ────────────────────────────────────────
export const PaguPerPptkTable: React.FC<PaguPerPptkTableProps> = ({ data }) => {
  const totals = data.reduce(
    (acc, item) => ({
      total_pagu: acc.total_pagu + item.total_pagu,
      total_terpakai: acc.total_terpakai + item.total_terpakai,
      total_dokumen: acc.total_dokumen + item.total_dokumen,
    }),
    { total_pagu: 0, total_terpakai: 0, total_dokumen: 0 },
  );

  const totalPercentage =
    totals.total_pagu > 0
      ? ((totals.total_terpakai / totals.total_pagu) * 100).toFixed(1)
      : "0.0";

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between md:px-6">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-gray-800 dark:text-white">
            Rekap Anggaran per PPTK
          </h2>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
            Pagu dokumen dan realisasi terpakai berdasarkan pembayaran NPD
          </p>
        </div>

        {/* Summary chips */}
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-300">
            <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {data.length} PPTK
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-300">
            <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {totals.total_dokumen} Dokumen
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              {["PPTK", "Dokumen", "Total Pagu", "Terpakai (NPD)", "Terserap"].map((h, i) => (
                <th
                  key={h}
                  scope="col"
                  className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 ${
                    i === 0
                      ? "pl-5 md:pl-6"
                      : i === 4
                      ? "pr-5 text-right md:pr-6"
                      : i === 1
                      ? "text-center"
                      : "text-right"
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50 dark:divide-gray-800/60">
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-sm text-gray-400 dark:text-gray-500">
                  <svg
                    className="mx-auto mb-2 h-8 w-8 opacity-30"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Data PPTK belum tersedia
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const percentage =
                  item.total_pagu > 0
                    ? (item.total_terpakai / item.total_pagu) * 100
                    : 0;
                const isOverBudget = percentage > 100;

                return (
                  <tr
                    key={item.pgw_id}
                    className="group transition-colors hover:bg-gray-50/80 dark:hover:bg-white/[0.02]"
                  >
                    {/* PPTK name */}
                    <th
                      scope="row"
                      className="px-4 py-3.5 pl-5 font-medium md:pl-6"
                    >
                      <div className="flex items-center gap-2.5">
                        <AvatarInitial name={item.pgw_nama} />
                        <span className="text-sm text-gray-700 dark:text-gray-200">
                          {item.pgw_nama}
                        </span>
                      </div>
                    </th>

                    {/* Dokumen count */}
                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-gray-100 px-2 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        {item.total_dokumen}
                      </span>
                    </td>

                    {/* Total Pagu */}
                    <td className="px-4 py-3.5 text-right text-sm tabular-nums text-gray-600 dark:text-gray-300">
                      {formatRupiah(item.total_pagu)}
                    </td>

                    {/* Terpakai */}
                    <td className="px-4 py-3.5 text-right text-sm font-semibold tabular-nums text-gray-800 dark:text-white/90">
                      {formatRupiah(item.total_terpakai)}
                    </td>

                    {/* Progress */}
                    <td className="px-4 py-3.5 pr-5 md:pr-6">
                      <ProgressBar percentage={percentage} isOverBudget={isOverBudget} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          {/* Footer totals */}
          {data.length > 0 && (
            <tfoot>
              <tr className="border-t border-gray-200 bg-gray-50/70 dark:border-gray-800 dark:bg-white/[0.02]">
                <th
                  scope="row"
                  className="px-4 py-3.5 pl-5 text-xs font-bold uppercase tracking-wide text-gray-600 dark:text-gray-300 md:pl-6"
                >
                  Grand Total
                </th>
                <td className="px-4 py-3.5 text-center">
                  <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-gray-200 px-2 text-xs font-bold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                    {totals.total_dokumen}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right text-sm font-bold tabular-nums text-gray-800 dark:text-white/90">
                  {formatRupiah(totals.total_pagu)}
                </td>
                <td className="px-4 py-3.5 text-right text-sm font-bold tabular-nums text-gray-800 dark:text-white/90">
                  {formatRupiah(totals.total_terpakai)}
                </td>
                <td className="px-4 py-3.5 pr-5 text-right text-xs font-bold tabular-nums text-gray-500 dark:text-gray-400 md:pr-6">
                  {totalPercentage}%
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </section>
  );
};
