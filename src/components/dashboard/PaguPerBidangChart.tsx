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
    colors: ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EC4899", "#6366F1"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 320,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        borderRadiusApplication: "end",
        barHeight: "50%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: categories,
      labels: {
        formatter: (val: string) => {
          const num = Number(val);
          if (isNaN(num)) return val;
          if (num >= 1_000_000_000) return `Rp ${(num / 1_000_000_000).toFixed(1)} M`;
          if (num >= 1_000_000) return `Rp ${(num / 1_000_000).toFixed(0)} Jt`;
          return `Rp ${num.toLocaleString("id-ID")}`;
        },
        style: {
          colors: "#64748B",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#475569",
          fontSize: "13px",
          fontWeight: 500,
        },
      },
    },
    grid: {
      borderColor: "#E2E8F0",
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (val: number) => formatRupiah(val),
        title: {
          formatter: () => "Total Pagu: ",
        },
      },
    },
    legend: {
      show: false,
    },
  };

  const series = [
    {
      name: "Pagu Anggaran",
      data: seriesData,
    },
  ];

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-6">
      <div className="mb-5">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white md:text-lg">
            Pagu Anggaran Per Bidang
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Perbandingan alokasi pagu anggaran di setiap bidang / bagian
          </p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-sm text-gray-400">
          Belum ada data pagu per bidang.
        </div>
      ) : (
        <div className="w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={320}
          />
        </div>
      )}
    </section>
  );
};
