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
    colors: ["#465fff", "#0ba5ec", "#12b76a", "#f79009", "#ee46bc", "#7a5af8"],
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
        borderRadius: 7,
        borderRadiusApplication: "end",
        barHeight: "52%",
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
        style: { colors: "#667085", fontSize: "11px", fontFamily: "Outfit, sans-serif" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#344054",
          fontSize: "12px",
          fontWeight: 500,
          fontFamily: "Outfit, sans-serif",
        },
      },
    },
    grid: {
      borderColor: "#f2f4f7",
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
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800 md:px-6">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-gray-800 dark:text-white">
            Pagu Anggaran Per Bidang
          </h2>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
            Perbandingan alokasi pagu di setiap bidang / bagian
          </p>
        </div>
        <span className="flex h-7 items-center rounded-lg bg-brand-50 px-2.5 text-xs font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
          {data.length} Bidang
        </span>
      </div>

      {/* Chart body */}
      <div className="px-2 pb-2 pt-3">
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
