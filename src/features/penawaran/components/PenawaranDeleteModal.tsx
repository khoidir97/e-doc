"use client";

import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Penawaran } from '../types';

interface PenawaranDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  Penawaran: Penawaran | null;
  loading: boolean;
}

export const PenawaranDeleteModal: React.FC<PenawaranDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  Penawaran,
  loading,
}) => {
  if (!Penawaran) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[480px] p-6 lg:p-8">
      <div className="text-center">
        {/* Warning Icon Badge */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-5">
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Hapus Data Harga Perkiraan Sendiri?
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Tindakan ini akan mengarsipkan data Harga Perkiraan Sendiri. Data ini tidak akan lagi tampil di daftar aktif.
        </p>

        {/* Info Card */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50/80 p-4 text-left dark:border-gray-800 dark:bg-gray-800/50 space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Uraian Pekerjaan:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{Penawaran.pnw_uraian_pekerjaan}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Volume:</span>
            <span className="font-mono font-semibold text-gray-900 dark:text-white">{Penawaran.pnw_volume}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Waktu:</span>
            <span className="font-mono font-semibold text-gray-900 dark:text-white">{Penawaran.pnw_waktu}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Harga Satuan:</span>
            <span className="font-mono font-semibold text-gray-900 dark:text-white">{Penawaran.pnw_harga_satuan}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Harga Perkiraan Sendiri:</span>
            <span className="font-mono font-semibold text-gray-900 dark:text-white">{Penawaran.pnw_harga_perkiraan_sendiri}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-theme-xs disabled:opacity-50 transition-colors cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Menghapus...
              </>
            ) : (
              'Ya, Hapus Data'
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
