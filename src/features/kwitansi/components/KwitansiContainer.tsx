"use client";

import React, { useState, useEffect } from 'react';
import { MasterDokumen } from '../../master-dokumen/types';
import { getMasterDokumenOptionsAction } from '@/features/faktur/actions';
import { formatRupiah } from '@/lib/terbilang';
import { formatDateYYYYMMDD } from '@/lib/date';
import { parseKwitansiRupiahInput } from '../kwitansiDecimalUtils';
import { SearchableSelect, SearchableOption } from '@/components/form/SearchableSelect';
import { BpkadApiService, Sp2dItem } from '@/services/bpkadApiService';
import { KwitansiOfficialSheet } from './KwitansiOfficialSheet';
import { Toast } from '@/components/ui/Toast';
import {
  getKwitansiByMasterDokumenIdAction,
  saveAllKwitansiAction,
  saveKwitansiItemAction,
  deleteKwitansiAction,
} from '../actions';
import { Kwitansi } from '../types';

interface KwitansiContainerProps {
  initialMasterDokumenId?: number;
  hideMasterDokumenSelector?: boolean;
}

export interface LocalKwitansiItem {
  kwt_id?: number;
  kwt_buku_kas_umum_no: string;
  kwt_uang_sejumlah: number | string;
  kwt_sudah_terima_dari: string;
  kwt_yaitu: string;
  kwt_tanggal_lunas_dibayar: string;
  kwt_tanggal_terima_uang: string;
  kwt_no_sp2d: string;
  kwt_status_lunas: number;
}

export const KwitansiContainer: React.FC<KwitansiContainerProps> = ({
  initialMasterDokumenId,
  hideMasterDokumenSelector = false,
}) => {
  const todayYmd = formatDateYYYYMMDD(new Date());

  const [masterDokumenList, setMasterDokumenList] = useState<MasterDokumen[]>([]);
  const [selectedMdkId, setSelectedMdkId] = useState<number | ''>(initialMasterDokumenId || '');
  const [selectedMasterDokumen, setSelectedMasterDokumen] = useState<MasterDokumen | null>(null);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // SP2D API State
  const [sp2dList, setSp2dList] = useState<Sp2dItem[]>([]);
  const [loadingSp2d, setLoadingSp2d] = useState<boolean>(false);

  // Multi-Kwitansi State
  const [kwitansiList, setKwitansiList] = useState<LocalKwitansiItem[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
  };

  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const isLocked = selectedMasterDokumen?.mdk_is_lock === 1;

  const formatDateStr = (val: string | Date | null | undefined): string => {
    if (!val) return todayYmd;
    return formatDateYYYYMMDD(val) || todayYmd;
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
          const found = res.data.find((m: MasterDokumen) => m.mdk_id === targetId) || null;
          setSelectedMasterDokumen(found);
        }
      }
      setLoadingOptions(false);
    }
    initOptions();
  }, [initialMasterDokumenId]);

  const loadKwitansiData = async (mdkId: number, currentMaster?: MasterDokumen | null, clearMessage = true) => {
    setLoadingData(true);
    if (clearMessage) {
      setSaveMessage(null);
    }
    setDeletedIds([]);

    const res = await getKwitansiByMasterDokumenIdAction(mdkId);
    if (res.success && res.data) {
      const { kwitansiList: fetchedList, pak_dibayar, nego_jumlah } = res.data;

      if (fetchedList && fetchedList.length > 0) {
        const formatted: LocalKwitansiItem[] = fetchedList.map((item) => ({
          kwt_id: item.kwt_id,
          kwt_buku_kas_umum_no: item.kwt_buku_kas_umum_no || '',
          kwt_uang_sejumlah: item.kwt_uang_sejumlah !== null ? Number(item.kwt_uang_sejumlah) : '',
          kwt_sudah_terima_dari: item.kwt_sudah_terima_dari || '',
          kwt_yaitu: item.kwt_yaitu || '',
          kwt_tanggal_lunas_dibayar: formatDateStr(item.kwt_tanggal_lunas_dibayar),
          kwt_tanggal_terima_uang: formatDateStr(item.kwt_tanggal_terima_uang),
          kwt_no_sp2d: item.kwt_no_sp2d || '',
          kwt_status_lunas: Number(item.kwt_status_lunas) || 0,
        }));
        setKwitansiList(formatted);
      } else {
        // Create 1 default kwitansi if none exists
        let defaultNominal: number | string = '';
        if (nego_jumlah && nego_jumlah > 0) {
          defaultNominal = Number(nego_jumlah);
        } else if (pak_dibayar && pak_dibayar > 0) {
          defaultNominal = Number(pak_dibayar);
        } else if (currentMaster?.mdk_pagu_anggaran) {
          defaultNominal = Number(currentMaster.mdk_pagu_anggaran);
        }

        setKwitansiList([
          {
            kwt_buku_kas_umum_no: '',
            kwt_uang_sejumlah: defaultNominal,
            kwt_sudah_terima_dari: '',
            kwt_yaitu: '',
            kwt_tanggal_lunas_dibayar: todayYmd,
            kwt_tanggal_terima_uang: todayYmd,
            kwt_no_sp2d: '',
            kwt_status_lunas: 0,
          },
        ]);
      }
    }
    setActiveTab(0);
    setLoadingData(false);
  };

  useEffect(() => {
    if (selectedMdkId && typeof selectedMdkId === 'number') {
      const found = masterDokumenList.find((m: MasterDokumen) => m.mdk_id === selectedMdkId) || null;
      setSelectedMasterDokumen(found);
      loadKwitansiData(selectedMdkId, found);
    }
  }, [selectedMdkId]);

  useEffect(() => {
    async function loadSp2dOptions() {
      const kodeSub = selectedMasterDokumen?.mdk_kode_sub_kegiatan;
      if (kodeSub && kodeSub.trim()) {
        setLoadingSp2d(true);
        try {
          const list = await BpkadApiService.getSp2d(kodeSub);
          setSp2dList(list);
        } catch (err) {
          console.error('[KwitansiContainer] Error fetching SP2D list:', err);
          setSp2dList([]);
        } finally {
          setLoadingSp2d(false);
        }
      } else {
        setSp2dList([]);
      }
    }
    loadSp2dOptions();
  }, [selectedMasterDokumen?.mdk_kode_sub_kegiatan]);

  const handleAddKwitansi = () => {
    const paguNominal = Number(selectedMasterDokumen?.mdk_pagu_anggaran) || 0;
    const currentTotal = kwitansiList.reduce((acc, curr) => acc + (Number(curr.kwt_uang_sejumlah) || 0), 0);
    const sisa = Math.max(0, paguNominal - currentTotal);

    const newItem: LocalKwitansiItem = {
      kwt_buku_kas_umum_no: '',
      kwt_uang_sejumlah: sisa > 0 ? sisa : '',
      kwt_sudah_terima_dari: '',
      kwt_yaitu: '',
      kwt_tanggal_lunas_dibayar: todayYmd,
      kwt_tanggal_terima_uang: todayYmd,
      kwt_no_sp2d: '',
      kwt_status_lunas: 0,
    };

    setKwitansiList((prev) => [...prev, newItem]);
    setActiveTab(kwitansiList.length);
  };

  const handleDeleteKwitansi = (indexToDelete: number) => {
    const itemToDelete = kwitansiList[indexToDelete];
    if (itemToDelete?.kwt_id) {
      setDeletedIds((prev) => [...prev, itemToDelete.kwt_id!]);
    }

    const updated = kwitansiList.filter((_, idx) => idx !== indexToDelete);
    if (updated.length === 0) {
      // Keep at least one empty kwitansi
      updated.push({
        kwt_buku_kas_umum_no: '',
        kwt_uang_sejumlah: '',
        kwt_sudah_terima_dari: '',
        kwt_yaitu: '',
        kwt_tanggal_lunas_dibayar: todayYmd,
        kwt_tanggal_terima_uang: todayYmd,
        kwt_no_sp2d: '',
        kwt_status_lunas: 0,
      });
    }

    setKwitansiList(updated);
    if (activeTab >= updated.length) {
      setActiveTab(Math.max(0, updated.length - 1));
    }
  };

  const paguNominal = Number(selectedMasterDokumen?.mdk_pagu_anggaran) || 0;
  const totalNominalKwitansi = kwitansiList.reduce(
    (acc, curr) => acc + (parseKwitansiRupiahInput(curr.kwt_uang_sejumlah) || 0),
    0
  );
  const sisaPagu = paguNominal - totalNominalKwitansi;
  const isExceedingPagu = totalNominalKwitansi > paguNominal || sisaPagu < 0;

  const otherKwitansiSum = kwitansiList.reduce(
    (acc, curr, idx) => (idx === activeTab ? acc : acc + (parseKwitansiRupiahInput(curr.kwt_uang_sejumlah) || 0)),
    0
  );
  const maxAllowedForActive = Math.max(0, paguNominal - otherKwitansiSum);

  const updateActiveKwitansi = (field: keyof LocalKwitansiItem, value: any) => {
    setKwitansiList((prev) => {
      const copy = [...prev];
      if (copy[activeTab]) {
        let finalVal = value;
        if (field === 'kwt_uang_sejumlah' && value !== '') {
          const num = parseKwitansiRupiahInput(value);
          if (!isNaN(num) && num > maxAllowedForActive) {
            finalVal = maxAllowedForActive;
          }
        }
        copy[activeTab] = { ...copy[activeTab], [field]: finalVal };
      }
      return copy;
    });
  };

  const handleSave = async () => {
    if (!selectedMdkId) return;
    setSaving(true);

    if (totalNominalKwitansi > paguNominal) {
      showToast('error', `Total nominal kwitansi (${formatRupiah(totalNominalKwitansi)}) melebihi Pagu Anggaran (${formatRupiah(paguNominal)}). Silakan sesuaikan nominal kwitansi.`)
      setSaving(false);
      return;
    }

    try {
      // 1. Process deletions
      for (const delId of deletedIds) {
        await deleteKwitansiAction(delId);
      }

      // 2. Process upserts
      const res = await saveAllKwitansiAction(Number(selectedMdkId), kwitansiList);
      if (res.success) {
        await loadKwitansiData(Number(selectedMdkId), selectedMasterDokumen, false);
        showToast('success', 'Seluruh Data Kwitansi berhasil disimpan!');
      } else {
        showToast('error', res.message || 'Gagal menyimpan data Kwitansi.');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Terjadi kesalahan saat menyimpan.');
    } finally {
      setSaving(false);
    }
  };

  const handlePrintCurrent = async () => {
    if (!selectedMdkId) return;
    await handleSave();
    const activeItem = kwitansiList[activeTab];
    if (activeItem?.kwt_id) {
      window.open(`/kwitansi/print/${selectedMdkId}?kwt_id=${activeItem.kwt_id}`, '_blank');
    } else {
      window.open(`/kwitansi/print/${selectedMdkId}?kwt_index=${activeTab}`, '_blank');
    }
  };

  const handlePrintAll = async () => {
    if (!selectedMdkId) return;
    await handleSave();
    window.open(`/kwitansi/print/${selectedMdkId}?all=true`, '_blank');
  };

  const activeItem = kwitansiList[activeTab] || {
    kwt_buku_kas_umum_no: '',
    kwt_uang_sejumlah: '',
    kwt_sudah_terima_dari: '',
    kwt_yaitu: '',
    kwt_tanggal_lunas_dibayar: todayYmd,
    kwt_tanggal_terima_uang: todayYmd,
    kwt_no_sp2d: '',
    kwt_status_lunas: 0,
  };


  const handleToggleStatusLunasDirectly = async () => {
    const currentStatus = Number(activeItem.kwt_status_lunas) === 1 ? 1 : 0;
    const newStatus = currentStatus === 1 ? 0 : 1;

    // 1. Update local state instan agar UI responsif
    updateActiveKwitansi('kwt_status_lunas', newStatus);

    // 2. Jika kwitansi sudah tersimpan di DB (punya kwt_id), langsung simpan status di DB tanpa perlu tekan simpan semua
    if (activeItem?.kwt_id && activeItem.kwt_id > 0 && selectedMdkId) {
      try {
        const res = await saveKwitansiItemAction(
          Number(selectedMdkId),
          activeItem.kwt_id,
          activeItem.kwt_buku_kas_umum_no || '',
          activeItem.kwt_uang_sejumlah || 0,
          activeItem.kwt_sudah_terima_dari || '',
          activeItem.kwt_yaitu || '',
          activeItem.kwt_tanggal_lunas_dibayar,
          activeItem.kwt_tanggal_terima_uang,
          activeItem.kwt_no_sp2d || '',
          newStatus
        );

        if (res.success) {
          showToast('success', `Status Kwitansi #${activeTab + 1} berhasil diubah menjadi ${newStatus === 1 ? 'SUDAH LUNAS' : 'BELUM LUNAS'}!`)
        } else {
          showToast('error', res.message || 'Gagal memperbarui status.');
        }
      } catch (err: any) {
        console.error('Error auto-saving status lunas:', err);
      }
    }
  };

  const selectedSp2dDetail = sp2dList.find(
    (s) => s.NOMOR_SP2D === activeItem.kwt_no_sp2d
  );

  const sp2dOptions: SearchableOption[] = sp2dList.map((item) => {
    const nilaiFormatted = item.NILAI ? ` (Rp ${formatRupiah(Number(item.NILAI))})` : '';
    const tglInfo = item.TANGGAL_SP2D ? ` [Tgl: ${item.TANGGAL_SP2D}]` : '';
    return {
      value: item.NOMOR_SP2D,
      label: item.NOMOR_SP2D,
      sublabel: `${item.KETERANGAN || ''}${nilaiFormatted}${tglInfo}`.trim(),
    };
  });

  if (
    activeItem.kwt_no_sp2d &&
    !sp2dList.some((s) => s.NOMOR_SP2D === activeItem.kwt_no_sp2d)
  ) {
    sp2dOptions.unshift({
      value: activeItem.kwt_no_sp2d,
      label: activeItem.kwt_no_sp2d,
      sublabel: '(Nomor SP2D tersimpan / Kustom)',
    });
  }

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
      {!hideMasterDokumenSelector && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dokumen Kwitansi</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Kelola, pratinjau &amp; cetak satu atau beberapa bukti Kwitansi berdasarkan Master Dokumen
            </p>
          </div>
        </div>
      )}

      <div
        className="grid gap-6 items-start"
        style={{
          gridTemplateColumns: hideMasterDokumenSelector ? '1fr' : 'minmax(0, 360px) minmax(0, 1fr)',
        }}
      >
        {/* Left Side (Master Dokumen Selector & Budget Summary) */}
        {!hideMasterDokumenSelector && (
          <div className="min-w-0 space-y-5">
            <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Pilih Master Dokumen</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Pilih dokumen acuan untuk Kwitansi</p>
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
                  onChange={(val) => setSelectedMdkId(Number(val))}
                  placeholder="-- Pilih Master Dokumen --"
                  searchPlaceholder="Cari berdasarkan uraian belanja, bidang, atau No. DPA..."
                  disabled={masterDokumenList.length === 0}
                />
              )}

              {selectedMasterDokumen && (
                <div className="p-4 rounded-xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200/60 dark:border-brand-800/40 text-xs space-y-3 mt-4">
                  <div className="font-bold text-gray-900 dark:text-white text-sm pb-1 border-b border-brand-200/50">
                    Detail Ringkas Dokumen
                  </div>
                  <div>
                    <span className="text-gray-500 block">Bagian:</span>
                    <strong>{selectedMasterDokumen.mdk_bagian || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">No. DPA:</span>
                    <strong className="font-mono">{selectedMasterDokumen.mdk_no_dpa || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Pagu Anggaran:</span>
                    <strong className="text-brand-600 font-bold">{formatRupiah(paguNominal)}</strong>
                  </div>
                </div>
              )}

              {/* Multi-Kwitansi Budget Balance Summary */}
              {selectedMasterDokumen && (
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/60 text-xs space-y-2.5">
                  <div className="font-bold text-gray-800 dark:text-gray-200 text-xs flex justify-between items-center">
                    <span>Ringkasan Kwitansi ({kwitansiList.length})</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${sisaPagu === 0
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : sisaPagu > 0
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                    >
                      {sisaPagu === 0 ? 'Sesuai Pagu' : sisaPagu > 0 ? 'Sisa Pagu Tersedia' : 'Melebihi Pagu'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                    <span>Total Nominal Kwitansi:</span>
                    <strong className="text-gray-900 dark:text-white font-semibold">
                      {formatRupiah(totalNominalKwitansi)}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-gray-600 dark:text-gray-400 pt-1 border-t border-gray-200 dark:border-gray-700">
                    <span>Sisa Pagu:</span>
                    <strong
                      className={`font-bold ${sisaPagu < 0
                        ? 'text-rose-600 dark:text-rose-400'
                        : sisaPagu === 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-brand-600 dark:text-brand-400'
                        }`}
                    >
                      {formatRupiah(sisaPagu)}
                    </strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right Side (Kwitansi Tabs, Form & Sheet) */}
        <div className="min-w-0">
          {selectedMasterDokumen ? (
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
              {/* Header & Global Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">Kelola Kuitansi Pembayaran</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Satu Master Dokumen dapat memuat beberapa lembar Kuitansi secara bertahap / terpisah
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 print:hidden">
                  <button
                    onClick={handleSave}
                    disabled={saving || isExceedingPagu || isLocked}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 dark:disabled:bg-gray-700"
                    title={isExceedingPagu ? 'Total nominal kwitansi melebihi Pagu Anggaran' : 'Simpan Seluruh Kwitansi'}
                  >
                    {saving ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 002-2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                    )}
                    {saving ? 'Menyimpan...' : 'Simpan Semua'}
                  </button>

                  <button
                    onClick={handlePrintCurrent}
                    disabled={isExceedingPagu}
                    className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    title={isExceedingPagu ? 'Tidak bisa mencetak saat melebihi Pagu Anggaran' : 'Cetak kwitansi lembar aktif'}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Cetak Ini
                  </button>

                  {kwitansiList.length > 1 && (
                    <button
                      onClick={handlePrintAll}
                      disabled={isExceedingPagu}
                      className="px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      title={isExceedingPagu ? 'Tidak bisa mencetak saat melebihi Pagu Anggaran' : 'Cetak seluruh lembar kwitansi sekaligus'}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Cetak Semua ({kwitansiList.length})
                    </button>
                  )}
                </div>
              </div>

              {/* Warning Banner when exceeding budget */}
              {isExceedingPagu && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2 print:hidden">
                  <svg className="w-5 h-5 shrink-0 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>
                    Total nominal kwitansi ({formatRupiah(totalNominalKwitansi)}) melebihi Pagu Anggaran ({formatRupiah(paguNominal)}). Tombol Simpan telah dinonaktifkan. Silakan sesuaikan nominal kwitansi.
                  </span>
                </div>
              )}

              {/* Notification Banner */}
              {saveMessage && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-semibold print:hidden flex items-center gap-2.5 shadow-xs ${saveMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200 border border-rose-300 dark:border-rose-800'
                    }`}
                >
                  {saveMessage.type === 'success' ? (
                    <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <span>{saveMessage.text}</span>
                </div>
              )}

              {/* Multi-Kwitansi Tab Navigation */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200/80 dark:border-gray-700/80 print:hidden">
                <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
                  {kwitansiList.map((item, idx) => {
                    const isSelected = idx === activeTab;
                    const nominal = Number(item.kwt_uang_sejumlah) || 0;
                    const isLunas = Number(item.kwt_status_lunas) === 1;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveTab(idx)}
                        className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${isSelected
                          ? 'bg-white dark:bg-gray-900 text-brand-600 dark:text-brand-400 shadow-sm border border-gray-200 dark:border-gray-700'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                      >
                        <span className="flex items-center gap-1.5">
                          {isLunas ? (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Sudah Lunas" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-amber-400" title="Belum Lunas" />
                          )}
                          <span>Kwitansi #{idx + 1}</span>
                        </span>
                        {nominal > 0 && (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${isSelected
                              ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                              : 'bg-gray-200/70 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                              }`}
                          >
                            {formatRupiah(nominal)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddKwitansi}
                    className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Kuitansi
                  </button>

                  {kwitansiList.length > 1 && (
                    <button
                      onClick={() => handleDeleteKwitansi(activeTab)}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 dark:text-rose-400 text-xs font-medium transition-all flex items-center gap-1 cursor-pointer"
                      title="Hapus Kwitansi Lembar Ini"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Hapus
                    </button>
                  )}
                </div>
              </div>



              {/* 2-Column Grid Layout: Status & Control Panel on Left, Kwitansi Preview on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Panel Kontrol & Status Pelunasan */}
                <div className="lg:col-span-5 xl:col-span-4 print:hidden space-y-4 lg:sticky lg:top-6 order-2 lg:order-1 min-w-0">
                  <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-slate-50 dark:from-gray-800/90 dark:via-indigo-950/40 dark:to-gray-800 border border-indigo-100 dark:border-indigo-900/40 shadow-sm space-y-4 overflow-hidden">
                    {/* Header Info & Badge */}
                    <div className="flex flex-col gap-2.5 pb-3 border-b border-indigo-100/80 dark:border-indigo-900/40">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-xs shrink-0">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                            Status &amp; SP2D Kwitansi #{activeTab + 1}
                          </h3>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-2xs shrink-0 ${Number(activeItem.kwt_status_lunas) === 1
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800'
                            }`}
                        >
                          {Number(activeItem.kwt_status_lunas) === 1 ? (
                            <>
                              <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                              </svg>
                              <span>SUDAH LUNAS</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>BELUM LUNAS</span>
                            </>
                          )}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                        Atur nomor SP2D dan ubah status pelunasan Kwitansi ini.
                      </p>
                    </div>

                    {/* Field Nomor SP2D (Pilih dari API BPKAD) */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                          Nomor SP2D (API BPKAD)
                        </label>
                        {loadingSp2d && (
                          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 animate-pulse font-medium">
                            Memuat data API...
                          </span>
                        )}
                      </div>

                      <SearchableSelect
                        options={sp2dOptions}
                        value={activeItem.kwt_no_sp2d || ''}
                        onChange={(val) => {
                          const chosenSp2d = sp2dList.find((s) => s.NOMOR_SP2D === val);
                          if (chosenSp2d && chosenSp2d.NILAI) {
                            const sp2dVal = parseKwitansiRupiahInput(chosenSp2d.NILAI);
                            if (!isNaN(sp2dVal) && sp2dVal > 0) {
                              setKwitansiList((prev) => {
                                const copy = [...prev];
                                if (copy[activeTab]) {
                                  copy[activeTab] = {
                                    ...copy[activeTab],
                                    kwt_no_sp2d: val,
                                    kwt_uang_sejumlah: sp2dVal.toString(),
                                  };
                                }
                                return copy;
                              });
                              return;
                            }
                          }
                          updateActiveKwitansi('kwt_no_sp2d', val);
                        }}
                        placeholder={
                          loadingSp2d
                            ? 'Memuat daftar SP2D...'
                            : sp2dList.length > 0
                              ? 'Pilih Nomor SP2D dari API...'
                              : 'Pilih atau cari Nomor SP2D...'
                        }
                        searchPlaceholder="Cari Nomor SP2D atau Keterangan..."
                        disabled={loadingSp2d}
                      />
                    </div>

                    {/* Informasi Detail SP2D dari API (Hanya No. SP2D disimpan ke DB) */}
                    {selectedSp2dDetail ? (
                      <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 shadow-2xs space-y-2 text-xs">
                        <div className="flex items-center justify-between border-b border-indigo-200/80 dark:border-indigo-800 pb-1.5">
                          <span className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5 text-[11px]">
                            <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Detail Informasi SP2D
                          </span>
                          <button
                            type="button"
                            onClick={() => updateActiveKwitansi('kwt_no_sp2d', '')}
                            className="text-[10px] text-rose-600 hover:text-rose-700 font-semibold underline cursor-pointer"
                          >
                            Reset SP2D
                          </button>
                        </div>

                        <div className="space-y-1.5 text-[11px]">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400 block text-[10px]">Keterangan:</span>
                            <p className="font-medium text-gray-800 dark:text-gray-200 leading-snug text-justify">
                              {selectedSp2dDetail.KETERANGAN || '-'}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-indigo-100 dark:border-indigo-900/40">
                            <div>
                              <span className="text-gray-500 dark:text-gray-400 block text-[10px]">Tanggal SP2D:</span>
                              <span className="font-semibold text-gray-800 dark:text-gray-200">
                                {selectedSp2dDetail.TANGGAL_SP2D || '-'}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400 block text-[10px]">Tanggal Transfer:</span>
                              <span className="font-semibold text-gray-800 dark:text-gray-200">
                                {selectedSp2dDetail.TANGGAL_TRANSFER || '-'}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-indigo-100 dark:border-indigo-900/40">
                            <div>
                              <span className="text-gray-500 dark:text-gray-400 block text-[10px]">Nilai SP2D:</span>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                {selectedSp2dDetail.NILAI ? formatRupiah(Number(selectedSp2dDetail.NILAI)) : '-'}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400 block text-[10px]">Potongan (PPN / PPH):</span>
                              <span className="font-medium text-gray-700 dark:text-gray-300">
                                {selectedSp2dDetail.PPN ? `PPN: ${formatRupiah(parseKwitansiRupiahInput(selectedSp2dDetail.PPN))}` : 'PPN: -'}{' '}<br />
                                {selectedSp2dDetail.PPH ? `PPH: ${formatRupiah(parseKwitansiRupiahInput(selectedSp2dDetail.PPH))}` : 'PPH: -'}
                              </span>
                            </div>
                          </div>

                          <div className="pt-1.5 border-t border-indigo-100 dark:border-indigo-900/40">
                            <div>
                              <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1 text-[10px]">
                                <svg className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-4 0h4" />
                                </svg>
                                Penerima (Perusahaan / Instansi):

                                <span className="font-semibold text-gray-800 dark:text-gray-200 block mt-0.5 break-words">
                                  {selectedSp2dDetail.PENERIMA ? selectedSp2dDetail.PENERIMA : '-'}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : activeItem.kwt_no_sp2d ? (
                      <div className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[11px] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">Nomor SP2D Tersimpan:</span>
                          <button
                            type="button"
                            onClick={() => updateActiveKwitansi('kwt_no_sp2d', '')}
                            className="text-[10px] text-rose-600 hover:text-rose-700 font-semibold underline cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                        <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400 break-all">
                          {activeItem.kwt_no_sp2d}
                        </div>
                      </div>
                    ) : null}

                    {/* Tombol Aksi Status Lunas */}
                    <div className="space-y-1.5 pt-1">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Ubah Status Pelunasan
                      </label>
                      <button
                        type="button"
                        onClick={handleToggleStatusLunasDirectly}
                        className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs ${Number(activeItem.kwt_status_lunas) === 1
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                          }`}
                      >
                        {Number(activeItem.kwt_status_lunas) === 1 ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                            </svg>
                            <span>Tandai Sebagai BELUM LUNAS</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Tandai Sebagai SUDAH LUNAS</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Ringkasan Details Memanjang Ke Bawah */}
                    <div className="pt-3 border-t border-indigo-100/80 dark:border-indigo-900/40 space-y-2.5 text-[11px] text-gray-600 dark:text-gray-400">
                      <div className="flex items-start justify-between gap-2 pb-1 border-b border-dashed border-gray-200 dark:border-gray-700">
                        <span className="text-gray-500 shrink-0">No. Buku Kas Umum:</span>
                        <strong className="text-gray-800 dark:text-gray-200 font-mono text-right min-w-0 break-all">
                          {activeItem.kwt_buku_kas_umum_no || '(Belum diisi)'}
                        </strong>
                      </div>
                      <div className="flex items-start justify-between gap-2 pb-1 border-b border-dashed border-gray-200 dark:border-gray-700">
                        <span className="text-gray-500 shrink-0">Nominal Uang:</span>
                        <strong className="text-emerald-600 dark:text-emerald-400 font-semibold text-right min-w-0 break-all">
                          {activeItem.kwt_uang_sejumlah ? formatRupiah(parseKwitansiRupiahInput(activeItem.kwt_uang_sejumlah)) : '(Belum diisi)'}
                        </strong>
                      </div>
                      <div className="flex items-start justify-between gap-2 pb-1 border-b border-dashed border-gray-200 dark:border-gray-700">
                        <span className="text-gray-500 shrink-0">No. SP2D:</span>
                        <strong className="text-indigo-600 dark:text-indigo-400 font-mono text-right min-w-0 break-all">
                          {activeItem.kwt_no_sp2d || '(Belum diisi)'}
                        </strong>
                      </div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-gray-500 shrink-0">Status Pelunasan:</span>
                        <strong className={`text-right min-w-0 break-all ${Number(activeItem.kwt_status_lunas) === 1 ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}`}>
                          {Number(activeItem.kwt_status_lunas) === 1 ? 'LUNAS' : 'BELUM LUNAS'}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Kwitansi Official Sheet Preview */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-4 order-1 lg:order-2">
                  {loadingData ? (
                    <div className="h-64 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl flex items-center justify-center text-xs text-gray-400">
                      Memuat data Kwitansi...
                    </div>
                  ) : (
                    <KwitansiOfficialSheet
                      masterDokumen={selectedMasterDokumen}
                      noBukuKas={activeItem.kwt_buku_kas_umum_no}
                      onNoBukuKasChange={(val) => updateActiveKwitansi('kwt_buku_kas_umum_no', val)}
                      uangSejumlah={activeItem.kwt_uang_sejumlah}
                      onUangSejumlahChange={(val) => updateActiveKwitansi('kwt_uang_sejumlah', val)}
                      maxUangSejumlah={maxAllowedForActive}
                      sudahTerimaDari={activeItem.kwt_sudah_terima_dari}
                      onSudahTerimaDariChange={(val) => updateActiveKwitansi('kwt_sudah_terima_dari', val)}
                      yaituKet={activeItem.kwt_yaitu}
                      onYaituKetChange={(val) => updateActiveKwitansi('kwt_yaitu', val)}
                      tanggalLunasDibayar={activeItem.kwt_tanggal_lunas_dibayar}
                      onTanggalLunasDibayarChange={(val) => updateActiveKwitansi('kwt_tanggal_lunas_dibayar', val)}
                      tanggalTerimaUang={activeItem.kwt_tanggal_terima_uang}
                      onTanggalTerimaUangChange={(val) => updateActiveKwitansi('kwt_tanggal_terima_uang', val)}
                      isEditable={true}
                    />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center text-gray-400 text-xs">
              Belum ada Master Dokumen yang dipilih.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

