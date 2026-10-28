"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MasterDokumen } from '../../master-dokumen/types';
import { SurveyHeader, SurveyWithDetails } from '../types';
import {
  getMasterDokumenOptionsAction,
  getSurveyWithDetailsAction,
  saveSurveyBatchAction,
} from '../actions';
import { formatRupiah } from '@/lib/terbilang';
import { formatDateYYYYMMDD } from '@/lib/date';
import { MasterDokumenSelectorCard } from '../../master-dokumen/components/MasterDokumenSelectorCard';
import { SurveyPrintPreview } from './SurveyPrintPreview';
import { RupiahInput } from '@/components/form/RupiahInput';
import { Toast } from '@/components/ui/Toast';

interface SurveyItemRow {
  dsrv_id?: number;
  dsrv_jenis_spesifikasi: string;
  dsrv_harga_survey: number;
}

interface SurveyContainerProps {
  initialMasterDokumenId?: number;
  hideMasterDokumenSelector?: boolean;
}



export const SurveyContainer: React.FC<SurveyContainerProps> = ({
  initialMasterDokumenId,
  hideMasterDokumenSelector = false,
}) => {
  // Master Dokumen List for Dropdown
  const [masterDokumenList, setMasterDokumenList] = useState<MasterDokumen[]>([]);
  const [selectedMdkId, setSelectedMdkId] = useState<number | ''>(initialMasterDokumenId || '');
  const [selectedMasterDokumen, setSelectedMasterDokumen] = useState<MasterDokumen | null>(null);

  const todayYmd = formatDateYYYYMMDD(new Date());

  // Survey Header State
  const [headerState, setHeaderState] = useState<{
    srv_nomor: string;
    srv_nama_kegiatan: string;
    srv_paket_pekerjaan: string;
    srv_tanggal_mulai: string;
    srv_tanggal_selesai: string;
    srv_nama_perusahaan: string;
    srv_alamat_perusahaan: string;
  }>({
    srv_nomor: '',
    srv_nama_kegiatan: '',
    srv_paket_pekerjaan: '',
    srv_tanggal_mulai: todayYmd,
    srv_tanggal_selesai: todayYmd,
    srv_nama_perusahaan: '',
    srv_alamat_perusahaan: '',
  });

  // Dynamic Survey Form Items
  const [surveyRows, setSurveyRows] = useState<SurveyItemRow[]>([
    { dsrv_jenis_spesifikasi: '', dsrv_harga_survey: 0 },
  ]);



  // Full Survey Data & Print Modal
  const [surveyData, setSurveyData] = useState<SurveyWithDetails | null>(null);
  const [hasSavedData, setHasSavedData] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Loading & Action states
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadingSurvey, setLoadingSurvey] = useState(false);
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

  // Fetch Survey Header + Details whenever selected Master Dokumen changes
  const loadSurveyForMdk = useCallback(async (mdkId: number, targetMdk?: MasterDokumen | null) => {
    setLoadingSurvey(true);
    const res = await getSurveyWithDetailsAction(mdkId);
    if (res.success && res.data) {
      setSurveyData(res.data);
      const { header, details, masterDokumen } = res.data;
      const isSaved = Boolean(header?.srv_id || (details && details.length > 0));
      setHasSavedData(isSaved);

      const effectiveMdk = masterDokumen || targetMdk || selectedMasterDokumen;

      const namaKegiatan =
        (header?.srv_nama_kegiatan && header.srv_nama_kegiatan.trim()) ||
        effectiveMdk?.mdk_kegiatan?.trim() ||
        effectiveMdk?.mdk_sub_kegiatan?.trim() ||
        effectiveMdk?.mdk_program?.trim() ||
        effectiveMdk?.mdk_uraian_belanja?.trim() ||
        '';

      const paketPekerjaan =
        (header?.srv_paket_pekerjaan && header.srv_paket_pekerjaan.trim()) ||
        effectiveMdk?.mdk_uraian_belanja?.trim() ||
        '';

      const namaPerusahaan =
        (header?.srv_nama_perusahaan && header.srv_nama_perusahaan.trim()) ||
        effectiveMdk?.mdk_nama_perusahaan?.trim() ||
        (effectiveMdk as any)?.psh_nama?.trim() ||
        '';

      const alamatPerusahaan =
        (header?.srv_alamat_perusahaan && header.srv_alamat_perusahaan.trim()) ||
        effectiveMdk?.mdk_alamat?.trim() ||
        (effectiveMdk as any)?.psh_alamat?.trim() ||
        '';

      setHeaderState({
        srv_nomor: header?.srv_nomor || '',
        srv_nama_kegiatan: namaKegiatan,
        srv_paket_pekerjaan: paketPekerjaan,
        srv_tanggal_mulai: formatDateYYYYMMDD(header?.srv_tanggal_mulai) || todayYmd,
        srv_tanggal_selesai: formatDateYYYYMMDD(header?.srv_tanggal_selesai) || todayYmd,
        srv_nama_perusahaan: namaPerusahaan,
        srv_alamat_perusahaan: alamatPerusahaan,
      });

      // Populate Detail Rows
      if (details && details.length > 0) {
        setSurveyRows(
          details.map((item) => ({
            dsrv_id: item.dsrv_id,
            dsrv_jenis_spesifikasi: item.dsrv_jenis_spesifikasi,
            dsrv_harga_survey: item.dsrv_harga_survey,
          }))
        );
      } else {
        setSurveyRows([{
          dsrv_jenis_spesifikasi: effectiveMdk?.mdk_pekerjaan?.trim() || '',
          dsrv_harga_survey: 0,
        }]);
      }
    } else {
      setSurveyData(null);
      setHasSavedData(false);
      setSurveyRows([{
        dsrv_jenis_spesifikasi: targetMdk?.mdk_pekerjaan?.trim() || '',
        dsrv_harga_survey: 0,
      }]);
    }
    setLoadingSurvey(false);
  }, [selectedMasterDokumen, todayYmd]);

  useEffect(() => {
    if (selectedMdkId && typeof selectedMdkId === 'number') {
      const found = masterDokumenList.find((m) => m.mdk_id === selectedMdkId) || null;
      setSelectedMasterDokumen(found);

      if (found) {
        setHeaderState((prev) => ({
          ...prev,
          srv_nama_kegiatan:
            found.mdk_kegiatan?.trim() ||
            found.mdk_sub_kegiatan?.trim() ||
            found.mdk_program?.trim() ||
            found.mdk_uraian_belanja?.trim() ||
            prev.srv_nama_kegiatan,
          srv_paket_pekerjaan: found.mdk_uraian_belanja?.trim() || prev.srv_paket_pekerjaan,
          srv_nama_perusahaan:
            found.mdk_nama_perusahaan?.trim() || (found as any).psh_nama?.trim() || prev.srv_nama_perusahaan,
          srv_alamat_perusahaan:
            found.mdk_alamat?.trim() || (found as any).psh_alamat?.trim() || prev.srv_alamat_perusahaan,
        }));
      }

      loadSurveyForMdk(selectedMdkId, found);
    } else {
      setSelectedMasterDokumen(null);
      setSurveyData(null);
      setHasSavedData(false);
      setSurveyRows([{ dsrv_jenis_spesifikasi: '', dsrv_harga_survey: 0 }]);
      setHeaderState({
        srv_nomor: '',
        srv_nama_kegiatan: '',
        srv_paket_pekerjaan: '',
        srv_tanggal_mulai: todayYmd,
        srv_tanggal_selesai: todayYmd,
        srv_nama_perusahaan: '',
        srv_alamat_perusahaan: '',
      });
    }
  }, [selectedMdkId, masterDokumenList, loadSurveyForMdk, todayYmd]);

  // Handle Dynamic Rows
  const handleAddRow = () => {
    setSurveyRows((prev) => [...prev, { dsrv_jenis_spesifikasi: '', dsrv_harga_survey: 0 }]);
  };

  const handleRemoveRow = (index: number) => {
    if (surveyRows.length === 1) {
      setSurveyRows([{ dsrv_jenis_spesifikasi: '', dsrv_harga_survey: 0 }]);
      return;
    }
    setSurveyRows((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleRowChange = (index: number, field: keyof SurveyItemRow, value: any) => {
    setSurveyRows((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Submit Dynamic Survey Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMdkId || typeof selectedMdkId !== 'number') {
      showToast('error', 'Silakan pilih Master Dokumen terlebih dahulu.');
      return;
    }

    const validRows = surveyRows.filter((r) => r.dsrv_jenis_spesifikasi.trim() !== '');
    if (validRows.length === 0) {
      showToast('error', 'Minimal isi 1 barang / spesifikasi survey.');
      return;
    }

    setSaving(true);
    const res = await saveSurveyBatchAction({
      srv_master_dokumen_id: selectedMdkId,
      srv_nomor: headerState.srv_nomor,
      srv_nama_kegiatan: headerState.srv_nama_kegiatan,
      srv_paket_pekerjaan: headerState.srv_paket_pekerjaan,
      srv_tanggal_mulai: headerState.srv_tanggal_mulai || null,
      srv_tanggal_selesai: headerState.srv_tanggal_selesai || null,
      srv_nama_perusahaan: headerState.srv_nama_perusahaan,
      srv_alamat_perusahaan: headerState.srv_alamat_perusahaan,
      items: validRows,
    });
    setSaving(false);

    if (res.success) {
      showToast('success', res.message);
      setHasSavedData(true);
      loadSurveyForMdk(selectedMdkId);
    } else {
      showToast('error', res.message);
    }
  };

  // Calculation metrics
  const totalHargaSurvey = surveyRows.reduce((acc, curr) => acc + (Number(curr.dsrv_harga_survey) || 0), 0);
  const paguNominal = Number(selectedMasterDokumen?.mdk_pagu_anggaran) || 0;
  const isLocked = selectedMasterDokumen?.mdk_is_lock === 1;
  const isSaved = hasSavedData || Boolean(surveyData?.header?.srv_id) || surveyRows.some((r) => Boolean(r.dsrv_id));
  const selisihNominal = paguNominal - totalHargaSurvey;

  const currentHeaderForPrint: SurveyHeader = {
    srv_id: surveyData?.header?.srv_id || 0,
    srv_master_dokumen_id: Number(selectedMdkId) || 0,
    srv_nomor: headerState.srv_nomor,
    srv_nama_kegiatan: headerState.srv_nama_kegiatan,
    srv_paket_pekerjaan: headerState.srv_paket_pekerjaan,
    srv_tanggal_mulai: headerState.srv_tanggal_mulai || null,
    srv_tanggal_selesai: headerState.srv_tanggal_selesai || null,
    srv_nama_perusahaan: headerState.srv_nama_perusahaan,
    srv_alamat_perusahaan: headerState.srv_alamat_perusahaan,
  };

  const handlePrintPdf = useCallback(async () => {
    if (!selectedMdkId) return;
    const validRows = surveyRows.filter((r) => r.dsrv_jenis_spesifikasi.trim() !== '');
    if (validRows.length > 0) {
      await saveSurveyBatchAction({
        srv_master_dokumen_id: Number(selectedMdkId),
        srv_nomor: headerState.srv_nomor,
        srv_nama_kegiatan: headerState.srv_nama_kegiatan,
        srv_paket_pekerjaan: headerState.srv_paket_pekerjaan,
        srv_tanggal_mulai: headerState.srv_tanggal_mulai || null,
        srv_tanggal_selesai: headerState.srv_tanggal_selesai || null,
        srv_nama_perusahaan: headerState.srv_nama_perusahaan,
        srv_alamat_perusahaan: headerState.srv_alamat_perusahaan,
        items: validRows,
      });
      setHasSavedData(true);
    }
    window.open(`/survey/print/${selectedMdkId}`, '_blank');
  }, [selectedMdkId, headerState, surveyRows]);

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

      {/* Print Preview Modal */}
      {showPrintModal && (
        <SurveyPrintPreview
          header={currentHeaderForPrint}
          details={surveyRows.filter((r) => r.dsrv_jenis_spesifikasi.trim() !== '').map((r, i) => ({
            dsrv_id: r.dsrv_id || i + 1,
            dsrv_survey_id: currentHeaderForPrint.srv_id,
            dsrv_jenis_spesifikasi: r.dsrv_jenis_spesifikasi,
            dsrv_harga_survey: Number(r.dsrv_harga_survey) || 0,
          }))}
          masterDokumen={surveyData?.masterDokumen || selectedMasterDokumen}
          onClose={() => setShowPrintModal(false)}
        />
      )}

      {/* Header Title */}
      {!hideMasterDokumenSelector && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Formulir Survey Harga Pasar</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Kelola rincian berita acara survei harga & spesifikasi barang/jasa
            </p>
          </div>
        </div>
      )}

      {/* 2-Column Responsive Layout */}
      <div
        className="grid gap-6 items-start"
        style={{
          gridTemplateColumns: hideMasterDokumenSelector ? '1fr' : 'minmax(0, 360px) minmax(0, 1fr)',
        }}
      >
        {/* Left Side (Master Dokumen Selector & Info Card) */}
        {!hideMasterDokumenSelector && (
          <div className="min-w-0 space-y-5">
            <MasterDokumenSelectorCard
              title="Pilih Master Dokumen"
              subtitle="Pilih dokumen acuan untuk input survey harga"
              masterDokumenList={masterDokumenList}
              selectedMdkId={selectedMdkId}
              selectedMasterDokumen={selectedMasterDokumen}
              onSelect={(val) => setSelectedMdkId(val)}
              loadingOptions={loadingOptions}
            />
          </div>
        )}

        {/* Right Side (Dynamic Survey Form Section) */}
        <div className="min-w-0">
          {selectedMasterDokumen ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 2-Column Grid Layout for Form Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Left Column: Informasi Berita Acara Survey */}
                <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                  <div className="pb-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-blue-900 dark:text-white">Informasi Berita Acara Survey</h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Kolom otomatis terisi dari Master Dokumen, silakan sesuaikan data & tanggal
                      </p>
                    </div>
                    {/* {hideMasterDokumenSelector && (
                      <button
                        type="button"
                        onClick={handlePrintPdf}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Cetak Berita Acara PDF
                      </button>
                    )} */}
                  </div>

                  <div className="space-y-3.5 text-xs">
                    {/* Nomor Berita Acara */}
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700 dark:text-gray-300 block">
                        Nomor Berita Acara Survey
                      </label>
                      <input
                        type="text"
                        value={headerState.srv_nomor}
                        onChange={(e) => setHeaderState((prev) => ({ ...prev, srv_nomor: e.target.value }))}
                        placeholder="Contoh: 027/DPMPTSP/BA-SURVEY/2026/001"
                        className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none"
                      />
                    </div>

                    {/* Nama Kegiatan */}
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700 dark:text-gray-300 block">
                        Nama Kegiatan <span className="text-emerald-500 font-normal text-[10px]">(Otomatis)</span>
                      </label>
                      <input
                        type="text"
                        value={headerState.srv_nama_kegiatan}
                        onChange={(e) => setHeaderState((prev) => ({ ...prev, srv_nama_kegiatan: e.target.value }))}
                        placeholder="Nama kegiatan survey..."
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none"
                      />
                    </div>

                    {/* Paket Pekerjaan */}
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700 dark:text-gray-300 block">
                        Paket Pekerjaan <span className="text-emerald-500 font-normal text-[10px]">(Otomatis)</span>
                      </label>
                      <input
                        type="text"
                        value={headerState.srv_paket_pekerjaan}
                        onChange={(e) => setHeaderState((prev) => ({ ...prev, srv_paket_pekerjaan: e.target.value }))}
                        placeholder="Paket pekerjaan pengadaan..."
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none"
                      />
                    </div>

                    {/* Tanggal Mulai & Selesai */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-semibold text-gray-700 dark:text-gray-300 block">Tanggal Mulai Survey</label>
                        <input
                          type="date"
                          value={headerState.srv_tanggal_mulai}
                          onChange={(e) => setHeaderState((prev) => ({ ...prev, srv_tanggal_mulai: e.target.value }))}
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-gray-700 dark:text-gray-300 block">Tanggal Selesai Survey</label>
                        <input
                          type="date"
                          value={headerState.srv_tanggal_selesai}
                          onChange={(e) => setHeaderState((prev) => ({ ...prev, srv_tanggal_selesai: e.target.value }))}
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Nama Perusahaan */}
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700 dark:text-gray-300 block">
                        Nama Perusahaan <span className="text-emerald-500 font-normal text-[10px]">(Otomatis)</span>
                      </label>
                      <input
                        type="text"
                        value={headerState.srv_nama_perusahaan}
                        onChange={(e) => setHeaderState((prev) => ({ ...prev, srv_nama_perusahaan: e.target.value }))}
                        placeholder="Nama Penyedia / Perusahaan yang disurvei..."
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none"
                      />
                    </div>

                    {/* Alamat Perusahaan */}
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700 dark:text-gray-300 block">
                        Alamat Perusahaan <span className="text-emerald-500 font-normal text-[10px]">(Otomatis)</span>
                      </label>
                      <textarea
                        rows={2}
                        value={headerState.srv_alamat_perusahaan}
                        onChange={(e) => setHeaderState((prev) => ({ ...prev, srv_alamat_perusahaan: e.target.value }))}
                        placeholder="Alamat lengkap penyedia..."
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Rincian Item Survey & Spesifikasi */}
                <div className="p-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                    <div>
                      <h2 className="text-base font-bold text-blue-900 dark:text-white">Rincian Item Survey & Spesifikasi</h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Tambahkan atau ubah daftar item spesifikasi dan estimasi harga survey
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddRow}
                      className="px-3.5 py-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400 font-semibold text-xs hover:bg-brand-100 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Tambah Baris
                    </button>
                  </div>

                  {loadingSurvey ? (
                    <div className="py-12 text-center text-xs text-gray-500 animate-pulse">Memuat data survey...</div>
                  ) : (
                    <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                      {surveyRows.map((row, index) => (
                        <div
                          key={index}
                          className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 space-y-2.5 transition-all"
                        >
                          <div className="flex items-center justify-between">

                            {surveyRows.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveRow(index)}
                                className="p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors shrink-0 cursor-pointer"
                                title="Hapus Baris"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gray-200 dark:bg-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300">
                            #{index + 1}
                          </span>
                          {/* Spesifikasi / Jenis Barang Input */}
                          <div className="flex flex-wrap justify-between items-center">
                            <div className='flex-1'>
                              <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Jenis / Spesifikasi Barang/Jasa
                              </label>
                              <input
                                type="text"
                                placeholder="Contoh: Sewa Bus Besar AC kps 40 Seat / 1 Hari"
                                value={row.dsrv_jenis_spesifikasi}
                                onChange={(e) => handleRowChange(index, 'dsrv_jenis_spesifikasi', e.target.value)}
                                className="w-full px-3.5 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all"
                              />
                            </div>

                            {/* Harga Survey Input */}
                            <div>
                              <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                                Harga Hasil Survey (Rp)
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-2 text-xs font-bold text-gray-400">Rp</span>
                                <RupiahInput
                                  placeholder="0"
                                  value={row.dsrv_harga_survey || ''}
                                  onChange={(num) => handleRowChange(index, 'dsrv_harga_survey', num)}
                                  className="w-full pl-9 pr-3 py-2 text-xs font-mono font-bold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>

              </div>

              {/* Dynamic Summary Card & Save Button */}
              <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-6 text-xs w-full sm:w-auto">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 block">Total Nominal Survey:</span>
                    <strong className="text-base font-bold text-gray-900 dark:text-white">
                      {formatRupiah(totalHargaSurvey)}
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

                <div className="flex items-center gap-3 w-full sm:w-auto">
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
                        {isSaved ? 'Update Data Survey' : 'Simpan Data Survey'}
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
              <span>Pilih Master Dokumen di sebelah kiri untuk mulai mengisi data survey.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
