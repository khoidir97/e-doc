"use client";

import React from 'react';
import { MasterDokumen } from '../types';
import { SearchableSelect } from '@/components/form/SearchableSelect';
import { formatRupiah } from '@/lib/terbilang';

interface MasterDokumenSelectorCardProps {
  masterDokumenList: MasterDokumen[];
  selectedMdkId: number | '';
  selectedMasterDokumen: MasterDokumen | null;
  onSelect: (val: number) => void;
  loadingOptions?: boolean;
  title?: string;
  subtitle?: string;
}

export const MasterDokumenSelectorCard: React.FC<MasterDokumenSelectorCardProps> = ({
  masterDokumenList,
  selectedMdkId,
  selectedMasterDokumen,
  onSelect,
  loadingOptions = false,
  title = "Pilih Master Dokumen",
  subtitle = "Pilih dokumen acuan untuk pengisian data",
}) => {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
      <div>
        <h2 className="text-base font-bold text-gray-900 dark:text-white">{title}</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {subtitle}
        </p>
      </div>

      {loadingOptions ? (
        <div className="h-10 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />
      ) : (
        <SearchableSelect
          options={masterDokumenList.map((mdk) => ({
            value: mdk.mdk_id,
            label: mdk.mdk_uraian_belanja || 'Dokumen Tanpa Judul',
            sublabel: `[${mdk.bdg_nama || mdk.mdk_bagian || '-'}] (No. DPA: ${mdk.mdk_no_dpa || '-'})`,
          }))}
          value={selectedMdkId}
          onChange={(val) => onSelect(Number(val))}
          placeholder="-- Pilih Master Dokumen --"
          searchPlaceholder="Cari berdasarkan uraian belanja, bidang, atau No. DPA..."
          disabled={masterDokumenList.length === 0}
        />
      )}

      {/* Selected Master Dokumen Detail Card */}
      {selectedMasterDokumen ? (
        <div className="p-4 rounded-xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200/60 dark:border-brand-800/40 text-xs space-y-3.5 mt-4">
          <div className="pb-2 border-b border-brand-200/50 dark:border-brand-800/40 font-bold text-gray-900 dark:text-white text-sm">
            Detail Master Dokumen
          </div>

          <div>
            <span className="text-gray-500 dark:text-gray-400 block mb-0.5">Pekerjaan / Belanja:</span>
            <strong className="text-gray-900 dark:text-white font-semibold text-xs leading-relaxed block">
              {selectedMasterDokumen.mdk_uraian_belanja || '-'}
            </strong>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div>
              <span className="text-gray-500 dark:text-gray-400 block mb-0.5">Bidang / Bagian:</span>
              <strong className="text-emerald-500 dark:text-white font-semibold block">
                {selectedMasterDokumen.bdg_nama || selectedMasterDokumen.mdk_bagian || '-'}
              </strong>
            </div>

            <div>
              <span className="text-gray-500 dark:text-gray-400 block mb-0.5">No. DPA:</span>
              <strong className="text-amber-400 dark:text-white font-mono font-semibold block">
                {selectedMasterDokumen.mdk_no_dpa || '-'}
              </strong>
            </div>

            <div>
              <span className="text-gray-500 dark:text-gray-400 block mb-0.5">Pagu Anggaran:</span>
              <strong className="text-brand-600 dark:text-brand-400 font-bold text-sm block">
                {formatRupiah(selectedMasterDokumen.mdk_pagu_anggaran)}
              </strong>
            </div>

            <div>
              <span className="text-gray-500 dark:text-gray-400 block mb-0.5">Sub Kegiatan:</span>
              <strong className="text-gray-900 dark:text-white font-bold text-sm block">
                {selectedMasterDokumen.mdk_sub_kegiatan || '-'}
              </strong>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-dashed border-gray-200 dark:border-gray-700 text-center text-xs text-gray-400">
          Belum ada Master Dokumen yang dipilih.
        </div>
      )}
    </div>
  );
};
