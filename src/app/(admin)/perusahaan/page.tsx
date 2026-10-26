import type { Metadata } from "next";
import React from "react";
import { PerusahaanContainer } from "@/features/perusahaan/components/PerusahaanContainer";

export const metadata: Metadata = {
    title: "Kelola Perusahaan | e-Doc BPKAD",
    description: "Halaman Manajemen Data Perusahaan BPKAD e-Doc",
};

export default function PerusahaanPage() {
    return <PerusahaanContainer />;
}
