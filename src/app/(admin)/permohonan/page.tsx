import type { Metadata } from "next";
import React from "react";
import { PermohonanContainer } from "@/features/permohonan/components/PermohonanContainer";

export const metadata: Metadata = {
  title: "Permohonan Pengadaan (Nota Dinas) | e-Doc BPKAD",
  description: "Halaman Manajemen Surat Permohonan Pengadaan Barang dan Jasa BPKAD Kota Pekanbaru",
};

export default function PermohonanPage() {
  return <PermohonanContainer />;
}

