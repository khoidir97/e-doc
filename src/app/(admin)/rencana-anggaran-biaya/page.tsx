import type { Metadata } from "next";
import React from "react";
import { RencanaAnggaranBiayaContainer } from "@/features/rencana-anggaran-biaya/components/RencanaAnggaranBiayaContainer";

export const metadata: Metadata = {
    title: "Kelola Rencana Anggaran Biaya | e-Doc BPKAD",
    description: "Halaman Manajemen Data Rencana Anggaran Biaya BPKAD e-Doc",
};

export default function RencanaAnggaranBiayaPage() {
    return <RencanaAnggaranBiayaContainer />;
}
