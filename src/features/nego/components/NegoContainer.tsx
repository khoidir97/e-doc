"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MasterDokumen } from '../../master-dokumen/types';
import {
  getMasterDokumenOptionsAction,
  getNegoByMasterDokumenAction,
  saveNegoBatchAction,
  deleteNegoAction,
} from '../actions';
import { getHargaPerkiraanSendiriByMasterDokumenAction } from '@/features/harga-perkiraan-sendiri/actions';
import { getPenawaranByMasterDokumenAction } from '@/features/penawaran/actions';
import { formatRupiah, terbilang } from '@/lib/terbilang';
import { MasterDokumenSelectorCard } from '@/features/master-dokumen/components/MasterDokumenSelectorCard';
import { RupiahInput } from '@/components/form/RupiahInput';
import { Toast } from '@/components/ui/Toast';

interface NegoItemRow {
  nego_id?: number;
  nego_master_dokumen_id?: number;
  nego_uraian_kegiatan: string;
  nego_volume: string;
  nego_waktu: string;
  nego_hps_harga_satuan: number;
  nego_hps_jumlah_harga: number;
  nego_pnw_harga_satuan: number;
  nego_pnw_jumlah_harga: number;
  nego_negosiasi_harga_satuan: number;
  nego_negosiasi_jumlah_harga: number;
}

const createEmptyRow = (): NegoItemRow => ({
  nego_uraian_kegiatan: '',
  nego_volume: '',
  nego_waktu: '',
  nego_hps_harga_satuan: 0,
  nego_hps_jumlah_harga: 0,
  nego_pnw_harga_satuan: 0,
  nego_pnw_jumlah_harga: 0,
  nego_negosiasi_harga_satuan: 0,
  nego_negosiasi_jumlah_harga: 0,
});

interface NegoContainerProps {
  initialMasterDokumenId?: number;
  hideMasterDokumenSelector?: boolean;
}

export const NegoContainer: React.FC<NegoContainerProps> = ({
  initialMasterDokumenId,
  hideMasterDokumenSelector = false,
}) => {
  const [masterDokumenList, setMasterDokumenList] = useState<MasterDokumen[]>([]);
  const [selectedMdkId, setSelectedMdkId] = useState<number | ''>(initialMasterDokumenId || '');
  const [selectedMasterDokumen, setSelectedMasterDokumen] = useState<MasterDokumen | null>(null);
  const [NegoRows, setNegoRows] = useState<NegoItemRow[]>([createEmptyRow()]);
  const [hasSavedData, setHasSavedData] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadingNego, setLoadingNego] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
  };

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

  const loadNegoForMdk = useCallback(async (mdkId: number) => {
    setLoadingNego(true);
    const [res, hpsRes, pnwRes] = await Promise.all([
      getNegoByMasterDokumenAction(mdkId),
      getHargaPerkiraanSendiriByMasterDokumenAction(mdkId),
      getPenawaranByMasterDokumenAction(mdkId),
    ]);

    const pnwList = pnwRes.success && pnwRes.data ? pnwRes.data : [];
    const isSaved = Boolean(res.success && res.data && res.data.length > 0);
    setHasSavedData(isSaved);

      if (isSaved && res.data) {
        setNegoRows(
          res.data.map((item, idx) => {
            const pnwItem = pnwList[idx];
            const pnwHargaSatuan = Number(item.nego_pnw_harga_satuan) || (pnwItem ? Number(pnwItem.pnw_harga_satuan) || 0 : 0);
            const pnwJumlahHarga = Number(item.nego_pnw_jumlah_harga) || (pnwItem ? Number(pnwItem.pnw_harga_perkiraan_sendiri) || 0 : 0);

            return {
              nego_id: item.nego_id,
              nego_master_dokumen_id: item.nego_master_dokumen_id,
              nego_uraian_kegiatan: item.nego_uraian_kegiatan || '',
              nego_volume: item.nego_volume || '',
              nego_waktu: item.nego_waktu || '',
              nego_hps_harga_satuan: item.nego_hps_harga_satuan || 0,
              nego_hps_jumlah_harga: item.nego_hps_jumlah_harga || 0,
              nego_pnw_harga_satuan: pnwHargaSatuan,
              nego_pnw_jumlah_harga: pnwJumlahHarga,
              nego_negosiasi_harga_satuan: item.nego_negosiasi_harga_satuan || 0,
              nego_negosiasi_jumlah_harga: item.nego_negosiasi_jumlah_harga || 0,
            };
          })
        );
      } else {
        // Auto-fill from HPS and Penawaran if available
        if (hpsRes.success && hpsRes.data && hpsRes.data.length > 0) {
          setNegoRows(
            hpsRes.data.map((item, idx) => {
              const pnwItem = pnwList[idx];
              return {
                nego_master_dokumen_id: mdkId,
                nego_uraian_kegiatan: item.hps_uraian_pekerjaan || '',
                nego_volume: item.hps_volume || '',
                nego_waktu: item.hps_waktu || '',
                nego_hps_harga_satuan: Number(item.hps_harga_satuan) || 0,
                nego_hps_jumlah_harga: Number(item.hps_harga_perkiraan_sendiri) || 0,
                nego_pnw_harga_satuan: pnwItem ? Number(pnwItem.pnw_harga_satuan) || 0 : 0,
                nego_pnw_jumlah_harga: pnwItem ? Number(pnwItem.pnw_harga_perkiraan_sendiri) || 0 : 0,
                nego_negosiasi_harga_satuan: 0,
                nego_negosiasi_jumlah_harga: 0,
              };
            })
          );
          showToast('success', 'Form Negosiasi otomatis terisi dari data HPS dan Penawaran.');
        } else {
          setNegoRows([createEmptyRow()]);
        }
      }
      setLoadingNego(false);
    }, []);

  const handleCopyFromHPS = async () => {
    if (!selectedMdkId || typeof selectedMdkId !== 'number') {
      showToast('error', 'Silakan pilih Master Dokumen terlebih dahulu.');
      return;
    }
    setLoadingNego(true);
    const [hpsRes, pnwRes] = await Promise.all([
      getHargaPerkiraanSendiriByMasterDokumenAction(selectedMdkId),
      getPenawaranByMasterDokumenAction(selectedMdkId),
    ]);
    const pnwList = pnwRes.success && pnwRes.data ? pnwRes.data : [];

    if (hpsRes.success && hpsRes.data && hpsRes.data.length > 0) {
      setNegoRows(
        hpsRes.data.map((item, idx) => {
          const pnwItem = pnwList[idx];
          return {
            nego_master_dokumen_id: selectedMdkId,
            nego_uraian_kegiatan: item.hps_uraian_pekerjaan || '',
            nego_volume: item.hps_volume || '',
            nego_waktu: item.hps_waktu || '',
            nego_hps_harga_satuan: Number(item.hps_harga_satuan) || 0,
            nego_hps_jumlah_harga: Number(item.hps_harga_perkiraan_sendiri) || 0,
            nego_pnw_harga_satuan: pnwItem ? Number(pnwItem.pnw_harga_satuan) || 0 : 0,
            nego_pnw_jumlah_harga: pnwItem ? Number(pnwItem.pnw_harga_perkiraan_sendiri) || 0 : 0,
            nego_negosiasi_harga_satuan: 0,
            nego_negosiasi_jumlah_harga: 0,
          };
        })
      );
      showToast('success', 'Berhasil menyalin data dari HPS dan Penawaran.');
    } else {
      showToast('error', 'Tidak ada data Harga Perkiraan Sendiri (HPS) untuk Master Dokumen ini.');
    }
    setLoadingNego(false);
  };

  const handleCopyFromPenawaran = async () => {
    if (!selectedMdkId || typeof selectedMdkId !== 'number') {
      showToast('error', 'Silakan pilih Master Dokumen terlebih dahulu.');
      return;
    }
    setLoadingNego(true);
    const pnwRes = await getPenawaranByMasterDokumenAction(selectedMdkId);
    if (pnwRes.success && pnwRes.data && pnwRes.data.length > 0) {
      const pnwList = pnwRes.data;
      setNegoRows((prev) =>
        prev.map((row, idx) => {
          const pnwItem = pnwList[idx];
          if (!pnwItem) return row;
          return {
            ...row,
            nego_pnw_harga_satuan: Number(pnwItem.pnw_harga_satuan) || 0,
            nego_pnw_jumlah_harga: Number(pnwItem.pnw_harga_perkiraan_sendiri) || 0,
          };
        })
      );
      showToast('success', 'Berhasil menyalin data Penawaran.');
    } else {
      showToast('error', 'Tidak ada data Penawaran untuk Master Dokumen ini.');
    }
    setLoadingNego(false);
  };

  useEffect(() => {
    if (selectedMdkId && typeof selectedMdkId === 'number') {
      const found = masterDokumenList.find((m) => m.mdk_id === selectedMdkId) || null;
      setSelectedMasterDokumen(found);
      loadNegoForMdk(selectedMdkId);
    } else {
      setSelectedMasterDokumen(null);
      setHasSavedData(false);
      setNegoRows([createEmptyRow()]);
    }
  }, [selectedMdkId, masterDokumenList, loadNegoForMdk]);

  const handleAddRow = () => setNegoRows((prev) => [...prev, createEmptyRow()]);

  const handleRemoveRow = (index: number) => {
    if (NegoRows.length === 1) {
      setNegoRows([createEmptyRow()]);
      return;
    }
    setNegoRows((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleRowChange = (index: number, field: keyof NegoItemRow, value: any) => {
    setNegoRows((prev) => {
      const updated = [...prev];
      const row = { ...updated[index], [field]: value };

      // Auto-hitung Jumlah Harga Negosiasi = Harga Satuan Negosiasi * Volume
      if (field === 'nego_negosiasi_harga_satuan' || field === 'nego_volume') {
        const parseNum = (str: string) => {
          if (!str) return 0;
          const match = String(str).match(/\d[\d.,]*/);
          if (!match) return 0;
          let s = match[0].replace(/[.,]$/, '');
          if (s.includes(',')) {
            // Format Indonesia: 1.000,50
            s = s.replace(/\./g, '').replace(',', '.');
          } else if (/^\d{1,3}(\.\d{3})+$/.test(s)) {
            // Pemisah ribuan: 1.000 / 10.000
            s = s.replace(/\./g, '');
          }
          const parsed = parseFloat(s);
          return isNaN(parsed) ? 0 : parsed;
        };
        const vol = parseNum(row.nego_volume);
        const hargaSatuan = Number(row.nego_negosiasi_harga_satuan) || 0;
        row.nego_negosiasi_jumlah_harga = Math.round(vol * hargaSatuan);
      }

      updated[index] = row;
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMdkId || typeof selectedMdkId !== 'number') {
      showToast('error', 'Silakan pilih Master Dokumen terlebih dahulu.');
      return;
    }
    const validRows = NegoRows.filter((r) => r.nego_uraian_kegiatan.trim() !== '');
    if (validRows.length === 0) {
      showToast('error', 'Minimal isi 1 Uraian Kegiatan Nego.');
      return;
    }
    setSaving(true);
    const res = await saveNegoBatchAction({
      nego_master_dokumen_id: selectedMdkId,
      items: validRows.map((r) => ({
        nego_uraian_kegiatan: r.nego_uraian_kegiatan,
        nego_volume: r.nego_volume,
        nego_waktu: r.nego_waktu,
        nego_hps_harga_satuan: Number(r.nego_hps_harga_satuan) || 0,
        nego_hps_jumlah_harga: Number(r.nego_hps_jumlah_harga) || 0,
        nego_pnw_harga_satuan: Number(r.nego_pnw_harga_satuan) || 0,
        nego_pnw_jumlah_harga: Number(r.nego_pnw_jumlah_harga) || 0,
        nego_negosiasi_harga_satuan: Number(r.nego_negosiasi_harga_satuan) || 0,
        nego_negosiasi_jumlah_harga: Number(r.nego_negosiasi_jumlah_harga) || 0,
      })),
    });
    setSaving(false);
    if (res.success) {
      showToast('success', res.message);
      setHasSavedData(true);
      loadNegoForMdk(selectedMdkId);
    } else {
      showToast('error', res.message);
    }
  };

  // Open PDF in new tab
  const handlePrintPdf = useCallback(async () => {
    if (!selectedMdkId) return;
    const validRows = NegoRows.filter((r) => r.nego_uraian_kegiatan.trim() !== '');
    if (validRows.length > 0) {
      await saveNegoBatchAction({
        nego_master_dokumen_id: selectedMdkId as number,
        items: validRows.map((r) => ({
          nego_uraian_kegiatan: r.nego_uraian_kegiatan,
          nego_volume: r.nego_volume,
          nego_waktu: r.nego_waktu,
          nego_hps_harga_satuan: Number(r.nego_hps_harga_satuan) || 0,
          nego_hps_jumlah_harga: Number(r.nego_hps_jumlah_harga) || 0,
          nego_pnw_harga_satuan: Number(r.nego_pnw_harga_satuan) || 0,
          nego_pnw_jumlah_harga: Number(r.nego_pnw_jumlah_harga) || 0,
          nego_negosiasi_harga_satuan: Number(r.nego_negosiasi_harga_satuan) || 0,
          nego_negosiasi_jumlah_harga: Number(r.nego_negosiasi_jumlah_harga) || 0,
        })),
      });
      setHasSavedData(true);
    }
    window.open(`/nego/print/${selectedMdkId}`, '_blank');
  }, [selectedMdkId, NegoRows]);

  const totalHargaNego = NegoRows.reduce(
    (acc, curr) => acc + (Number(curr.nego_negosiasi_jumlah_harga) || 0),
    0
  );
  const ppnNego = Math.round(totalHargaNego * 0.11);
  const totalKeseluruhanNego = totalHargaNego + ppnNego;
  const paguNominal = Number(selectedMasterDokumen?.mdk_pagu_anggaran) || 0;
  const isLocked = selectedMasterDokumen?.mdk_is_lock === 1;
  const isSaved = hasSavedData || NegoRows.some((r) => Boolean(r.nego_id));
  const selisihNominal = paguNominal - totalKeseluruhanNego;
  const terbilangStr = terbilang(totalKeseluruhanNego);

  // Ringkasan untuk ketiga kolom (HPS/OE, Penawaran, Negosiasi)
  const buildSummary = (key: 'nego_hps_jumlah_harga' | 'nego_pnw_jumlah_harga' | 'nego_negosiasi_jumlah_harga') => {
    const total = NegoRows.reduce((acc, curr) => acc + (Number(curr[key]) || 0), 0);
    const ppn = Math.round(total * 0.11);
    const totalPpn = total + ppn;
    return { total, ppn, totalPpn, selisih: paguNominal - totalPpn };
  };
  const summaryColumns = [
    { label: 'HPS / OE', data: buildSummary('nego_hps_jumlah_harga'), box: 'border-blue-200 dark:border-blue-800/40 bg-blue-50/40 dark:bg-blue-900/10', title: 'text-blue-600 dark:text-blue-400' },
    { label: 'Harga Penawaran', data: buildSummary('nego_pnw_jumlah_harga'), box: 'border-amber-200 dark:border-amber-800/40 bg-amber-50/40 dark:bg-amber-900/10', title: 'text-amber-600 dark:text-amber-400' },
    { label: 'Negosiasi', data: buildSummary('nego_negosiasi_jumlah_harga'), box: 'border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/40 dark:bg-emerald-900/10', title: 'text-emerald-600 dark:text-emerald-400' },
  ];

  return (
    <div className="p-1 sm:p-1 w-full space-y-6 overflow-hidden">
      {/* Toast Banner */}
      {notification && (
        <Toast
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {!hideMasterDokumenSelector && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Formulir Nego</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Kelola rincian item Nego &amp; estimasi harga berdasarkan Master Dokumen
            </p>
          </div>
          {selectedMasterDokumen && (
            <button
              onClick={handlePrintPdf}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Cetak Nego PDF
            </button>
          )}
        </div>
      )}

      {/* 2-Column Layout */}
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

        {/* ── Right: Dynamic Nego Form ── */}
        <div className="min-w-0">
          {selectedMasterDokumen ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
                {/* Section Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white">Rincian Item Nego</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Isi uraian kegiatan, volume, waktu, HPS/OE, Penawaran, dan Negosiasi
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyFromHPS}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 font-semibold text-xs hover:bg-blue-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="Salin rincian data dari Harga Perkiraan Sendiri (HPS)"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                      Salin dari HPS
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyFromPenawaran}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400 font-semibold text-xs hover:bg-amber-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="Salin rincian harga dari Penawaran"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                      Salin dari Penawaran
                    </button>
                    <button
                      type="button"
                      onClick={handleAddRow}
                      className="px-3 py-1.5 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400 font-semibold text-xs hover:bg-brand-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Tambah Baris
                    </button>
                  </div>
                </div>

                {/* Rows */}
                {loadingNego ? (
                  <div className="py-8 text-center text-xs text-gray-500 animate-pulse">Memuat data Nego...</div>
                ) : (
                  <div className="space-y-4">
                    {NegoRows.map((row, index) => (
                      <div key={index} className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 space-y-3">
                        {/* Row number & remove */}
                        <div className="flex items-center justify-between">
                          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-brand-100 dark:bg-brand-900/40 text-xs font-bold text-brand-600 dark:text-brand-400">
                            {index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveRow(index)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                            title="Hapus Baris"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>

                        {/* 2-Column Main Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

                          {/* Kolom Kiri: Uraian + Volume/Waktu */}
                          <div className="space-y-3">
                            {/* Uraian Kegiatan */}
                            <div>
                              <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">Uraian Kegiatan</label>
                              <input
                                type="text"
                                placeholder="Contoh: Sewa Kendaraan Dinas Bermotor Penumpang - Big Bus"
                                value={row.nego_uraian_kegiatan}
                                onChange={(e) => handleRowChange(index, 'nego_uraian_kegiatan', e.target.value)}
                                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all"
                              />
                            </div>

                            {/* Volume & Waktu */}
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">Volume</label>
                                <input type="text" placeholder="ex: 2.00 Unit" value={row.nego_volume}
                                  onChange={(e) => handleRowChange(index, 'nego_volume', e.target.value)}
                                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all" />
                              </div>
                              <div>
                                <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">Waktu</label>
                                <input type="text" placeholder="ex: 1.00 Hari" value={row.nego_waktu}
                                  onChange={(e) => handleRowChange(index, 'nego_waktu', e.target.value)}
                                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all" />
                              </div>
                            </div>
                          </div>

                          {/* Kolom Kanan: HPS/OE + Penawaran + Negosiasi */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">

                            {/* HPS / OE */}
                            <div className="rounded-lg border border-blue-200 dark:border-blue-800/40 bg-blue-50/40 dark:bg-blue-900/10 p-2.5">
                              <p className="text-[10px] font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-2">HPS / OE</p>
                              <div className="space-y-2">
                                <div>
                                  <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1">Harga Satuan</label>
                                  <div className="relative">
                                    <span className="absolute left-2 top-2 text-[10px] font-bold text-gray-400">Rp</span>
                                    <RupiahInput placeholder="0" value={row.nego_hps_harga_satuan || ''}
                                      onChange={(e) => handleRowChange(index, 'nego_hps_harga_satuan', e)}
                                      className="w-full pl-7 pr-2 py-2 text-xs font-mono rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all" />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1">Jumlah Harga</label>
                                  <div className="relative">
                                    <span className="absolute left-2 top-2 text-[10px] font-bold text-gray-400">Rp</span>
                                    <RupiahInput placeholder="0" value={row.nego_hps_jumlah_harga || ''}
                                      onChange={(e) => handleRowChange(index, 'nego_hps_jumlah_harga', e)}
                                      className="w-full pl-7 pr-2 py-2 text-xs font-mono rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all" />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Harga Penawaran */}
                            <div className="rounded-lg border border-amber-200 dark:border-amber-800/40 bg-amber-50/40 dark:bg-amber-900/10 p-2.5">
                              <p className="text-[10px] font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400 mb-2">Penawaran</p>
                              <div className="space-y-2">
                                <div>
                                  <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1">Harga Satuan</label>
                                  <div className="relative">
                                    <span className="absolute left-2 top-2 text-[10px] font-bold text-gray-400">Rp</span>
                                    <RupiahInput placeholder="0" value={row.nego_pnw_harga_satuan || ''}
                                      onChange={(e) => handleRowChange(index, 'nego_pnw_harga_satuan', e)}
                                      className="w-full pl-7 pr-2 py-2 text-xs font-mono rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all" />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1">Jumlah Harga</label>
                                  <div className="relative">
                                    <span className="absolute left-2 top-2 text-[10px] font-bold text-gray-400">Rp</span>
                                    <RupiahInput placeholder="0" value={row.nego_pnw_jumlah_harga || ''}
                                      onChange={(e) => handleRowChange(index, 'nego_pnw_jumlah_harga', e)}
                                      className="w-full pl-7 pr-2 py-2 text-xs font-mono rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all" />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Harga Negosiasi */}
                            <div className="rounded-lg border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/40 dark:bg-emerald-900/10 p-2.5">
                              <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-2">Negosiasi</p>
                              <div className="space-y-2">
                                <div>
                                  <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1">Harga Satuan</label>
                                  <div className="relative">
                                    <span className="absolute left-2 top-2 text-[10px] font-bold text-gray-400">Rp</span>
                                    <RupiahInput placeholder="0" value={row.nego_negosiasi_harga_satuan || ''}
                                      onChange={(e) => handleRowChange(index, 'nego_negosiasi_harga_satuan', e)}
                                      className="w-full pl-7 pr-2 py-2 text-xs font-mono rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all" />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1">Jumlah Harga</label>
                                  <div className="relative">
                                    <span className="absolute left-2 top-2 text-[10px] font-bold text-gray-400">Rp</span>
                                    <RupiahInput placeholder="0" value={row.nego_negosiasi_jumlah_harga || ''}
                                      onChange={(e) => handleRowChange(index, 'nego_negosiasi_jumlah_harga', e)}
                                      className="w-full pl-7 pr-2 py-2 text-xs font-mono rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all" />
                                  </div>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Summary & Save */}
              <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {summaryColumns.map((col) => (
                    <div key={col.label} className={`rounded-xl border p-3 space-y-2 text-xs ${col.box}`}>
                      <p className={`text-[10px] font-bold uppercase tracking-wide ${col.title}`}>{col.label}</p>
                      <div className="flex justify-between gap-2">
                        <span className="text-gray-500 dark:text-gray-400">Total:</span>
                        <strong className="font-bold text-gray-900 dark:text-white">{formatRupiah(col.data.total)}</strong>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-gray-500 dark:text-gray-400">PPN (11%):</span>
                        <strong className="font-bold text-gray-900 dark:text-white">{formatRupiah(col.data.ppn)}</strong>
                      </div>
                      <div className="flex justify-between gap-2 pt-1 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-gray-500 dark:text-gray-400">Total + PPN:</span>
                        <strong className="text-sm font-extrabold text-brand-600 dark:text-brand-400">{formatRupiah(col.data.totalPpn)}</strong>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-400">Selisih vs Pagu:</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${col.data.selisih >= 0
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                          }`}>
                          {col.data.selisih >= 0
                            ? `Sisa ${formatRupiah(col.data.selisih)}`
                            : `Surplus ${formatRupiah(Math.abs(col.data.selisih))}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-4">

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
              <span>Pilih Master Dokumen di sebelah kiri untuk mulai mengisi data Nego.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
