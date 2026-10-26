"use client";

import React from 'react';
import { Modal } from '@/components/ui/modal';
import { MasterDokumen } from '../types';

interface MasterDokumenCopyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  masterDokumen: MasterDokumen | null;
  loading: boolean;
}

export const MasterDokumenCopyModal: React.FC<MasterDokumenCopyModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  masterDokumen,
  loading,
}) => {
  if (!masterDokumen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[480px] p-6 lg:p-8">
      <div className="text-center">
        {/* Copy Icon Badge */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mb-5">
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Duplikat Master Dokumen?
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Sistem akan membuat salinan baru dari data Master Dokumen ini. Apakah Anda yakin ingin melanjutkan?
        </p>

        {/* Info Card */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50/80 p-4 text-left dark:border-gray-800 dark:bg-gray-800/50 space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Bagian:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{masterDokumen.mdk_bagian || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Uraian Belanja:</span>
            <span className="font-semibold text-gray-900 dark:text-white truncate max-w-[220px]">{masterDokumen.mdk_uraian_belanja || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">No. DPA:</span>
            <span className="font-mono font-semibold text-gray-900 dark:text-white">{masterDokumen.mdk_no_dpa || '-'}</span>
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
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow-theme-xs disabled:opacity-50 transition-colors cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Menduplikat...
              </>
            ) : (
              'Ya, Duplikat Data'
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
