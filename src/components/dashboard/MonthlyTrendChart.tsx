"use client";

import React from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { MonthlyTrend } from "@/features/dashboard/types";
import { formatRupiah } from "./EDocMetrics";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface MonthlyTrendChartProps {
  data: MonthlyTrend[];
}

export const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ data }) => {
  const categories = data.map((d) => d.nama_bulan);
  const paguSeries = data.map((d) => d.total_pagu);
  const dokumenSeries = data.map((d) => d.total_dokumen);

  const totalPaguYear = data.reduce((acc, curr) => acc + (curr.total_pagu || 0), 0);
  const totalDokumenYear = data.reduce((acc, curr) => acc + (curr.total_dokumen || 0), 0);

  const options: ApexOptions = {
    colors: ["#6366f1", "#10b981"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "area",
      height: 290,
      toolbar: { show: false },
      background: "transparent",
      animations: {
        enabled: true,
        speed: 600,
        animateGradually: { enabled: true, delay: 60 },
      },
    },
    stroke: {
      curve: "smooth",
      width: [2.5, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.22,
        opacityTo: 0.02,
        stops: [0, 85, 100],
      },
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#94a3b8",
          fontSize: "11px",
          fontFamily: "Outfit, sans-serif",
        },
      },
    },
    yaxis: [
      {
        title: {
          text: "Pagu (Rp)",
          style: { color: "#64748b", fontSize: "11px", fontFamily: "Outfit, sans-serif" },
        },
        labels: {
          formatter: (val: number) => {
            if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(1)} M`;
            if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(0)} Jt`;
            return `${val}`;
          },
          style: { colors: "#94a3b8", fontSize: "11px", fontFamily: "Outfit, sans-serif" },
        },
      },
      {
        opposite: true,
        title: {
          text: "Dokumen",
          style: { color: "#64748b", fontSize: "11px", fontFamily: "Outfit, sans-serif" },
        },
        labels: {
          formatter: (val: number) => `${Math.round(val)}`,
          style: { colors: "#94a3b8", fontSize: "11px", fontFamily: "Outfit, sans-serif" },
        },
      },
    ],
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 4,
      padding: { left: 10, right: 10 },
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: "light",
      style: { fontFamily: "Outfit, sans-serif" },
      y: [
        { formatter: (val: number) => formatRupiah(val) },
        { formatter: (val: number) => `${val} Dokumen` },
      ],
    },
    legend: {
      show: false,
    },
  };

  const series = [
    { name: "Pagu Anggaran", data: paguSeries },
    { name: "Jumlah Dokumen", data: dokumenSeries },
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-800">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
            Tren Pagu &amp; Dokumen Bulanan
          </h2>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
            Statistik pergerakan pagu anggaran dan penerbitan dokumen per bulan
          </p>
        </div>

        {/* Legend Chips & Stats */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300 border border-gray-150 dark:border-gray-700">
            <span className="inline-block h-2 w-2 rounded-full bg-indigo-500" />
            <span>Pagu: <strong>{formatRupiah(totalPaguYear)}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300 border border-gray-150 dark:border-gray-700">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <span>Dokumen: <strong>{totalDokumenYear}</strong></span>
          </div>
        </div>
      </div>

      {/* Chart body */}
      <div className="px-3 pb-3 pt-4">
        {data.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2 text-sm text-gray-400 dark:text-gray-500">
            <svg className="h-10 w-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            <span>Belum ada data tren bulanan</span>
          </div>
        ) : (
          <ReactApexChart options={options} series={series} type="area" height={290} />
        )}
      </div>
    </section>
  );
};
