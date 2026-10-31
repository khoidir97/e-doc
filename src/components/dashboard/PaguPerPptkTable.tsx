"use client";

import React, { useState, useMemo } from "react";
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
        className={`h-full rounded-full transition-all duration-500 ${
          isOverBudget
            ? "bg-gradient-to-r from-rose-500 to-red-400"
            : "bg-gradient-to-r from-indigo-500 to-blue-400"
        }`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
    <span
      className={`w-12 text-right text-xs font-semibold tabular-nums ${
        isOverBudget
          ? "text-rose-600 dark:text-rose-400"
          : "text-gray-600 dark:text-gray-300"
      }`}
    >
      {percentage.toFixed(1)}%
    </span>
  </div>
);

// ─── Avatar initial component ────────────────────────────────
const AvatarInitial = ({ name }: { name: string }) => {
  const initial = name?.trim()?.charAt(0)?.toUpperCase() ?? "?";
  const hues = [
    "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-900/50",
    "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900/50",
    "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900/50",
    "bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-900/50",
    "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-900/50",
  ];
  const colorClass = hues[(name?.charCodeAt(0) ?? 0) % hues.length];

  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold border ${colorClass}`}
    >
      {initial}
    </span>
  );
};

// ─── PaguPerPptkTable ────────────────────────────────────────
export const PaguPerPptkTable: React.FC<PaguPerPptkTableProps> = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const q = searchQuery.toLowerCase();
    return data.filter((item) => item.pgw_nama.toLowerCase().includes(q));
  }, [data, searchQuery]);

  const totals = useMemo(() => {
    return data.reduce(
      (acc, item) => ({
        total_pagu: acc.total_pagu + item.total_pagu,
        total_terpakai: acc.total_terpakai + item.total_terpakai,
        total_dokumen: acc.total_dokumen + item.total_dokumen,
      }),
      { total_pagu: 0, total_terpakai: 0, total_dokumen: 0 },
    );
  }, [data]);

  const totalPercentage =
    totals.total_pagu > 0
      ? ((totals.total_terpakai / totals.total_pagu) * 100).toFixed(1)
      : "0.0";

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="flex flex-col gap-3.5 border-b border-gray-100 px-5 py-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between md:px-6">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
            Rekap Anggaran per PPTK
          </h2>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
            Monitoring pagu dokumen dan serapan realisasi NPD per Pejabat Pelaksana Teknis Kegiatan
          </p>
        </div>

        {/* Search & Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Live Search Input */}
          <div className="relative w-full sm:w-56">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama PPTK..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            <svg
              className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200/70 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            {data.length} PPTK
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/50 dark:text-indigo-300">
            {totals.total_dokumen} Dokumen
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
              {["PPTK", "Dokumen", "Total Pagu", "Terpakai (NPD)", "Terserap"].map((h, i) => (
                <th
                  key={h}
                  scope="col"
                  className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 ${
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

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
            {filteredData.length === 0 ? (
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
                  {searchQuery ? "Tidak ada nama PPTK yang cocok dengan pencarian" : "Data PPTK belum tersedia"}
                </td>
              </tr>
            ) : (
              filteredData.map((item) => {
                const percentage =
                  item.total_pagu > 0
                    ? (item.total_terpakai / item.total_pagu) * 100
                    : 0;
                const isOverBudget = percentage > 100;

                return (
                  <tr
                    key={item.pgw_id}
                    className="group transition-colors hover:bg-gray-50/70 dark:hover:bg-white/[0.02]"
                  >
                    {/* PPTK name */}
                    <td className="px-4 py-3 pl-5 font-medium md:pl-6">
                      <div className="flex items-center gap-2.5">
                        <AvatarInitial name={item.pgw_nama} />
                        <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                          {item.pgw_nama}
                        </span>
                      </div>
                    </td>

                    {/* Dokumen count */}
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex h-5 min-w-6 items-center justify-center rounded-md bg-gray-100 px-2 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        {item.total_dokumen}
                      </span>
                    </td>

                    {/* Total Pagu */}
                    <td className="px-4 py-3 text-right text-xs tabular-nums text-gray-600 dark:text-gray-300">
                      {formatRupiah(item.total_pagu)}
                    </td>

                    {/* Terpakai */}
                    <td className="px-4 py-3 text-right text-xs font-semibold tabular-nums text-gray-900 dark:text-white">
                      {formatRupiah(item.total_terpakai)}
                    </td>

                    {/* Progress */}
                    <td className="px-4 py-3 pr-5 md:pr-6">
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
              <tr className="border-t border-gray-200/80 bg-gray-50/70 font-semibold text-xs text-gray-800 dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-200">
                <th
                  scope="row"
                  className="px-4 py-3 pl-5 md:pl-6 uppercase tracking-wider text-[11px] text-gray-600 dark:text-gray-400"
                >
                  Grand Total
                </th>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex h-5 min-w-6 items-center justify-center rounded-md bg-gray-200/70 dark:bg-gray-700 px-2 text-xs font-bold text-gray-800 dark:text-gray-200">
                    {totals.total_dokumen}
                  </span>
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-bold text-gray-900 dark:text-white">
                  {formatRupiah(totals.total_pagu)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-bold text-gray-900 dark:text-white">
                  {formatRupiah(totals.total_terpakai)}
                </td>
                <td className="px-4 py-3 pr-5 text-right tabular-nums font-bold text-indigo-600 dark:text-indigo-400 md:pr-6">
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
