import type { Metadata } from "next";
import React from "react";
import { PegawaiContainer } from "@/features/pegawai/components/PegawaiContainer";

export const metadata: Metadata = {
  title: "Kelola Pegawai | e-Doc BPKAD",
  description: "Halaman Manajemen Data Pegawai BPKAD e-Doc",
};

export default function PegawaiPage() {
  return <PegawaiContainer />;
}
