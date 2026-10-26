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

  const options: ApexOptions = {
    colors: ["#465fff", "#12b76a"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "area",
      height: 300,
      toolbar: { show: false },
      background: "transparent",
      animations: {
        enabled: true,
        speed: 600,
        animateGradually: { enabled: true, delay: 80 },
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
        opacityFrom: 0.25,
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
          colors: "#667085",
          fontSize: "11px",
          fontFamily: "Outfit, sans-serif",
        },
      },
    },
    yaxis: [
      {
        title: {
          text: "Pagu (Rp)",
          style: { color: "#667085", fontSize: "11px", fontFamily: "Outfit, sans-serif" },
        },
        labels: {
          formatter: (val: number) => {
            if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(1)} M`;
            if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(0)} Jt`;
            return `${val}`;
          },
          style: { colors: "#667085", fontSize: "11px", fontFamily: "Outfit, sans-serif" },
        },
      },
      {
        opposite: true,
        title: {
          text: "Dokumen",
          style: { color: "#667085", fontSize: "11px", fontFamily: "Outfit, sans-serif" },
        },
        labels: {
          formatter: (val: number) => `${Math.round(val)}`,
          style: { colors: "#667085", fontSize: "11px", fontFamily: "Outfit, sans-serif" },
        },
      },
    ],
    grid: {
      borderColor: "#f2f4f7",
      strokeDashArray: 4,
      padding: { left: 0, right: 0 },
    },
    tooltip: {
      shared: true,
      intersect: false,
      style: { fontFamily: "Outfit, sans-serif" },
      y: [
        { formatter: (val: number) => formatRupiah(val) },
        { formatter: (val: number) => `${val} Dokumen` },
      ],
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontSize: "12px",
      fontFamily: "Outfit, sans-serif",
      fontWeight: 500,
      markers: { size: 6 },
    },
  };

  const series = [
    { name: "Pagu Anggaran", data: paguSeries },
    { name: "Jumlah Dokumen", data: dokumenSeries },
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800 md:px-6">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-gray-800 dark:text-white">
            Tren Pagu &amp; Dokumen Bulanan
          </h2>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
            Statistik akumulasi pagu dan pembuatan dokumen per bulan
          </p>
        </div>
        {/* Legend chips */}
        <div className="flex shrink-0 items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
            <span className="inline-block h-2 w-2 rounded-full bg-brand-500" />
            Pagu
          </span>
          <span className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
            <span className="inline-block h-2 w-2 rounded-full bg-success-500" />
            Dokumen
          </span>
        </div>
      </div>

      {/* Chart body */}
      <div className="px-2 pb-2 pt-3">
        {data.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2 text-sm text-gray-400 dark:text-gray-500">
            <svg className="h-10 w-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            <span>Belum ada data tren bulanan</span>
          </div>
        ) : (
          <ReactApexChart options={options} series={series} type="area" height={300} />
        )}
      </div>
    </section>
  );
};
