"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MasterDokumen } from '../../master-dokumen/types';
import {
  getMasterDokumenOptionsAction,
  getHargaPerkiraanSendiriByMasterDokumenAction,
  getRencanaAnggaranBiayaByMasterDokumenAction,
  saveHargaPerkiraanSendiriBatchAction,
} from '../actions';
import { formatRupiah, terbilang } from '@/lib/terbilang';
import { MasterDokumenSelectorCard } from '@/features/master-dokumen/components/MasterDokumenSelectorCard';
import { RupiahInput } from '@/components/form/RupiahInput';
import { Toast } from '@/components/ui/Toast';

interface HargaPerkiraanSendiriItemRow {
  hps_id?: number;
  hps_master_dokumen_id?: number;
  hps_uraian_pekerjaan: string;
  hps_volume: string;
  hps_waktu: string;
  hps_harga_satuan: number;
  hps_harga_perkiraan_sendiri: number;
}

const createEmptyRow = (): HargaPerkiraanSendiriItemRow => ({
  hps_uraian_pekerjaan: '',
  hps_volume: '',
  hps_waktu: '',
  hps_harga_satuan: 0,
  hps_harga_perkiraan_sendiri: 0,
});

interface HargaPerkiraanSendiriContainerProps {
  initialMasterDokumenId?: number;
  hideMasterDokumenSelector?: boolean;
}

export const HargaPerkiraanSendiriContainer: React.FC<HargaPerkiraanSendiriContainerProps> = ({
  initialMasterDokumenId,
  hideMasterDokumenSelector = false,
}) => {
  // Master Dokumen List for Dropdown
  const [masterDokumenList, setMasterDokumenList] = useState<MasterDokumen[]>([]);
  const [selectedMdkId, setSelectedMdkId] = useState<number | ''>(initialMasterDokumenId || '');
  const [selectedMasterDokumen, setSelectedMasterDokumen] = useState<MasterDokumen | null>(null);

  // Dynamic HargaPerkiraanSendiri Form Items
  const [HargaPerkiraanSendiriRows, setHargaPerkiraanSendiriRows] = useState<HargaPerkiraanSendiriItemRow[]>([
    createEmptyRow(),
  ]);

  // Loading & Action states
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadingHargaPerkiraanSendiri, setLoadingHargaPerkiraanSendiri] = useState(false);
  const [saving, setSaving] = useState(false);
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

  // Fetch HargaPerkiraanSendiri items whenever selected Master Dokumen changes
  const loadHargaPerkiraanSendiriForMdk = useCallback(async (mdkId: number) => {
    setLoadingHargaPerkiraanSendiri(true);
    const res = await getHargaPerkiraanSendiriByMasterDokumenAction(mdkId);
    if (res.success && res.data && res.data.length > 0) {
      setHargaPerkiraanSendiriRows(
        res.data.map((item) => ({
          hps_id: item.hps_id,
          hps_master_dokumen_id: item.hps_master_dokumen_id,
          hps_uraian_pekerjaan: item.hps_uraian_pekerjaan || '',
          hps_volume: item.hps_volume || '',
          hps_waktu: item.hps_waktu || '',
          hps_harga_satuan: item.hps_harga_satuan || 0,
          hps_harga_perkiraan_sendiri: item.hps_harga_perkiraan_sendiri || 0,
        }))
      );
    } else {
      // Auto-fill from Rencana Anggaran Biaya (RAB) if available for this Master Dokumen
      const rabRes = await getRencanaAnggaranBiayaByMasterDokumenAction(mdkId);
      if (rabRes.success && rabRes.data && rabRes.data.length > 0) {
        setHargaPerkiraanSendiriRows(
          rabRes.data.map((item) => ({
            hps_master_dokumen_id: mdkId,
            hps_uraian_pekerjaan: item.rab_uraian_pekerjaan || '',
            hps_volume: item.rab_volume || '',
            hps_waktu: item.rab_waktu || '',
            hps_harga_satuan: item.rab_harga_satuan || 0,
            hps_harga_perkiraan_sendiri: item.rab_harga_perkiraan_sendiri || 0,
          }))
        );
        showToast('success', 'Form HPS otomatis terisi dari data Rencana Anggaran Biaya (RAB).');
      } else {
        setHargaPerkiraanSendiriRows([createEmptyRow()]);
      }
    }
    setLoadingHargaPerkiraanSendiri(false);
  }, []);

  const handleCopyFromRAB = async () => {
    if (!selectedMdkId || typeof selectedMdkId !== 'number') {
      showToast('error', 'Silakan pilih Master Dokumen terlebih dahulu.');
      return;
    }
    setLoadingHargaPerkiraanSendiri(true);
    const rabRes = await getRencanaAnggaranBiayaByMasterDokumenAction(selectedMdkId);
    if (rabRes.success && rabRes.data && rabRes.data.length > 0) {
      setHargaPerkiraanSendiriRows(
        rabRes.data.map((item) => ({
          hps_master_dokumen_id: selectedMdkId,
          hps_uraian_pekerjaan: item.rab_uraian_pekerjaan || '',
          hps_volume: item.rab_volume || '',
          hps_waktu: item.rab_waktu || '',
          hps_harga_satuan: item.rab_harga_satuan || 0,
          hps_harga_perkiraan_sendiri: item.rab_harga_perkiraan_sendiri || 0,
        }))
      );
      showToast('success', 'Berhasil menyalin data dari Rencana Anggaran Biaya (RAB).');
    } else {
      showToast('error', 'Tidak ada data Rencana Anggaran Biaya (RAB) untuk Master Dokumen ini.');
    }
    setLoadingHargaPerkiraanSendiri(false);
  };

  useEffect(() => {
    if (selectedMdkId && typeof selectedMdkId === 'number') {
      const found = masterDokumenList.find((m) => m.mdk_id === selectedMdkId) || null;
      setSelectedMasterDokumen(found);
      loadHargaPerkiraanSendiriForMdk(selectedMdkId);
    } else {
      setSelectedMasterDokumen(null);
      setHargaPerkiraanSendiriRows([createEmptyRow()]);
    }
  }, [selectedMdkId, masterDokumenList, loadHargaPerkiraanSendiriForMdk]);

  // Handle Dynamic Rows
  const handleAddRow = () => {
    setHargaPerkiraanSendiriRows((prev) => [...prev, createEmptyRow()]);
  };

  const handleRemoveRow = (index: number) => {
    if (HargaPerkiraanSendiriRows.length === 1) {
      setHargaPerkiraanSendiriRows([createEmptyRow()]);
      return;
    }
    setHargaPerkiraanSendiriRows((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleRowChange = (index: number, field: keyof HargaPerkiraanSendiriItemRow, value: any) => {
    setHargaPerkiraanSendiriRows((prev) => {
      const updated = [...prev];
      const row = { ...updated[index], [field]: value };

      const parseNum = (str: string) => {
        if (!str) return 1;
        const match = str.match(/[\d,.]+/);
        if (!match) return 1;
        const parsed = parseFloat(match[0].replace(/\./g, '').replace(',', '.'));
        return isNaN(parsed) || parsed <= 0 ? 1 : parsed;
      };

      if (field === 'hps_harga_satuan' || field === 'hps_volume' || field === 'hps_waktu') {
        const vol = parseNum(field === 'hps_volume' ? value : row.hps_volume);
        const waktu = parseNum(field === 'hps_waktu' ? value : row.hps_waktu);
        const hargaSatuan = Number(field === 'hps_harga_satuan' ? value : row.hps_harga_satuan) || 0;
        row.hps_harga_perkiraan_sendiri = Math.round(vol * waktu * hargaSatuan);
      }

      updated[index] = row;
      return updated;
    });
  };

  // Save Batch Data
  const saveBatch = async () => {
    if (!selectedMdkId || typeof selectedMdkId !== 'number') return false;
    const validRows = HargaPerkiraanSendiriRows.filter((r) => r.hps_uraian_pekerjaan.trim() !== '');
    if (validRows.length === 0) return false;

    const res = await saveHargaPerkiraanSendiriBatchAction({
      hps_master_dokumen_id: selectedMdkId,
      items: validRows.map((r) => ({
        hps_uraian_pekerjaan: r.hps_uraian_pekerjaan,
        hps_volume: r.hps_volume,
        hps_waktu: r.hps_waktu,
        hps_harga_satuan: Number(r.hps_harga_satuan) || 0,
        hps_harga_perkiraan_sendiri: Number(r.hps_harga_perkiraan_sendiri) || 0,
      })),
    });
    return res.success;
  };

  // Submit Dynamic Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMdkId || typeof selectedMdkId !== 'number') {
      showToast('error', 'Silakan pilih Master Dokumen terlebih dahulu.');
      return;
    }

    const validRows = HargaPerkiraanSendiriRows.filter((r) => r.hps_uraian_pekerjaan.trim() !== '');
    if (validRows.length === 0) {
      showToast('error', 'Minimal isi 1 Uraian Pekerjaan Harga Perkiraan Sendiri.');
      return;
    }

    setSaving(true);
    const success = await saveBatch();
    setSaving(false);

    if (success) {
      showToast('success', 'Berhasil menyimpan data Harga Perkiraan Sendiri!');
      loadHargaPerkiraanSendiriForMdk(selectedMdkId);
    } else {
      showToast('error', 'Gagal menyimpan data Harga Perkiraan Sendiri.');
    }
  };

  // Open PDF in new tab
  const handlePrintPdf = useCallback(async () => {
    if (!selectedMdkId) return;
    const validRows = HargaPerkiraanSendiriRows.filter((r) => r.hps_uraian_pekerjaan.trim() !== '');
    if (validRows.length > 0) {
      await saveBatch();
    }
    window.open(`/harga-perkiraan-sendiri/print/${selectedMdkId}`, '_blank');
  }, [selectedMdkId, HargaPerkiraanSendiriRows]);

  // Calculation metrics
  const totalHargaHargaPerkiraanSendiri = HargaPerkiraanSendiriRows.reduce(
    (acc, curr) => acc + (Number(curr.hps_harga_perkiraan_sendiri) || 0),
    0
  );
  const ppnHps = Math.round(totalHargaHargaPerkiraanSendiri * 0.11);
  const totalKeseluruhanHps = totalHargaHargaPerkiraanSendiri + ppnHps;
  const paguNominal = Number(selectedMasterDokumen?.mdk_pagu_anggaran) || 0;
  const selisihNominal = paguNominal - totalKeseluruhanHps;
  const terbilangStr = terbilang(totalKeseluruhanHps);

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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Formulir Harga Perkiraan Sendiri (HPS)</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Kelola rincian item Harga Perkiraan Sendiri & estimasi harga berdasarkan Master Dokumen
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
              Cetak HPS PDF
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
              subtitle="Pilih dokumen acuan untuk Penawaran"
              masterDokumenList={masterDokumenList}
              selectedMdkId={selectedMdkId}
              selectedMasterDokumen={selectedMasterDokumen}
              onSelect={(val) => setSelectedMdkId(val)}
              loadingOptions={loadingOptions}
            />
          </div>
        )}

        {/* Right Side (Dynamic HargaPerkiraanSendiri Form Section) */}
        <div className="min-w-0">
          {selectedMasterDokumen ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white">Rincian Item Harga Perkiraan Sendiri</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Tambahkan atau ubah daftar item uraian pekerjaan, volume, waktu, dan estimasi harga HPS
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyFromRAB}
                      className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 font-semibold text-xs hover:bg-blue-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="Salin rincian data dari Rencana Anggaran Biaya (RAB)"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Salin dari RAB
                    </button>
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
                </div>

                {loadingHargaPerkiraanSendiri ? (
                  <div className="py-8 text-center text-xs text-gray-500 animate-pulse">Memuat data Harga Perkiraan Sendiri...</div>
                ) : (
                  <div className="space-y-3">
                    {/* Table Header Labels (Desktop) */}
                    <div className="hidden md:flex items-center gap-3 px-3.5 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      <div className="w-7 text-center shrink-0">No</div>
                      <div className="grid grid-cols-12 gap-3 flex-1">
                        <div className="col-span-4">Uraian Pekerjaan</div>
                        <div className="col-span-2">Volume</div>
                        <div className="col-span-2">Waktu</div>
                        <div className="col-span-2">Harga Satuan</div>
                        <div className="col-span-2">HPS (Harga Est.)</div>
                      </div>
                      <div className="w-8 shrink-0"></div>
                    </div>

                    {HargaPerkiraanSendiriRows.map((row, index) => (
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
                            <input
                              type="text"
                              placeholder="Contoh: Sewa Bus AC kps 40 Seat"
                              value={row.hps_uraian_pekerjaan}
                              onChange={(e) => handleRowChange(index, 'hps_uraian_pekerjaan', e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all"
                            />
                          </div>

                          {/* Volume */}
                          <div className="md:col-span-2">
                            <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1 md:hidden">Volume</label>
                            <input
                              type="text"
                              placeholder="ex: 1 Paket"
                              value={row.hps_volume}
                              onChange={(e) => handleRowChange(index, 'hps_volume', e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all"
                            />
                          </div>

                          {/* Waktu */}
                          <div className="md:col-span-2">
                            <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1 md:hidden">Waktu</label>
                            <input
                              type="text"
                              placeholder="ex: 1 Hari"
                              value={row.hps_waktu}
                              onChange={(e) => handleRowChange(index, 'hps_waktu', e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all"
                            />
                          </div>

                          {/* Harga Satuan */}
                          <div className="md:col-span-2">
                            <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1 md:hidden">Harga Satuan</label>
                            <div className="relative">
                              <span className="absolute left-2.5 top-2 text-[11px] font-bold text-gray-400">Rp</span>
                              <RupiahInput
                                placeholder="0"
                                value={row.hps_harga_satuan || ''}
                                onChange={(e) => handleRowChange(index, 'hps_harga_satuan', e)}
                                className="w-full pl-8 pr-2 py-2 text-xs font-mono font-bold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all"
                              />
                            </div>
                          </div>

                          {/* Harga Perkiraan Sendiri */}
                          <div className="md:col-span-2">
                            <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1 md:hidden">HPS (Harga Est.)</label>
                            <div className="relative">
                              <span className="absolute left-2.5 top-2 text-[11px] font-bold text-gray-400">Rp</span>
                              <RupiahInput
                                placeholder="0"
                                value={row.hps_harga_perkiraan_sendiri || ''}
                                onChange={(e) => handleRowChange(index, 'hps_harga_perkiraan_sendiri', e)}
                                className="w-full pl-8 pr-2 py-2 text-xs font-mono font-bold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all"
                              />
                            </div>
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
                      <span className="text-gray-500 dark:text-gray-400 block">Jumlah HPS:</span>
                      <strong className="text-sm font-bold text-gray-900 dark:text-white">
                        {formatRupiah(totalHargaHargaPerkiraanSendiri)}
                      </strong>
                    </div>

                    <div>
                      <span className="text-gray-500 dark:text-gray-400 block">PPN (11%):</span>
                      <strong className="text-sm font-bold text-gray-900 dark:text-white">
                        {formatRupiah(ppnHps)}
                      </strong>
                    </div>

                    <div>
                      <span className="text-gray-500 dark:text-gray-400 block">Total + PPN (HPS):</span>
                      <strong className="text-base font-extrabold text-brand-600 dark:text-brand-400">
                        {formatRupiah(totalKeseluruhanHps)}
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
                      <svg className="w-4 h-4 text-white-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      Cetak PDF
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Simpan Data HPS
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
              <span>Pilih Master Dokumen di sebelah kiri untuk mulai mengisi data Harga Perkiraan Sendiri.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
