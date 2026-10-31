"use client";

import React from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { PaguPerBidang } from "@/features/dashboard/types";
import { formatRupiah } from "./EDocMetrics";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface PaguPerBidangChartProps {
  data: PaguPerBidang[];
}

export const PaguPerBidangChart: React.FC<PaguPerBidangChartProps> = ({ data }) => {
  const categories = data.map((item) => item.bdg_nama);
  const seriesData = data.map((item) => item.total_pagu);

  const options: ApexOptions = {
    colors: ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 320,
      toolbar: { show: false },
      background: "transparent",
      animations: {
        enabled: true,
        speed: 600,
        animateGradually: { enabled: true, delay: 80 },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        borderRadiusApplication: "end",
        barHeight: "56%",
        distributed: true,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories,
      labels: {
        formatter: (val: string) => {
          const num = Number(val);
          if (isNaN(num)) return val;
          if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)} M`;
          if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(0)} Jt`;
          return `Rp ${num.toLocaleString("id-ID")}`;
        },
        style: { colors: "#94a3b8", fontSize: "11px", fontFamily: "Outfit, sans-serif" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#475569",
          fontSize: "12px",
          fontWeight: 500,
          fontFamily: "Outfit, sans-serif",
        },
      },
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 4,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
      padding: { left: 0, right: 16 },
    },
    tooltip: {
      theme: "light",
      style: { fontFamily: "Outfit, sans-serif" },
      y: {
        formatter: (val: number) => formatRupiah(val),
        title: { formatter: () => "Pagu: " },
      },
    },
    legend: { show: false },
  };

  const series = [{ name: "Pagu Anggaran", data: seriesData }];

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
            Grafik Pagu Per Bidang
          </h2>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
            Perbandingan alokasi pagu di setiap bidang
          </p>
        </div>
        <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100 dark:border-indigo-900/50 dark:bg-indigo-950/50 dark:text-indigo-400">
          {data.length} Bidang
        </span>
      </div>

      {/* Chart body */}
      <div className="flex-1 px-3 py-3">
        {data.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2 text-sm text-gray-400 dark:text-gray-500">
            <svg className="h-10 w-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Belum ada data pagu per bidang</span>
          </div>
        ) : (
          <ReactApexChart options={options} series={series} type="bar" height={320} />
        )}
      </div>
    </section>
  );
};
