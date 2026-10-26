import type { Metadata } from "next";
import React from "react";
import { DashboardRepository } from "@/features/dashboard/repository";
import { DashboardContainer } from "@/components/dashboard/DashboardContainer";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Dashboard e-Doc BPKAD | Sistem Pengelolaan Dokumen",
  description: "Dashboard e-Doc BPKAD untuk pemantauan pagu anggaran, realisasi pencairan dana, dan dokumen terbaru",
};

export default async function DashboardPage() {
  const dashboardData = await DashboardRepository.getDashboardData();

  return <DashboardContainer initialData={dashboardData} />;
}

