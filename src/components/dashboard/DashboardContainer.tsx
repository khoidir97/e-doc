"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DashboardData } from "@/features/dashboard/types";
import { EDocMetrics } from "./EDocMetrics";
import { PaguPerBidangChart } from "./PaguPerBidangChart";
import { PaguPerBidangTable } from "./PaguPerBidangTable";
import { MonthlyTrendChart } from "./MonthlyTrendChart";
import { RecentDokumenTable } from "./RecentDokumenTable";
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
    <div className="space-y-6">
      {/* Header bar with Refresh button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-white/[0.03] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            Dashboard e-Doc BPKAD
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Ringkasan alokasi pagu anggaran, realisasi, dan dokumen terbaru
          </p>
        </div>
        <div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all disabled:opacity-50"
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
        </div>
      </div>

      {/* 1. Metric Cards */}
      <EDocMetrics summary={dashboardData.summary} />

      {/* 2. Charts & Tables Grid */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Left Column: Pagu Per Bidang Chart & Monthly Trend */}
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <PaguPerBidangChart data={dashboardData.paguPerBidang} />
          <MonthlyTrendChart data={dashboardData.monthlyTrend} />
        </div>

        {/* Right Column: Pagu Per Bidang Table */}
        <div className="col-span-12 xl:col-span-5">
          <PaguPerBidangTable data={dashboardData.paguPerBidang} />
        </div>
      </div>

      {/* 3. Recent Master Dokumen Table */}
      {/* <div className="w-full">
        <RecentDokumenTable data={dashboardData.recentDokumen} />
      </div> */}
    </div>
  );
};
