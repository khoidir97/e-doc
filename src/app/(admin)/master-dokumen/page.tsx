import type { Metadata } from "next";
import React from "react";
import { MasterDokumenContainer } from "@/features/master-dokumen/components/MasterDokumenContainer";

export const metadata: Metadata = {
  title: "Master Dokumen | e-Doc BPKAD",
  description: "Halaman Manajemen Data Master Dokumen BPKAD e-Doc",
};

export default function MasterDokumenPage() {
  return <MasterDokumenContainer />;
}
