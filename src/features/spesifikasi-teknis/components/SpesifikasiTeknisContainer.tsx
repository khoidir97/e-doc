"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  getKakOptionsForSptAction,
  getSpesifikasiTeknisByKakIdAction,
  getSatuanListForSptAction,
  getPegawaiListForSptAction,
  saveSpesifikasiTeknisAction,
  deleteSpesifikasiTeknisAction,
} from '../actions';
import {
  KakOptionItemForSpt,
  DetailSpesifikasiTeknis,
  DetailSpesifikasiJumlah,
  DetailDaftarPelakuUsaha,
  SaveSpesifikasiTeknisPayload,
} from '../types';
import { KerangkaAcuanKerja } from '@/features/kerangka-acuan-kerja/types';
import { MasterDokumen } from '@/features/master-dokumen/types';
import { Pegawai } from '@/features/pegawai/types';
import { SearchableSelect } from '@/components/form/SearchableSelect';
import { RupiahInput } from '@/components/form/RupiahInput';
import { formatRupiah } from '@/lib/terbilang';
import { Toast } from '@/components/ui/Toast';
import { RichTextEditor } from '@/components/form/RichTextEditor';
import { SpesifikasiTeknisSheet } from './SpesifikasiTeknisSheet';

interface SpesifikasiTeknisContainerProps {
  initialKakId?: number;
}

const DEFAULT_SPESIFIKASI_JUMLAH =
  '<p>Harga perolehan atas masing-masing uraian barang di atas harus sudah memperhitungkan komponen harga perolehan di bawah ini :</p><ul><li>Ongkos Kirim dan pajak</li></ul>';

const DEFAULT_PELAYANAN =
  '<p><strong>Tingkat pelayanan barang/jasa :</strong></p><ol><li><strong>Pengiriman</strong> : Vendor bertanggung jawab atas pengiriman ke lokasi dan harus memastikan bahwa barang sampai dalam kondisi baik.</li><li><strong>Jadwal</strong>: Vendor harus menyediakan jadwal pengadaan yang jelas,termasuk tenggat waktu untuk pengiriman.</li></ol>';

const DEFAULT_LOKASI =
  '<p>Berdasarkan lokasi pengiriman terdekat dari lokasi tujuan pengiriman.</p>';

const DEFAULT_POIN_NEGOSIASI =
  '<ol><li>Sebagaimana tersebut pada spesifikasi mutu</li><li>Sebagaimana tersebut pada spesifikasi waktu</li><li>Sebagaimana tersebut pada spesifikasi pelayanan</li><li>Sebagaimana tersebut pada spesifikasi lokasi</li></ol>';

export const SpesifikasiTeknisContainer: React.FC<SpesifikasiTeknisContainerProps> = ({
  initialKakId,
}) => {
  const [kakOptions, setKakOptions] = useState<KakOptionItemForSpt[]>([]);
  const [selectedKakId, setSelectedKakId] = useState<number | ''>(initialKakId || '');
  const [selectedKak, setSelectedKak] = useState<KerangkaAcuanKerja | null>(null);
  const [selectedMasterDokumen, setSelectedMasterDokumen] = useState<MasterDokumen | null>(null);
  const [ppkPegawai, setPpkPegawai] = useState<Pegawai | null>(null);

  const [satuanList, setSatuanList] = useState<{ st_id: number; st_nama: string }[]>([]);
  const [pegawaiList, setPegawaiList] = useState<{ pgw_id: number; pgw_nama: string; pgw_nip: string; pgw_jabatan: string }[]>([]);

  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [hasSavedData, setHasSavedData] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  // Form states matching table spesifikasi_teknis
  const [sptId, setSptId] = useState<number | null>(null);
  const [sptPaketPengadaan, setSptPaketPengadaan] = useState('');
  const [sptSatuanKerja, setSptSatuanKerja] = useState('Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru');
  const [sptPpkPgwId, setSptPpkPgwId] = useState<number | null>(null);
  const [spdIdRup, setSpdIdRup] = useState('');
  const [sptNamaBarangType, setSptNamaBarangType] = useState('');

  // TKDN & PDN Checkbox states
  const [isTkdn, setIsTkdn] = useState(true);
  const [isPdn, setIsPdn] = useState(true);
  const [isImpor, setIsImpor] = useState(false);

  // Prioritas Penggunaan
  const [prioritasPenggunaan, setPrioritasPenggunaan] = useState('Usaha Kecil');

  // Spesifikasi Jumlah (Rich Text)
  const [sptSpesifikasiJumlah, setSptSpesifikasiJumlah] = useState(DEFAULT_SPESIFIKASI_JUMLAH);

  // Spesifikasi Waktu, Pelayanan, Lokasi, Poin Negosiasi
  const [sptWaktuPelaksanaan, setSptWaktuPelaksanaan] = useState('30 (tiga puluh) Hari Kalender');
  const [sptLokasiKedatangan, setSptLokasiKedatangan] = useState('Kantor Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru');
  const [sptPelayanan, setSptPelayanan] = useState(DEFAULT_PELAYANAN);
  const [sptLokasi, setSptLokasi] = useState(DEFAULT_LOKASI);
  const [sptPoinNegosiasi, setSptPoinNegosiasi] = useState(DEFAULT_POIN_NEGOSIASI);

  // Pelaku Usaha Lulus & Link Katalog (Rich Text)
  const [sptNamaPelakuUsaha, setSptNamaPelakuUsaha] = useState('');
  const [sptLinkKatalog, setSptLinkKatalog] = useState('');

  // 3 Detail dynamic tables
  const [detailTeknis, setDetailTeknis] = useState<DetailSpesifikasiTeknis[]>([]);
  const [detailJumlah, setDetailJumlah] = useState<DetailSpesifikasiJumlah[]>([]);
  const [detailPelakuUsaha, setDetailPelakuUsaha] = useState<DetailDaftarPelakuUsaha[]>([]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
  };

  // Initial fetch for options, satuan, and pegawai
  useEffect(() => {
    async function initDropdowns() {
      setLoadingOptions(true);
      const [kakRes, satuanRes, pegawaiRes] = await Promise.all([
        getKakOptionsForSptAction(),
        getSatuanListForSptAction(),
        getPegawaiListForSptAction(),
      ]);

      if (satuanRes.success && satuanRes.data) {
        setSatuanList(satuanRes.data);
      }
      if (pegawaiRes.success && pegawaiRes.data) {
        setPegawaiList(pegawaiRes.data);
      }
      if (kakRes.success && kakRes.data) {
        setKakOptions(kakRes.data);
        const targetId = initialKakId || (kakRes.data.length > 0 ? kakRes.data[0].kak_id : '');
        if (targetId) {
          setSelectedKakId(targetId);
        }
      } else {
        showToast('error', kakRes.message || 'Gagal memuat opsi KAK.');
      }
      setLoadingOptions(false);
    }
    initDropdowns();
  }, [initialKakId]);

  // Load Spesifikasi Teknis data when KAK is selected
  const loadDataForKak = useCallback(async (kakId: number) => {
    setLoadingData(true);
    const res = await getSpesifikasiTeknisByKakIdAction(kakId);

    if (res.success && res.data) {
      const {
        spesifikasiTeknis,
        detailTeknis: dTeknis,
        detailJumlah: dJumlah,
        detailPelakuUsaha: dPelaku,
        kak,
        masterDokumen,
        ppkPegawai: ppk,
      } = res.data;

      setSelectedKak(kak);
      setSelectedMasterDokumen(masterDokumen);
      setPpkPegawai(ppk);

      const defaultPaket =
        kak?.kak_pekerjaan ||
        masterDokumen?.mdk_pekerjaan ||
        masterDokumen?.mdk_uraian_belanja ||
        'Pengadaan Barang/Jasa';

      const defaultNamaBarang =
        kak?.kak_pekerjaan ||
        masterDokumen?.mdk_pekerjaan ||
        '';

      const defaultPpkId =
        ppk?.pgw_id ||
        masterDokumen?.mdk_nama_pejabat_id ||
        null;

      if (spesifikasiTeknis) {
        setSptId(spesifikasiTeknis.spt_id);
        setSptPaketPengadaan(spesifikasiTeknis.spt_paket_pengadaan || defaultPaket);
        setSptSatuanKerja(spesifikasiTeknis.spt_satuan_kerja || 'Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru');
        setSptPpkPgwId(spesifikasiTeknis.spt_spt_ppk_pgw_id || defaultPpkId);
        setSpdIdRup(spesifikasiTeknis.spd_id_rup || '');
        setSptNamaBarangType(spesifikasiTeknis.spt_nama_barang_type || defaultNamaBarang);

        // Parse TKDN/PDN
        const tkdnRaw = spesifikasiTeknis.spt_identifikasi_tkdn || 'TKDN,PDN';
        setIsTkdn(tkdnRaw.toUpperCase().includes('TKDN'));
        setIsPdn(tkdnRaw.toUpperCase().includes('PDN'));
        setIsImpor(tkdnRaw.toUpperCase().includes('IMPOR'));

        setPrioritasPenggunaan(spesifikasiTeknis.spt_prioritas_penggunaan || 'Usaha Kecil');
        setSptSpesifikasiJumlah(spesifikasiTeknis.spt_spesifikasi_jumlah || DEFAULT_SPESIFIKASI_JUMLAH);
        setSptWaktuPelaksanaan(spesifikasiTeknis.spt_spesifikasi_waktu_pelaksanaan || kak?.kak_jangka_waktu_pelaksanaan || '30 (tiga puluh) Hari Kalender');
        setSptLokasiKedatangan(spesifikasiTeknis.spt_spesifikasi_waktu_lokasi_kedatangan || 'Kantor Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru');
        setSptPelayanan(spesifikasiTeknis.spt_spesifikasi_pelayanan || DEFAULT_PELAYANAN);
        setSptLokasi(spesifikasiTeknis.spt_spesifikasi_lokasi || DEFAULT_LOKASI);
        setSptPoinNegosiasi(spesifikasiTeknis.spt_rencana_poin_negosiasi_teknis || DEFAULT_POIN_NEGOSIASI);
        setSptNamaPelakuUsaha(spesifikasiTeknis.spt_nama_pelaku_usaha || '');
        setSptLinkKatalog(spesifikasiTeknis.spt_link_katalog || '');

        setDetailTeknis(dTeknis);
        setDetailJumlah(dJumlah);
        setDetailPelakuUsaha(dPelaku);
        setHasSavedData(true);
      } else {
        // Belum ada data spesifikasi teknis di database: isi default cerdas
        setSptId(null);
        setHasSavedData(false);

        setSptPaketPengadaan(defaultPaket);
        setSptSatuanKerja('Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru');
        setSptPpkPgwId(defaultPpkId);
        setSpdIdRup('');
        setSptNamaBarangType(defaultNamaBarang);

        setIsTkdn(true);
        setIsPdn(true);
        setIsImpor(false);
        setPrioritasPenggunaan('Usaha Kecil');

        setSptSpesifikasiJumlah(DEFAULT_SPESIFIKASI_JUMLAH);
        setSptWaktuPelaksanaan(kak?.kak_jangka_waktu_pelaksanaan || '30 (tiga puluh) Hari Kalender');
        setSptLokasiKedatangan('Kantor Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru');
        setSptPelayanan(DEFAULT_PELAYANAN);
        setSptLokasi(DEFAULT_LOKASI);
        setSptPoinNegosiasi(DEFAULT_POIN_NEGOSIASI);
        setSptNamaPelakuUsaha(masterDokumen?.mdk_nama_perusahaan || '');
        setSptLinkKatalog('');

        setDetailTeknis(dTeknis.length > 0 ? dTeknis : [
          { dspt_item_barang_jasa: '', dspt_spesifikasi: '' }
        ]);
        setDetailJumlah(dJumlah.length > 0 ? dJumlah : [
          { dspj_item_barang_jasa: '', dspj_jumlah: 1, dspj_satuan_id: null, st_nama: 'Unit' }
        ]);
        setDetailPelakuUsaha(dPelaku.length > 0 ? dPelaku : []);
      }
    } else {
      showToast('error', res.message || 'Gagal memuat detail data.');
    }
    setLoadingData(false);
  }, []);

  useEffect(() => {
    if (selectedKakId) {
      loadDataForKak(Number(selectedKakId));
    }
  }, [selectedKakId, loadDataForKak]);

  // -------------------------------------------------------------
  // DYNAMIC FORM 1: DETAIL SPESIFIKASI TEKNIS HANDLERS
  // -------------------------------------------------------------
  const handleAddDetailTeknis = () => {
    setDetailTeknis((prev) => [
      ...prev,
      { dspt_item_barang_jasa: '', dspt_spesifikasi: '' },
    ]);
  };

  const handleUpdateDetailTeknis = (index: number, field: keyof DetailSpesifikasiTeknis, value: string) => {
    setDetailTeknis((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveDetailTeknis = (index: number) => {
    setDetailTeknis((prev) => prev.filter((_, idx) => idx !== index));
  };

  // -------------------------------------------------------------
  // DYNAMIC FORM 2: DETAIL SPESIFIKASI JUMLAH HANDLERS
  // -------------------------------------------------------------
  const handleAddDetailJumlah = () => {
    setDetailJumlah((prev) => [
      ...prev,
      { dspj_item_barang_jasa: '', dspj_jumlah: 1, dspj_satuan_id: null, st_nama: 'Unit' },
    ]);
  };

  const handleUpdateDetailJumlah = (index: number, field: keyof DetailSpesifikasiJumlah, value: any) => {
    setDetailJumlah((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      if (field === 'dspj_satuan_id') {
        const foundSatuan = satuanList.find((s) => s.st_id === Number(value));
        copy[index].st_nama = foundSatuan?.st_nama || 'Unit';
      }
      return copy;
    });
  };

  const handleRemoveDetailJumlah = (index: number) => {
    setDetailJumlah((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSyncItemsToJumlah = () => {
    if (detailTeknis.length === 0) {
      showToast('error', 'Belum ada item spesifikasi teknis untuk disinkronkan.');
      return;
    }
    const synced: DetailSpesifikasiJumlah[] = detailTeknis
      .filter((t) => t.dspt_item_barang_jasa.trim() !== '')
      .map((t) => {
        const existing = detailJumlah.find((j) => j.dspj_item_barang_jasa.toLowerCase() === t.dspt_item_barang_jasa.toLowerCase());
        return {
          dspj_item_barang_jasa: t.dspt_item_barang_jasa,
          dspj_jumlah: existing ? existing.dspj_jumlah : 1,
          dspj_satuan_id: existing ? existing.dspj_satuan_id : null,
          st_nama: existing?.st_nama || 'Unit',
        };
      });

    setDetailJumlah(synced);
    showToast('success', `${synced.length} item berhasil disinkronkan ke Daftar Kuantitas.`);
  };

  // -------------------------------------------------------------
  // DYNAMIC FORM 3: DETAIL PELAKU USAHA HANDLERS
  // -------------------------------------------------------------
  const handleAddDetailPelakuUsaha = (defaultItemName?: string) => {
    const itemToUse = defaultItemName || (detailTeknis[0]?.dspt_item_barang_jasa || '');
    setDetailPelakuUsaha((prev) => [
      ...prev,
      {
        dpu_item: itemToUse,
        dpu_nama_pelaku_usaha_potensial: '',
        dpu_link_katalog: '',
        dpu_harga: 0,
        dpu_evaluasi_berdasarkan_parameter: 'Lulus/Gugur\nSeluruh parameter Spesifikasi terpenuhi\nLokasi : Pekanbaru',
      },
    ]);
  };

  const handleUpdateDetailPelakuUsaha = (index: number, field: keyof DetailDaftarPelakuUsaha, value: any) => {
    setDetailPelakuUsaha((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveDetailPelakuUsaha = (index: number) => {
    setDetailPelakuUsaha((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSetPemenang = (vendor: DetailDaftarPelakuUsaha) => {
    setSptNamaPelakuUsaha(vendor.dpu_nama_pelaku_usaha_potensial);
    if (vendor.dpu_link_katalog) {
      if (!sptLinkKatalog.includes(vendor.dpu_link_katalog)) {
        setSptLinkKatalog((prev) => (prev ? `${prev}<br/><a href="${vendor.dpu_link_katalog}" target="_blank">${vendor.dpu_link_katalog}</a>` : `<p><a href="${vendor.dpu_link_katalog}" target="_blank">${vendor.dpu_link_katalog}</a></p>`));
      }
    }
    showToast('success', `${vendor.dpu_nama_pelaku_usaha_potensial} dipilih sebagai Pelaku Usaha yang Lulus.`);
  };

  // -------------------------------------------------------------
  // SAVE HANDLER
  // -------------------------------------------------------------
  const handleSave = async (e?: React.FormEvent): Promise<number | null> => {
    if (e) e.preventDefault();
    if (!selectedKakId) {
      showToast('error', 'Pilih Kerangka Acuan Kerja (KAK) terlebih dahulu.');
      return null;
    }

    setSaving(true);

    // Compute TKDN string
    const tkdnParts: string[] = [];
    if (isTkdn) tkdnParts.push('TKDN');
    if (isPdn) tkdnParts.push('PDN');
    if (isImpor) tkdnParts.push('IMPOR');
    const tkdnString = tkdnParts.join(',');

    const payload: SaveSpesifikasiTeknisPayload = {
      spt_id: sptId || null,
      spt_kak_id: Number(selectedKakId),
      spt_paket_pengadaan: sptPaketPengadaan || null,
      spt_satuan_kerja: sptSatuanKerja || null,
      spt_spt_ppk_pgw_id: sptPpkPgwId ? Number(sptPpkPgwId) : null,
      spd_id_rup: spdIdRup || null,
      spt_nama_barang_type: sptNamaBarangType || null,
      spt_identifikasi_tkdn: tkdnString,
      spt_prioritas_penggunaan: prioritasPenggunaan || null,
      spt_spesifikasi_jumlah: sptSpesifikasiJumlah || null,
      spt_spesifikasi_waktu_pelaksanaan: sptWaktuPelaksanaan || null,
      spt_spesifikasi_waktu_lokasi_kedatangan: sptLokasiKedatangan || null,
      spt_spesifikasi_pelayanan: sptPelayanan || null,
      spt_spesifikasi_lokasi: sptLokasi || null,
      spt_rencana_poin_negosiasi_teknis: sptPoinNegosiasi || null,
      spt_nama_pelaku_usaha: sptNamaPelakuUsaha || null,
      spt_link_katalog: sptLinkKatalog || null,
      detailTeknis: detailTeknis.filter((t) => t.dspt_item_barang_jasa.trim() || t.dspt_spesifikasi.trim()),
      detailJumlah: detailJumlah.filter((j) => j.dspj_item_barang_jasa.trim()),
      detailPelakuUsaha: detailPelakuUsaha.filter((p) => p.dpu_item.trim() || p.dpu_nama_pelaku_usaha_potensial.trim()),
    };

    const res = await saveSpesifikasiTeknisAction(payload);
    let savedSptId: number | null = null;
    if (res.success && res.data) {
      savedSptId = res.data.sptId;
      setSptId(savedSptId);
      setHasSavedData(true);
      showToast('success', res.message || 'Dokumen Spesifikasi Teknis berhasil disimpan!');

      // Update label in dropdown
      setKakOptions((prev) =>
        prev.map((opt) => (opt.kak_id === Number(selectedKakId) ? { ...opt, has_spesifikasi_teknis: true } : opt))
      );
    } else {
      showToast('error', res.message || 'Gagal menyimpan Dokumen Spesifikasi Teknis.');
    }

    setSaving(false);
    return savedSptId;
  };

  const handlePrintPdf = async () => {
    let targetId = sptId;
    if (!targetId) {
      targetId = await handleSave();
    }
    if (targetId) {
      window.open(`/spesifikasi-teknis/print/${targetId}`, '_blank');
    } else if (selectedKakId) {
      window.open(`/spesifikasi-teknis/print/kak-${selectedKakId}`, '_blank');
    }
  };

  const handleDelete = async () => {
    if (!sptId) return;
    if (!confirm('Apakah Anda yakin ingin menghapus data Spesifikasi Teknis ini?')) return;

    setSaving(true);
    const res = await deleteSpesifikasiTeknisAction(sptId);
    if (res.success) {
      showToast('success', 'Dokumen Spesifikasi Teknis berhasil dihapus.');
      setSptId(null);
      setHasSavedData(false);

      // Update dropdown status
      setKakOptions((prev) =>
        prev.map((opt) => (opt.kak_id === Number(selectedKakId) ? { ...opt, has_spesifikasi_teknis: false } : opt))
      );

      if (selectedKakId) {
        loadDataForKak(Number(selectedKakId));
      }
    } else {
      showToast('error', res.message || 'Gagal menghapus data.');
    }
    setSaving(false);
  };

  const selectedPpk = pegawaiList.find((p) => p.pgw_id === sptPpkPgwId);

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Notification */}
      {notification && (
        <Toast
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
              E-Purchasing
            </span>
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Spesifikasi Teknis
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Manajemen Dokumen Spesifikasi Teknis, Kuantitas, dan Penetapan Penyedia E-Purchasing
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Tab Switcher */}
          <div className="flex p-1 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'form'
                  ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Form Input
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Preview Cetak
            </button>
          </div>

          {hasSavedData && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="px-3 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
              title="Hapus Dokumen Spesifikasi Teknis"
            >
              Hapus
            </button>
          )}

          <button
            type="button"
            onClick={handlePrintPdf}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Cetak (PDF)
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : hasSavedData ? 'Perbarui Data' : 'Simpan Dokumen'}
          </button>
        </div>
      </div>

      {/* CARD 1: PILIH DOKUMEN KAK ACUAN */}
      <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Pilih Kerangka Acuan Kerja (KAK) Acuan</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Pilih dokumen KAK untuk mengisi field spt_kak_id dan menarik otomatis rincian pekerjaan
            </p>
          </div>
          {hasSavedData && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 self-start sm:self-auto">
              ✓ Data Spesifikasi Teknis Tersimpan
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <SearchableSelect
              options={kakOptions.map((opt) => {
                const isSaved = Boolean(Number(opt.has_spesifikasi_teknis));
                const pekerjaan = opt.kak_pekerjaan || opt.mdk_pekerjaan || opt.mdk_uraian_belanja || 'Tanpa Pekerjaan';
                const tahun = opt.kak_tahun_anggaran || '2026';
                return {
                  value: opt.kak_id,
                  label: `${isSaved ? '✓ [SUDAH DIBUAT] ' : ''}[KAK #${opt.kak_id}] ${pekerjaan} (${tahun})`,
                  sublabel: isSaved
                    ? '✓ Dokumen Spesifikasi Teknis sudah pernah dibuat / tersimpan'
                    : 'Belum ada Dokumen Spesifikasi Teknis',
                };
              })}
              value={selectedKakId}
              onChange={(val) => setSelectedKakId(Number(val))}
              placeholder={loadingOptions ? 'Memuat daftar KAK...' : '-- Cari / Pilih KAK --'}
              disabled={loadingOptions}
            />
          </div>

          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Metode:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{selectedKak?.kak_metode_pemilihan || 'e-purchasing'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Tahun Anggaran:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{selectedKak?.kak_tahun_anggaran || '2026'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Pagu Anggaran:</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">{formatRupiah(selectedMasterDokumen?.mdk_pagu_anggaran || 0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT TABS */}
      {activeTab === 'preview' ? (
        <div className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-sm overflow-x-auto">
          <div className="max-w-4xl mx-auto mb-4 flex justify-between items-center print:hidden">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
              Live Document Preview (5 Halaman Dokumen Standar E-Purchasing)
            </span>
            <button
              type="button"
              onClick={handlePrintPdf}
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Cetak Dokumen
            </button>
          </div>
          <SpesifikasiTeknisSheet
            spesifikasiTeknis={{
              spt_paket_pengadaan: sptPaketPengadaan,
              spt_satuan_kerja: sptSatuanKerja,
              spt_spt_ppk_pgw_id: sptPpkPgwId,
              spd_id_rup: spdIdRup,
              spt_nama_barang_type: sptNamaBarangType,
              spt_identifikasi_tkdn: [isTkdn && 'TKDN', isPdn && 'PDN', isImpor && 'IMPOR'].filter(Boolean).join(','),
              spt_prioritas_penggunaan: prioritasPenggunaan,
              spt_spesifikasi_jumlah: sptSpesifikasiJumlah,
              spt_spesifikasi_waktu_pelaksanaan: sptWaktuPelaksanaan,
              spt_spesifikasi_waktu_lokasi_kedatangan: sptLokasiKedatangan,
              spt_spesifikasi_pelayanan: sptPelayanan,
              spt_spesifikasi_lokasi: sptLokasi,
              spt_rencana_poin_negosiasi_teknis: sptPoinNegosiasi,
              spt_nama_pelaku_usaha: sptNamaPelakuUsaha,
              spt_link_katalog: sptLinkKatalog,
              ppk_nama: selectedPpk?.pgw_nama || ppkPegawai?.pgw_nama,
              ppk_nip: selectedPpk?.pgw_nip || ppkPegawai?.pgw_nip,
              ppk_jabatan: selectedPpk?.pgw_jabatan || ppkPegawai?.pgw_jabatan,
            }}
            detailTeknis={detailTeknis}
            detailJumlah={detailJumlah}
            detailPelakuUsaha={detailPelakuUsaha}
            kak={selectedKak}
            masterDokumen={selectedMasterDokumen}
            ppkPegawai={selectedPpk || ppkPegawai}
          />
        </div>
      ) : (
        /* FORM INPUT TAB */
        <div className="space-y-6">
          {/* BAGIAN 1: HEADER & IDENTIFIKASI */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 pb-2">
              1. Header Dokumen & Identifikasi
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Paket Pengadaan
                </label>
                <input
                  type="text"
                  value={sptPaketPengadaan}
                  onChange={(e) => setSptPaketPengadaan(e.target.value)}
                  placeholder="Contoh: Pengadaan Wireless Access Point"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Satuan Kerja
                </label>
                <input
                  type="text"
                  value={sptSatuanKerja}
                  onChange={(e) => setSptSatuanKerja(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Pejabat Pembuat Komitmen (PPK)
                </label>
                <SearchableSelect
                  options={pegawaiList.map((p) => ({
                    value: p.pgw_id,
                    label: `${p.pgw_nama} - ${p.pgw_nip} (${p.pgw_jabatan || 'PPK'})`,
                  }))}
                  value={sptPpkPgwId || ''}
                  onChange={(val) => setSptPpkPgwId(Number(val))}
                  placeholder="-- Pilih Pegawai PPK --"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  ID RUP (spd_id_rup)
                </label>
                <input
                  type="text"
                  value={spdIdRup}
                  onChange={(e) => setSpdIdRup(e.target.value)}
                  placeholder="Contoh: 66684700"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Nama Barang / Tipe (spt_nama_barang_type)
                </label>
                <input
                  type="text"
                  value={sptNamaBarangType}
                  onChange={(e) => setSptNamaBarangType(e.target.value)}
                  placeholder="Contoh: Pengadaan Routerboard"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Checkboxes TKDN & Usaha Kecil */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40">
                <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">
                  Identifikasi TKDN dan Berlabel PDN :
                </label>
                <div className="flex items-center gap-6">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={isTkdn}
                      onChange={(e) => setIsTkdn(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                    />
                    TKDN
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={isPdn}
                      onChange={(e) => setIsPdn(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                    />
                    PDN
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={isImpor}
                      onChange={(e) => setIsImpor(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                    />
                    IMPOR
                  </label>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40">
                <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 mb-2">
                  Prioritas Penggunaan Produk dari Penyedia :
                </label>
                <div className="flex items-center gap-6">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700 dark:text-gray-300">
                    <input
                      type="radio"
                      name="prioritasPenggunaan"
                      checked={prioritasPenggunaan === 'Usaha Kecil'}
                      onChange={() => setPrioritasPenggunaan('Usaha Kecil')}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                    />
                    Usaha Kecil
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700 dark:text-gray-300">
                    <input
                      type="radio"
                      name="prioritasPenggunaan"
                      checked={prioritasPenggunaan === 'Usaha non kecil'}
                      onChange={() => setPrioritasPenggunaan('Usaha non kecil')}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                    />
                    Usaha non kecil
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* BAGIAN 2: DYNAMIC FORM 1 - DETAIL SPESIFIKASI TEKNIS */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  2. Detail Spesifikasi Teknis (detail_spesifikasi_teknis)
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Daftar item barang/jasa beserta rincian spesifikasi teknisnya (Dynamic Form tetap menggunakan textarea)
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddDetailTeknis}
                className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300 hover:bg-blue-100 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                + Tambah Item Spesifikasi
              </button>
            </div>

            <div className="space-y-3">
              {detailTeknis.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/40 dark:bg-gray-800/40 space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      Item #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDetailTeknis(idx)}
                      className="text-red-500 hover:text-red-700 text-xs font-semibold p-1 cursor-pointer"
                      title="Hapus baris ini"
                    >
                      ✕ Hapus
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        Item Barang / Jasa
                      </label>
                      <input
                        type="text"
                        value={item.dspt_item_barang_jasa}
                        onChange={(e) => handleUpdateDetailTeknis(idx, 'dspt_item_barang_jasa', e.target.value)}
                        placeholder="Contoh: Routerboard CCR2004-16G-2S+"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        Rincian Spesifikasi Teknis
                      </label>
                      <textarea
                        rows={3}
                        value={item.dspt_spesifikasi}
                        onChange={(e) => handleUpdateDetailTeknis(idx, 'dspt_spesifikasi', e.target.value)}
                        placeholder="Contoh: Product code CCR2004-16G-2S+, Architecture ARM 64bit, CPU AL32400..."
                        className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {detailTeknis.length === 0 && (
                <div className="text-center py-6 text-xs text-gray-400 italic">
                  Belum ada item spesifikasi teknis. Klik &quot;+ Tambah Item Spesifikasi&quot; di atas.
                </div>
              )}
            </div>
          </div>

          {/* BAGIAN 3: DYNAMIC FORM 2 - DETAIL SPESIFIKASI JUMLAH */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  3. Detail Spesifikasi Jumlah / Kuantitas (detail_spesifikasi_jumlah)
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Daftar kuantitas dan satuan masing-masing uraian barang/jasa
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSyncItemsToJumlah}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 transition-all cursor-pointer"
                  title="Salin nama item dari Spesifikasi Teknis di atas"
                >
                  Sinkronkan dari Bagian 2
                </button>
                <button
                  type="button"
                  onClick={handleAddDetailJumlah}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300 hover:bg-blue-100 text-xs font-semibold transition-all cursor-pointer"
                >
                  + Tambah Baris Kuantitas
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {detailJumlah.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/40 dark:bg-gray-800/40 space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      Kuantitas #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDetailJumlah(idx)}
                      className="text-red-500 hover:text-red-700 text-xs font-semibold p-1 cursor-pointer"
                      title="Hapus baris ini"
                    >
                      ✕ Hapus
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        Item Barang / Jasa
                      </label>
                      <input
                        type="text"
                        value={item.dspj_item_barang_jasa}
                        onChange={(e) => handleUpdateDetailJumlah(idx, 'dspj_item_barang_jasa', e.target.value)}
                        placeholder="Contoh: Routerboard CCR2004-16G-2S+"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        Jumlah (dspj_jumlah)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.dspj_jumlah}
                        onChange={(e) => handleUpdateDetailJumlah(idx, 'dspj_jumlah', Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        Satuan (dspj_satuan_id)
                      </label>
                      <select
                        value={item.dspj_satuan_id || ''}
                        onChange={(e) => handleUpdateDetailJumlah(idx, 'dspj_satuan_id', e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="">-- Satuan ({item.st_nama || 'Unit'}) --</option>
                        {satuanList.map((s) => (
                          <option key={s.st_id} value={s.st_id}>
                            {s.st_nama}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              {detailJumlah.length === 0 && (
                <div className="text-center py-6 text-xs text-gray-400 italic">
                  Belum ada baris kuantitas. Klik &quot;+ Tambah Baris Kuantitas&quot; atau &quot;Sinkronkan dari Bagian 2&quot;.
                </div>
              )}
            </div>

            {/* Kalimat Komponen Harga Perolehan (spt_spesifikasi_jumlah - Rich Text Editor) */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Catatan Komponen Harga Perolehan (spt_spesifikasi_jumlah)
              </label>
              <RichTextEditor
                value={sptSpesifikasiJumlah}
                onChange={(val) => setSptSpesifikasiJumlah(val)}
                minHeight="100px"
                placeholder="Ketik catatan komponen harga perolehan..."
              />
            </div>
          </div>

          {/* BAGIAN 4: SPESIFIKASI WAKTU, PELAYANAN, LOKASI & NEGOSIASI */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 pb-2">
              4. Spesifikasi Waktu, Pelayanan, Lokasi, dan Negosiasi Teknis
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Waktu Pelaksanaan (spt_spesifikasi_waktu_pelaksanaan)
                </label>
                <input
                  type="text"
                  value={sptWaktuPelaksanaan}
                  onChange={(e) => setSptWaktuPelaksanaan(e.target.value)}
                  placeholder="Contoh: 30 (tiga puluh) Hari Kalender"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Lokasi Kedatangan Barang (spt_spesifikasi_waktu_lokasi_kedatangan)
                </label>
                <input
                  type="text"
                  value={sptLokasiKedatangan}
                  onChange={(e) => setSptLokasiKedatangan(e.target.value)}
                  placeholder="Contoh: Kantor Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Spesifikasi Pelayanan (Rich Text Editor) */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Spesifikasi Pelayanan (spt_spesifikasi_pelayanan)
              </label>
              <RichTextEditor
                value={sptPelayanan}
                onChange={(val) => setSptPelayanan(val)}
                minHeight="120px"
                placeholder="Ketik spesifikasi pelayanan barang/jasa..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Spesifikasi Lokasi (Rich Text Editor) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Spesifikasi Lokasi (spt_spesifikasi_lokasi)
                </label>
                <RichTextEditor
                  value={sptLokasi}
                  onChange={(val) => setSptLokasi(val)}
                  minHeight="110px"
                  placeholder="Ketik spesifikasi lokasi..."
                />
              </div>

              {/* Rencana Poin Negosiasi Teknis (Rich Text Editor) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Rencana Poin Negosiasi Teknis (spt_rencana_poin_negosiasi_teknis)
                </label>
                <RichTextEditor
                  value={sptPoinNegosiasi}
                  onChange={(val) => setSptPoinNegosiasi(val)}
                  minHeight="110px"
                  placeholder="Ketik rencana poin negosiasi teknis..."
                />
              </div>
            </div>
          </div>

          {/* BAGIAN 5: DYNAMIC FORM 3 - DETAIL DAFTAR PELAKU USAHA POTENSIAL */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  5. Daftar Pelaku Usaha Potensial (detail_daftar_pelaku_usaha)
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Daftar link katalog penyedia yang berpotensi relevan untuk Dokumen Penetapan Penyedia (Dynamic Form tetap menggunakan textarea)
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleAddDetailPelakuUsaha()}
                className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300 hover:bg-blue-100 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                + Tambah Pelaku Usaha
              </button>
            </div>

            <div className="space-y-4">
              {detailPelakuUsaha.map((vendor, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/40 dark:bg-gray-800/40 space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        Pelaku Usaha #{idx + 1}
                      </span>
                      {sptNamaPelakuUsaha && sptNamaPelakuUsaha.toLowerCase() === vendor.dpu_nama_pelaku_usaha_potensial.toLowerCase() && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          Penyedia Lulus
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSetPemenang(vendor)}
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                        title="Jadikan sebagai pelaku usaha yang lulus untuk halaman 5"
                      >
                        ✓ Set Sebagai Pemenang / Lulus
                      </button>
                      <span className="text-gray-300 dark:text-gray-600">|</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDetailPelakuUsaha(idx)}
                        className="text-red-500 hover:text-red-700 text-xs font-semibold cursor-pointer"
                      >
                        ✕ Hapus
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        Item Barang / Jasa (dpu_item)
                      </label>
                      <input
                        type="text"
                        value={vendor.dpu_item}
                        onChange={(e) => handleUpdateDetailPelakuUsaha(idx, 'dpu_item', e.target.value)}
                        placeholder="Contoh: Routerboard CCR2004-16G-2S+"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        Nama Pelaku Usaha Potensial (dpu_nama_pelaku_usaha_potensial)
                      </label>
                      <input
                        type="text"
                        value={vendor.dpu_nama_pelaku_usaha_potensial}
                        onChange={(e) => handleUpdateDetailPelakuUsaha(idx, 'dpu_nama_pelaku_usaha_potensial', e.target.value)}
                        placeholder="Contoh: SAMARTHA NUSA UTAMA"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        Harga (dpu_harga)
                      </label>
                      <RupiahInput
                        value={vendor.dpu_harga}
                        onChange={(val) => handleUpdateDetailPelakuUsaha(idx, 'dpu_harga', Number(val) || 0)}
                        placeholder="0"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        Link Katalog (dpu_link_katalog)
                      </label>
                      <input
                        type="text"
                        value={vendor.dpu_link_katalog}
                        onChange={(e) => handleUpdateDetailPelakuUsaha(idx, 'dpu_link_katalog', e.target.value)}
                        placeholder="Contoh: https://katalog.inaproc.id/samartha-nusa-utama/..."
                        className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        Evaluasi Berdasarkan Parameter (dpu_evaluasi_berdasarkan_parameter)
                      </label>
                      <textarea
                        rows={2}
                        value={vendor.dpu_evaluasi_berdasarkan_parameter}
                        onChange={(e) => handleUpdateDetailPelakuUsaha(idx, 'dpu_evaluasi_berdasarkan_parameter', e.target.value)}
                        placeholder="Contoh: Lulus/Gugur&#10;Seluruh parameter terpenuhi&#10;Lokasi : Pekanbaru"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {detailPelakuUsaha.length === 0 && (
                <div className="text-center py-6 text-xs text-gray-400 italic">
                  Belum ada daftar pelaku usaha potensial. Klik &quot;+ Tambah Pelaku Usaha&quot; di atas.
                </div>
              )}
            </div>
          </div>

          {/* BAGIAN 6: PELAKU USAHA YANG LULUS (TABEL REFERENSI HALAMAN 5) */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 pb-2">
                6. Tabel Referensi Pertimbangan Penyedia (Khusus Pelaku Usaha yang Lulus)
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Data penyedia yang lulus untuk ditampilkan pada Halaman 5 dokumen cetak
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Nama Pelaku Usaha yang Lulus (spt_nama_pelaku_usaha)
                </label>
                <input
                  type="text"
                  value={sptNamaPelakuUsaha}
                  onChange={(e) => setSptNamaPelakuUsaha(e.target.value)}
                  placeholder="Contoh: SAMARTHA NUSA UTAMA"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Link Katalog (Rich Text Editor) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Daftar Link Katalog Penyedia yang Lulus (spt_link_katalog)
                </label>
                <RichTextEditor
                  value={sptLinkKatalog}
                  onChange={(val) => setSptLinkKatalog(val)}
                  minHeight="120px"
                  placeholder="Ketik atau tempel tautan katalog penyedia yang lulus..."
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
              <strong>Info:</strong> Pada Halaman 5 dokumen cetak, 7 poin pertimbangan (Spesifikasi Mutu, TKDN &amp; PDN, Usaha Kecil/Koperasi, Spesifikasi Jumlah, Waktu, Pelayanan, dan Lokasi) beserta Tanda Tangan PPK akan otomatis dicetak secara resmi.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
