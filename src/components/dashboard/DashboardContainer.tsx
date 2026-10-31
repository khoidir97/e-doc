"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DashboardData } from "@/features/dashboard/types";
import { EDocMetrics } from "./EDocMetrics";
import { PaguPerBidangChart } from "./PaguPerBidangChart";
import { PaguPerBidangTable } from "./PaguPerBidangTable";
import { PaguPerPptkTable } from "./PaguPerPptkTable";
import { MonthlyTrendChart } from "./MonthlyTrendChart";
import { getDashboardDataAction } from "@/features/dashboard/actions";

interface DashboardContainerProps {
  initialData: DashboardData;
}

export const DashboardContainer: React.FC<DashboardContainerProps> = ({ initialData }) => {
  const [dashboardData, setDashboardData] = useState<DashboardData>(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [dateStr, setDateStr] = useState<string>("");

  const fetchLatestData = useCallback(async (silent = true) => {
    if (!silent) setIsRefreshing(true);
    try {
      const res = await getDashboardDataAction();
      if (res.success && res.data) {
        setDashboardData(res.data);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Failed to refresh dashboard data", err);
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const now = new Date();
    setLastUpdated(now);
    setDateStr(
      now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );

    const interval = setInterval(() => {
      fetchLatestData(true);
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchLatestData]);

  const handleRefresh = () => {
    fetchLatestData(false);
  };

  const formattedTime = lastUpdated
    ? lastUpdated.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    : "--:--:--";

  return (
    <div className="space-y-6 pb-6">
      {/* ─── Header Modern Card ─────────────────────────────────────────── */}
      <header className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 md:p-7">
        {/* Soft subtle ambient glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl dark:from-indigo-500/20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl dark:from-emerald-500/15"
        />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Title block */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Sistem Aktif
              </span>
              {dateStr && (
                <>
                  <span className="text-xs text-gray-300 dark:text-gray-700">•</span>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {dateStr}
                  </span>
                </>
              )}
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white md:text-3xl">
              Dashboard Dokumen BPKAD
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              Monitoring terpadu alokasi pagu anggaran, realisasi pencairan dana, dan arsip dokumen aktif
            </p>
          </div>

          {/* Action block */}
          <div className="flex flex-wrap items-center gap-3 self-start sm:self-center">
            <div className="hidden text-right text-xs sm:block">
              <p className="font-medium text-gray-400 dark:text-gray-500">Terakhir Diperbarui</p>
              <p className="font-semibold tabular-nums text-gray-700 dark:text-gray-300">
                {formattedTime}
              </p>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200/90 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 shadow-xs transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-750 dark:hover:text-white"
            >
              <svg
                className={`h-4 w-4 text-gray-500 transition-transform ${isRefreshing ? "animate-spin text-indigo-600 dark:text-indigo-400" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>{isRefreshing ? "Memperbarui..." : "Refresh Data"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── Metric Cards ────────────────────────────────────── */}
      <EDocMetrics summary={dashboardData.summary} />

      {/* ─── Distribusi Pagu Bidang (Grid 2 Kolom Seimbang) ─── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-stretch">
        <div className="flex flex-col">
          <PaguPerBidangChart data={dashboardData.paguPerBidang} />
        </div>
        <div className="flex flex-col">
          <PaguPerBidangTable data={dashboardData.paguPerBidang} />
        </div>
      </div>

      {/* ─── Tren Bulanan (Full Width) ───────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-stretch">
        <div className="flex flex-col">
          <MonthlyTrendChart data={dashboardData.monthlyTrend} />
        </div>

        {/* ─── Rekapitulasi PPTK (Full Width) ─────────────────── */}
        <div className="flex flex-col">
          <PaguPerPptkTable data={dashboardData.paguPerPptk} />
        </div>
      </div>
    </div>
  );
};
