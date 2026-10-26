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

  const fetchLatestData = useCallback(async (silent = true) => {
    if (!silent) setIsRefreshing(true);
    try {
      const res = await getDashboardDataAction();
      if (res.success && res.data) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error("Failed to refresh dashboard data", err);
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchLatestData(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchLatestData]);

  const handleRefresh = () => {
    fetchLatestData(false);
  };

  return (
    <div className="space-y-5 md:space-y-6">
      <header className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:items-center sm:justify-between md:p-6">
        <div className="min-w-0">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-600 dark:text-blue-400">
            Ringkasan
          </p>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white md:text-2xl">
            Dashboard e-Doc BPKAD
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Ringkasan alokasi pagu anggaran, realisasi, dan dokumen terbaru
          </p>
        </div>
        <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-xs transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <svg
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
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
      </header>

      {/* 1. Metric Cards */}
      <EDocMetrics summary={dashboardData.summary} />

      {/* 2. Charts & Tables Grid */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12 xl:gap-6">
        {/* Left Column: Pagu Per Bidang Chart & Monthly Trend */}
        <div className="space-y-5 xl:col-span-7 xl:space-y-6">
          <PaguPerBidangChart data={dashboardData.paguPerBidang} />
          <MonthlyTrendChart data={dashboardData.monthlyTrend} />
        </div>

        {/* Right Column: Pagu Per Bidang Table */}
        <div className="xl:col-span-5">
          <PaguPerBidangTable data={dashboardData.paguPerBidang} />
        </div>
      </div>

      <PaguPerPptkTable data={dashboardData.paguPerPptk} />

      {/* 3. Recent Master Dokumen Table */}
      {/* <div className="w-full">
        <RecentDokumenTable data={dashboardData.recentDokumen} />
      </div> */}
    </div>
  );
};
