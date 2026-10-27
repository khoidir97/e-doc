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
    setLastUpdated(new Date());

    const interval = setInterval(() => {
      fetchLatestData(true);
    }, 10000);

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
    <div className="space-y-6">
      {/* ─── Header ─────────────────────────────────────────── */}
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-6 shadow-theme-lg md:p-8">
        {/* Decorative blobs */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-white/5 blur-2xl"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-12 -left-8 h-48 w-48 rounded-full bg-white/5 blur-2xl"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-32 bottom-0 h-32 w-32 rounded-full bg-brand-400/20"
        />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Title block */}
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              {/* Animated live dot */}
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </span>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                Live · Diperbarui {formattedTime}
              </p>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              Dashboard e-Doc BPKAD
            </h1>
            <p className="mt-1.5 max-w-md text-sm leading-relaxed text-white/65">
              Ringkasan alokasi pagu anggaran, realisasi, dan dokumen aktif
            </p>
          </div>

          {/* Refresh button */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
          >
            <svg
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
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
            {isRefreshing ? "Memuat..." : "Refresh Data"}
          </button>
        </div>
      </header>

      {/* ─── Metric Cards ────────────────────────────────────── */}
      <EDocMetrics summary={dashboardData.summary} />

      {/* ─── Charts & Tables Grid ────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Left: Charts */}
        <div className="space-y-6 xl:col-span-7">
          <PaguPerBidangChart data={dashboardData.paguPerBidang} />
          <MonthlyTrendChart data={dashboardData.monthlyTrend} />
        </div>

        {/* Right: Bidang table */}
        <div className="xl:col-span-5">
          <PaguPerBidangTable data={dashboardData.paguPerBidang} />
        </div>
      </div>

      {/* ─── PPTK Table ──────────────────────────────────────── */}
      <PaguPerPptkTable data={dashboardData.paguPerPptk} />
    </div>
  );
};
