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
    colors: ["#3B82F6", "#10B981"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "area",
      height: 300,
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: [3, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#64748B",
          fontSize: "12px",
        },
      },
    },
    yaxis: [
      {
        title: {
          text: "Pagu Anggaran (Rp)",
          style: { color: "#3B82F6", fontSize: "12px" },
        },
        labels: {
          formatter: (val: number) => {
            if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(1)} M`;
            if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(0)} Jt`;
            return `${val}`;
          },
          style: { colors: "#64748B", fontSize: "11px" },
        },
      },
      {
        opposite: true,
        title: {
          text: "Jumlah Dokumen",
          style: { color: "#10B981", fontSize: "12px" },
        },
        labels: {
          formatter: (val: number) => `${Math.round(val)}`,
          style: { colors: "#64748B", fontSize: "11px" },
        },
      },
    ],
    grid: {
      borderColor: "#E2E8F0",
      strokeDashArray: 4,
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: [
        {
          formatter: (val: number) => formatRupiah(val),
        },
        {
          formatter: (val: number) => `${val} Dokumen`,
        },
      ],
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontSize: "13px",
      fontWeight: 500,
    },
  };

  const series = [
    {
      name: "Pagu Anggaran",
      data: paguSeries,
    },
    {
      name: "Jumlah Dokumen",
      data: dokumenSeries,
    },
  ];

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-6">
      <div className="mb-5">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white md:text-lg">
            Tren Pagu & Dokumen Bulanan
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Statistik akumulasi pagu dan pembuatan dokumen per bulan tahun berjalan
          </p>
        </div>
      </div>

      <div className="w-full">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={300}
        />
      </div>
    </section>
  );
};
