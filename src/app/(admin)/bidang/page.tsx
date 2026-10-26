import type { Metadata } from "next";
import React from "react";
import { BidangContainer } from "@/features/bidang/components/BidangContainer";

export const metadata: Metadata = {
    title: "Kelola Bidang | e-Doc BPKAD",
    description: "Halaman Manajemen Data Bidang BPKAD e-Doc",
};

export default function BidangPage() {
    return <BidangContainer />;
}
