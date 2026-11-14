import type { Metadata } from "next";
import React from "react";
import { SpesifikasiTeknisContainer } from "@/features/spesifikasi-teknis/components/SpesifikasiTeknisContainer";

export const metadata: Metadata = {
  title: "Spesifikasi Teknis E-Purchasing | e-Doc BPKAD",
  description: "Halaman Manajemen Dokumen Spesifikasi Teknis dan Penetapan Penyedia E-Purchasing BPKAD Kota Pekanbaru",
};

export default function SpesifikasiTeknisPage() {
  return <SpesifikasiTeknisContainer />;
}

