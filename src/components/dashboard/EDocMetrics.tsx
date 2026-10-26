"use client";

import React from "react";
import { DashboardSummary } from "@/features/dashboard/types";

interface EDocMetricsProps {
  summary: DashboardSummary;
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export const EDocMetrics: React.FC<EDocMetricsProps> = ({ summary }) => {
  const realisasiPercentage =
    summary.totalPagu > 0
      ? ((summary.totalRealisasi / summary.totalPagu) * 100).toFixed(1)
      : "0";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6">
      {/* Metric 1: Total Pagu Anggaran */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] md:p-6 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Pagu Anggaran
          </span>
          <div className="flex items-center justify-center w-11 h-11 bg-blue-50 text-blue-600 rounded-xl dark:bg-blue-900/30 dark:text-blue-400">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="font-bold text-gray-800 text-xl md:text-2xl dark:text-white/90">
            {formatRupiah(summary.totalPagu)}
          </h4>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
            Total pagu seluruh bidang
          </p>
        </div>
      </div>

      {/* Metric 2: Total Realisasi Pencairan */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] md:p-6 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Realisasi Pencairan
          </span>
          <div className="flex items-center justify-center w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl dark:bg-emerald-900/30 dark:text-emerald-400">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="font-bold text-gray-800 text-xl md:text-2xl dark:text-white/90">
            {formatRupiah(summary.totalRealisasi)}
          </h4>
          <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <span>{realisasiPercentage}%</span> terserap dari total pagu
          </p>
        </div>
      </div>

      {/* Metric 3: Total Master Dokumen */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] md:p-6 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Master Dokumen
          </span>
          <div className="flex items-center justify-center w-11 h-11 bg-purple-50 text-purple-600 rounded-xl dark:bg-purple-900/30 dark:text-purple-400">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <h4 className="font-bold text-gray-800 text-2xl md:text-3xl dark:text-white/90">
            {summary.totalDokumen}
          </h4>
          <span className="text-xs px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 font-semibold">
            Aktif
          </span>
        </div>
      </div>

      {/* Metric 4: Total Bidang & Mitra */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] md:p-6 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Bidang & Perusahaan
          </span>
          <div className="flex items-center justify-center w-11 h-11 bg-amber-50 text-amber-600 rounded-xl dark:bg-amber-900/30 dark:text-amber-400">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h5m-5 0V11m0 0h-5m5 0h5"
              />
            </svg>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 block">Bidang</span>
            <span className="font-bold text-gray-800 text-xl dark:text-white/90">
              {summary.totalBidang}
            </span>
          </div>
          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
          <div>
            <span className="text-xs text-gray-400 block">Perusahaan</span>
            <span className="font-bold text-gray-800 text-xl dark:text-white/90">
              {summary.totalPerusahaan}
            </span>
          </div>
          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
          <div>
            <span className="text-xs text-gray-400 block">Pegawai</span>
            <span className="font-bold text-gray-800 text-xl dark:text-white/90">
              {summary.totalPegawai}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
