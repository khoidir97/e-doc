"use client";

import React from "react";
import Link from "next/link";
import { RecentDokumen } from "@/features/dashboard/types";
import { formatRupiah } from "./EDocMetrics";

interface RecentDokumenTableProps {
  data: RecentDokumen[];
}

export const RecentDokumenTable: React.FC<RecentDokumenTableProps> = ({ data }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Master Dokumen Terbaru
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Daftar dokumen e-Doc yang baru ditambahkan
          </p>
        </div>
        <Link
          href="/master-dokumen"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 transition-colors"
        >
          Lihat Semua
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 text-xs font-semibold uppercase text-gray-400">
              <th className="pb-3 pl-1">No. DPA</th>
              <th className="pb-3">Program & Kegiatan</th>
              <th className="pb-3">Bidang</th>
              <th className="pb-3 text-right">Pagu Anggaran</th>
              <th className="pb-3 text-right pr-1">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-xs text-gray-400">
                  Belum ada master dokumen.
                </td>
              </tr>
            ) : (
              data.map((doc) => (
                <tr key={doc.mdk_id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                  <td className="py-3.5 pl-1 font-medium text-gray-800 dark:text-white/90 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-semibold text-xs border border-blue-100 dark:border-blue-800/50">
                      {doc.mdk_no_dpa || `DOC-#${doc.mdk_id}`}
                    </span>
                  </td>
                  <td className="py-3.5 max-w-xs">
                    <p className="font-semibold text-gray-800 dark:text-white/90 truncate">
                      {doc.mdk_program}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {doc.mdk_kegiatan}
                    </p>
                  </td>
                  <td className="py-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {doc.bdg_nama}
                    </span>
                  </td>
                  <td className="py-3.5 text-right font-bold text-gray-800 dark:text-white/90 whitespace-nowrap">
                    {formatRupiah(doc.mdk_pagu_anggaran)}
                  </td>
                  <td className="py-3.5 text-right pr-1 whitespace-nowrap">
                    <Link
                      href={`/master-dokumen?id=${doc.mdk_id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
