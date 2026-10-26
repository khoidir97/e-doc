import type { Metadata } from "next";
import React from "react";
import { KwitansiContainer } from "@/features/kwitansi/components/KwitansiContainer";

export const metadata: Metadata = {
  title: "Kwitansi | e-Doc BPKAD",
  description: "Halaman Kwitansi Pembayaran BPKAD e-Doc",
};

export default function KwitansiPage() {
  return <KwitansiContainer />;
}
