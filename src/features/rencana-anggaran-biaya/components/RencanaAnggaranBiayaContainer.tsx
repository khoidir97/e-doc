"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MasterDokumen } from '../../master-dokumen/types';
import {
  getMasterDokumenOptionsAction,
  getRencanaAnggaranBiayaByMasterDokumenAction,
  saveRencanaAnggaranBiayaBatchAction,
} from '../actions';
import { formatRupiah, terbilang } from '@/lib/terbilang';
import { RupiahInput } from '@/components/form/RupiahInput';
import { MasterDokumenSelectorCard } from '@/features/master-dokumen/components/MasterDokumenSelectorCard';
import { Toast } from '@/components/ui/Toast';
import TextArea from '@/components/form/input/TextArea';

interface RencanaAnggaranBiayaItemRow {
  rab_id?: number;
  rab_master_dokumen_id?: number;
  rab_uraian_pekerjaan: string;
  rab_volume: string;
  rab_waktu: string;
  rab_harga_satuan: number;
  rab_harga_perkiraan_sendiri: number;
}

const createEmptyRow = (defaultUraian = '', defaultVolume = '', defaultWaktu = ''): RencanaAnggaranBiayaItemRow => ({
  rab_uraian_pekerjaan: defaultUraian,
  rab_volume: defaultVolume,
  rab_waktu: defaultWaktu,
  rab_harga_satuan: 0,
  rab_harga_perkiraan_sendiri: 0,
});

interface RencanaAnggaranBiayaContainerProps {
  initialMasterDokumenId?: number;
  hideMasterDokumenSelector?: boolean;
}

export const RencanaAnggaranBiayaContainer: React.FC<RencanaAnggaranBiayaContainerProps> = ({
  initialMasterDokumenId,
  hideMasterDokumenSelector = false,
}) => {
  // Master Dokumen List for Dropdown
  const [masterDokumenList, setMasterDokumenList] = useState<MasterDokumen[]>([]);
  const [selectedMdkId, setSelectedMdkId] = useState<number | ''>(initialMasterDokumenId || '');
  const [selectedMasterDokumen, setSelectedMasterDokumen] = useState<MasterDokumen | null>(null);

  // Dynamic RencanaAnggaranBiaya Form Items
  const [RencanaAnggaranBiayaRows, setRencanaAnggaranBiayaRows] = useState<RencanaAnggaranBiayaItemRow[]>([
    createEmptyRow(),
  ]);

  // Loading & Action states
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadingRencanaAnggaranBiaya, setLoadingRencanaAnggaranBiaya] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasSavedData, setHasSavedData] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
  };

  // Load Master Dokumen list on mount
  useEffect(() => {
    async function initOptions() {
      setLoadingOptions(true);
      const res = await getMasterDokumenOptionsAction();
      if (res.success && res.data) {
        setMasterDokumenList(res.data);
        const targetId = initialMasterDokumenId || (res.data.length > 0 ? res.data[0].mdk_id : '');
        if (targetId) {
          setSelectedMdkId(targetId);
          const found = res.data.find((m) => m.mdk_id === targetId) || null;
          setSelectedMasterDokumen(found);
        }
      } else {
        showToast('error', res.message || 'Gagal memuat opsi Master Dokumen.');
      }
      setLoadingOptions(false);
    }
    initOptions();
  }, [initialMasterDokumenId]);

  // Fetch RencanaAnggaranBiaya items whenever selected Master Dokumen changes
  const loadRencanaAnggaranBiayaForMdk = useCallback(async (mdkId: number, defaultUraianText = '', defaultVolume = '', defaultWaktu = '') => {
    setLoadingRencanaAnggaranBiaya(true);
    const res = await getRencanaAnggaranBiayaByMasterDokumenAction(mdkId);
    const isSaved = Boolean(res.success && res.data && res.data.length > 0);
    setHasSavedData(isSaved);
    if (isSaved && res.data) {
      setRencanaAnggaranBiayaRows(
        res.data.map((item) => ({
          rab_id: item.rab_id,
          rab_master_dokumen_id: item.rab_master_dokumen_id,
          rab_uraian_pekerjaan: (item.rab_uraian_pekerjaan && item.rab_uraian_pekerjaan.trim() !== '') ? item.rab_uraian_pekerjaan : defaultUraianText,
          rab_volume: (item.rab_volume && item.rab_volume.trim() !== '') ? item.rab_volume : defaultVolume,
          rab_waktu: (item.rab_waktu && item.rab_waktu.trim() !== '') ? item.rab_waktu : defaultWaktu,
          rab_harga_satuan: item.rab_harga_satuan || 0,
          rab_harga_perkiraan_sendiri: item.rab_harga_perkiraan_sendiri || 0,
        }))
      );
    } else {
      setRencanaAnggaranBiayaRows([createEmptyRow(defaultUraianText, defaultVolume, defaultWaktu)]);
    }
    setLoadingRencanaAnggaranBiaya(false);
  }, []);

  useEffect(() => {
    if (selectedMdkId && typeof selectedMdkId === 'number') {
      const found = masterDokumenList.find((m) => m.mdk_id === selectedMdkId) || null;
      setSelectedMasterDokumen(found);
      const defaultUraianText = found?.mdk_pekerjaan || found?.mdk_uraian_belanja || '';
      loadRencanaAnggaranBiayaForMdk(selectedMdkId, defaultUraianText, found?.mdk_volume || '', found?.mdk_satuan || '');
    } else {
      setSelectedMasterDokumen(null);
      setHasSavedData(false);
      setRencanaAnggaranBiayaRows([createEmptyRow()]);
    }
  }, [selectedMdkId, masterDokumenList, loadRencanaAnggaranBiayaForMdk]);

  // Handle Dynamic Rows
  const handleAddRow = () => {
    const defaultUraianText = selectedMasterDokumen?.mdk_pekerjaan || selectedMasterDokumen?.mdk_uraian_belanja || '';
    setRencanaAnggaranBiayaRows((prev) => [
      ...prev,
      createEmptyRow(defaultUraianText, selectedMasterDokumen?.mdk_volume || '', selectedMasterDokumen?.mdk_satuan || ''),
    ]);
  };

  const handleRemoveRow = (index: number) => {
    const defaultUraianText = selectedMasterDokumen?.mdk_pekerjaan || selectedMasterDokumen?.mdk_uraian_belanja || '';
    if (RencanaAnggaranBiayaRows.length === 1) {
      setRencanaAnggaranBiayaRows([
        createEmptyRow(defaultUraianText, selectedMasterDokumen?.mdk_volume || '', selectedMasterDokumen?.mdk_satuan || ''),
      ]);
      return;
    }
    setRencanaAnggaranBiayaRows((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleRowChange = (index: number, field: keyof RencanaAnggaranBiayaItemRow, value: any) => {
    setRencanaAnggaranBiayaRows((prev) => {
      const updated = [...prev];
      const row = { ...updated[index], [field]: value };

      // Helper to parse first number from volume/waktu string
      const parseNum = (str: string) => {
        if (!str) return 1;
        const match = str.match(/[\d,.]+/);
        if (!match) return 1;
        const parsed = parseFloat(match[0].replace(/\./g, '').replace(',', '.'));
        return isNaN(parsed) || parsed <= 0 ? 1 : parsed;
      };

      if (field === 'rab_harga_satuan' || field === 'rab_volume' || field === 'rab_waktu') {
        const vol = parseNum(field === 'rab_volume' ? value : row.rab_volume);
        const waktu = parseNum(field === 'rab_waktu' ? value : row.rab_waktu);
        const hargaSatuan = Number(field === 'rab_harga_satuan' ? value : row.rab_harga_satuan) || 0;
        row.rab_harga_perkiraan_sendiri = Math.round(vol * waktu * hargaSatuan);
      }

      updated[index] = row;
      return updated;
    });
  };

  // Save Batch Data
  const saveBatch = async () => {
    if (!selectedMdkId || typeof selectedMdkId !== 'number') return false;
    const validRows = RencanaAnggaranBiayaRows.filter((r) => r.rab_uraian_pekerjaan.trim() !== '');
    if (validRows.length === 0) return false;

    const res = await saveRencanaAnggaranBiayaBatchAction({
      rab_master_dokumen_id: selectedMdkId,
      items: validRows.map((r) => ({
        rab_uraian_pekerjaan: r.rab_uraian_pekerjaan,
        rab_volume: r.rab_volume,
        rab_waktu: r.rab_waktu,
        rab_harga_satuan: Number(r.rab_harga_satuan) || 0,
        rab_harga_perkiraan_sendiri: Number(r.rab_harga_perkiraan_sendiri) || 0,
      })),
    });
    return res.success;
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMdkId || typeof selectedMdkId !== 'number') {
      showToast('error', 'Silakan pilih Master Dokumen terlebih dahulu.');
      return;
    }

    const validRows = RencanaAnggaranBiayaRows.filter((r) => r.rab_uraian_pekerjaan.trim() !== '');
    if (validRows.length === 0) {
      showToast('error', 'Minimal isi 1 Uraian Pekerjaan Rencana Anggaran Biaya.');
      return;
    }

    setSaving(true);
    const success = await saveBatch();
    setSaving(false);

    if (success) {
      showToast('success', 'Berhasil menyimpan data Rencana Anggaran Biaya!');
      loadRencanaAnggaranBiayaForMdk(selectedMdkId);
    } else {
      showToast('error', 'Gagal menyimpan data Rencana Anggaran Biaya.');
    }
  };

  // Open PDF in new tab
  const handlePrintPdf = useCallback(async () => {
    if (!selectedMdkId) return;
    const validRows = RencanaAnggaranBiayaRows.filter((r) => r.rab_uraian_pekerjaan.trim() !== '');
    if (validRows.length > 0) {
      await saveBatch();
    }
    window.open(`/rencana-anggaran-biaya/print/${selectedMdkId}`, '_blank');
  }, [selectedMdkId, RencanaAnggaranBiayaRows]);

  // Calculation metrics
  const totalHargaRencanaAnggaranBiaya = RencanaAnggaranBiayaRows.reduce(
    (acc, curr) => acc + (Number(curr.rab_harga_perkiraan_sendiri) || 0),
    0
  );
  const paguNominal = Number(selectedMasterDokumen?.mdk_pagu_anggaran) || 0;
  const isLocked = selectedMasterDokumen?.mdk_is_lock === 1;
  const isSaved = hasSavedData || RencanaAnggaranBiayaRows.some((r) => Boolean(r.rab_id));
  const selisihNominal = paguNominal - totalHargaRencanaAnggaranBiaya;
  const terbilangStr = terbilang(totalHargaRencanaAnggaranBiaya);

  return (
    <div className="p-1 sm:p-1 w-full space-y-6 overflow-hidden">
      {/* Toast Notification */}
      {notification && (
        <Toast
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      {/* Header Title */}
      {!hideMasterDokumenSelector && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Formulir Rencana Anggaran Biaya (RAB)</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Kelola rincian item Rencana Anggaran Biaya & estimasi harga berdasarkan Master Dokumen
            </p>
          </div>

          {selectedMasterDokumen && (
            <button
              onClick={handlePrintPdf}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Cetak RAB PDF
            </button>
          )}
        </div>
      )}

      {/* 2-Column Responsive Layout */}
      <div
        className="grid gap-6 items-start"
        style={{
          gridTemplateColumns: hideMasterDokumenSelector ? '1fr' : 'minmax(0, 380px) minmax(0, 1fr)',
        }}
      >
        {/* Left Side (Master Dokumen Selector & Info Card) */}
        {!hideMasterDokumenSelector && (
          <div className="min-w-0 space-y-5">
            <MasterDokumenSelectorCard
              title="Pilih Master Dokumen"
              subtitle="Pilih dokumen acuan untuk Rencana Anggaran Biaya"
              masterDokumenList={masterDokumenList}
              selectedMdkId={selectedMdkId}
              selectedMasterDokumen={selectedMasterDokumen}
              onSelect={(val) => setSelectedMdkId(val)}
              loadingOptions={loadingOptions}
            />
          </div>
        )}

        {/* Right Side (Dynamic RencanaAnggaranBiaya Form Section) */}
        <div className="min-w-0">
          {selectedMasterDokumen ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <h2 className="text-base font-bold text-amber-900 dark:text-white">Rincian Item Rencana Anggaran Biaya</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Tambahkan atau ubah daftar item uraian pekerjaan, volume, waktu, dan estimasi harga RAB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="px-3.5 py-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400 font-semibold text-xs hover:bg-brand-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Baris
                  </button>
                </div>

                {loadingRencanaAnggaranBiaya ? (
                  <div className="py-8 text-center text-xs text-gray-500 animate-pulse">Memuat data Rencana Anggaran Biaya...</div>
                ) : (
                  <div className="space-y-3">
                    {/* Table Header Labels (Desktop) */}
                    <div className="hidden md:flex items-center gap-3 px-3.5 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      <div className="w-7 text-center shrink-0">No</div>
                      <div className="grid grid-cols-12 gap-3 flex-1">
                        <div className="col-span-4">Uraian Pekerjaan</div>
                        <div className="col-span-2">Volume</div>
                        <div className="col-span-2">Satuan</div>
                        <div className="col-span-2">Harga Satuan</div>
                        <div className="col-span-2">HPS (Harga Est.)</div>
                      </div>
                      <div className="w-8 shrink-0"></div>
                    </div>

                    {RencanaAnggaranBiayaRows.map((row, index) => (
                      <div
                        key={index}
                        className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 transition-all"
                      >
                        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 shrink-0">
                          {index + 1}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 flex-1 items-center">
                          {/* Uraian Pekerjaan */}
                          <div className="md:col-span-4">
                            <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1 md:hidden">Uraian Pekerjaan</label>
                            <TextArea
                              placeholder="Contoh: Sewa Bus AC kps 40 Seat"
                              value={row.rab_uraian_pekerjaan}
                              onChange={(value) => handleRowChange(index, 'rab_uraian_pekerjaan', value)}
                              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all"
                              rows={1}
                            />
                          </div>

                          {/* Volume */}
                          <div className="md:col-span-2">
                            <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1 md:hidden">Volume</label>
                            <input
                              type="text"
                              placeholder="ex: 1 Paket"
                              value={row.rab_volume}
                              onChange={(e) => handleRowChange(index, 'rab_volume', e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all"
                            />
                          </div>

                          {/* Waktu */}
                          <div className="md:col-span-2">
                            <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1 md:hidden">Waktu</label>
                            <input
                              type="text"
                              placeholder="ex: 1 Hari"
                              value={row.rab_waktu}
                              onChange={(e) => handleRowChange(index, 'rab_waktu', e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all"
                            />
                          </div>

                          {/* Harga Satuan */}
                          <div className="md:col-span-2">
                            <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1 md:hidden">Harga Satuan</label>
                            <RupiahInput
                              placeholder="0"
                              value={row.rab_harga_satuan}
                              onChange={(num) => handleRowChange(index, 'rab_harga_satuan', num)}
                              className="pr-2 py-2 text-xs font-mono font-bold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all"
                            />
                          </div>

                          {/* Harga Perkiraan Sendiri */}
                          <div className="md:col-span-2">
                            <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1 md:hidden">HPS (Harga Est.)</label>
                            <RupiahInput
                              placeholder="0"
                              value={row.rab_harga_perkiraan_sendiri}
                              onChange={(num) => handleRowChange(index, 'rab_harga_perkiraan_sendiri', num)}
                              className="pr-2 py-2 text-xs font-mono font-bold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all"
                            />
                          </div>
                        </div>

                        {/* Action Remove Row */}
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(index)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors shrink-0 cursor-pointer"
                          title="Hapus Baris"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Dynamic Summary Card & Save Button */}
              <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-6 text-xs w-full sm:w-auto">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 block">Total Nominal RAB:</span>
                      <strong className="text-base font-bold text-gray-900 dark:text-white">
                        {formatRupiah(totalHargaRencanaAnggaranBiaya)}
                      </strong>
                    </div>

                    <div>
                      <span className="text-gray-500 dark:text-gray-400 block">Selisih vs Pagu:</span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${selisihNominal >= 0
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                          }`}
                      >
                        {selisihNominal >= 0 ? `Sisa ${formatRupiah(selisihNominal)}` : `Surplus ${formatRupiah(Math.abs(selisihNominal))}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handlePrintPdf}
                      className="flex-1 sm:flex-initial px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white dark:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      Cetak PDF
                    </button>

                    <button
                      type="submit"
                      disabled={saving || isLocked}
                      className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          {isSaved ? 'Mengupdate...' : 'Menyimpan...'}
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          {isSaved ? 'Update Data' : 'Simpan Data'}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-800 text-xs">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Terbilang : </span>
                  <span className="font-bold italic text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                    {terbilangStr}
                  </span>
                </div>
              </div>
            </form>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 text-gray-400 text-sm h-64 flex flex-col items-center justify-center">
              <svg className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Pilih Master Dokumen di sebelah kiri untuk mulai mengisi data Rencana Anggaran Biaya.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
