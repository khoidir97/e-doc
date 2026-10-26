"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MasterDokumen } from '../../master-dokumen/types';
import {
  getMasterDokumenOptionsAction,
  getFakturWithDetailsAction,
  getRencanaAnggaranBiayaByMasterDokumenAction,
  saveFakturBatchAction,
} from '../actions';
import { formatRupiah } from '@/lib/terbilang';
import { MasterDokumenSelectorCard } from '@/features/master-dokumen/components/MasterDokumenSelectorCard';
import { RupiahInput } from '@/components/form/RupiahInput';
import { Toast } from '@/components/ui/Toast';
import { getNegoByMasterDokumenAction } from '@/features/nego/actions';

// Ambil angka pertama dari string (mendukung "2.00", "1.000", "1.000,5")
const parseNumber = (value: unknown): number => {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return value;
  const match = String(value).match(/\d[\d.,]*/);
  if (!match) return 0;
  let s = match[0].replace(/[.,]$/, '');
  if (s.includes(',')) {
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (/^\d{1,3}(\.\d{3})+$/.test(s)) {
    s = s.replace(/\./g, '');
  }
  const parsed = parseFloat(s);
  return isNaN(parsed) ? 0 : parsed;
};

interface FakturItemRow {
  fkt_id?: number;
  fkt_master_dokumen_id?: number;
  fkt_jenis_spesifikasi: string;
  fkt_unit: number;
  fkt_hari: string;
  fkt_harga_satuan: number;
  fkt_total: number;
}

const createEmptyRow = (): FakturItemRow => ({
  fkt_jenis_spesifikasi: '',
  fkt_unit: 0,
  fkt_hari: '',
  fkt_harga_satuan: 0,
  fkt_total: 0,
});

interface FakturContainerProps {
  initialMasterDokumenId?: number;
  hideMasterDokumenSelector?: boolean;
}

export const FakturContainer: React.FC<FakturContainerProps> = ({
  initialMasterDokumenId,
  hideMasterDokumenSelector = false,
}) => {
  // Master Dokumen List for Dropdown
  const [masterDokumenList, setMasterDokumenList] = useState<MasterDokumen[]>([]);
  const [selectedMdkId, setSelectedMdkId] = useState<number | ''>(initialMasterDokumenId || '');
  const [selectedMasterDokumen, setSelectedMasterDokumen] = useState<MasterDokumen | null>(null);

  // Header state (tabel faktur)
  const [nomorFaktur, setNomorFaktur] = useState<string>('');
  const [tanggalFaktur, setTanggalFaktur] = useState<string>('');

  // Dynamic Faktur Form Items (tabel detail_faktur)
  const [FakturRows, setFakturRows] = useState<FakturItemRow[]>([
    createEmptyRow(),
  ]);

  // Loading & Action states
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadingFaktur, setLoadingFaktur] = useState(false);
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

  const handleCopyFromRAB = async () => {
    if (!selectedMdkId || typeof selectedMdkId !== 'number') {
      showToast('error', 'Silakan pilih Master Dokumen terlebih dahulu.');
      return;
    }
    setLoadingFaktur(true);
    const rabRes = await getRencanaAnggaranBiayaByMasterDokumenAction(selectedMdkId);
    if (rabRes.success && rabRes.data && rabRes.data.length > 0) {
      setFakturRows(
        rabRes.data.map((item) => ({
          fkt_master_dokumen_id: selectedMdkId,
          fkt_jenis_spesifikasi: item.rab_uraian_pekerjaan || '',
          fkt_unit: item.rab_volume || 0,
          fkt_hari: String(item.rab_waktu || ''),
          fkt_harga_satuan: item.rab_harga_satuan || 0,
          fkt_total: item.rab_harga_perkiraan_sendiri || 0,
        }))
      );
      showToast('success', 'Berhasil menyalin data dari Rencana Anggaran Biaya (RAB).');
    } else {
      showToast('error', 'Tidak ada data Rencana Anggaran Biaya (RAB) untuk Master Dokumen ini.');
    }
    setLoadingFaktur(false);
  };

  // Isi otomatis dari Master Dokumen (pekerjaan, volume, satuan) + Nego (harga satuan negosiasi)
  const prefillFromMasterAndNego = useCallback(async (mdk: MasterDokumen) => {
    setLoadingFaktur(true);
    const negoRes = await getNegoByMasterDokumenAction(mdk.mdk_id);
    const negoFirst = negoRes.success && negoRes.data && negoRes.data.length > 0 ? negoRes.data[0] : null;

    const unit = parseNumber(mdk.mdk_volume);
    const hargaSatuan = Number(negoFirst?.nego_negosiasi_harga_satuan) || 0;

    setFakturRows([
      {
        fkt_master_dokumen_id: mdk.mdk_id,
        fkt_jenis_spesifikasi: mdk.mdk_pekerjaan || '',
        fkt_unit: unit,
        fkt_hari: mdk.mdk_satuan || '',
        fkt_harga_satuan: hargaSatuan,
        fkt_total: Math.round(unit * hargaSatuan),
      },
    ]);
    setLoadingFaktur(false);
  }, []);

  useEffect(() => {
    if (selectedMdkId && typeof selectedMdkId === 'number') {
      const found = masterDokumenList.find((m) => m.mdk_id === selectedMdkId) || null;
      setSelectedMasterDokumen(found);
      // loadFakturForMdk(selectedMdkId);
      if (found) prefillFromMasterAndNego(found);
    } else {
      setSelectedMasterDokumen(null);
      setNomorFaktur('');
      setTanggalFaktur('');
      setFakturRows([createEmptyRow()]);
    }
  }, [selectedMdkId, masterDokumenList, prefillFromMasterAndNego]);

  // Handle Dynamic Rows
  const handleAddRow = () => {
    setFakturRows((prev) => [...prev, createEmptyRow()]);
  };

  const handleRemoveRow = (index: number) => {
    if (FakturRows.length === 1) {
      setFakturRows([createEmptyRow()]);
      return;
    }
    setFakturRows((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleRowChange = (index: number, field: keyof FakturItemRow, value: any) => {
    setFakturRows((prev) => {
      const updated = [...prev];
      const currentRow = { ...updated[index], [field]: value };

      if (field === 'fkt_unit' || field === 'fkt_harga_satuan') {
        // fkt_total = fkt_unit * fkt_harga_satuan
        const unitVal = parseFloat(String(currentRow.fkt_unit)) || 0;
        const hargaSatuanVal = parseFloat(String(currentRow.fkt_harga_satuan)) || 0;
        currentRow.fkt_total = Math.round(unitVal * hargaSatuanVal);
      }

      updated[index] = currentRow;
      return updated;
    });
  };

  // Submit Dynamic Faktur Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMdkId || typeof selectedMdkId !== 'number') {
      showToast('error', 'Silakan pilih Master Dokumen terlebih dahulu.');
      return;
    }

    const validRows = FakturRows.filter((r) => r.fkt_jenis_spesifikasi.trim() !== '');
    if (validRows.length === 0) {
      showToast('error', 'Minimal isi 1 Jenis Spesifikasi Faktur.');
      return;
    }

    setSaving(true);
    const res = await saveFakturBatchAction({
      fkt_master_dokumen_id: selectedMdkId,
      fak_nomor_faktur: nomorFaktur,
      fak_tanggal_faktur: tanggalFaktur,
      items: validRows.map((r) => ({
        fkt_jenis_spesifikasi: r.fkt_jenis_spesifikasi,
        fkt_unit: Number(r.fkt_unit) || 0,
        fkt_hari: String(r.fkt_hari || ''),
        fkt_harga_satuan: Number(r.fkt_harga_satuan) || 0,
        fkt_total: Number(r.fkt_total) || 0,
      })),
    });
    setSaving(false);

    if (res.success) {
      showToast('success', res.message);
      // loadFakturForMdk(selectedMdkId);
    } else {
      showToast('error', res.message);
    }
  };

  const handlePrint = async () => {
    if (!selectedMdkId || typeof selectedMdkId !== 'number') {
      showToast('error', 'Silakan pilih Master Dokumen terlebih dahulu.');
      return;
    }

    const validRows = FakturRows.filter((r) => r.fkt_jenis_spesifikasi.trim() !== '');
    if (validRows.length > 0) {
      setSaving(true);
      await saveFakturBatchAction({
        fkt_master_dokumen_id: selectedMdkId,
        fak_nomor_faktur: nomorFaktur,
        fak_tanggal_faktur: tanggalFaktur,
        items: validRows.map((r) => ({
          fkt_jenis_spesifikasi: r.fkt_jenis_spesifikasi,
          fkt_unit: Number(r.fkt_unit) || 0,
          fkt_hari: String(r.fkt_hari || ''),
          fkt_harga_satuan: Number(r.fkt_harga_satuan) || 0,
          fkt_total: Number(r.fkt_total) || 0,
        })),
      });
      setSaving(false);
    }

    window.open(`/faktur/print/${selectedMdkId}`, '_blank');
  };

  // Calculation metrics
  const totalHargaFaktur = FakturRows.reduce(
    (acc, curr) => acc + (Number(curr.fkt_total) || 0),
    0
  );
  const paguNominal = Number(selectedMasterDokumen?.mdk_pagu_anggaran) || 0;
  const selisihNominal = paguNominal - totalHargaFaktur;
  const countPPN = totalHargaFaktur * (11 / 100);

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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Formulir Faktur Pesanan</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Kelola nomor faktur, tanggal, rincian spesifikasi barang, dan estimasi harga
            </p>
          </div>
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
              subtitle="Pilih dokumen acuan untuk Faktur Pesanan"
              masterDokumenList={masterDokumenList}
              selectedMdkId={selectedMdkId}
              selectedMasterDokumen={selectedMasterDokumen}
              onSelect={(val) => setSelectedMdkId(val)}
              loadingOptions={loadingOptions}
            />
          </div>
        )}

        {/* Right Side (Dynamic Faktur Form Section) */}
        <div className="min-w-0">
          {selectedMasterDokumen ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Card Header Info Dokumen Faktur */}
              <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                <div className="font-bold text-gray-900 dark:text-white text-sm pb-2 border-b border-gray-100 dark:border-gray-800">
                  Info Dokumen Faktur Pesanan
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Nomor Faktur
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: /SEKRETARIS-027.1/VI/2026"
                      value={nomorFaktur}
                      onChange={(e) => setNomorFaktur(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Tanggal Faktur
                    </label>
                    <input
                      type="date"
                      value={tanggalFaktur}
                      onChange={(e) => setTanggalFaktur(e.target.value)}
                      onClick={(e) => e.currentTarget.showPicker && e.currentTarget.showPicker()}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Rincian Item Card */}
              <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white">Rincian Item Faktur</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Tambahkan atau ubah daftar item spesifikasi barang, volume, dan harga
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

                {loadingFaktur ? (
                  <div className="py-8 text-center text-xs text-gray-500 animate-pulse">Memuat data Faktur...</div>
                ) : (
                  <div className="space-y-3">
                    {/* Table Header Labels (Desktop) */}
                    <div className="hidden md:flex items-center gap-3 px-3.5 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      <div className="w-7 text-center shrink-0">No</div>
                      <div className="grid grid-cols-12 gap-3 flex-1">
                        <div className="col-span-4">Jenis Spesifikasi</div>
                        <div className="col-span-2">Unit</div>
                        <div className="col-span-2">Hari</div>
                        <div className="col-span-2">Harga Satuan</div>
                        <div className="col-span-2">Total</div>
                      </div>
                      <div className="w-8 shrink-0"></div>
                    </div>

                    {FakturRows.map((row, index) => (
                      <div
                        key={index}
                        className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 transition-all"
                      >
                        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 shrink-0">
                          {index + 1}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 flex-1 items-center">
                          {/* Jenis Spesifikasi */}
                          <div className="md:col-span-4">
                            <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1 md:hidden">Jenis Spesifikasi</label>
                            <input
                              type="text"
                              placeholder="Contoh: Sewa Bus AC kps 40 Seat"
                              value={row.fkt_jenis_spesifikasi}
                              onChange={(e) => handleRowChange(index, 'fkt_jenis_spesifikasi', e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all"
                            />
                          </div>

                          {/* Unit */}
                          <div className="md:col-span-2">
                            <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1 md:hidden">Unit</label>
                            <input
                              type="number"
                              placeholder="0"
                              value={row.fkt_unit || ''}
                              onChange={(e) => handleRowChange(index, 'fkt_unit', e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all"
                            />
                          </div>

                          {/* Hari */}
                          <div className="md:col-span-2">
                            <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1 md:hidden">Hari</label>
                            <input
                              placeholder="0"
                              value={row.fkt_hari || ''}
                              onChange={(e) => handleRowChange(index, 'fkt_hari', e.target.value)}
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
                                value={row.fkt_harga_satuan || ''}
                                onChange={(e) => handleRowChange(index, 'fkt_harga_satuan', e)}
                                className="w-full pl-8 pr-2 py-2 text-xs font-mono font-bold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all"
                              />
                            </div>
                          </div>

                          {/* Total */}
                          <div className="md:col-span-2">
                            <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1 md:hidden">Total</label>
                            <div className="relative">
                              <span className="absolute left-2.5 top-2 text-[11px] font-bold text-gray-400">Rp</span>
                              <RupiahInput
                                placeholder="0"
                                value={row.fkt_total || ''}
                                onChange={(e) => handleRowChange(index, 'fkt_total', e)}
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

              {/* Dynamic Summary Card & Action Buttons */}
              <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-6 text-xs w-full sm:w-auto">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 block">Total Nominal Faktur:</span>
                    <strong className="text-base font-bold text-gray-900 dark:text-white">
                      {formatRupiah(totalHargaFaktur)}
                    </strong>
                  </div>

                  <div>
                    <span className="text-gray-500 dark:text-gray-400 block">PPN</span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400`}
                    >
                      {formatRupiah(countPPN)}
                    </span>
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

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handlePrint}
                    disabled={saving}
                    className="flex-1 sm:flex-initial px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white dark:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Cetak Faktur
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
                        Simpan Data
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 text-gray-400 text-sm h-64 flex flex-col items-center justify-center">
              <svg className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Pilih Master Dokumen di sebelah kiri untuk mulai mengisi data Faktur.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
