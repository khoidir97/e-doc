"use client";

import React from 'react';
import { Penawaran } from '../types';

interface PenawaranTableProps {
  data: Penawaran[];
  loading: boolean;
  onEdit: (Penawaran: Penawaran) => void;
  onDelete: (Penawaran: Penawaran) => void;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (newPage: number) => void;
}

export const PenawaranTable: React.FC<PenawaranTableProps> = ({
  data,
  loading,
  onEdit,
  onDelete,
  page,
  totalPages,
  total,
  onPageChange,
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
              <th className="px-6 py-4">No</th>
              <th className="px-6 py-4">Uraian Pekerjaan</th>
              <th className="px-6 py-4">Volume</th>
              <th className="px-6 py-4">Waktu</th>
              <th className="px-6 py-4">Harga Satuan</th>
              <th className="px-6 py-4">Harga Perkiraan Sendiri</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-brand-500" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Memuat data Penawaran...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  Belum ada data Penawaran.
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={item.pnw_id}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {(page - 1) * 10 + index + 1}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {item.pnw_uraian_pekerjaan}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {item.pnw_volume}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {item.pnw_waktu}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {item.pnw_harga_satuan}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {item.pnw_harga_perkiraan_sendiri}
                  </td>


                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-brand-600 hover:bg-brand-50 dark:text-gray-400 dark:hover:text-brand-400 dark:hover:bg-brand-900/20 transition-colors"
                        title="Edit Penawaran"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                        title="Hapus Penawaran"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/30 text-sm text-gray-500 dark:text-gray-400">
        <div>
          Menampilkan {data.length > 0 ? (page - 1) * 10 + 1 : 0} -{' '}
          {Math.min(page * 10, total)} dari {total} data Penawaran
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1 || loading}
            onClick={() => onPageChange(page - 1)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40"
          >
            Sebelumnya
          </button>
          <span className="px-2 font-medium text-gray-800 dark:text-white">
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages || loading}
            onClick={() => onPageChange(page + 1)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
};
