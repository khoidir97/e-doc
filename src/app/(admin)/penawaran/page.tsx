import type { Metadata } from "next";
import React from "react";
import { PenawaranContainer } from "@/features/penawaran/components/PenawaranContainer";

export const metadata: Metadata = {
    title: "Kelola Penawaran | e-Doc BPKAD",
    description: "Halaman Manajemen Data Penawaran BPKAD e-Doc",
};

export default function PenawaranPage() {
    return <PenawaranContainer />;
}
