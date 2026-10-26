import type { Metadata } from "next";
import React from "react";
import { MasterDokumenDetailContainer } from "@/features/master-dokumen/components/MasterDokumenDetailContainer";

export const metadata: Metadata = {
  title: "Detail Master Dokumen | e-Doc BPKAD",
  description: "Halaman Rincian Master Dokumen dan Sub-Menu BPKAD e-Doc",
};

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MasterDokumenDetailPage({ params }: DetailPageProps) {
  const resolvedParams = await params;
  const mdkId = parseInt(resolvedParams.id, 10) || 0;

  return <MasterDokumenDetailContainer mdkId={mdkId} />;
}
