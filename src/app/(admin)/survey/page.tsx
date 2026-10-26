import type { Metadata } from "next";
import React from "react";
import { SurveyContainer } from "@/features/survey/components/SurveyContainer";

export const metadata: Metadata = {
    title: "Kelola Survey | e-Doc BPKAD",
    description: "Halaman Manajemen Data Survey BPKAD e-Doc",
};

export default function SurveyPage() {
    return <SurveyContainer />;
}
