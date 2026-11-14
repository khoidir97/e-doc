"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  getKakOptionsForPermohonanAction,
  getPermohonanByKakIdAction,
  savePermohonanAction,
} from '../actions';
import {
  KakOptionItem,
  Permohonan,
  SavePermohonanPayload,
} from '../types';
import { KerangkaAcuanKerja } from '@/features/kerangka-acuan-kerja/types';
import { MasterDokumen } from '@/features/master-dokumen/types';
import { SearchableSelect } from '@/components/form/SearchableSelect';
import { RupiahInput } from '@/components/form/RupiahInput';
import { formatRupiah, terbilang } from '@/lib/terbilang';
import { Toast } from '@/components/ui/Toast';
import { KopSuratBpkad } from '@/components/common/KopSuratBpkad';
import { RichTextEditor } from '@/components/form/RichTextEditor';

interface PermohonanContainerProps {
  initialKakId?: number;
}

export const PermohonanContainer: React.FC<PermohonanContainerProps> = ({
  initialKakId,
}) => {
  const [kakOptions, setKakOptions] = useState<KakOptionItem[]>([]);
  const [selectedKakId, setSelectedKakId] = useState<number | ''>(initialKakId || '');
  const [selectedKak, setSelectedKak] = useState<KerangkaAcuanKerja | null>(null);
  const [selectedMasterDokumen, setSelectedMasterDokumen] = useState<MasterDokumen | null>(null);

  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadingPermohonan, setLoadingPermohonan] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [hasSavedData, setHasSavedData] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  // Form states matching table permohonan
  const [pmhId, setPmhId] = useState<number | null>(null);
  const [pmhTanggal, setPmhTanggal] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [pmhNomor, setPmhNomor] = useState<string>('S.000.3.1/ BPKAD-ND/      / 2026');
  const [pmhSifat, setPmhSifat] = useState<string>('Segera');
  const [pmhLampiran, setPmhLampiran] = useState<string>('3 (tiga)');
  const [pmhHal, setPmhHal] = useState<string>('Permintaan Proses Pengadaan Barang/Jasa');

  const [pmhParagraf1, setPmhParagraf1] = useState<string>('');
  const [pmhKodeRup, setPmhKodeRup] = useState<string>('');
  const [pmhNamaPaket, setPmhNamaPaket] = useState<string>('');
  const [pmhPaguAnggaran, setPmhPaguAnggaran] = useState<number>(0);
  const [pmhHps, setPmhHps] = useState<number>(0);
  const [pmhMetodePemilihan, setPmhMetodePemilihan] = useState<string>('e-purchasing melalui e katalog v.6');
  const [pmhSumberDana, setPmhSumberDana] = useState<string>('APBD Pemerintah Kota Pekanbaru Tahun Anggaran 2026');
  const [pmhParagraf2, setPmhParagraf2] = useState<string>(
    '<p>Berkaitan dengan hal tersebut di atas, bersama ini kami lampirkan Dokumen Persiapan Pengadaan (DPP), antara lain:</p><ol><li>KAK</li><li>Spesifikasi Teknis</li></ol><p>Demikian disampaikan untuk diproses lebih lanjut sesuai dengan ketentuan dan peraturan perundang-undangan yang berlaku.</p>'
  );

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
  };

  const ensureHtmlParagraf2 = (val: string) => {
    if (!val) return '';
    if (/<[a-z][\s\S]*>/i.test(val)) return val;
    const lines = val.split('\n').map((l) => l.trim()).filter(Boolean);
    const result: string[] = [];
    let inList = false;
    for (const line of lines) {
      const listMatch = line.match(/^\d+[\.\)]\s*(.+)/);
      if (listMatch) {
        if (!inList) {
          result.push('<ol>');
          inList = true;
        }
        result.push(`<li>${listMatch[1]}</li>`);
      } else {
        if (inList) {
          result.push('</ol>');
          inList = false;
        }
        result.push(`<p>${line}</p>`);
      }
    }
    if (inList) result.push('</ol>');
    return result.join('');
  };

  // Format tanggal ke Bahasa Indonesia (Contoh: 15 Oktober 2026)
  const formatIndoDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Fetch KAK options on mount
  useEffect(() => {
    async function initKakList() {
      setLoadingOptions(true);
      const res = await getKakOptionsForPermohonanAction();
      if (res.success && res.data) {
        setKakOptions(res.data);
        const targetId = initialKakId || (res.data.length > 0 ? res.data[0].kak_id : '');
        if (targetId) {
          setSelectedKakId(targetId);
        }
      } else {
        showToast('error', res.message || 'Gagal memuat opsi KAK.');
      }
      setLoadingOptions(false);
    }
    initKakList();
  }, [initialKakId]);

  // Load Permohonan when KAK selection changes
  const loadPermohonanForKak = useCallback(async (kakId: number) => {
    setLoadingPermohonan(true);
    const res = await getPermohonanByKakIdAction(kakId);

    if (res.success && res.data) {
      const { permohonan, kak, masterDokumen, totalBiayaKak, totalHps } = res.data;
      setSelectedKak(kak);
      setSelectedMasterDokumen(masterDokumen);

      const tahun = kak?.kak_tahun_anggaran || '2026';
      const defaultPaket = kak?.kak_pekerjaan || kak?.kak_rekening || masterDokumen?.mdk_pekerjaan || masterDokumen?.mdk_uraian_belanja || '';
      const defaultMetode = kak?.kak_metode_pemilihan || 'e-purchasing melalui e katalog v.6';
      const defaultPagu = Number(masterDokumen?.mdk_pagu_anggaran) || totalHps || totalBiayaKak || 0;
      const defaultHps = totalHps || totalBiayaKak || 0;

      if (permohonan) {
        // Data permohonan sudah ada di database
        setPmhId(permohonan.pmh_id);
        if (permohonan.pmh_tanggal) {
          const dStr = typeof permohonan.pmh_tanggal === 'string'
            ? permohonan.pmh_tanggal.split('T')[0]
            : new Date(permohonan.pmh_tanggal).toISOString().split('T')[0];
          setPmhTanggal(dStr);
        }
        setPmhNomor(permohonan.pmh_nomor || `S.000.3.1/ BPKAD-ND/      / ${tahun}`);
        setPmhSifat(permohonan.pmh_sifat || 'Segera');
        setPmhLampiran(permohonan.pmh_lampiran || '3 (tiga)');
        setPmhHal(permohonan.pmh_hal || 'Permintaan Proses Pengadaan Barang/Jasa');

        setPmhParagraf1(permohonan.pmh_paragraf1 || '');
        setPmhKodeRup(permohonan.pmh_kode_rup || '');
        setPmhNamaPaket(permohonan.pmh_nama_paket || defaultPaket);
        setPmhPaguAnggaran(Number(permohonan.pmh_pagu_anggaran) || defaultPagu);
        setPmhHps(Number(permohonan.pmh_hps) || defaultHps);
        setPmhMetodePemilihan(permohonan.pmh_metode_pemilihan || defaultMetode);
        setPmhSumberDana(permohonan.pmh_sumber_dana || `APBD Pemerintah Kota Pekanbaru Tahun Anggaran ${tahun}`);
        setPmhParagraf2(ensureHtmlParagraf2(permohonan.pmh_paragraf2 || ''));

        setHasSavedData(true);
      } else {
        // Belum ada data permohonan, set default boilerplate cerdas sesuai dokumen BPKAD
        setPmhId(null);
        setHasSavedData(false);

        const dToday = new Date().toISOString().split('T')[0];
        setPmhTanggal(dToday);
        setPmhNomor(`S.000.3.1/ BPKAD-ND/      / ${tahun}`);
        setPmhSifat('Segera');
        setPmhLampiran('3 (tiga)');
        setPmhHal('Permintaan Proses Pengadaan Barang/Jasa');

        setPmhParagraf1(
          `Memperhatikan DPA Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru Tahun Anggaran ${tahun}, bersama ini Pejabat Pengadaan Barang/Jasa pada Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru diminta untuk melaksanakan paket Pengadaan melalui e-purchasing pada Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru dengan rincian sebagai berikut :`
        );
        setPmhKodeRup('');
        setPmhNamaPaket(defaultPaket);
        setPmhPaguAnggaran(defaultPagu);
        setPmhHps(defaultHps);
        setPmhMetodePemilihan(defaultMetode);
        setPmhSumberDana(`APBD Pemerintah Kota Pekanbaru Tahun Anggaran ${tahun}`);
        setPmhParagraf2(
          '<p>Berkaitan dengan hal tersebut di atas, bersama ini kami lampirkan Dokumen Persiapan Pengadaan (DPP), antara lain:</p><ol><li>KAK</li><li>Spesifikasi Teknis</li></ol><p>Demikian disampaikan untuk diproses lebih lanjut sesuai dengan ketentuan dan peraturan perundang-undangan yang berlaku.</p>'
        );
      }
    } else {
      showToast('error', res.message || 'Gagal memuat detail KAK.');
    }
    setLoadingPermohonan(false);
  }, []);

  useEffect(() => {
    if (selectedKakId) {
      loadPermohonanForKak(Number(selectedKakId));
    }
  }, [selectedKakId, loadPermohonanForKak]);

  const handleSelectKak = (val: number | string) => {
    const numId = Number(val);
    setSelectedKakId(numId);
  };

  // Save handler
  const handleSave = async (e?: React.FormEvent): Promise<number | null> => {
    if (e) e.preventDefault();
    if (!selectedKakId) {
      showToast('error', 'Pilih Kerangka Acuan Kerja (KAK) terlebih dahulu.');
      return null;
    }

    if (!pmhNamaPaket.trim()) {
      showToast('error', 'Nama Paket Pengadaan harus diisi.');
      return null;
    }

    setSaving(true);
    const payload: SavePermohonanPayload = {
      pmh_id: pmhId || null,
      pmh_kak_id: Number(selectedKakId),
      pmh_tanggal: pmhTanggal || null,
      pmh_nomor: pmhNomor || null,
      pmh_sifat: pmhSifat || null,
      pmh_lampiran: pmhLampiran || null,
      pmh_hal: pmhHal || null,
      pmh_paragraf1: pmhParagraf1 || null,
      pmh_kode_rup: pmhKodeRup || null,
      pmh_nama_paket: pmhNamaPaket || null,
      pmh_pagu_anggaran: Number(pmhPaguAnggaran) || 0,
      pmh_hps: Number(pmhHps) || 0,
      pmh_metode_pemilihan: pmhMetodePemilihan || null,
      pmh_sumber_dana: pmhSumberDana || null,
      pmh_paragraf2: pmhParagraf2 || null,
    };

    const res = await savePermohonanAction(payload);
    let savedPmhId: number | null = null;
    if (res.success && res.data) {
      savedPmhId = res.data.pmhId;
      setPmhId(savedPmhId);
      setHasSavedData(true);
      showToast('success', res.message || 'Nota Dinas Permohonan berhasil disimpan!');

      // Update options status
      setKakOptions((prev) =>
        prev.map((opt) => (opt.kak_id === Number(selectedKakId) ? { ...opt, has_permohonan: true } : opt))
      );
    } else {
      showToast('error', res.message || 'Gagal menyimpan Permohonan.');
    }
    setSaving(false);
    return savedPmhId;
  };

  // Print PDF in new tab
  const handlePrintPdf = async () => {
    const savedId = await handleSave();
    const targetId = savedId || pmhId;
    if (targetId) {
      window.open(`/permohonan/print/${targetId}`, '_blank');
    } else if (selectedKakId) {
      window.open(`/permohonan/print/kak-${selectedKakId}`, '_blank');
    } else {
      showToast('error', 'Simpan dokumen terlebih dahulu sebelum mencetak PDF.');
    }
  };

  // Info Pejabat PPK
  const namaPpk = selectedMasterDokumen?.mdk_nama_pejabat || 'DANIEL PERDANA, SE';
  const nipPpk = selectedMasterDokumen?.mdk_nip_pejabat || '197507242001121006';
  const jabatanPpk = selectedMasterDokumen?.mdk_jabatan_pejabat || 'Plt. Sekretaris Badan';

  return (
    <div className="p-1 sm:p-2 w-full space-y-6">
      {/* Toast Notification */}
      {notification && (
        <Toast
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Permohonan Proses Pengadaan (Nota Dinas)
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Nota Dinas Permintaan Proses Pengadaan Barang/Jasa kepada Pejabat Pengadaan berdasarkan KAK
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Tab Form vs Preview */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mr-2">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeTab === 'form'
                ? 'bg-white dark:bg-gray-900 text-brand-600 dark:text-brand-400 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
            >
              📝 Form Input
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeTab === 'preview'
                ? 'bg-white dark:bg-gray-900 text-brand-600 dark:text-brand-400 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
            >
              👁️ Preview Nota Dinas
            </button>
          </div>

          <button
            type="button"
            onClick={handlePrintPdf}
            disabled={saving}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Cetak Nota Dinas (PDF)
          </button>
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : hasSavedData ? 'Perbarui Permohonan' : 'Simpan Permohonan'}
          </button>
        </div>
      </div>

      {/* CARD 1: PILIH DOKUMEN KAK ACUAN */}
      <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Pilih Kerangka Acuan Kerja (KAK) Acuan</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Pilih data KAK untuk menarik otomatis Pekerjaan/Paket, Pagu Anggaran, HPS, Metode Pemilihan, dan Sumber Dana
            </p>
          </div>
          {hasSavedData && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 self-start sm:self-auto">
              ✓ Data Nota Dinas Tersimpan
            </span>
          )}
        </div>

        {loadingOptions ? (
          <div className="h-10 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />
        ) : (
          <SearchableSelect
            options={kakOptions.map((k) => ({
              value: k.kak_id,
              label: k.kak_pekerjaan || `Dokumen KAK #${k.kak_id}`,
              sublabel: `Metode: ${k.kak_metode_pemilihan || '-'} · [${k.has_permohonan ? '✓ Permohonan Ada' : 'Belum Ada Permohonan'}]`,
            }))}
            value={selectedKakId}
            onChange={(val) => handleSelectKak(val)}
            placeholder="-- Pilih Dokumen KAK --"
            searchPlaceholder="Cari KAK berdasarkan pekerjaan, program, atau nomor..."
            disabled={kakOptions.length === 0}
          />
        )}

        {/* Selected KAK Details Banner */}
        {selectedKak && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/70 to-indigo-50/60 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200/60 dark:border-blue-900/40 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <span className="text-gray-500 dark:text-gray-400 block font-medium">Program:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {selectedKak.kak_program || selectedMasterDokumen?.mdk_program || '-'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block font-medium">Kegiatan:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {selectedKak.kak_kegiatan || selectedMasterDokumen?.mdk_kegiatan || '-'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block font-medium">Sub Kegiatan:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {selectedKak.kak_sub_kegiatan || selectedMasterDokumen?.mdk_sub_kegiatan || '-'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block font-medium">Nama Paket / Pekerjaan:</span>
                <span className="font-bold text-brand-600 dark:text-brand-400">
                  {selectedKak.kak_pekerjaan || selectedMasterDokumen?.mdk_pekerjaan || '-'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block font-medium">Metode Pemilihan di KAK:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {selectedKak.kak_metode_pemilihan || 'e-Purchasing'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block font-medium">Tahun Anggaran:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  Tahun {selectedKak.kak_tahun_anggaran || '2026'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {loadingPermohonan ? (
        <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-500">Memuat data Permohonan Nota Dinas...</p>
        </div>
      ) : selectedKakId ? (
        activeTab === 'form' ? (
          <form onSubmit={handleSave} className="space-y-6">
            {/* CARD 2: INFORMASI NOTA DINAS (HEADER SURAT) */}
            <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                <span className="p-1.5 rounded-lg bg-brand-500 text-white text-xs">📄</span>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Header Nota Dinas
                </h3>
              </div>

              {/* Info Pengirim & Penerima Standar */}
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <span className="text-gray-400 block font-medium text-[11px]">Kepada:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      Pejabat Pengadaan BPKAD Kota Pekanbaru
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium text-[11px]">Dari:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      Pejabat Pembuat Komitmen (PPK) BPKAD Kota Pekanbaru
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block font-medium text-[11px]">Tembusan:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      Kabag Pengadaan Barang & Jasa Setda Kota Pekanbaru
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid Form Input Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Tanggal */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tanggal Surat
                  </label>
                  <input
                    type="date"
                    value={pmhTanggal}
                    onChange={(e) => setPmhTanggal(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                  />
                  <span className="text-[11px] text-gray-500 mt-0.5 block">
                    Tampilan: <span className="font-medium">{formatIndoDate(pmhTanggal)}</span>
                  </span>
                </div>

                {/* Nomor Surat */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nomor Nota Dinas
                  </label>
                  <input
                    type="text"
                    value={pmhNomor}
                    onChange={(e) => setPmhNomor(e.target.value)}
                    placeholder="Contoh: S.000.3.1/ BPKAD-ND/ 946/ 2026"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-mono focus:ring-1 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                {/* Sifat */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sifat
                  </label>
                  <input
                    type="text"
                    value={pmhSifat}
                    onChange={(e) => setPmhSifat(e.target.value)}
                    placeholder="Contoh: Segera"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {['Segera', 'Penting', 'Biasa'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setPmhSifat(s)}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${pmhSifat === s
                          ? 'bg-brand-600 text-white shadow-xs'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lampiran */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Lampiran
                  </label>
                  <input
                    type="text"
                    value={pmhLampiran}
                    onChange={(e) => setPmhLampiran(e.target.value)}
                    placeholder="Contoh: 3 (tiga)"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                {/* Hal */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Hal
                  </label>
                  <input
                    type="text"
                    value={pmhHal}
                    onChange={(e) => setPmhHal(e.target.value)}
                    placeholder="Contoh: Permintaan Proses Pengadaan Barang/Jasa"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* CARD 3: PARAGRAF PEMBUKA */}
            <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
              <label className="block text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Paragraf Pembuka Permohonan
              </label>
              <RichTextEditor
                value={pmhParagraf1}
                onChange={setPmhParagraf1}
                minHeight="100px"
                placeholder="Tulis kalimat pengantar paragraf pertama permohonan..."
              />
            </div>

            {/* CARD 4: RINCIAN PAKET PENGADAAN */}
            <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                <span className="p-1.5 rounded-lg bg-brand-500 text-white text-xs">📦</span>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  Rincian Paket Pengadaan
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Kode RUP */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Kode RUP
                  </label>
                  <input
                    type="text"
                    value={pmhKodeRup}
                    onChange={(e) => setPmhKodeRup(e.target.value)}
                    placeholder="Contoh: 66684700"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-mono focus:ring-1 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                {/* Nama Paket */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nama Paket <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={pmhNamaPaket}
                    onChange={(e) => setPmhNamaPaket(e.target.value)}
                    placeholder="Contoh: Pengadaan Routerboard"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-semibold focus:ring-1 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                {/* Pagu Anggaran */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Pagu Anggaran
                  </label>
                  <RupiahInput
                    value={pmhPaguAnggaran}
                    onChange={(val) => setPmhPaguAnggaran(Number(val) || 0)}
                    placeholder="Masukkan nilai pagu anggaran..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-mono font-semibold focus:ring-1 focus:ring-brand-500 focus:outline-none"
                  />
                  {pmhPaguAnggaran > 0 && (
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 italic">
                      ({terbilang(pmhPaguAnggaran)})
                    </p>
                  )}
                </div>

                {/* HPS */}
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    HPS (Harga Perkiraan Sendiri)
                  </label>
                  <RupiahInput
                    value={pmhHps}
                    onChange={(val) => setPmhHps(Number(val) || 0)}
                    placeholder="Masukkan nilai HPS..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-mono font-semibold focus:ring-1 focus:ring-brand-500 focus:outline-none"
                  />
                  {pmhHps > 0 && (
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 italic">
                      ({terbilang(pmhHps)})
                    </p>
                  )}
                </div>

                {/* Metode Pemilihan */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Metode Pemilihan
                  </label>
                  <input
                    type="text"
                    value={pmhMetodePemilihan}
                    onChange={(e) => setPmhMetodePemilihan(e.target.value)}
                    placeholder="Contoh: e-purchasing melalui e katalog v.6"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {['e-purchasing melalui e katalog v.6', 'Pengadaan Langsung', 'Tender', 'Penunjukan Langsung'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setPmhMetodePemilihan(m)}
                        className={`px-2 py-0.5 text-[10px] rounded-md transition-colors ${pmhMetodePemilihan === m
                          ? 'bg-brand-600 text-white font-semibold'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                          }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sumber Dana */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sumber Dana
                  </label>
                  <input
                    type="text"
                    value={pmhSumberDana}
                    onChange={(e) => setPmhSumberDana(e.target.value)}
                    placeholder="Contoh: APBD Pemerintah Kota Pekanbaru Tahun Anggaran 2026"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* CARD 5: PARAGRAF PENUTUP & LAMPIRAN */}
            <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
              <label className="block text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Paragraf Penutup &amp; Lampiran DPP
              </label>
              <RichTextEditor
                value={pmhParagraf2}
                onChange={setPmhParagraf2}
                minHeight="130px"
                placeholder="Tulis daftar lampiran DPP dan kalimat penutup..."
              />
            </div>

            {/* CARD 6: PEJABAT PENANDATANGAN (PPK) */}
            <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Pejabat Pembuat Komitmen (PPK) Penandatangan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 block font-medium text-[11px]">Nama PPK:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{namaPpk}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium text-[11px]">NIP:</span>
                  <span className="font-mono text-gray-800 dark:text-gray-200">{nipPpk}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium text-[11px]">Jabatan:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{jabatanPpk}</span>
                </div>
              </div>
            </div>

            {/* Form Actions Footer */}
            <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Pastikan seluruh informasi paket pengadaan telah sesuai sebelum mencetak Nota Dinas.
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handlePrintPdf}
                  disabled={saving}
                  className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Cetak Nota Dinas (PDF)
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Menyimpan...
                    </>
                  ) : hasSavedData ? (
                    'Perbarui Permohonan'
                  ) : (
                    'Simpan Permohonan'
                  )}
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* PREVIEW TAMPILAN NOTA DINAS MATCHING THE USER'S PDF */
          <div className="bg-white text-black p-8 sm:p-12 rounded-2xl shadow-lg border border-gray-300 font-serif max-w-[210mm] mx-auto leading-relaxed text-[13px] space-y-4">
            <style>{`
              .pmh-content ul {
                list-style-type: disc !important;
                margin-left: 1.35rem !important;
                padding-left: 0.2rem !important;
                margin-top: 0.25rem !important;
                margin-bottom: 0.25rem !important;
              }
              .pmh-content ol {
                list-style-type: decimal !important;
                margin-left: 1.35rem !important;
                padding-left: 0.2rem !important;
                margin-top: 0.25rem !important;
                margin-bottom: 0.25rem !important;
              }
              .pmh-content p {
                margin-bottom: 0.45rem !important;
                line-height: 1.6 !important;
              }
              .pmh-content li {
                margin-bottom: 0.2rem !important;
                line-height: 1.55 !important;
              }
            `}</style>
            {/* Kop Surat */}
            <KopSuratBpkad />

            {/* Judul */}
            <div className="text-center pt-2 pb-4">
              <h2 className="font-extrabold text-base uppercase tracking-wider underline">
                NOTA DINAS
              </h2>
            </div>

            {/* Metadata Table */}
            <table className="w-full text-[13px] border-collapse leading-snug">
              <tbody>
                <tr>
                  <td className="w-28 py-1 align-top">Kepada</td>
                  <td className="w-4 py-1 align-top text-center">:</td>
                  <td className="py-1 align-top">
                    Pejabat Pengadaan Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru
                  </td>
                </tr>
                <tr>
                  <td className="py-1 align-top">Dari</td>
                  <td className="py-1 align-top text-center">:</td>
                  <td className="py-1 align-top">
                    Pejabat Pembuat Komitmen Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru
                  </td>
                </tr>
                <tr>
                  <td className="py-1 align-top">Tembusan</td>
                  <td className="py-1 align-top text-center">:</td>
                  <td className="py-1 align-top">
                    Kepala Bagian Pengadaan Barang dan Jasa Sekretariat Daerah Kota Pekanbaru
                  </td>
                </tr>
                <tr>
                  <td className="py-1 align-top">Tanggal</td>
                  <td className="py-1 align-top text-center">:</td>
                  <td className="py-1 align-top">{formatIndoDate(pmhTanggal)}</td>
                </tr>
                <tr>
                  <td className="py-1 align-top">Nomor</td>
                  <td className="py-1 align-top text-center">:</td>
                  <td className="py-1 align-top font-mono">{pmhNomor || '-'}</td>
                </tr>
                <tr>
                  <td className="py-1 align-top">Sifat</td>
                  <td className="py-1 align-top text-center">:</td>
                  <td className="py-1 align-top">{pmhSifat || 'Segera'}</td>
                </tr>
                <tr>
                  <td className="py-1 align-top">Lampiran</td>
                  <td className="py-1 align-top text-center">:</td>
                  <td className="py-1 align-top">{pmhLampiran || '3 (tiga)'}</td>
                </tr>
                <tr>
                  <td className="py-1 align-top">Hal</td>
                  <td className="py-1 align-top text-center">:</td>
                  <td className="py-1 align-top font-semibold">{pmhHal || 'Permintaan Proses Pengadaan Barang/Jasa'}</td>
                </tr>
              </tbody>
            </table>

            {/* Paragraf 1 */}
            <p className="text-justify leading-relaxed pt-2">
              {pmhParagraf1}
            </p>

            {/* Rincian Paket */}
            <div className="pl-6 py-2">
              <table className="w-full text-[13px] border-collapse leading-snug">
                <tbody>
                  <tr>
                    <td className="w-40 py-1.5 align-top">Kode RUP</td>
                    <td className="w-4 py-1.5 align-top text-center">:</td>
                    <td className="py-1.5 align-top font-mono">{pmhKodeRup || '-'}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 align-top">Nama Paket</td>
                    <td className="py-1.5 align-top text-center">:</td>
                    <td className="py-1.5 align-top font-semibold">{pmhNamaPaket || '-'}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 align-top">Pagu Anggaran</td>
                    <td className="py-1.5 align-top text-center">:</td>
                    <td className="py-1.5 align-top">
                      <span className="font-mono font-semibold">{formatRupiah(pmhPaguAnggaran)}</span>
                      {pmhPaguAnggaran > 0 && (
                        <p className="italic text-[12px] text-gray-700 mt-0.5">({terbilang(pmhPaguAnggaran)})</p>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 align-top">HPS</td>
                    <td className="py-1.5 align-top text-center">:</td>
                    <td className="py-1.5 align-top">
                      <span className="font-mono font-semibold">{formatRupiah(pmhHps)}</span>
                      {pmhHps > 0 && (
                        <p className="italic text-[12px] text-gray-700 mt-0.5">({terbilang(pmhHps)})</p>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1.5 align-top">Metode Pemilihan</td>
                    <td className="py-1.5 align-top text-center">:</td>
                    <td className="py-1.5 align-top">{pmhMetodePemilihan || '-'}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 align-top">Sumber Dana</td>
                    <td className="py-1.5 align-top text-center">:</td>
                    <td className="py-1.5 align-top">{pmhSumberDana || '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Paragraf 2 */}
            <div
              className="text-justify leading-relaxed pmh-content pt-2"
              dangerouslySetInnerHTML={{ __html: ensureHtmlParagraf2(pmhParagraf2) }}
            />

            {/* Tanda Tangan PPK */}
            <div className="pt-8 flex justify-end">
              <div className="w-80 text-left text-[12px] space-y-1">
                <div>
                  Pekanbaru, {formatIndoDate(pmhTanggal)}
                </div>
                <div>
                  <p className="font-semibold">{jabatanPpk}</p>
                  <p className="font-semibold">Pengelola Keuangan dan Aset Daerah</p>
                  <p className="font-semibold">Kota Pekanbaru</p>
                  <p className="font-semibold">Selaku Pejabat Pembuat Komitmen,</p>
                </div>
                <div className="pt-20">
                  <p className="font-bold underline uppercase text-sm">{namaPpk}</p>
                  <p className="text-[11px] font-mono mt-0.5">NIP. {nipPpk}</p>
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 text-gray-500">
          Silakan pilih dokumen Kerangka Acuan Kerja (KAK) di atas untuk mengisi Surat Permohonan (Nota Dinas).
        </div>
      )}
    </div>
  );
};

