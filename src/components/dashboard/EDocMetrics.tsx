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

// ─── Icon Components ────────────────────────────────────────
const IconPagu = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const IconRealisasi = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const IconDokumen = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const IconBidang = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

// ─── Mini Progress Bar ───────────────────────────────────────
const MiniProgress = ({
  value,
  colorClass,
}: {
  value: number;
  colorClass: string;
}) => (
  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
    <div
      className={`h-full rounded-full transition-all duration-700 ${colorClass}`}
      style={{ width: `${Math.min(value, 100)}%` }}
    />
  </div>
);

// ─── EDocMetrics ─────────────────────────────────────────────
export const EDocMetrics: React.FC<EDocMetricsProps> = ({ summary }) => {
  const realisasiPercentage =
    summary.totalPagu > 0
      ? Number(((summary.totalRealisasi / summary.totalPagu) * 100).toFixed(1))
      : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

      {/* Card 1: Total Pagu Anggaran */}
      <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-theme-md dark:border-gray-800 dark:bg-gray-900">
        {/* Subtle top accent line */}
        <span className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-blue-500 to-blue-400" />

        <div className="flex items-start justify-between">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Pagu Anggaran
          </p>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <IconPagu />
          </div>
        </div>

        <div className="mt-3">
          <h4 className="break-words text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {formatRupiah(summary.totalPagu)}
          </h4>
          <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
            Total pagu seluruh bidang
          </p>
        </div>

        <MiniProgress value={100} colorClass="bg-gradient-to-r from-blue-500 to-blue-400" />
      </div>

      {/* Card 2: Realisasi Pencairan */}
      <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-theme-md dark:border-gray-800 dark:bg-gray-900">
        <span className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-emerald-500 to-emerald-400" />

        <div className="flex items-start justify-between">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Realisasi Pencairan
          </p>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <IconRealisasi />
          </div>
        </div>

        <div className="mt-3">
          <h4 className="break-words text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {formatRupiah(summary.totalRealisasi)}
          </h4>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {realisasiPercentage}%
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">terserap dari pagu</span>
          </div>
        </div>

        <MiniProgress value={realisasiPercentage} colorClass="bg-gradient-to-r from-emerald-500 to-emerald-400" />
      </div>

      {/* Card 3: Master Dokumen */}
      <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-theme-md dark:border-gray-800 dark:bg-gray-900">
        <span className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-brand-700 to-brand-400" />

        <div className="flex items-start justify-between">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Master Dokumen
          </p>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
            <IconDokumen />
          </div>
        </div>

        <div className="mt-3 flex items-end justify-between">
          <div>
            <h4 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {summary.totalDokumen}
            </h4>
            <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">dokumen terdaftar</p>
          </div>
          <span className="mb-1 inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
            Aktif
          </span>
        </div>
      </div>

      {/* Card 4: Bidang & Entitas */}
      <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-theme-md dark:border-gray-800 dark:bg-gray-900">
        <span className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-amber-500 to-orange-400" />

        <div className="flex items-start justify-between">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Bidang &amp; Entitas
          </p>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
            <IconBidang />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-800">
          <div className="pr-3 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">Bidang</p>
            <span className="mt-0.5 block text-xl font-bold text-gray-900 dark:text-white">
              {summary.totalBidang}
            </span>
          </div>
          <div className="px-3 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">Mitra</p>
            <span className="mt-0.5 block text-xl font-bold text-gray-900 dark:text-white">
              {summary.totalPerusahaan}
            </span>
          </div>
          <div className="pl-3 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">Pegawai</p>
            <span className="mt-0.5 block text-xl font-bold text-gray-900 dark:text-white">
              {summary.totalPegawai}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
