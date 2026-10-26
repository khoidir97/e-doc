import type { Metadata } from "next";
import React from "react";
import { BeritaAcaraContainer } from "@/features/berita-acara/components/BeritaAcaraContainer";

export const metadata: Metadata = {
    title: "Kelola Berita Acara | e-Doc BPKAD",
    description: "Halaman Manajemen Data Berita Acara BPKAD e-Doc",
};

export default function BeritaAcaraPage() {
    return <BeritaAcaraContainer />;
}
