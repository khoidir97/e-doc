import type { Metadata } from "next";
import React from "react";
import { PerhitunganPaketContainer } from "@/features/perhitungan-paket/components/PerhitunganPaketContainer";

export const metadata: Metadata = {
    title: "Kelola Perhitungan Paket | e-Doc BPKAD",
    description: "Halaman Manajemen Data Perhitungan Paket BPKAD e-Doc",
};

export default function PerhitunganPaketPage() {
    return <PerhitunganPaketContainer />;
}
