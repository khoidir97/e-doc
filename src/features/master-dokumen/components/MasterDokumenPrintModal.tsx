"use client";

import React from 'react';
import { Modal } from '@/components/ui/modal';
import { MasterDokumen } from '../types';

export type DocumentType =
  | 'survey'
  | 'rab'
  | 'hps'
  | 'penawaran'
  | 'nego'
  | 'perhitungan'
  | 'kuitansi'
  | 'faktur'
  | 'npd'
  | 'all';

interface MasterDokumenPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  masterDokumen: MasterDokumen | null;
  onSelectDocument: (docType: DocumentType) => void;
}

export const DOCUMENT_OPTIONS: { id: DocumentType; label: string; subLabel: string; icon: string; badge: string }[] = [
  {
    id: 'survey',
    label: 'SURVEY',
    subLabel: 'Surat Usulan & Hasil Survey Harga Pasar',
    icon: '🔍',
    badge: 'Sheet Survey',
  },
  {
    id: 'rab',
    label: 'RAB',
    subLabel: 'Rencana Anggaran Biaya Pekerjaan',
    icon: '📊',
    badge: 'Sheet RAB',
  },
  {
    id: 'hps',
    label: 'HPS',
    subLabel: 'Harga Perkiraan Sendiri Pejabat Pengadaan',
    icon: '🏷️',
    badge: 'Sheet HPS',
  },
  {
    id: 'penawaran',
    label: 'PENAWARAN',
    subLabel: 'Surat Permintaan & Penawaran Harga',
    icon: '📝',
    badge: 'Sheet Penawaran',
  },
  {
    id: 'nego',
    label: 'NEGO',
    subLabel: 'Berita Acara Negosiasi Harga',
    icon: '🤝',
    badge: 'Sheet Nego',
  },
  {
    id: 'perhitungan',
    label: 'Perhitungan Paket',
    subLabel: 'Rincian Perhitungan Paket & Volume',
    icon: '📐',
    badge: 'Sheet Perhitungan',
  },
  {
    id: 'kuitansi',
    label: 'KUITANSI',
    subLabel: 'Kuitansi Resmi Pembayaran Pekerjaan',
    icon: '🧾',
    badge: 'Sheet Kuitansi',
  },
  {
    id: 'faktur',
    label: 'FAKTUR',
    subLabel: 'Faktur Pembelian & Berita Acara Penerimaan',
    icon: '📄',
    badge: 'Sheet Faktur',
  },
  {
    id: 'npd',
    label: 'NPD',
    subLabel: 'Nota Permintaan Dana KPA / PPTK',
    icon: '📌',
    badge: 'Sheet NPD',
  },
  {
    id: 'all',
    label: 'Cetak Semua Dokumen',
    subLabel: 'Cetak Gabungan Seluruh Sheet Dokumen',
    icon: '🖨️',
    badge: 'Bundle Paket',
  },
];

export const MasterDokumenPrintModal: React.FC<MasterDokumenPrintModalProps> = ({
  isOpen,
  onClose,
  masterDokumen,
  onSelectDocument,
}) => {
  if (!masterDokumen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[720px] p-6 lg:p-8">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Cetak Dokumen Pengadaan
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Pilih jenis dokumen yang ingin dicetak dari Master Dokumen ini
              </p>
            </div>
          </div>
        </div>

        {/* Informative summary card */}
        <div className="p-3.5 mb-5 rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/60 text-xs space-y-1">
          <div className="font-semibold text-gray-800 dark:text-gray-200">
            {masterDokumen.mdk_uraian_belanja || 'Master Dokumen'}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-500 dark:text-gray-400">
            <span>Bagian: <strong className="text-gray-700 dark:text-gray-300">{masterDokumen.mdk_bagian || '-'}</strong></span>
            <span>No. DPA: <strong className="text-gray-700 dark:text-gray-300">{masterDokumen.mdk_no_dpa || '-'}</strong></span>
            <span>Perusahaan: <strong className="text-gray-700 dark:text-gray-300">{masterDokumen.mdk_nama_perusahaan || '-'}</strong></span>
          </div>
        </div>

        {/* Document Grid Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
          {DOCUMENT_OPTIONS.map((opt) => {
            const isAll = opt.id === 'all';
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  onSelectDocument(opt.id);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex items-start gap-3 group cursor-pointer ${
                  isAll
                    ? 'sm:col-span-2 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white border-transparent shadow-md hover:shadow-lg'
                    : 'bg-white hover:bg-brand-50/50 border-gray-200 dark:border-gray-800 dark:bg-gray-800/80 dark:hover:bg-brand-950/30 hover:border-brand-300 dark:hover:border-brand-700/60'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                  isAll ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/50'
                }`}>
                  {opt.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-bold text-sm ${isAll ? 'text-white' : 'text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400'}`}>
                      {opt.label}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      isAll ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}>
                      {opt.badge}
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 truncate ${isAll ? 'text-brand-100' : 'text-gray-500 dark:text-gray-400'}`}>
                    {opt.subLabel}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-5 mt-5 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </Modal>
  );
};
