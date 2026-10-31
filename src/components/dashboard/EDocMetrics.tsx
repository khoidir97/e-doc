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

// ─── Soft Modern Icons ──────────────────────────────────────
const IconPagu = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const IconRealisasi = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const IconSisa = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const IconDokumen = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
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
      style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
    />
  </div>
);

// ─── EDocMetrics ─────────────────────────────────────────────
export const EDocMetrics: React.FC<EDocMetricsProps> = ({ summary }) => {
  const realisasiPercentage =
    summary.totalPagu > 0
      ? Number(((summary.totalRealisasi / summary.totalPagu) * 100).toFixed(1))
      : 0;

  const sisaPagu = Math.max(0, summary.totalPagu - summary.totalRealisasi);
  const sisaPercentage =
    summary.totalPagu > 0
      ? Number(((sisaPagu / summary.totalPagu) * 100).toFixed(1))
      : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

      {/* Card 1: Total Pagu Anggaran */}
      <div className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Total Pagu Anggaran
            </p>
            <h4 className="mt-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
              {formatRupiah(summary.totalPagu)}
            </h4>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50/80 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 border border-indigo-100/60 dark:border-indigo-900/40">
            <IconPagu />
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Alokasi seluruh bidang</span>
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">100%</span>
        </div>

        <MiniProgress value={100} colorClass="bg-gradient-to-r from-indigo-500 to-indigo-400" />
      </div>

      {/* Card 2: Realisasi Pencairan */}
      <div className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Realisasi Pencairan
            </p>
            <h4 className="mt-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
              {formatRupiah(summary.totalRealisasi)}
            </h4>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50/80 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-100/60 dark:border-emerald-900/40">
            <IconRealisasi />
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-400">Serapan NPD</span>
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
            {realisasiPercentage}%
          </span>
        </div>

        <MiniProgress value={realisasiPercentage} colorClass="bg-gradient-to-r from-emerald-500 to-teal-400" />
      </div>

      {/* Card 3: Sisa Pagu Anggaran */}
      <div className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Sisa Pagu Anggaran
            </p>
            <h4 className="mt-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
              {formatRupiah(sisaPagu)}
            </h4>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50/80 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-100/60 dark:border-amber-900/40">
            <IconSisa />
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-400">Dana belum cair</span>
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50">
            {sisaPercentage}%
          </span>
        </div>

        <MiniProgress value={sisaPercentage} colorClass="bg-gradient-to-r from-amber-500 to-orange-400" />
      </div>

      {/* Card 4: Dokumen & Entitas */}
      <div className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Dokumen Terdaftar
            </p>
            <h4 className="mt-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
              {summary.totalDokumen}{" "}
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Berkas</span>
            </h4>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50/80 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400 border border-purple-100/60 dark:border-purple-900/40">
            <IconDokumen />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1.5 pt-2 border-t border-gray-100 dark:border-gray-800 text-[11px] font-medium text-gray-600 dark:text-gray-300">
          <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            {summary.totalBidang} Bidang
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {summary.totalPerusahaan} Rekanan
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
            {summary.totalPegawai} Pegawai
          </span>
        </div>
      </div>

    </div>
  );
};
