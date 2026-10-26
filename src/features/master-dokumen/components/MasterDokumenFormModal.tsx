"use client";

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { MasterDokumen, CreateMasterDokumenInput, UpdateMasterDokumenInput } from '../types';
import { getPegawaiListAction } from '@/features/pegawai/actions';
import { Pegawai } from '@/features/pegawai/types';
import { getPerusahaanListAction } from '@/features/perusahaan/actions';
import { Perusahaan } from '@/features/perusahaan/types';
import { getBidangListAction } from '@/features/bidang/actions';
import { Bidang } from '@/features/bidang/types';
import { RupiahInput } from '@/components/form/RupiahInput';
import { SearchableSelect } from '@/components/form/SearchableSelect';
import { BpkadApiService, Program, Kegiatan, SubKegiatan, RekeningBelanja } from '@/services/bpkadApiService';

interface MasterDokumenFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMasterDokumenInput | UpdateMasterDokumenInput) => Promise<void>;
  initialData?: MasterDokumen | null;
  loading: boolean;
}

export const MasterDokumenFormModal: React.FC<MasterDokumenFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading,
}) => {
  const [activeTab, setActiveTab] = useState(1);

  // Pegawai & Perusahaan options state
  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>([]);
  const [perusahaanList, setPerusahaanList] = useState<Perusahaan[]>([]);
  const [bidangList, setBidangList] = useState<Bidang[]>([]);
  const [loadingPegawai, setLoadingPegawai] = useState(false);

  // BPKAD API options state & loading per level
  const [programList, setProgramList] = useState<Program[]>([]);
  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
  const [subKegiatanList, setSubKegiatanList] = useState<SubKegiatan[]>([]);
  const [rekeningBelanjaList, setRekeningBelanjaList] = useState<RekeningBelanja[]>([]);

  const [loadingProgram, setLoadingProgram] = useState(false);
  const [loadingKegiatan, setLoadingKegiatan] = useState(false);
  const [loadingSubKegiatan, setLoadingSubKegiatan] = useState(false);
  const [loadingRekBel, setLoadingRekBel] = useState(false);

  // Form states matching all 24 mdk_* fields
  const [mdkNamaPejabatId, setMdkNamaPejabatId] = useState<number | string>(0);
  const [mdkBidangId, setMdkBidangId] = useState(0);
  const [mdkPaguAnggaran, setMdkPaguAnggaran] = useState<number | string>(0);

  const [mdkNamaPejabatPengadaanId, setMdkNamaPejabatPengadaanId] = useState<number | string>(0);
  const [mdkNamaPptk, setMdkNamaPptk] = useState(0);
  const [mdkNamaBendaharaId, setMdkNamaBendaharaId] = useState<number | string>(0);

  const [mdkNamaPerusahaanId, setMdkNamaPerusahaanId] = useState<number | string>(0);
  const [mdkNamaPimpinanPerusahaan, setMdkNamaPimpinanPerusahaan] = useState('');
  const [mdkJabatanPimpinanPerusahaan, setMdkJabatanPimpinanPerusahaan] = useState('');
  const [mdkAlamat, setMdkAlamat] = useState('');
  const [mdkPekerjaan, setMdkPekerjaan] = useState('');

  const [mdkKodeProgram, setMdkKodeProgram] = useState('');
  const [mdkProgram, setMdkProgram] = useState('');
  const [mdkKodeKegiatan, setMdkKodeKegiatan] = useState('');
  const [mdkKegiatan, setMdkKegiatan] = useState('');
  const [mdkKodeSubKegiatan, setMdkKodeSubKegiatan] = useState('');
  const [mdkSubKegiatan, setMdkSubKegiatan] = useState('');

  const [mdkUraianBelanja, setMdkUraianBelanja] = useState('');
  const [mdkRekeningBelanja, setMdkRekeningBelanja] = useState('');
  const [mdkKodeLevel1, setMdkKodeLevel1] = useState('');
  const [mdkNamaLevel1, setMdkNamaLevel1] = useState('');
  const [mdkKodeLevel2, setMdkKodeLevel2] = useState('');
  const [mdkNamaLevel2, setMdkNamaLevel2] = useState('');
  const [mdkKodeLevel3, setMdkKodeLevel3] = useState('');
  const [mdkNamaLevel3, setMdkNamaLevel3] = useState('');
  const [mdkKodeLevel4, setMdkKodeLevel4] = useState('');
  const [mdkNamaLevel4, setMdkNamaLevel4] = useState('');
  const [mdkKodeLevel5, setMdkKodeLevel5] = useState('');
  const [mdkNamaLevel5, setMdkNamaLevel5] = useState('');

  const [mdkApbd, setMdkApbd] = useState('');
  const [mdkNoDpa, setMdkNoDpa] = useState('');
  const [mdkVolume, setMdkVolume] = useState('');
  const [mdkSatuan, setMdkSatuan] = useState('');
  const [mdkKeterangan, setMdkKeterangan] = useState('');

  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setMdkNamaPejabatId(initialData.mdk_nama_pejabat_id ?? 0);
      setMdkBidangId(initialData.mdk_bidang_id || 0);
      setMdkPaguAnggaran(initialData.mdk_pagu_anggaran ?? 0);

      setMdkNamaPejabatPengadaanId(initialData.mdk_nama_pejabat_pengadaan_id ?? 0);
      setMdkNamaPptk(initialData.mdk_nama_pptk_id || 0);
      setMdkNamaBendaharaId(initialData.mdk_nama_bendahara_id ?? 0);

      setMdkNamaPerusahaanId(initialData.mdk_nama_perusahaan_id ?? 0);
      setMdkNamaPimpinanPerusahaan(initialData.mdk_nama_pimpinan_perusahaan || '');
      setMdkJabatanPimpinanPerusahaan(initialData.mdk_jabatan_pimpinan_perusahaan || '');
      setMdkAlamat(initialData.mdk_alamat || '');
      setMdkPekerjaan(initialData.mdk_pekerjaan || '');

      setMdkKodeProgram(initialData.mdk_kode_program || '');
      setMdkProgram(initialData.mdk_program || '');
      setMdkKodeKegiatan(initialData.mdk_kode_kegiatan || '');
      setMdkKegiatan(initialData.mdk_kegiatan || '');
      setMdkKodeSubKegiatan(initialData.mdk_kode_sub_kegiatan || '');
      setMdkSubKegiatan(initialData.mdk_sub_kegiatan || '');

      setMdkUraianBelanja(initialData.mdk_uraian_belanja || '');
      setMdkRekeningBelanja(initialData.mdk_rekening_belanja || '');
      setMdkKodeLevel1(initialData.mdk_kode_level1 || '');
      setMdkNamaLevel1(initialData.mdk_nama_level1 || '');
      setMdkKodeLevel2(initialData.mdk_kode_level2 || '');
      setMdkNamaLevel2(initialData.mdk_nama_level2 || '');
      setMdkKodeLevel3(initialData.mdk_kode_level3 || '');
      setMdkNamaLevel3(initialData.mdk_nama_level3 || '');
      setMdkKodeLevel4(initialData.mdk_kode_level4 || '');
      setMdkNamaLevel4(initialData.mdk_nama_level4 || '');
      setMdkKodeLevel5(initialData.mdk_kode_level5 || '');
      setMdkNamaLevel5(initialData.mdk_nama_level5 || '');
      setMdkApbd(initialData.mdk_apbd || '');
      setMdkNoDpa(initialData.mdk_no_dpa || '');
      setMdkVolume(initialData.mdk_volume || '');
      setMdkSatuan(initialData.mdk_satuan || '');
      setMdkKeterangan(initialData.mdk_keterangan || '');
    } else {
      setMdkNamaPejabatId(0);
      setMdkBidangId(0);
      setMdkPaguAnggaran(0);

      setMdkNamaPejabatPengadaanId(0);
      setMdkNamaPptk(0);
      setMdkNamaBendaharaId(0);

      setMdkNamaPerusahaanId(0);
      setMdkNamaPimpinanPerusahaan('');
      setMdkJabatanPimpinanPerusahaan('');
      setMdkAlamat('');
      setMdkPekerjaan('');

      setMdkKodeProgram('');
      setMdkProgram('');
      setMdkKodeKegiatan('');
      setMdkKegiatan('');
      setMdkKodeSubKegiatan('');
      setMdkSubKegiatan('');

      setMdkUraianBelanja('');
      setMdkRekeningBelanja('');
      setMdkKodeLevel1('');
      setMdkNamaLevel1('');
      setMdkKodeLevel2('');
      setMdkNamaLevel2('');
      setMdkKodeLevel3('');
      setMdkNamaLevel3('');
      setMdkKodeLevel4('');
      setMdkNamaLevel4('');
      setMdkKodeLevel5('');
      setMdkNamaLevel5('');
      setMdkApbd('APBD Kota Pekanbaru Tahun 2026');
      setMdkNoDpa('');
      setMdkVolume('');
      setMdkSatuan('');
      setMdkKeterangan('');
    }
    setActiveTab(1);
    setError('');
  }, [initialData, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    // ── Fetch data internal (Pegawai, Perusahaan, Bidang) ──────────────────
    const fetchInternalOptions = async () => {
      setLoadingPegawai(true);
      try {
        const [pegawaiRes, perusahaanRes, bidangRes] = await Promise.allSettled([
          getPegawaiListAction('', 1, 500),
          getPerusahaanListAction('', 1, 500),
          getBidangListAction('', 1, 500),
        ]);

        if (pegawaiRes.status === 'fulfilled' && pegawaiRes.value.success && pegawaiRes.value.data) {
          setPegawaiList(pegawaiRes.value.data.data);
        }
        if (perusahaanRes.status === 'fulfilled' && perusahaanRes.value.success && perusahaanRes.value.data) {
          setPerusahaanList(perusahaanRes.value.data.data);
        }
        if (bidangRes.status === 'fulfilled' && bidangRes.value.success && bidangRes.value.data) {
          setBidangList(bidangRes.value.data.data);
        }
      } catch (err) {
        console.error('Gagal mengambil data internal:', err);
      } finally {
        setLoadingPegawai(false);
      }
    };

    // ── Fetch Program dari BPKAD API saat modal dibuka ──────────────────────
    const fetchProgram = async () => {
      setLoadingProgram(true);
      try {
        const data = await BpkadApiService.getProgram();
        setProgramList(data);
      } catch (err) {
        console.error('Gagal mengambil data program BPKAD:', err);
      } finally {
        setLoadingProgram(false);
      }
    };

    fetchInternalOptions();
    fetchProgram();
  }, [isOpen]);

  // ── Fetch Kegiatan saat mdkKodeProgram terisi/berubah ────────────────────
  useEffect(() => {
    if (!isOpen || !mdkKodeProgram) {
      setKegiatanList([]);
      return;
    }

    const fetchKegiatan = async () => {
      setLoadingKegiatan(true);
      try {
        const data = await BpkadApiService.getKegiatan(mdkKodeProgram);
        setKegiatanList(data);
      } catch (err) {
        console.error('Gagal mengambil kegiatan BPKAD:', err);
        setKegiatanList([]);
      } finally {
        setLoadingKegiatan(false);
      }
    };

    fetchKegiatan();
  }, [isOpen, mdkKodeProgram]);

  // ── Fetch Sub Kegiatan saat mdkKodeKegiatan terisi/berubah ───────────────
  useEffect(() => {
    if (!isOpen || !mdkKodeKegiatan) {
      setSubKegiatanList([]);
      return;
    }

    const fetchSubKegiatan = async () => {
      setLoadingSubKegiatan(true);
      try {
        const data = await BpkadApiService.getSubKegiatan(mdkKodeKegiatan);
        setSubKegiatanList(data);
      } catch (err) {
        console.error('Gagal mengambil sub kegiatan BPKAD:', err);
        setSubKegiatanList([]);
      } finally {
        setLoadingSubKegiatan(false);
      }
    };

    fetchSubKegiatan();
  }, [isOpen, mdkKodeKegiatan]);

  // ── Fetch Rekening Belanja saat mdkKodeSubKegiatan terisi/berubah ────────
  useEffect(() => {
    if (!isOpen || !mdkKodeSubKegiatan) {
      setRekeningBelanjaList([]);
      return;
    }

    const fetchRekBel = async () => {
      setLoadingRekBel(true);
      try {
        const data = await BpkadApiService.getRekeningBelanja(mdkKodeSubKegiatan);
        setRekeningBelanjaList(data);
      } catch (err) {
        console.error('Gagal mengambil rekening belanja BPKAD:', err);
        setRekeningBelanjaList([]);
      } finally {
        setLoadingRekBel(false);
      }
    };

    fetchRekBel();
  }, [isOpen, mdkKodeSubKegiatan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let finalUraianBelanja = mdkUraianBelanja.trim();
    if (mdkRekeningBelanja) {
      const foundRek = rekeningBelanjaList.find((r) => r.KODE_REKENING === mdkRekeningBelanja);
      if (foundRek?.NAMA_REKENING) {
        finalUraianBelanja = foundRek.NAMA_REKENING.trim();
      }
    }

    const payload = {
      mdk_nama_pejabat_id: Number(mdkNamaPejabatId) || 0,
      mdk_bidang_id: Number(mdkBidangId) || 0,
      mdk_pagu_anggaran: Number(mdkPaguAnggaran) || 0,
      mdk_nama_pejabat_pengadaan_id: Number(mdkNamaPejabatPengadaanId) || 0,
      mdk_nama_pptk_id: Number(mdkNamaPptk) || 0,
      mdk_nama_bendahara_id: Number(mdkNamaBendaharaId) || 0,
      mdk_nama_perusahaan_id: Number(mdkNamaPerusahaanId) || 0,
      mdk_nama_pimpinan_perusahaan: mdkNamaPimpinanPerusahaan.trim(),
      mdk_jabatan_pimpinan_perusahaan: mdkJabatanPimpinanPerusahaan.trim(),
      mdk_pekerjaan: mdkPekerjaan.trim(),
      mdk_alamat: mdkAlamat.trim(),
      mdk_program: mdkProgram.trim(),
      mdk_kode_program: mdkKodeProgram.trim(),
      mdk_kegiatan: mdkKegiatan.trim(),
      mdk_kode_kegiatan: mdkKodeKegiatan.trim(),
      mdk_sub_kegiatan: mdkSubKegiatan.trim(),
      mdk_kode_sub_kegiatan: mdkKodeSubKegiatan.trim(),
      mdk_uraian_belanja: finalUraianBelanja,
      mdk_rekening_belanja: mdkRekeningBelanja.trim(),
      mdk_kode_level1: mdkKodeLevel1.trim(),
      mdk_nama_level1: mdkNamaLevel1.trim(),
      mdk_kode_level2: mdkKodeLevel2.trim(),
      mdk_nama_level2: mdkNamaLevel2.trim(),
      mdk_kode_level3: mdkKodeLevel3.trim(),
      mdk_nama_level3: mdkNamaLevel3.trim(),
      mdk_kode_level4: mdkKodeLevel4.trim(),
      mdk_nama_level4: mdkNamaLevel4.trim(),
      mdk_kode_level5: mdkKodeLevel5.trim(),
      mdk_nama_level5: mdkNamaLevel5.trim(),
      mdk_keterangan: mdkKeterangan.trim(),
      mdk_apbd: mdkApbd.trim(),
      mdk_no_dpa: mdkNoDpa.trim(),
      mdk_volume: mdkVolume.trim(),
      mdk_satuan: mdkSatuan.trim(),
    };

    try {
      if (initialData) {
        await onSubmit({
          mdk_id: initialData.mdk_id,
          ...payload,
        });
      } else {
        await onSubmit(payload);
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan data master dokumen.');
    }
  };

  const tabs = [
    { id: 1, label: 'Program & Kegiatan', icon: '📊' },
    { id: 2, label: 'Rincian Belanja & DPA', icon: '📝' },
    { id: 3, label: 'Pejabat & Bagian', icon: '👤' },
    { id: 4, label: 'Tim Pengadaan & PPTK', icon: '👥' },
    { id: 5, label: 'Perusahaan / Penyedia', icon: '🏢' },

  ];

  const formatRupiah = (val: number | string) => {
    const num = Number(val) || 0;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  const renderProgramSummary = () => (
    <div className="bg-gray-50/80 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700/70 rounded-2xl p-4 space-y-3.5 h-fit sticky top-0">
      <div className="flex items-center gap-2 pb-2.5 border-b border-gray-200 dark:border-gray-700/70">
        <span className="text-base">📌</span>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          Ringkasan Program & Anggaran
        </h4>
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <span className="text-gray-400 dark:text-gray-500 font-semibold block text-[10px] uppercase tracking-wider mb-0.5">
            Program
          </span>
          <p className="font-medium text-gray-800 dark:text-gray-200 leading-snug">
            {mdkKodeProgram ? (
              <>
                <span className="font-mono text-brand-600 dark:text-brand-400 font-semibold">{mdkKodeProgram}</span>
                <span className="mx-1.5 text-gray-300 dark:text-gray-600">•</span>
                <span>{mdkProgram}</span>
              </>
            ) : (
              <span className="text-gray-400 italic text-[11px]">Belum dipilih (Tab 1)</span>
            )}
          </p>
        </div>

        <div>
          <span className="text-gray-400 dark:text-gray-500 font-semibold block text-[10px] uppercase tracking-wider mb-0.5">
            Kegiatan
          </span>
          <p className="font-medium text-gray-800 dark:text-gray-200 leading-snug">
            {mdkKodeKegiatan ? (
              <>
                <span className="font-mono text-brand-600 dark:text-brand-400 font-semibold">{mdkKodeKegiatan}</span>
                <span className="mx-1.5 text-gray-300 dark:text-gray-600">•</span>
                <span>{mdkKegiatan}</span>
              </>
            ) : (
              <span className="text-gray-400 italic text-[11px]">Belum dipilih (Tab 1)</span>
            )}
          </p>
        </div>

        <div>
          <span className="text-gray-400 dark:text-gray-500 font-semibold block text-[10px] uppercase tracking-wider mb-0.5">
            Sub Kegiatan
          </span>
          <p className="font-medium text-gray-800 dark:text-gray-200 leading-snug">
            {mdkKodeSubKegiatan ? (
              <>
                <span className="font-mono text-brand-600 dark:text-brand-400 font-semibold">{mdkKodeSubKegiatan}</span>
                <span className="mx-1.5 text-gray-300 dark:text-gray-600">•</span>
                <span>{mdkSubKegiatan}</span>
              </>
            ) : (
              <span className="text-gray-400 italic text-[11px]">Belum dipilih (Tab 1)</span>
            )}
          </p>
        </div>

        <div>
          <span className="text-gray-400 dark:text-gray-500 font-semibold block text-[10px] uppercase tracking-wider mb-0.5">
            Rekening Belanja
          </span>
          <p className="font-medium text-gray-800 dark:text-gray-200 leading-snug">
            {mdkRekeningBelanja ? (
              <>
                <span className="font-mono text-brand-600 dark:text-brand-400 font-semibold">{mdkRekeningBelanja}</span>
                {mdkUraianBelanja && (
                  <span className="block text-[11px] text-gray-600 dark:text-gray-400 mt-0.5 font-normal">
                    {mdkUraianBelanja}
                  </span>
                )}
              </>
            ) : (
              <span className="text-gray-400 italic text-[11px]">Belum dipilih (Tab 2)</span>
            )}
          </p>
        </div>

        <div className="pt-2.5 border-t border-gray-200 dark:border-gray-700/70">
          <span className="text-gray-400 dark:text-gray-500 font-semibold block text-[10px] uppercase tracking-wider mb-0.5">
            Pagu Anggaran
          </span>
          <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            {formatRupiah(mdkPaguAnggaran)}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-5xl p-6 lg:p-8">
      <div className="flex flex-col h-full max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400 font-semibold shadow-xs">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {initialData ? 'Edit Master Dokumen' : 'Tambah Master Dokumen'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Isi rincian informasi data master dokumen secara lengkap.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
            Langkah {activeTab} dari {tabs.length}
          </span>
        </div>

        {/* Tab Header Navigation */}
        <div className="flex overflow-x-auto gap-2 py-3 border-b border-gray-100 dark:border-gray-800 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${activeTab === tab.id
                ? 'bg-brand-500 text-white shadow-xs font-semibold'
                : 'bg-gray-100 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-3 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm dark:bg-red-900/30 dark:border-red-800 dark:text-red-300 flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Form Body with Scroll */}
        <form id="master-dokumen-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* TAB 1: Program & Kegiatan */}
          {activeTab === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3 bg-brand-50/50 dark:bg-brand-900/10 rounded-xl text-xs text-brand-700 dark:text-brand-300 font-medium">
                📊 Bagian 1: Pengodean & Struktur Program Kegiatan
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Program */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Program
                  </label>
                  {loadingProgram && (
                    <div className="flex items-center gap-2 text-xs text-brand-600 dark:text-brand-400 mb-1.5">
                      <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Memuat data program BPKAD...
                    </div>
                  )}
                  <SearchableSelect
                    placeholder={loadingProgram ? 'Memuat data program...' : 'Pilih Program...'}
                    searchPlaceholder="Cari kode atau nama program..."
                    disabled={loadingProgram}
                    value={mdkKodeProgram}
                    options={programList.map((p) => ({
                      value: p.KODE_PROGRAM,
                      label: p.NAMA_PROGRAM,
                      sublabel: p.KODE_PROGRAM,
                    }))}
                    onChange={(val: string) => {
                      const found = programList.find((p) => p.KODE_PROGRAM === val);
                      setMdkKodeProgram(val);
                      setMdkProgram(found?.NAMA_PROGRAM ?? '');
                      // Reset turunan (Kegiatan, Sub Kegiatan, Rekening Belanja)
                      setMdkKodeKegiatan('');
                      setMdkKegiatan('');
                      setMdkKodeSubKegiatan('');
                      setMdkSubKegiatan('');
                      setMdkRekeningBelanja('');
                      setRekeningBelanjaList([]);
                    }}
                  />
                  {mdkKodeProgram && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Kode: <span className="font-mono font-medium">{mdkKodeProgram}</span>
                    </p>
                  )}
                </div>

                {/* Kegiatan (Dependent pada Program via POST API BPKAD) */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Kegiatan
                    {!mdkKodeProgram && (
                      <span className="ml-2 text-gray-400 dark:text-gray-500 font-normal">
                        (Pilih Program terlebih dahulu)
                      </span>
                    )}
                  </label>
                  {loadingKegiatan && (
                    <div className="flex items-center gap-2 text-xs text-brand-600 dark:text-brand-400 mb-1.5">
                      <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Memuat kegiatan dari BPKAD...
                    </div>
                  )}
                  <SearchableSelect
                    placeholder={
                      !mdkKodeProgram
                        ? 'Pilih Program terlebih dahulu...'
                        : loadingKegiatan
                          ? 'Memuat kegiatan...'
                          : 'Pilih Kegiatan...'
                    }
                    searchPlaceholder="Cari kode atau nama kegiatan..."
                    disabled={loadingKegiatan || !mdkKodeProgram}
                    value={mdkKodeKegiatan}
                    options={kegiatanList.map((k) => ({
                      value: k.KODE_KEGIATAN,
                      label: k.NAMA_KEGIATAN,
                      sublabel: `${k.KODE_KEGIATAN}${k.PAGU ? ` · Pagu: Rp ${Number(k.PAGU).toLocaleString('id-ID')}` : ''}`,
                    }))}
                    onChange={(val: string) => {
                      const found = kegiatanList.find((k) => k.KODE_KEGIATAN === val);
                      setMdkKodeKegiatan(val);
                      setMdkKegiatan(found?.NAMA_KEGIATAN ?? '');
                      // Reset turunan (Sub Kegiatan, Rekening Belanja)
                      setMdkKodeSubKegiatan('');
                      setMdkSubKegiatan('');
                      setMdkRekeningBelanja('');
                      setRekeningBelanjaList([]);
                    }}
                  />
                  {mdkKodeKegiatan && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Kode: <span className="font-mono font-medium">{mdkKodeKegiatan}</span>
                    </p>
                  )}
                </div>

                {/* Sub Kegiatan (Dependent pada Kegiatan via POST API BPKAD) */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sub Kegiatan
                    {!mdkKodeKegiatan && (
                      <span className="ml-2 text-gray-400 dark:text-gray-500 font-normal">
                        (Pilih Kegiatan terlebih dahulu)
                      </span>
                    )}
                  </label>
                  {loadingSubKegiatan && (
                    <div className="flex items-center gap-2 text-xs text-brand-600 dark:text-brand-400 mb-1.5">
                      <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Memuat sub kegiatan dari BPKAD...
                    </div>
                  )}
                  <SearchableSelect
                    placeholder={
                      !mdkKodeKegiatan
                        ? 'Pilih Kegiatan terlebih dahulu...'
                        : loadingSubKegiatan
                          ? 'Memuat sub kegiatan...'
                          : 'Pilih Sub Kegiatan...'
                    }
                    searchPlaceholder="Cari kode atau nama sub kegiatan..."
                    disabled={loadingSubKegiatan || !mdkKodeKegiatan}
                    value={mdkKodeSubKegiatan}
                    options={subKegiatanList.map((sk) => ({
                      value: sk.KODE_SUB_KEGIATAN,
                      label: sk.NAMA_SUB_KEGIATAN,
                      sublabel: `${sk.KODE_SUB_KEGIATAN}${sk.PAGU ? ` · Pagu: Rp ${Number(sk.PAGU).toLocaleString('id-ID')}` : ''}`,
                    }))}
                    onChange={(val: string) => {
                      const found = subKegiatanList.find((sk) => sk.KODE_SUB_KEGIATAN === val);
                      setMdkKodeSubKegiatan(val);
                      setMdkSubKegiatan(found?.NAMA_SUB_KEGIATAN ?? '');
                      // Reset rekening belanja karena berubah berdasarkan sub kegiatan
                      setMdkRekeningBelanja('');
                      setRekeningBelanjaList([]);
                    }}
                  />
                  {mdkKodeSubKegiatan && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Kode: <span className="font-mono font-medium">{mdkKodeSubKegiatan}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Rincian Belanja & DPA */}
          {activeTab === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3 bg-brand-50/50 dark:bg-brand-900/10 rounded-xl text-xs text-brand-700 dark:text-brand-300 font-medium">
                📝 Bagian 2: Uraian Belanja, Rekening, APBD & Dokumen DPA
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Rekening Belanja
                    {!mdkKodeSubKegiatan && (
                      <span className="ml-2 text-gray-400 dark:text-gray-500 font-normal">
                        ⚠ Pilih Sub Kegiatan terlebih dahulu (Tab 1)
                      </span>
                    )}
                  </label>
                  {loadingRekBel && (
                    <div className="flex items-center gap-2 text-xs text-brand-600 dark:text-brand-400 mb-1.5">
                      <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Mengambil rekening belanja untuk sub kegiatan terpilih...
                    </div>
                  )}
                  <SearchableSelect
                    placeholder={
                      !mdkKodeSubKegiatan
                        ? 'Pilih Sub Kegiatan dulu di Tab 1...'
                        : loadingRekBel
                          ? 'Memuat data rekening...'
                          : 'Pilih Rekening Belanja...'
                    }
                    searchPlaceholder="Cari kode atau nama rekening..."
                    disabled={!mdkKodeSubKegiatan || loadingRekBel}
                    value={mdkRekeningBelanja}
                    options={rekeningBelanjaList.map((r) => ({
                      value: r.KODE_REKENING,
                      label: r.NAMA_REKENING,
                      sublabel: `${r.KODE_REKENING} · Pagu: Rp ${Number(r.PAGU).toLocaleString('id-ID')}`,
                    }))}
                    onChange={(val: string) => {
                      const found = rekeningBelanjaList.find((r) => r.KODE_REKENING === val);
                      setMdkRekeningBelanja(val);
                      if (found) {
                        setMdkUraianBelanja(found.NAMA_REKENING || '');
                        if (found.PAGU) {
                          setMdkPaguAnggaran(Number(found.PAGU) || 0);
                        }
                        setMdkKodeLevel1(found.KODE_LEVEL_I || '');
                        setMdkNamaLevel1(found.NAMA_LEVEL_I || '');
                        setMdkKodeLevel2(found.KODE_LEVEL_II || '');
                        setMdkNamaLevel2(found.NAMA_LEVEL_II || '');
                        setMdkKodeLevel3(found.KODE_LEVEL_III || '');
                        setMdkNamaLevel3(found.NAMA_LEVEL_III || '');
                        setMdkKodeLevel4(found.KODE_LEVEL_IV || '');
                        setMdkNamaLevel4(found.NAMA_LEVEL_IV || '');
                        setMdkKodeLevel5(found.KODE_LEVEL_V || '');
                        setMdkNamaLevel5(found.NAMA_LEVEL_V || '');
                      } else {
                        setMdkKodeLevel1('');
                        setMdkNamaLevel1('');
                        setMdkKodeLevel2('');
                        setMdkNamaLevel2('');
                        setMdkKodeLevel3('');
                        setMdkNamaLevel3('');
                        setMdkKodeLevel4('');
                        setMdkNamaLevel4('');
                        setMdkKodeLevel5('');
                        setMdkNamaLevel5('');
                      }
                    }}
                  />
                  {mdkRekeningBelanja && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Kode: <span className="font-mono font-medium">{mdkRekeningBelanja}</span>
                      {mdkUraianBelanja && (
                        <span className="ml-2">
                          · Uraian: <span className="font-medium text-gray-700 dark:text-gray-300">{mdkUraianBelanja}</span>
                        </span>
                      )}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    APBD / Tahun Anggaran
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: APBD 2026 / APBD-P 2026"
                    value={mdkApbd}
                    onChange={(e) => setMdkApbd(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nomor DPA / Dokumen Pelaksanaan Anggaran
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan Nomor DPA"
                    value={mdkNoDpa}
                    onChange={(e) => setMdkNoDpa(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Pekerjaan
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Pekerjaan"
                    value={mdkPekerjaan}
                    onChange={(e) => setMdkPekerjaan(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Keterangan Tambahan
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Catatan / keterangan tambahan"
                    value={mdkKeterangan}
                    onChange={(e) => setMdkKeterangan(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Volume
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan Volume"
                    value={mdkVolume}
                    onChange={(e) => setMdkVolume(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Satuan
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan Satuan"
                    value={mdkSatuan}
                    onChange={(e) => setMdkSatuan(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Pejabat & Bagian */}
          {activeTab === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3 bg-brand-50/50 dark:bg-brand-900/10 rounded-xl text-xs text-brand-700 dark:text-brand-300 font-medium">
                👤 Bagian 3: Informasi Pejabat Utama & Pagu Anggaran
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Ringkasan Program & Anggaran (Kanan) */}
                <div className="lg:col-span-5">
                  {renderProgramSummary()}
                </div>
                {/* Form Input (Kiri) */}
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nama Pejabat Utama
                    </label>
                    <SearchableSelect
                      options={pegawaiList
                        .filter((pgw) => pgw.pgw_status_pegawai === 0)
                        .map((pgw) => ({
                          value: pgw.pgw_id,
                          label: pgw.pgw_nama + ` (${pgw.pgw_nip})`,
                          sublabel: `(${pgw.pgw_jabatan})`,
                        }))}
                      value={mdkNamaPejabatId}
                      onChange={(val) => setMdkNamaPejabatId(Number(val))}
                      placeholder="-- Pilih Pejabat Utama --"
                      searchPlaceholder="Cari berdasarkan nama..."
                      disabled={pegawaiList.length === 0}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nama Bagian / SKPD <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={mdkBidangId}
                      onChange={(e) => setMdkBidangId(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
                    >
                      <option value={0}>-- Pilih Bidang/Bagian --</option>
                      {bidangList.map((bid) => (
                        <option key={bid.bdg_id} value={bid.bdg_id}>
                          {bid.bdg_nama}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                        Pagu Anggaran (Rp)
                      </label>
                    </div>
                    <RupiahInput
                      placeholder="Masukkan Nilai Pagu (contoh: 50000000)"
                      value={mdkPaguAnggaran}
                      onChange={(value) => setMdkPaguAnggaran(value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
                    />
                  </div>
                </div>


              </div>
            </div>
          )}

          {/* TAB 4: Tim Pengadaan & PPTK */}
          {activeTab === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3 bg-brand-50/50 dark:bg-brand-900/10 rounded-xl text-xs text-brand-700 dark:text-brand-300 font-medium">
                👥 Bagian 4: Pejabat Pengadaan, PPTK & Bendahara
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Ringkasan Program & Anggaran (Kanan) */}
                <div className="lg:col-span-5">
                  {renderProgramSummary()}
                </div>
                {/* Form Input (Kiri) */}
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nama Pejabat Pengadaan
                    </label>
                    <SearchableSelect
                      options={pegawaiList
                        .filter((pgw) => pgw.pgw_status_pegawai === 1)
                        .map((pgw) => ({
                          value: pgw.pgw_id,
                          label: `${pgw.pgw_nama} (${pgw.pgw_nip})`,
                          sublabel: pgw.pgw_jabatan ? `(${pgw.pgw_jabatan})` : undefined,
                        }))}
                      value={mdkNamaPejabatPengadaanId}
                      onChange={(val) => setMdkNamaPejabatPengadaanId(Number(val))}
                      placeholder="-- Pilih Pejabat Pengadaan --"
                      searchPlaceholder="Cari nama atau NIP..."
                      disabled={pegawaiList.filter((pgw) => pgw.pgw_status_pegawai === 1).length === 0}
                    />
                  </div>



                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nama PPTK
                    </label>
                    <SearchableSelect
                      options={pegawaiList
                        .filter((pgw) => pgw.pgw_status_pegawai === 0)
                        .map((pgw) => ({
                          value: pgw.pgw_id,
                          label: pgw.pgw_nama + ` (${pgw.pgw_nip})`,
                          sublabel: `(${pgw.pgw_jabatan})`,
                        }))}
                      value={mdkNamaPptk}
                      onChange={(val) => setMdkNamaPptk(Number(val))}
                      placeholder="-- Pilih PPTK --"
                      searchPlaceholder="Cari berdasarkan nama..."
                      disabled={pegawaiList.length === 0}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nama Bendahara
                    </label>
                    <SearchableSelect
                      options={pegawaiList
                        .filter((pgw) => pgw.pgw_status_pegawai === 0)
                        .map((pgw) => ({
                          value: pgw.pgw_id,
                          label: pgw.pgw_nama + ` (${pgw.pgw_nip})`,
                          sublabel: `(${pgw.pgw_jabatan})`,
                        }))}
                      value={mdkNamaBendaharaId}
                      onChange={(val) => setMdkNamaBendaharaId(Number(val))}
                      placeholder="-- Pilih Bendahara --"
                      searchPlaceholder="Cari berdasarkan nama..."
                      disabled={pegawaiList.length === 0}
                    />
                  </div>
                </div>


              </div>
            </div>
          )}

          {/* TAB 5: Perusahaan / Penyedia */}
          {activeTab === 5 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3 bg-brand-50/50 dark:bg-brand-900/10 rounded-xl text-xs text-brand-700 dark:text-brand-300 font-medium">
                🏢 Bagian 5: Identitas Penyedia / Perusahaan Rekanan
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Ringkasan Program & Anggaran (Kanan) */}
                <div className="lg:col-span-5">
                  {renderProgramSummary()}
                </div>
                {/* Form Input (Kiri) */}
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nama Perusahaan
                    </label>
                    <SearchableSelect
                      options={perusahaanList
                        .map((psh) => ({
                          value: psh.psh_id,
                          label: psh.psh_nama + ` (${psh.psh_alamat})`,
                        }))}
                      value={mdkNamaPerusahaanId}
                      onChange={(val) => {
                        const selectedId = Number(val);
                        setMdkNamaPerusahaanId(selectedId);
                        const selectedPsh = perusahaanList.find((p) => p.psh_id === selectedId);
                        if (selectedPsh) {
                          setMdkAlamat(selectedPsh.psh_alamat || '');
                          setMdkNamaPimpinanPerusahaan(selectedPsh.psh_nama_pimpinan || '');
                          setMdkJabatanPimpinanPerusahaan(selectedPsh.psh_jabatan || '');
                        }
                      }}
                      placeholder="-- Pilih Perusahaan --"
                      searchPlaceholder="Cari berdasarkan nama..."
                      disabled={perusahaanList.length === 0}
                    />

                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nama Pimpinan Perusahaan
                    </label>
                    <input
                      type="text"
                      placeholder="Masukkan nama pimpinan perusahaan"
                      value={mdkNamaPimpinanPerusahaan}
                      onChange={(e) => setMdkNamaPimpinanPerusahaan(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Jabatan Pimpinan Perusahaan
                    </label>
                    <input
                      type="text"
                      placeholder="Masukkan nama jabatan pimpinan perusahaan"
                      value={mdkJabatanPimpinanPerusahaan}
                      onChange={(e) => setMdkJabatanPimpinanPerusahaan(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Alamat Perusahaan
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Masukkan alamat lengkap perusahaan"
                      value={mdkAlamat}
                      onChange={(e) => setMdkAlamat(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
                    />
                  </div>
                </div>


              </div>
            </div>
          )}
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Batal
            </button>
            {activeTab > 1 && (
              <button
                type="button"
                onClick={() => setActiveTab((prev) => Math.max(1, prev - 1))}
                className="px-4 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                ← Sebelumnya
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeTab < tabs.length && (
              <button
                type="button"
                onClick={() => setActiveTab((prev) => Math.min(tabs.length, prev + 1))}
                className="px-4 py-2 text-xs font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-300 rounded-xl transition-colors cursor-pointer font-semibold"
              >
                Selanjutnya →
              </button>
            )}
            <button
              type="submit"
              form="master-dokumen-form"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-medium text-white bg-brand-500 rounded-xl hover:bg-brand-600 shadow-theme-xs disabled:opacity-50 transition-colors cursor-pointer font-semibold"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Menyimpan...
                </>
              ) : (
                'Simpan Master Dokumen'
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
