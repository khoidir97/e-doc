import type { Metadata } from "next";
import React from "react";
import { HargaPerkiraanSendiriContainer } from "@/features/harga-perkiraan-sendiri/components/HargaPerkiraanSendiriContainer";

export const metadata: Metadata = {
    title: "Kelola Harga Perkiraan Sendiri | e-Doc BPKAD",
    description: "Halaman Manajemen Data Harga Perkiraan Sendiri BPKAD e-Doc",
};

export default function HargaPerkiraanSendiriPage() {
    return <HargaPerkiraanSendiriContainer />;
}
