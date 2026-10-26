"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MasterDokumen } from '../../master-dokumen/types';
import {
  getMasterDokumenOptionsAction,
  getNotaPencairanDanaByMasterDokumenAction,
  saveNotaPencairanDanaBatchAction,
  deleteNotaPencairanDanaAction,
} from '../actions';
import { getKwitansiByMasterDokumenIdAction } from '@/features/kwitansi/actions';
import { formatRupiah, terbilang } from '@/lib/terbilang';
import { SearchableSelect } from '@/components/form/SearchableSelect';
import { MasterDokumenSelectorCard } from '@/features/master-dokumen/components/MasterDokumenSelectorCard';
import { RupiahInput } from '@/components/form/RupiahInput';
import { Toast } from '@/components/ui/Toast';

interface NotaPencairanDanaItemRow {
  dpd_id?: number;
  dpd_master_dokumen_id?: number;
  dpd_uraian: string;
  dpd_dpa_volume: string;
  dpd_dpa_satuan: string;
  dpd_dpa_nilai: number;
  dpd_belum_volume: string;
  dpd_belum_nilai: number;
  dpd_saatini_volume: string;
  dpd_saatini_nilai: number;
  dpd_saatini_ppn: number;
  dpd_saatini_pph23: number;
  dpd_saatini_total_pajak: number;
  dpd_saatini_pembayaran: number;
  dpd_sisa_volume: string;
  dpd_sisa_nilai: number;
}

const createEmptyRow = (defaultUraian = '', dpaNilai = 0, belumNilai = 0, saatIniNilai = 0, defaultDpaVolume = '', defaultDpaSatuan = '', defaultSaatiniVolume = '', defaultSebelumnyaVolume = ''): NotaPencairanDanaItemRow => {
  const ppn = Math.round((Number(saatIniNilai) * 0.0990990990990991) || 0);
  const pph23 = Math.round((Number(saatIniNilai) - ppn) * (1.5 / 100));

  const totalPajak = ppn + pph23;
  const pembayaran = saatIniNilai - totalPajak;
  const sisaNilai = dpaNilai - belumNilai - saatIniNilai;

  return {
    dpd_uraian: defaultUraian,
    dpd_dpa_volume: defaultDpaVolume,
    dpd_dpa_satuan: defaultDpaSatuan,
    dpd_dpa_nilai: dpaNilai,
    dpd_belum_volume: defaultSebelumnyaVolume,
    dpd_belum_nilai: belumNilai,
    dpd_saatini_volume: defaultSaatiniVolume,
    dpd_saatini_nilai: saatIniNilai,
    dpd_saatini_ppn: ppn,
    dpd_saatini_pph23: pph23,
    dpd_saatini_total_pajak: totalPajak,
    dpd_saatini_pembayaran: pembayaran,
    dpd_sisa_volume: '',
    dpd_sisa_nilai: sisaNilai,
  };
};

interface NotaPencairanDanaContainerProps {
  initialMasterDokumenId?: number;
  hideMasterDokumenSelector?: boolean;
}

export const NotaPencairanDanaContainer: React.FC<NotaPencairanDanaContainerProps> = ({
  initialMasterDokumenId,
  hideMasterDokumenSelector = false,
}) => {
  const [masterDokumenList, setMasterDokumenList] = useState<MasterDokumen[]>([]);
  const [selectedMdkId, setSelectedMdkId] = useState<number | ''>(initialMasterDokumenId || '');
  const [selectedMasterDokumen, setSelectedMasterDokumen] = useState<MasterDokumen | null>(null);
  const [NotaPencairanDanaRows, setNotaPencairanDanaRows] = useState<NotaPencairanDanaItemRow[]>([createEmptyRow()]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadingNotaPencairanDana, setLoadingNotaPencairanDana] = useState(false);
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

  const loadNotaPencairanDanaForMdk = useCallback(async (mdkId: number, defaultUraianText = '', defaultDpaVolume = '', defaultDpaSatuan = '', defaultSaatiniVolume = '', defaultSebelumnyaVolume = '', currentMaster?: MasterDokumen | null) => {
    setLoadingNotaPencairanDana(true);
    const [res, kwtRes] = await Promise.all([
      getNotaPencairanDanaByMasterDokumenAction(mdkId),
      getKwitansiByMasterDokumenIdAction(mdkId),
    ]);

    const paguNilai = currentMaster?.mdk_pagu_anggaran ? Math.round(Number(currentMaster.mdk_pagu_anggaran)) : 0;

    let calcBelumNilai = 0;
    let calcSaatIniNilai = 0;

    if (kwtRes.success && kwtRes.data?.kwitansiList) {
      const kwtList = kwtRes.data.kwitansiList;
      const lunasKwitansi = kwtList.filter((k) => Number(k.kwt_status_lunas) === 1);

      if (lunasKwitansi.length > 0) {
        // Kwitansi lunas terakhir -> dpd_saatini_nilai
        const lastLunas = lunasKwitansi[lunasKwitansi.length - 1];
        calcSaatIniNilai = Math.round(Number(lastLunas.kwt_uang_sejumlah) || 0);

        // Kwitansi lunas sebelum kwitansi terakhir -> dpd_belum_nilai
        const previousLunas = lunasKwitansi.slice(0, lunasKwitansi.length - 1);
        calcBelumNilai = previousLunas.reduce(
          (sum, k) => sum + Math.round(Number(k.kwt_uang_sejumlah) || 0),
          0
        );
      } else if (kwtList.length > 0) {
        const lastKwt = kwtList[kwtList.length - 1];
        calcSaatIniNilai = Math.round(Number(lastKwt.kwt_uang_sejumlah) || 0);
      }
    }

    if (res.success && res.data && res.data.length > 0) {
      setNotaPencairanDanaRows(
        res.data.map((item) => {
          const dpaNilai = (item.dpd_dpa_nilai && Number(item.dpd_dpa_nilai) > 0) ? Number(item.dpd_dpa_nilai) : paguNilai;
          const belumNilai = (item.dpd_belum_nilai && Number(item.dpd_belum_nilai) > 0) ? Number(item.dpd_belum_nilai) : calcBelumNilai;
          const saatIniNilai = (item.dpd_saatini_nilai && Number(item.dpd_saatini_nilai) > 0) ? Number(item.dpd_saatini_nilai) : calcSaatIniNilai;

          const ppn = Math.round((Number(item.dpd_saatini_ppn) * 0.0990990990990991) || 0);
          const pph23 = Math.round((item.dpd_saatini_nilai - ppn) * (1.5 / 100));
          const totalPajak = ppn + pph23;
          const pembayaran = saatIniNilai - totalPajak;
          const sisaNilai = dpaNilai - belumNilai - saatIniNilai;

          return {
            dpd_id: item.dpd_id,
            dpd_master_dokumen_id: item.dpd_master_dokumen_id,
            dpd_uraian: (item.dpd_uraian && item.dpd_uraian.trim() !== '') ? item.dpd_uraian : defaultUraianText,
            dpd_dpa_volume: (item.dpd_dpa_volume && item.dpd_dpa_volume.trim() !== '') ? item.dpd_dpa_volume : defaultDpaVolume,
            dpd_dpa_satuan: (item.dpd_dpa_satuan && item.dpd_dpa_satuan.trim() !== '') ? item.dpd_dpa_satuan : defaultDpaSatuan,
            dpd_dpa_nilai: dpaNilai,
            dpd_belum_volume: item.dpd_belum_volume || defaultSebelumnyaVolume,
            dpd_belum_nilai: belumNilai,
            dpd_saatini_volume: item.dpd_saatini_volume || defaultSaatiniVolume,
            dpd_saatini_nilai: saatIniNilai,
            dpd_saatini_ppn: ppn,
            dpd_saatini_pph23: pph23,
            dpd_saatini_total_pajak: totalPajak,
            dpd_saatini_pembayaran: pembayaran,
            dpd_sisa_volume: item.dpd_sisa_volume || '',
            dpd_sisa_nilai: sisaNilai,
          };
        })
      );
    } else {
      setNotaPencairanDanaRows([createEmptyRow(defaultUraianText, paguNilai, calcBelumNilai, calcSaatIniNilai, defaultDpaVolume, defaultDpaSatuan, defaultSaatiniVolume, defaultSebelumnyaVolume)]);
    }
    setLoadingNotaPencairanDana(false);
  }, []);

  useEffect(() => {
    if (selectedMdkId && typeof selectedMdkId === 'number') {
      const found = masterDokumenList.find((m) => m.mdk_id === selectedMdkId) || null;
      setSelectedMasterDokumen(found);
      const defaultUraianText = found?.mdk_pekerjaan || found?.mdk_uraian_belanja || '';
      const defaultDpaVolume = found?.mdk_volume || '';
      const defaultDpaSatuan = found?.mdk_satuan || '';
      const defaultSaatiniVolume = found?.mdk_volume || '';
      const defaultSebelumnyaVolume = found?.mdk_volume || '';
      loadNotaPencairanDanaForMdk(selectedMdkId, defaultUraianText, defaultDpaVolume, defaultDpaSatuan, defaultSaatiniVolume, defaultSebelumnyaVolume, found);
    } else {
      setSelectedMasterDokumen(null);
      setNotaPencairanDanaRows([createEmptyRow()]);
    }
  }, [selectedMdkId, masterDokumenList, loadNotaPencairanDanaForMdk]);

  const handleAddRow = () => {
    const defaultUraianText = selectedMasterDokumen?.mdk_pekerjaan || selectedMasterDokumen?.mdk_uraian_belanja || '';
    const paguNilai = selectedMasterDokumen?.mdk_pagu_anggaran ? Math.round(Number(selectedMasterDokumen.mdk_pagu_anggaran)) : 0;
    const defaultDpaVolume = selectedMasterDokumen?.mdk_volume || '';
    const defaultDpaSatuan = selectedMasterDokumen?.mdk_satuan || '';
    const defaultSaatiniVolume = selectedMasterDokumen?.mdk_volume || '';
    const defaultSebelumnyaVolume = selectedMasterDokumen?.mdk_volume || '';
    setNotaPencairanDanaRows((prev) => [...prev, createEmptyRow(defaultUraianText, paguNilai, 0, 0, defaultDpaVolume, defaultDpaSatuan, defaultSaatiniVolume, defaultSebelumnyaVolume)]);
  };

  const handleRemoveRow = (index: number) => {
    const defaultUraianText = selectedMasterDokumen?.mdk_pekerjaan || selectedMasterDokumen?.mdk_uraian_belanja || '';
    const paguNilai = selectedMasterDokumen?.mdk_pagu_anggaran ? Math.round(Number(selectedMasterDokumen.mdk_pagu_anggaran)) : 0;
    const defaultDpaVolume = selectedMasterDokumen?.mdk_volume || '';
    const defaultDpaSatuan = selectedMasterDokumen?.mdk_satuan || '';
    const defaultSaatiniVolume = selectedMasterDokumen?.mdk_volume || '';
    const defaultSebelumnyaVolume = selectedMasterDokumen?.mdk_volume || '';
    if (NotaPencairanDanaRows.length === 1) {
      setNotaPencairanDanaRows([createEmptyRow(defaultUraianText, paguNilai, 0, 0, defaultDpaVolume, defaultDpaSatuan, defaultSaatiniVolume, defaultSebelumnyaVolume)]);
      return;
    }
    setNotaPencairanDanaRows((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleRowChange = (index: number, field: keyof NotaPencairanDanaItemRow, value: any) => {
    setNotaPencairanDanaRows((prev) => {
      const updated = [...prev];
      const currentRow = { ...updated[index], [field]: value };

      if (field === 'dpd_saatini_nilai' || field === 'dpd_saatini_ppn' || field === 'dpd_saatini_pph23') {
        const nilai = Number(currentRow.dpd_saatini_nilai) || 0;
        const ppn = Math.round((Number(currentRow.dpd_saatini_ppn) * 0.0990990990990991) || 0);
        const pph23 = Math.round((Number(currentRow.dpd_saatini_nilai) - ppn) * (1.5 / 100));
        const totalPajak = ppn + pph23;

        currentRow.dpd_saatini_ppn = ppn;
        currentRow.dpd_saatini_pph23 = pph23;
        currentRow.dpd_saatini_total_pajak = totalPajak;
        currentRow.dpd_saatini_pembayaran = nilai - totalPajak;
      }

      if (field === 'dpd_dpa_nilai' || field === 'dpd_belum_nilai' || field === 'dpd_saatini_nilai') {
        const dpaNilai = Number(currentRow.dpd_dpa_nilai) || 0;
        const belumNilai = Number(currentRow.dpd_belum_nilai) || 0;
        const nilaiSaatIni = Number(currentRow.dpd_saatini_nilai) || 0;

        currentRow.dpd_sisa_nilai = dpaNilai - belumNilai - nilaiSaatIni;
      }

      updated[index] = currentRow;
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMdkId || typeof selectedMdkId !== 'number') {
      showToast('error', 'Silakan pilih Master Dokumen terlebih dahulu.');
      return;
    }
    const validRows = NotaPencairanDanaRows.filter((r) => r.dpd_uraian.trim() !== '');
    if (validRows.length === 0) {
      showToast('error', 'Minimal isi 1 Uraian Kegiatan Nota Pencairan Dana.');
      return;
    }
    setSaving(true);
    const res = await saveNotaPencairanDanaBatchAction({
      dpd_master_dokumen_id: selectedMdkId,
      items: validRows.map((r) => ({
        dpd_uraian: r.dpd_uraian,
        dpd_dpa_volume: r.dpd_dpa_volume,
        dpd_dpa_satuan: r.dpd_dpa_satuan,
        dpd_dpa_nilai: Number(r.dpd_dpa_nilai) || 0,
        dpd_belum_volume: r.dpd_belum_volume,
        dpd_belum_nilai: Number(r.dpd_belum_nilai) || 0,
        dpd_saatini_volume: r.dpd_saatini_volume,
        dpd_saatini_nilai: Number(r.dpd_saatini_nilai) || 0,
        dpd_saatini_ppn: Number(r.dpd_saatini_ppn) || 0,
        dpd_saatini_pph23: Number(r.dpd_saatini_pph23) || 0,
        dpd_saatini_total_pajak: Number(r.dpd_saatini_total_pajak) || 0,
        dpd_saatini_pembayaran: Number(r.dpd_saatini_pembayaran) || 0,
        dpd_sisa_volume: r.dpd_sisa_volume,
        dpd_sisa_nilai: Number(r.dpd_sisa_nilai) || 0,
      })),
    });
    setSaving(false);
    if (res.success) {
      showToast('success', res.message);
      loadNotaPencairanDanaForMdk(selectedMdkId);
    } else {
      showToast('error', res.message);
    }
  };

  // Open PDF in new tab
  const handlePrintPdf = useCallback(async () => {
    if (!selectedMdkId) return;
    const validRows = NotaPencairanDanaRows.filter((r) => r.dpd_uraian.trim() !== '');
    if (validRows.length > 0) {
      await saveNotaPencairanDanaBatchAction({
        dpd_master_dokumen_id: selectedMdkId as number,
        items: validRows.map((r) => ({
          dpd_uraian: r.dpd_uraian,
          dpd_dpa_volume: r.dpd_dpa_volume,
          dpd_dpa_satuan: r.dpd_dpa_satuan,
          dpd_dpa_nilai: Number(r.dpd_dpa_nilai) || 0,
          dpd_belum_volume: r.dpd_belum_volume,
          dpd_belum_nilai: Number(r.dpd_belum_nilai) || 0,
          dpd_saatini_volume: r.dpd_saatini_volume,
          dpd_saatini_nilai: Number(r.dpd_saatini_nilai) || 0,
          dpd_saatini_ppn: Number(r.dpd_saatini_ppn) || 0,
          dpd_saatini_pph23: Number(r.dpd_saatini_pph23) || 0,
          dpd_saatini_total_pajak: Number(r.dpd_saatini_total_pajak) || 0,
          dpd_saatini_pembayaran: Number(r.dpd_saatini_pembayaran) || 0,
          dpd_sisa_volume: r.dpd_sisa_volume,
          dpd_sisa_nilai: Number(r.dpd_sisa_nilai) || 0,
        })),
      });
    }
    window.open(`/nota-pencairan-dana/print/${selectedMdkId}`, '_blank');
  }, [selectedMdkId, NotaPencairanDanaRows]);

  const totalHargaNotaPencairanDana = NotaPencairanDanaRows.reduce(
    (acc, curr) => acc + (Number(curr.dpd_saatini_pembayaran) || 0),
    0
  );
  const ppnNotaPencairanDana = Math.round(totalHargaNotaPencairanDana * 0.11);
  const totalKeseluruhanNotaPencairanDana = totalHargaNotaPencairanDana + ppnNotaPencairanDana;
  const paguNominal = Number(selectedMasterDokumen?.mdk_pagu_anggaran) || 0;
  const selisihNominal = paguNominal - totalKeseluruhanNotaPencairanDana;
  const terbilangStr = terbilang(totalKeseluruhanNotaPencairanDana);

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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Formulir Nota Pencairan Dana</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Kelola rincian item Nota Pencairan Dana &amp; estimasi harga berdasarkan Master Dokumen
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
              Cetak Nota Pencairan Dana PDF
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

        {/* ── Right: Dynamic NotaPencairanDana Form ── */}
        <div className="min-w-0">
          {selectedMasterDokumen ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
                {/* Section Header */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white">Rincian Item Nota Pencairan Dana</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Isi uraian kegiatan, volume, waktu, HPS/OE, Permintaan Sebelumnya, dan Nota Pencairan Dana
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

                {/* Rows */}
                {loadingNotaPencairanDana ? (
                  <div className="py-8 text-center text-xs text-gray-500 animate-pulse">Memuat data NotaPencairanDana...</div>
                ) : (
                  <div className="space-y-4">
                    {NotaPencairanDanaRows.map((row, index) => (
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

                        {/* All-in-one flat row: Uraian + 4 panels */}
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-start text-xs">

                          {/* Uraian Kegiatan */}
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">Uraian Kegiatan</label>
                            <textarea
                              rows={7}
                              placeholder="Contoh: Sewa Kendaraan Dinas Bermotor Penumpang - Big Bus"
                              value={row.dpd_uraian}
                              onChange={(e) => handleRowChange(index, 'dpd_uraian', e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all resize-none"
                            />
                          </div>

                          {/* HPS / OE */}
                          <div className="rounded-lg border border-blue-200 dark:border-blue-800/40 bg-blue-50/40 dark:bg-blue-900/10 p-2.5">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-2">Anggaran (DPA)</p>
                            <div className="space-y-2">
                              <div>
                                <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1">Volume</label>
                                <div className="relative">
                                  <input type='text' placeholder="0" value={row.dpd_dpa_volume || ''}
                                    onChange={(e) => handleRowChange(index, 'dpd_dpa_volume', e.target.value)}
                                    className="w-full px-2 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all" />
                                </div>
                              </div>
                              <div>
                                <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1">Satuan</label>
                                <input
                                  type="text"
                                  placeholder="ex: Unit, Hari"
                                  value={row.dpd_dpa_satuan || ''}
                                  onChange={(e) => handleRowChange(index, 'dpd_dpa_satuan', e.target.value)}
                                  className="w-full px-2 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all" />
                              </div>
                              <div>
                                <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1">Nilai</label>
                                <RupiahInput
                                  value={row.dpd_dpa_nilai}
                                  onChange={(e) => handleRowChange(index, 'dpd_dpa_nilai', e)}
                                  className="w-full px-2 py-2 text-xs font-mono rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all" />
                              </div>
                            </div>
                          </div>

                          {/* Permintaan Sebelumnya */}
                          <div className="rounded-lg border border-amber-200 dark:border-amber-800/40 bg-amber-50/40 dark:bg-amber-900/10 p-2.5">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400 mb-2">Permintaan Sebelumnya</p>
                            <div className="space-y-2">
                              <div>
                                <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1">Volume</label>
                                <input
                                  type="text"
                                  placeholder="ex: 2.00"
                                  value={row.dpd_belum_volume || ''}
                                  onChange={(e) => handleRowChange(index, 'dpd_belum_volume', e.target.value)}
                                  className="w-full px-2 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all" />
                              </div>
                              <div>
                                <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1">Nilai</label>
                                <div className="relative">
                                  <span className="absolute left-2 top-2 text-[10px] font-bold text-gray-400">Rp</span>
                                  <RupiahInput placeholder="0" value={row.dpd_belum_nilai || ''}
                                    onChange={(e) => handleRowChange(index, 'dpd_belum_nilai', e)}
                                    className="w-full pl-7 pr-2 py-2 text-xs font-mono rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Permintaan Saat Ini */}
                          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/40 dark:bg-emerald-900/10 p-2.5">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-2">Permintaan Saat Ini</p>
                            <div className="space-y-2">
                              <div>
                                <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1">Volume</label>
                                <input
                                  type="text"
                                  placeholder="ex: 2.00"
                                  value={row.dpd_saatini_volume || ''}
                                  onChange={(e) => handleRowChange(index, 'dpd_saatini_volume', e.target.value)}
                                  className="w-full px-2 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all" />
                              </div>
                              <div>
                                <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1">Nilai</label>
                                <div className="relative">
                                  <span className="absolute left-2 top-2 text-[10px] font-bold text-gray-400">Rp</span>
                                  <RupiahInput placeholder="0" value={row.dpd_saatini_nilai || ''}
                                    onChange={(e) => handleRowChange(index, 'dpd_saatini_nilai', e)}
                                    className="w-full pl-7 pr-2 py-2 text-xs font-mono rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all" />
                                </div>
                              </div>
                              <div>
                                <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1">PPN</label>
                                <div className="relative">
                                  <span className="absolute left-2 top-2 text-[10px] font-bold text-gray-400">Rp</span>
                                  <RupiahInput placeholder="0" value={row.dpd_saatini_ppn || ''}
                                    onChange={(e) => handleRowChange(index, 'dpd_saatini_ppn', e)}
                                    className="w-full pl-7 pr-2 py-2 text-xs font-mono rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all" />
                                </div>
                              </div>
                              <div>
                                <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1">PPH23</label>
                                <div className="relative">
                                  <span className="absolute left-2 top-2 text-[10px] font-bold text-gray-400">Rp</span>
                                  <RupiahInput placeholder="0" value={row.dpd_saatini_pph23 || ''}
                                    onChange={(e) => handleRowChange(index, 'dpd_saatini_pph23', e)}
                                    className="w-full pl-7 pr-2 py-2 text-xs font-mono rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all" />
                                </div>
                              </div>
                              <div>
                                <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1">Total Pajak (Otomatis)</label>
                                <div className="relative">
                                  <span className="absolute left-2 top-2 text-[10px] font-bold text-gray-400">Rp</span>
                                  <RupiahInput placeholder="0" value={row.dpd_saatini_total_pajak || ''}
                                    readOnly
                                    className="w-full pl-7 pr-2 py-2 text-xs font-mono rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 focus:outline-none cursor-not-allowed" />
                                </div>
                              </div>
                              <div>
                                <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1">Pembayaran</label>
                                <div className="relative">
                                  <span className="absolute left-2 top-2 text-[10px] font-bold text-gray-400">Rp</span>
                                  <RupiahInput placeholder="0" value={row.dpd_saatini_pembayaran || ''}
                                    onChange={(e) => handleRowChange(index, 'dpd_saatini_pembayaran', e)}
                                    className="w-full pl-7 pr-2 py-2 text-xs font-mono rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Sisa Anggaran */}
                          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/40 p-2.5">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">Sisa Anggaran</p>
                            <div className="space-y-2">
                              <div>
                                <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1">Volume</label>
                                <input
                                  type="text"
                                  placeholder="ex: 2.00"
                                  value={row.dpd_sisa_volume || ''}
                                  onChange={(e) => handleRowChange(index, 'dpd_sisa_volume', e.target.value)}
                                  className="w-full px-2 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all" />
                              </div>
                              <div>
                                <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1">Nilai</label>
                                <div className="relative">
                                  <span className="absolute left-2 top-2 text-[10px] font-bold text-gray-400">Rp</span>
                                  <RupiahInput placeholder="0" value={row.dpd_sisa_nilai || ''}
                                    onChange={(e) => handleRowChange(index, 'dpd_sisa_nilai', e)}
                                    className="w-full pl-7 pr-2 py-2 text-xs font-mono rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all" />
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
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-6 text-xs w-full sm:w-auto">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 block">Total Nota Pencairan Dana:</span>
                      <strong className="text-sm font-bold text-gray-900 dark:text-white">{formatRupiah(totalHargaNotaPencairanDana)}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 block">PPN (11%):</span>
                      <strong className="text-sm font-bold text-gray-900 dark:text-white">{formatRupiah(ppnNotaPencairanDana)}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 block">Total + PPN:</span>
                      <strong className="text-base font-extrabold text-brand-600 dark:text-brand-400">{formatRupiah(totalKeseluruhanNotaPencairanDana)}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 block">Selisih vs Pagu:</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${selisihNominal >= 0
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                        }`}>
                        {selisihNominal >= 0
                          ? `Sisa ${formatRupiah(selisihNominal)}`
                          : `Surplus ${formatRupiah(Math.abs(selisihNominal))}`}
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
                          Simpan Data
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
              <span>Pilih Master Dokumen di sebelah kiri untuk mulai mengisi data NotaPencairanDana.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
