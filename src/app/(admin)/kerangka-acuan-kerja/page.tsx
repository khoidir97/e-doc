import type { Metadata } from "next";
import React from "react";
import { KerangkaAcuanKerjaContainer } from "@/features/kerangka-acuan-kerja/components/KerangkaAcuanKerjaContainer";

export const metadata: Metadata = {
  title: "Kerangka Acuan Kerja (KAK) | e-Doc BPKAD",
  description: "Halaman Manajemen Kerangka Acuan Kerja (Term of Reference) BPKAD e-Doc",
};

export default function KerangkaAcuanKerjaPage() {
  return <KerangkaAcuanKerjaContainer />;
}

