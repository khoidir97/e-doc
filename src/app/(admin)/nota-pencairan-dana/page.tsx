import type { Metadata } from "next";
import React from "react";
import { NotaPencairanDanaContainer } from "@/features/nota-pencairan-dana/components/NotaPencairanDanaContainer";

export const metadata: Metadata = {
    title: "Kelola Nota Pencairan Dana | e-Doc BPKAD",
    description: "Halaman Manajemen Data Nota Pencairan Dana BPKAD e-Doc",
};

export default function NotaPencairanDanaPage() {
    return <NotaPencairanDanaContainer />;
}
