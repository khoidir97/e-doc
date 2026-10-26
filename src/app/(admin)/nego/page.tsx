import type { Metadata } from "next";
import React from "react";
import { NegoContainer } from "@/features/nego/components/NegoContainer";

export const metadata: Metadata = {
    title: "Kelola Nego | e-Doc BPKAD",
    description: "Halaman Manajemen Data Nego BPKAD e-Doc",
};

export default function NegoPage() {
    return <NegoContainer />;
}
