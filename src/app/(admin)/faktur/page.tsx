import type { Metadata } from "next";
import React from "react";
import { FakturContainer } from "@/features/faktur/components/FakturContainer";

export const metadata: Metadata = {
    title: "Kelola Faktur | e-Doc BPKAD",
    description: "Halaman Manajemen Data Faktur BPKAD e-Doc",
};

export default function FakturPage() {
    return <FakturContainer />;
}
