"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MasterDokumen } from '@/features/master-dokumen/types';
import {
  getMasterDokumenOptionsAction,
  getKerangkaAcuanKerjaByMasterDokumenAction,
  saveKerangkaAcuanKerjaAction,
  getHpsItemsForKakAction,
} from '../actions';
import {
  DetailKakPerkiraanBiaya,
  DetailKakSpesifikasiTeknis,
} from '../types';
import { SearchableSelect } from '@/components/form/SearchableSelect';
import { RichTextEditor } from '@/components/form/RichTextEditor';
import { RupiahInput } from '@/components/form/RupiahInput';
import { formatRupiah, terbilang } from '@/lib/terbilang';
import { Toast } from '@/components/ui/Toast';

interface KerangkaAcuanKerjaContainerProps {
  initialMasterDokumenId?: number;
}

export const KerangkaAcuanKerjaContainer: React.FC<KerangkaAcuanKerjaContainerProps> = ({
  initialMasterDokumenId,
}) => {
  const [masterDokumenList, setMasterDokumenList] = useState<MasterDokumen[]>([]);
  const [selectedMdkId, setSelectedMdkId] = useState<number | ''>(initialMasterDokumenId || '');
  const [selectedMasterDokumen, setSelectedMasterDokumen] = useState<MasterDokumen | null>(null);

  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadingKak, setLoadingKak] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pullingHps, setPullingHps] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [hasSavedData, setHasSavedData] = useState(false);

  // Form states matching kerangka_acuan_kerja
  const [kakId, setKakId] = useState<number | null>(null);
  const [latarBelakang, setLatarBelakang] = useState('');
  const [maksudDanTujuan, setMaksudDanTujuan] = useState('');
  const [referensiHukum, setReferensiHukum] = useState('');
  const [targetSasaran, setTargetSasaran] = useState('');
  const [namaOrganisasi, setNamaOrganisasi] = useState('');
  const [sumberDanaIntro, setSumberDanaIntro] = useState('');
  const [ruangLingkup, setRuangLingkup] = useState('');
  const [jangkaWaktu, setJangkaWaktu] = useState('');
  const [metodePemilihan, setMetodePemilihan] = useState('e-Purchasing');
  const [persyaratanKualifikasi, setPersyaratanKualifikasi] = useState('');
  const [penutup, setPenutup] = useState('');

  // Tables
  const [perkiraanBiayaList, setPerkiraanBiayaList] = useState<DetailKakPerkiraanBiaya[]>([
    { kpb_uraian: '', kpb_volume: 1, kpb_harga: 0, kpb_jumlah: 0 },
  ]);
  const [spesifikasiTeknisList, setSpesifikasiTeknisList] = useState<DetailKakSpesifikasiTeknis[]>([
    { kst_uraian: '', kst_spesifikasi: '' },
  ]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
  };

  // Helper to generate smart defaults for a new KAK
  const getSmartDefaults = useCallback((mdk: MasterDokumen) => {
    const namaPekerjaan = mdk.mdk_pekerjaan || mdk.mdk_uraian_belanja || 'Pengadaan Barang / Jasa';
    const tahunAnggaran = mdk.mdk_apbd?.match(/\b(20\d\d)\b/)?.[1] || new Date().getFullYear().toString();
    const noDpa = mdk.mdk_no_dpa || '-';
    const ppkNama = mdk.mdk_nama_pejabat || 'DANIEL PERDANA, SE';

    const defaultLatarBelakang = `<p>Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru merupakan perangkat daerah yang mempunyai tugas melaksanakan sebagian urusan pemerintahan daerah di bidang pengelolaan keuangan daerah dan pengelolaan aset daerah. Dalam pelaksanaan tugas dan fungsinya, BPKAD Kota Pekanbaru melaksanakan antara lain pengelolaan anggaran, perbendaharaan, aset daerah, akuntansi, serta fasilitasi penyusunan, penetapan, perubahan dan pertanggungjawaban pelaksanaan Anggaran Pendapatan dan Belanja Daerah (APBD).</p><p>Sejalan dengan meningkatnya kebutuhan akses sistem informasi, aplikasi berbasis Cloud, dan pertukaran data di lingkungan BPKAD Kota Pekanbaru, diperlukan infrastruktur dan sarana prasarana yang andal dan aman guna mendukung percepatan kinerja dan pelayanan.</p><p>Untuk memenuhi kebutuhan tersebut, pada Tahun Anggaran ${tahunAnggaran} BPKAD Kota Pekanbaru melaksanakan kegiatan ${namaPekerjaan} sebagai bagian dari upaya pemenuhan sarana dan prasarana kerja guna menunjang pelaksanaan tugas dan fungsi organisasi.</p>`;

    const defaultMaksudTujuan = `<p><strong>a. Maksud</strong></p><p>Melakukan ${namaPekerjaan} di lingkungan Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru.</p><p><strong>b. Tujuan</strong></p><ul><li>Mengoptimalkan sarana dan prasarana kerja aparatur dalam menunjang pelaksanaan tugas secara efisien dan akuntabel.</li><li>Meningkatkan keandalan operasional sistem informasi dan pertukaran data internal SKPD.</li><li>Memastikan ketersediaan sarana pendukung yang terstandarisasi dan bergaransi resmi.</li></ul>`;

    const defaultReferensiHukum = `<ul><li>Undang-Undang Nomor 23 Tahun 2014 tentang Pemerintahan Daerah sebagaimana telah diubah beberapa kali terakhir dengan Undang-Undang Nomor 11 tahun 2020 tentang Cipta Kerja;</li><li>Peraturan Pemerintah Nomor 27 Tahun 2014 tentang Pengelolaan Barang Milik Negara/Daerah sebagaimana telah diubah dengan Peraturan Pemerintah Nomor 28 Tahun 2020;</li><li>Peraturan Pemerintah Nomor 12 Tahun 2019 tentang Pengelolaan Keuangan Daerah;</li><li>Peraturan Presiden Nomor 16 Tahun 2018 tentang Pengadaan Barang/Jasa Pemerintah sebagaimana telah diubah dengan Peraturan Presiden Nomor 12 Tahun 2021;</li><li>Peraturan Menteri Dalam Negeri Nomor 77 Tahun 2020 tentang Pedoman Teknis Pengelolaan Keuangan Daerah;</li><li>Peraturan Daerah Kota Pekanbaru Nomor 01 Tahun 2023 tentang Pengelolaan Keuangan Daerah;</li><li>Peraturan Wali Kota Pekanbaru Nomor 7 Tahun 2022 tentang Sistem dan Prosedur Pengelolaan Keuangan Daerah.</li></ul>`;

    const defaultTarget = `<p>Terpasangnya dan beroperasinya ${namaPekerjaan} yang memenuhi standar spesifikasi teknis yang dipersyaratkan guna mendukung kelancaran operasional di Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru.</p>`;

    const defaultNamaOrganisasi = `<p>Nama organisasi yang menyelenggarakan/melaksanakan pengadaan barang/jasa:</p><p>a. K/L/PD : Pemerintah Kota Pekanbaru</p><p>b. PD : Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru</p><p>c. PPK : ${ppkNama}</p>`;

    const defaultSumberDanaIntro = `<p><strong>a. Sumber Dana :</strong><br>Anggaran Pendapatan dan Belanja Daerah (APBD) Tahun Anggaran ${tahunAnggaran} Pemerintah Kota Pekanbaru Badan Pengelola Keuangan dan Aset Daerah (No. DPA SKPD : ${noDpa})</p><p><strong>b. Total perkiraan biaya yang diperlukan :</strong></p>`;

    const defaultRuangLingkup = `<p>a) Penyediaan ${namaPekerjaan};<br>b) Penyediaan garansi dan layanan purna jual sesuai ketentuan;<br>c) Serah terima barang setelah seluruh persyaratan jumlah, spesifikasi, kualitas dan fungsi terpenuhi;<br>d) Lokasi pekerjaan : Pekanbaru / BPKAD Kota Pekanbaru.</p>`;

    const defaultJangkaWaktu = `<p>14 (empat belas) Hari Kalender</p>`;

    const defaultPersyaratan = `<ol><li>Memiliki SIUP / NIB yang masih berlaku sesuai bidang pekerjaan;</li><li>Memiliki Nomor Pokok Wajib Pajak (NPWP) dan telah memenuhi kewajiban perpajakan tahun terakhir (SPT Tahunan);</li><li>Memperoleh paling sedikit 1 (satu) pekerjaan sejenis dalam kurun waktu 1 (satu) sampai 3 (tiga) tahun terakhir;</li><li>Tidak dalam pengawasan pengadilan, tidak pailit, kegiatan usahanya tidak sedang dihentikan dan/atau direksi yang bertindak untuk dan atas nama perusahaan tidak sedang dalam menjalani sanksi pidana;</li><li>Memiliki kemampuan untuk menyediakan fasilitas/peralatan/perlengkapan yang dipersyaratkan.</li></ol>`;

    const defaultPenutup = `<p>1. Apabila terdapat hal yang bertentangan dengan ketentuan, peraturan, pedoman dan kebijakan pemerintah yang berlaku maka segala sesuatu yang termaksud di dalam Kerangka Acuan Kerja (KAK) ini akan diteliti dan ditinjau kembali;<br>2. Hal-hal yang belum diatur dalam KAK ini akan ditetapkan lebih lanjut.</p><p><br></p><p>Demikian Kerangka Acuan Kerja ini dibuat. Untuk dapat digunakan dengan sebaik-baiknya.</p>`;

    return {
      defaultLatarBelakang,
      defaultMaksudTujuan,
      defaultReferensiHukum,
      defaultTarget,
      defaultNamaOrganisasi,
      defaultSumberDanaIntro,
      defaultRuangLingkup,
      defaultJangkaWaktu,
      defaultPersyaratan,
      defaultPenutup,
    };
  }, []);

  // Fetch Master Dokumen Options
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

  // Load KAK Data when Master Dokumen changes
  const loadKakForMdk = useCallback(
    async (mdkId: number, targetMaster?: MasterDokumen | null) => {
      setLoadingKak(true);
      const currentMaster = targetMaster ?? selectedMasterDokumen;

      const res = await getKerangkaAcuanKerjaByMasterDokumenAction(mdkId);

      if (res.success && res.data?.kakDetails.kak) {
        const kak = res.data.kakDetails.kak;
        setKakId(kak.kak_id);
        setLatarBelakang(kak.kak_latar_belakang || '');
        setMaksudDanTujuan(kak.kak_maksud_dan_tujuan || '');
        setReferensiHukum(kak.kak_referensi_hukum || '');
        setTargetSasaran(kak.kak_target_sasaran || '');
        setNamaOrganisasi(kak.kak_nama_organisasi_dan_pengadaan || '');
        setSumberDanaIntro(kak.kak_sumber_dana_perkiraan_biaya || '');
        setRuangLingkup(kak.kak_ruang_lingkup_lokasi_pekerjaan || '');
        setJangkaWaktu(kak.kak_jangka_waktu_pelaksanaan || '');
        setMetodePemilihan(kak.kak_metode_pemilihan || 'e-Purchasing');
        setPersyaratanKualifikasi(kak.kak_persyaratan_kualifikasi_penyedia || '');
        setPenutup(kak.kak_penutup || '');

        setPerkiraanBiayaList(
          res.data.kakDetails.perkiraanBiayaList.length > 0
            ? res.data.kakDetails.perkiraanBiayaList
            : [{ kpb_uraian: '', kpb_volume: 1, kpb_harga: 0, kpb_jumlah: 0 }]
        );

        setSpesifikasiTeknisList(
          res.data.kakDetails.spesifikasiTeknisList.length > 0
            ? res.data.kakDetails.spesifikasiTeknisList
            : [{ kst_uraian: '', kst_spesifikasi: '' }]
        );

        setHasSavedData(true);
      } else {
        // No existing KAK saved yet; populate smart boilerplate defaults
        setKakId(null);
        setHasSavedData(false);

        if (currentMaster) {
          const defaults = getSmartDefaults(currentMaster);
          setLatarBelakang(defaults.defaultLatarBelakang);
          setMaksudDanTujuan(defaults.defaultMaksudTujuan);
          setReferensiHukum(defaults.defaultReferensiHukum);
          setTargetSasaran(defaults.defaultTarget);
          setNamaOrganisasi(defaults.defaultNamaOrganisasi);
          setSumberDanaIntro(defaults.defaultSumberDanaIntro);
          setRuangLingkup(defaults.defaultRuangLingkup);
          setJangkaWaktu(defaults.defaultJangkaWaktu);
          setMetodePemilihan('e-Purchasing');
          setPersyaratanKualifikasi(defaults.defaultPersyaratan);
          setPenutup(defaults.defaultPenutup);

          // Try pulling HPS items automatically if available
          const hpsRes = await getHpsItemsForKakAction(mdkId);
          if (hpsRes.success && hpsRes.data && hpsRes.data.length > 0) {
            const hpsRows: DetailKakPerkiraanBiaya[] = hpsRes.data.map((item: any) => {
              const vol = Number(item.hps_volume) || 1;
              const harga = Number(item.hps_harga_satuan) || 0;
              const jumlah = Number(item.hps_harga_perkiraan_sendiri) || vol * harga;
              return {
                kpb_uraian: item.hps_uraian_pekerjaan || '',
                kpb_volume: vol,
                kpb_harga: harga,
                kpb_jumlah: jumlah,
              };
            });
            setPerkiraanBiayaList(hpsRows);

            const specRows: DetailKakSpesifikasiTeknis[] = hpsRes.data.map((item: any) => ({
              kst_uraian: item.hps_uraian_pekerjaan || '',
              kst_spesifikasi: '',
            }));
            setSpesifikasiTeknisList(specRows);
          } else {
            setPerkiraanBiayaList([{ kpb_uraian: currentMaster.mdk_pekerjaan || currentMaster.mdk_uraian_belanja || '', kpb_volume: 1, kpb_harga: 0, kpb_jumlah: 0 }]);
            setSpesifikasiTeknisList([{ kst_uraian: currentMaster.mdk_pekerjaan || currentMaster.mdk_uraian_belanja || '', kst_spesifikasi: '' }]);
          }
        }
      }
      setLoadingKak(false);
    },
    [selectedMasterDokumen, getSmartDefaults]
  );

  useEffect(() => {
    if (selectedMdkId) {
      loadKakForMdk(Number(selectedMdkId));
    }
  }, [selectedMdkId, loadKakForMdk]);

  const handleSelectMasterDokumen = (mdkId: number) => {
    setSelectedMdkId(mdkId);
    const found = masterDokumenList.find((m) => m.mdk_id === mdkId) || null;
    setSelectedMasterDokumen(found);
    loadKakForMdk(mdkId, found);
  };

  // Pull HPS items manually
  const handlePullFromHps = async () => {
    if (!selectedMdkId) return;
    setPullingHps(true);
    const res = await getHpsItemsForKakAction(Number(selectedMdkId));
    if (res.success && res.data && res.data.length > 0) {
      const rows: DetailKakPerkiraanBiaya[] = res.data.map((item: any) => {
        const vol = Number(item.hps_volume) || 1;
        const harga = Number(item.hps_harga_satuan) || 0;
        const jumlah = Number(item.hps_harga_perkiraan_sendiri) || vol * harga;
        return {
          kpb_uraian: item.hps_uraian_pekerjaan || '',
          kpb_volume: vol,
          kpb_harga: harga,
          kpb_jumlah: jumlah,
        };
      });
      setPerkiraanBiayaList(rows);

      // Also append to spesifikasi teknis if empty
      const existingSpecsWithContent = spesifikasiTeknisList.filter((s) => s.kst_uraian.trim() !== '' || s.kst_spesifikasi.trim() !== '');
      if (existingSpecsWithContent.length === 0) {
        setSpesifikasiTeknisList(
          res.data.map((item: any) => ({
            kst_uraian: item.hps_uraian_pekerjaan || '',
            kst_spesifikasi: '',
          }))
        );
      }
      showToast('success', `Berhasil menarik ${res.data.length} item dari HPS!`);
    } else {
      showToast('error', 'Tidak ditemukan data rincian HPS pada dokumen ini.');
    }
    setPullingHps(false);
  };

  // Save handler
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedMdkId) {
      showToast('error', 'Pilih Master Dokumen terlebih dahulu.');
      return;
    }

    setSaving(true);
    const payload = {
      kak_master_dokumen_id: Number(selectedMdkId),
      kak_latar_belakang: latarBelakang,
      kak_maksud_dan_tujuan: maksudDanTujuan,
      kak_referensi_hukum: referensiHukum,
      kak_target_sasaran: targetSasaran,
      kak_nama_organisasi_dan_pengadaan: namaOrganisasi,
      kak_sumber_dana_perkiraan_biaya: sumberDanaIntro,
      kak_ruang_lingkup_lokasi_pekerjaan: ruangLingkup,
      kak_jangka_waktu_pelaksanaan: jangkaWaktu,
      kak_metode_pemilihan: metodePemilihan,
      kak_persyaratan_kualifikasi_penyedia: persyaratanKualifikasi,
      kak_penutup: penutup,
      perkiraanBiayaList: perkiraanBiayaList.map((item) => ({
        kpb_uraian: item.kpb_uraian,
        kpb_volume: Number(item.kpb_volume) || 0,
        kpb_harga: Number(item.kpb_harga) || 0,
        kpb_jumlah: Number(item.kpb_jumlah) || (Number(item.kpb_volume) || 0) * (Number(item.kpb_harga) || 0),
      })),
      spesifikasiTeknisList: spesifikasiTeknisList.map((item) => ({
        kst_uraian: item.kst_uraian,
        kst_spesifikasi: item.kst_spesifikasi,
      })),
    };

    const res = await saveKerangkaAcuanKerjaAction(payload);
    if (res.success && res.data) {
      setKakId(res.data.kakId);
      setHasSavedData(true);
      showToast('success', res.message || 'Kerangka Acuan Kerja berhasil disimpan!');
    } else {
      showToast('error', res.message || 'Gagal menyimpan Kerangka Acuan Kerja.');
    }
    setSaving(false);
  };

  // Print PDF in new tab
  const handlePrintPdf = async () => {
    if (!selectedMdkId) return;
    await handleSave();
    window.open(`/kerangka-acuan-kerja/print/${selectedMdkId}`, '_blank');
  };

  // Calculation for perkiraan biaya
  const totalBiaya = perkiraanBiayaList.reduce((acc, curr) => acc + (Number(curr.kpb_jumlah) || 0), 0);
  const terbilangBiaya = terbilang(totalBiaya);

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
            Kerangka Acuan Kerja (KAK) / TOR
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Kelola dokumen Kerangka Acuan Kerja (Term of Reference) pengadaan barang dan jasa
          </p>
        </div>

        {selectedMasterDokumen && (
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handlePrintPdf}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Cetak KAK (PDF)
            </button>
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : hasSavedData ? 'Perbarui KAK' : 'Simpan KAK'}
            </button>
          </div>
        )}
      </div>

      {/* CARD ATAS: Master Dokumen Selector & Details */}
      <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Pilih Master Dokumen Acuan</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Pilih Master Dokumen untuk menarik otomatis Program, Kegiatan, Pekerjaan, Kode Rekening, dan Pagu Anggaran
            </p>
          </div>
          {hasSavedData && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 self-start sm:self-auto">
              ✓ Data KAK Tersimpan di Database
            </span>
          )}
        </div>

        {loadingOptions ? (
          <div className="h-10 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl" />
        ) : (
          <SearchableSelect
            options={masterDokumenList.map((mdk) => ({
              value: mdk.mdk_id,
              label: mdk.mdk_uraian_belanja || 'Dokumen Tanpa Judul',
              sublabel: `[${mdk.mdk_pekerjaan || '-'}] (No. DPA: ${mdk.mdk_no_dpa || '-'})`,
            }))}
            value={selectedMdkId}
            onChange={(val) => handleSelectMasterDokumen(Number(val))}
            placeholder="-- Pilih Master Dokumen --"
            searchPlaceholder="Cari berdasarkan uraian belanja, bidang, atau No. DPA..."
            disabled={masterDokumenList.length === 0}
          />
        )}

        {/* Selected Master Dokumen Details Banner */}
        {selectedMasterDokumen && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/70 to-indigo-50/60 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200/60 dark:border-blue-900/40 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <span className="text-gray-500 dark:text-gray-400 block font-medium">SKPD / Unit Kerja:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru - {selectedMasterDokumen.mdk_bagian}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block font-medium">Program:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {selectedMasterDokumen.mdk_program || '-'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block font-medium">Kegiatan:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {selectedMasterDokumen.mdk_kegiatan || '-'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block font-medium">Sub Kegiatan:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {selectedMasterDokumen.mdk_sub_kegiatan || '-'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block font-medium">Pekerjaan:</span>
                <span className="font-bold text-brand-600 dark:text-brand-400">
                  {selectedMasterDokumen.mdk_pekerjaan || selectedMasterDokumen.mdk_uraian_belanja || '-'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block font-medium">Kode Rekening Belanja:</span>
                <span className="font-mono font-semibold text-gray-900 dark:text-white">
                  {selectedMasterDokumen.mdk_rekening_belanja || '-'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block font-medium">No. DPA SKPD:</span>
                <span className="font-mono font-semibold text-gray-900 dark:text-white">
                  {selectedMasterDokumen.mdk_no_dpa || '-'}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block font-medium">Pagu Anggaran:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {formatRupiah(selectedMasterDokumen.mdk_pagu_anggaran)}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400 block font-medium">Pejabat PPK:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {selectedMasterDokumen.mdk_nama_pejabat || '-'} (NIP. {selectedMasterDokumen.mdk_nip_pejabat || '-'})
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {loadingKak ? (
        <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-500">Memuat isi form Kerangka Acuan Kerja...</p>
        </div>
      ) : selectedMasterDokumen ? (
        <form onSubmit={handleSave} className="space-y-6">
          {/* 1. Latar Belakang */}
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-500 text-white font-bold text-xs flex items-center justify-center">1</span>
              <label className="text-sm font-bold text-gray-900 dark:text-white">
                LATAR BELAKANG
              </label>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Uraikan tugas pokok BPKAD, urgensi kebutuhan sarana/prasarana, dan alasan dilaksanakannya pekerjaan ini.
            </p>
            <RichTextEditor
              value={latarBelakang}
              onChange={setLatarBelakang}
              minHeight="140px"
              placeholder="Tulis latar belakang pekerjaan..."
            />
          </div>

          {/* 2. Maksud dan Tujuan */}
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-500 text-white font-bold text-xs flex items-center justify-center">2</span>
              <label className="text-sm font-bold text-gray-900 dark:text-white">
                MAKSUD DAN TUJUAN
              </label>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Jelaskan apa yang ingin dicapai melalui pengadaan ini (Maksud dan butir-butir Tujuan).
            </p>
            <RichTextEditor
              value={maksudDanTujuan}
              onChange={setMaksudDanTujuan}
              minHeight="130px"
              placeholder="Tulis maksud dan tujuan..."
            />
          </div>

          {/* 3. Referensi Hukum */}
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-500 text-white font-bold text-xs flex items-center justify-center">3</span>
              <label className="text-sm font-bold text-gray-900 dark:text-white">
                REFERENSI HUKUM
              </label>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Daftar peraturan perundang-undangan yang menjadi dasar pelaksanaan (UU, PP, Perpres, Permendagri, Perda, Perwako).
            </p>
            <RichTextEditor
              value={referensiHukum}
              onChange={setReferensiHukum}
              minHeight="140px"
              placeholder="Tulis referensi hukum..."
            />
          </div>

          {/* 4. Target / Sasaran */}
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-500 text-white font-bold text-xs flex items-center justify-center">4</span>
              <label className="text-sm font-bold text-gray-900 dark:text-white">
                TARGET / SASARAN
              </label>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Target output hasil pengadaan yang harus tercapai dan terpasang/beroperasi.
            </p>
            <RichTextEditor
              value={targetSasaran}
              onChange={setTargetSasaran}
              minHeight="100px"
              placeholder="Tulis target / sasaran..."
            />
          </div>

          {/* 5. Nama Organisasi Pengadaan Jasa Lainnya / Barang */}
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-500 text-white font-bold text-xs flex items-center justify-center">5</span>
              <label className="text-sm font-bold text-gray-900 dark:text-white">
                NAMA ORGANISASI PENGADAAN JASA LAINNYA / BARANG
              </label>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              K/L/PD, Perangkat Daerah, dan nama Pejabat Pembuat Komitmen (PPK).
            </p>
            <RichTextEditor
              value={namaOrganisasi}
              onChange={setNamaOrganisasi}
              minHeight="100px"
              placeholder="Tulis nama organisasi pengadaan..."
            />
          </div>

          {/* 6. Sumber Dana dan Perkiraan Biaya (Dengan Tabel Dinamis) */}
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-500 text-white font-bold text-xs flex items-center justify-center">6</span>
                <label className="text-sm font-bold text-gray-900 dark:text-white">
                  SUMBER DANA DAN PERKIRAAN BIAYA
                </label>
              </div>
              <button
                type="button"
                onClick={handlePullFromHps}
                disabled={pullingHps}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto disabled:opacity-50"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {pullingHps ? 'Menarik...' : 'Tarik Rincian dari HPS'}
              </button>
            </div>

            {/* Pengantar Teks Sumber Dana */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Keterangan Sumber Dana & Pengantar Biaya:
              </span>
              <RichTextEditor
                value={sumberDanaIntro}
                onChange={setSumberDanaIntro}
                minHeight="90px"
                placeholder="Tulis sumber dana dan pengantar..."
              />
            </div>

            {/* Tabel Detail Perkiraan Biaya */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                  Tabel Rincian Perkiraan Biaya
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setPerkiraanBiayaList([
                      ...perkiraanBiayaList,
                      { kpb_uraian: '', kpb_volume: 1, kpb_harga: 0, kpb_jumlah: 0 },
                    ])
                  }
                  className="px-3 py-1 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all flex items-center gap-1 cursor-pointer"
                >
                  + Tambah Baris
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full text-xs text-left">
                  <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold uppercase border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-3 py-2.5 w-10 text-center">No</th>
                      <th className="px-3 py-2.5">Uraian Pekerjaan / Barang</th>
                      <th className="px-3 py-2.5 w-24 text-center">Volume</th>
                      <th className="px-3 py-2.5 w-36 text-right">Harga Satuan (Rp)</th>
                      <th className="px-3 py-2.5 w-40 text-right">Jumlah (Rp)</th>
                      <th className="px-3 py-2.5 w-14 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {perkiraanBiayaList.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                        <td className="px-3 py-2 text-center font-semibold text-gray-500">
                          {idx + 1}
                        </td>
                        <td className="px-2 py-1.5">
                          <input
                            type="text"
                            value={row.kpb_uraian}
                            onChange={(e) => {
                              const updated = [...perkiraanBiayaList];
                              updated[idx].kpb_uraian = e.target.value;
                              setPerkiraanBiayaList(updated);
                            }}
                            placeholder="Nama / Uraian barang..."
                            className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                          />
                        </td>
                        <td className="px-2 py-1.5">
                          <input
                            type="number"
                            min="1"
                            value={row.kpb_volume || ''}
                            onChange={(e) => {
                              const updated = [...perkiraanBiayaList];
                              const vol = Number(e.target.value) || 0;
                              updated[idx].kpb_volume = vol;
                              updated[idx].kpb_jumlah = vol * (Number(updated[idx].kpb_harga) || 0);
                              setPerkiraanBiayaList(updated);
                            }}
                            className="w-full text-center px-2 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                          />
                        </td>
                        <td className="px-2 py-1.5">
                          <RupiahInput
                            value={row.kpb_harga}
                            onChange={(val) => {
                              const updated = [...perkiraanBiayaList];
                              const harga = Number(val) || 0;
                              updated[idx].kpb_harga = harga;
                              updated[idx].kpb_jumlah = (Number(updated[idx].kpb_volume) || 0) * harga;
                              setPerkiraanBiayaList(updated);
                            }}
                            className="w-full text-right px-2 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                          />
                        </td>
                        <td className="px-3 py-2 text-right font-mono font-bold text-gray-900 dark:text-white">
                          {formatRupiah(row.kpb_jumlah)}
                        </td>
                        <td className="px-2 py-2 text-center">
                          {perkiraanBiayaList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                setPerkiraanBiayaList(perkiraanBiayaList.filter((_, i) => i !== idx));
                              }}
                              className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50 dark:hover:bg-red-950/30"
                              title="Hapus baris"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {/* TOTAL ROW */}
                    <tr className="bg-gray-100 dark:bg-gray-800/80 font-bold">
                      <td colSpan={4} className="px-3 py-2 text-right uppercase tracking-wider text-xs">
                        TOTAL BIAYA:
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-sm text-brand-600 dark:text-brand-400">
                        {formatRupiah(totalBiaya)}
                      </td>
                      <td />
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Terbilang */}
              <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Terbilang : </span>
                <span className="italic font-serif">{terbilangBiaya} Rupiah</span>
              </div>
            </div>
          </div>

          {/* 7. Ruang Lingkup dan Lokasi Pekerjaan */}
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-500 text-white font-bold text-xs flex items-center justify-center">7</span>
              <label className="text-sm font-bold text-gray-900 dark:text-white">
                RUANG LINGKUP DAN LOKASI PEKERJAAN
              </label>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Penyediaan barang/jasa, garansi dan purna jual, serah terima, serta lokasi pekerjaan.
            </p>
            <RichTextEditor
              value={ruangLingkup}
              onChange={setRuangLingkup}
              minHeight="120px"
              placeholder="Tulis ruang lingkup dan lokasi pekerjaan..."
            />
          </div>

          {/* 8. Jangka Waktu Pelaksanaan */}
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-500 text-white font-bold text-xs flex items-center justify-center">8</span>
              <label className="text-sm font-bold text-gray-900 dark:text-white">
                JANGKA WAKTU PELAKSANAAN
              </label>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Masa waktu pelaksanaan pekerjaan (contoh: 14 (empat belas) Hari Kalender).
            </p>
            <RichTextEditor
              value={jangkaWaktu}
              onChange={setJangkaWaktu}
              minHeight="80px"
              placeholder="Contoh: 14 (empat belas) Hari Kalender"
            />
          </div>

          {/* 9. Metoda Pemilihan */}
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-500 text-white font-bold text-xs flex items-center justify-center">9</span>
              <label className="text-sm font-bold text-gray-900 dark:text-white">
                METODA PEMILIHAN
              </label>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Metode pemilihan penyedia (misal: e-Purchasing, Pengadaan Langsung, Tender, Penunjukan Langsung).
            </p>
            <div className="flex flex-wrap gap-2">
              {['e-Purchasing', 'Pengadaan Langsung', 'Tender', 'Penunjukan Langsung'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMetodePemilihan(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${metodePemilihan === m
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                >
                  {m}
                </button>
              ))}
              <input
                type="text"
                value={metodePemilihan}
                onChange={(e) => setMetodePemilihan(e.target.value)}
                placeholder="Atau ketik metode pemilihan lain..."
                className="flex-1 min-w-[200px] px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 10. Spesifikasi Teknis (Dengan Tabel Dinamis) */}
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-500 text-white font-bold text-xs flex items-center justify-center">10</span>
                <label className="text-sm font-bold text-gray-900 dark:text-white">
                  SPESIFIKASI TEKNIS
                </label>
              </div>
              <button
                type="button"
                onClick={() =>
                  setSpesifikasiTeknisList([
                    ...spesifikasiTeknisList,
                    { kst_uraian: '', kst_spesifikasi: '' },
                  ])
                }
                className="px-3 py-1 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all flex items-center gap-1 cursor-pointer"
              >
                + Tambah Spesifikasi
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Rincian spesifikasi teknis barang/komponen yang dipersyaratkan.
            </p>

            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold uppercase border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-3 py-2.5 w-10 text-center">No</th>
                    <th className="px-3 py-2.5 w-60">Uraian / Nama Produk</th>
                    <th className="px-3 py-2.5">Spesifikasi Teknis Detail</th>
                    <th className="px-3 py-2.5 w-14 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {spesifikasiTeknisList.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                      <td className="px-3 py-2 text-center font-semibold text-gray-500 align-top pt-3">
                        {idx + 1}
                      </td>
                      <td className="px-2 py-2 align-top">
                        <textarea
                          rows={3}
                          value={row.kst_uraian}
                          onChange={(e) => {
                            const updated = [...spesifikasiTeknisList];
                            updated[idx].kst_uraian = e.target.value;
                            setSpesifikasiTeknisList(updated);
                          }}
                          placeholder="Nama barang / produk..."
                          className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                        />
                      </td>
                      <td className="px-2 py-2 align-top">
                        <textarea
                          rows={4}
                          value={row.kst_spesifikasi}
                          onChange={(e) => {
                            const updated = [...spesifikasiTeknisList];
                            updated[idx].kst_spesifikasi = e.target.value;
                            setSpesifikasiTeknisList(updated);
                          }}
                          placeholder="Spesifikasi teknis lengkap (CPU, RAM, Fitur, Dimensi, dll)..."
                          className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                        />
                      </td>
                      <td className="px-2 py-2 text-center align-top pt-3">
                        {spesifikasiTeknisList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setSpesifikasiTeknisList(spesifikasiTeknisList.filter((_, i) => i !== idx));
                            }}
                            className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50 dark:hover:bg-red-950/30"
                            title="Hapus baris"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 11. Persyaratan Kualifikasi Penyedia */}
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-500 text-white font-bold text-xs flex items-center justify-center">11</span>
              <label className="text-sm font-bold text-gray-900 dark:text-white">
                PERSYARATAN KUALIFIKASI PENYEDIA
              </label>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Syarat legalitas, perizinan berusaha (SIUP/NIB/KBLI), NPWP & SPT, pengalaman kerja sejenis, dan integritas.
            </p>
            <RichTextEditor
              value={persyaratanKualifikasi}
              onChange={setPersyaratanKualifikasi}
              minHeight="140px"
              placeholder="Tulis persyaratan kualifikasi..."
            />
          </div>

          {/* 12. Penutup */}
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-500 text-white font-bold text-xs flex items-center justify-center">12</span>
              <label className="text-sm font-bold text-gray-900 dark:text-white">
                PENUTUP
              </label>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Klausul penutup dokumen Kerangka Acuan Kerja (peninjauan kembali bila terdapat perubahan peraturan).
            </p>
            <RichTextEditor
              value={penutup}
              onChange={setPenutup}
              minHeight="110px"
              placeholder="Tulis klausul penutup..."
            />
          </div>

          {/* Form Actions Footer */}
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Pastikan seluruh rincian dan spesifikasi teknis telah terisi dengan benar sebelum mencetak dokumen.
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handlePrintPdf}
                className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Cetak KAK (PDF)
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
                  'Perbarui KAK'
                ) : (
                  'Simpan KAK'
                )}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 text-gray-500">
          Silakan pilih Master Dokumen acuan di atas untuk mengelola Kerangka Acuan Kerja (KAK).
        </div>
      )}
    </div>
  );
};

