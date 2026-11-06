"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MasterDokumen } from '../../master-dokumen/types';
import {
  getMasterDokumenOptionsAction,
  getBeritaAcaraByMasterDokumenAction,
  getRencanaAnggaranBiayaByMasterDokumenAction,
  saveBeritaAcaraBatchAction,
  getMasterJenisBeritaAcaraAction,
  getMasterBaBuktiPerikatanAction,
} from '../actions';
import { getPaketByMasterDokumenAction } from '@/features/perhitungan-paket/actions';
import { formatRupiah, terbilang } from '@/lib/terbilang';
import { formatDateYYYYMMDD, formatDateIndonesian, formatDateToLegalWords } from '@/lib/date';
import { MasterDokumenSelectorCard } from '../../master-dokumen/components/MasterDokumenSelectorCard';
import { Toast } from '@/components/ui/Toast';
import { MasterJenisBeritaAcara, MasterBaBuktiPerikatan } from '../types';

interface BeritaAcaraItemRow {
  dba_id?: number;
  dba_berita_acara_id?: number | null;
  dba_master_dokumen_id?: number;
  dba_uraian: string;
  dba_volume: string;
  dba_satuan: string;
  dba_status_pemeriksaan: string;
}

const createEmptyRow = (): BeritaAcaraItemRow => ({
  dba_uraian: '',
  dba_volume: '',
  dba_satuan: '',
  dba_status_pemeriksaan: '100% Selesai',
});

interface BeritaAcaraContainerProps {
  initialMasterDokumenId?: number;
  hideMasterDokumenSelector?: boolean;
}

export const BeritaAcaraContainer: React.FC<BeritaAcaraContainerProps> = ({
  initialMasterDokumenId,
  hideMasterDokumenSelector = false,
}) => {
  // Master Dokumen List for Dropdown
  const [masterDokumenList, setMasterDokumenList] = useState<MasterDokumen[]>([]);
  const [selectedMdkId, setSelectedMdkId] = useState<number | ''>(initialMasterDokumenId || '');
  const [selectedMasterDokumen, setSelectedMasterDokumen] = useState<MasterDokumen | null>(null);

  // Master Jenis BA & Bukti Perikatan Options
  const [jenisBaOptions, setJenisBaOptions] = useState<MasterJenisBeritaAcara[]>([]);
  const [buktiPerikatanOptions, setBuktiPerikatanOptions] = useState<MasterBaBuktiPerikatan[]>([]);
  const [selectedJenisBa, setSelectedJenisBa] = useState<string>('001'); // '001': PEMERIKSAAN, '002': SERAH TERIMA
  const [selectedBuktiPerikatan, setSelectedBuktiPerikatan] = useState<string>('002'); // '001': FAKTUR, '002': SPK, dll
  const [bacNomorBuktiPerikatan, setBacNomorBuktiPerikatan] = useState<string>('');

  // Header Berita Acara State
  const [bacNomorSuratPemeriksaan, setBacNomorSuratPemeriksaan] = useState('');
  const [bacNomorSuratSerahTerima, setBacNomorSuratSerahTerima] = useState('');
  const [bacParagrafPertama, setBacParagrafPertama] = useState('');
  const [bacParagrafKedua, setBacParagrafKedua] = useState('');
  const [bacHasilPemeriksaan, setBacHasilPemeriksaan] = useState('');
  const [bacTanggal, setBacTanggal] = useState(() => formatDateYYYYMMDD(new Date()));

  // Nilai aktif nomor surat sesuai jenis berita acara yang dipilih
  const activeNomorSurat = selectedJenisBa === '002' ? bacNomorSuratSerahTerima : bacNomorSuratPemeriksaan;
  const setActiveNomorSurat = (val: string) => {
    if (selectedJenisBa === '002') {
      setBacNomorSuratSerahTerima(val);
    } else {
      setBacNomorSuratPemeriksaan(val);
    }
  };

  // Dynamic BeritaAcara Form Items
  const [BeritaAcaraRows, setBeritaAcaraRows] = useState<BeritaAcaraItemRow[]>([
    createEmptyRow(),
  ]);

  // Loading & Action states
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadingBeritaAcara, setLoadingBeritaAcara] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasSavedData, setHasSavedData] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
  };

  // Helper untuk membuat template narasi otomatis
  const generateNarratives = useCallback(
    (
      jenisKode: string,
      buktiKode: string,
      nomorBukti: string,
      tanggalDoc: string,
      mdk: MasterDokumen | null,
      customNoPemeriksaan?: string
    ) => {
      const buktiObj = buktiPerikatanOptions.find((b) => b.mbk_kode === buktiKode);
      const namaBukti = buktiObj ? buktiObj.mbk_nama : 'SPK';
      const labelBukti = namaBukti === 'SPK' ? 'Surat Perintah Kerja (SPK)' : namaBukti;

      const uraianPekerjaan = mdk?.mdk_pekerjaan || mdk?.mdk_uraian_belanja || mdk?.mdk_kegiatan || 'Penyediaan Jasa';
      const program = mdk?.mdk_program || 'Program Penunjang Urusan Pemerintahan Daerah';
      const kegiatan = mdk?.mdk_kegiatan || 'Kegiatan Administrasi Umum Perangkat Daerah';
      const subKeg = mdk?.mdk_sub_kegiatan || 'Sub Kegiatan Dukungan Pelaksanaan Sistem Pemerintahan Berbasis Elektronik pada SKPD';
      const tahunAnggaran = mdk?.mdk_apbd
        ? mdk.mdk_apbd.replace(/[^0-9]/g, '') || '2024'
        : '2024';
      const noBuktiStr = nomorBukti || '/SEKRETARIAT-027.2/VIII/2026';
      const tglFormatted = formatDateIndonesian(tanggalDoc);

      // Paragraf 1: Pembuka Tanggal Terbilang & Tempat
      const { fullSentence } = formatDateToLegalWords(tanggalDoc);
      const paragraf1 = fullSentence;

      // Paragraf 2: Pernyataan Pemeriksaan / Serah Terima berdasarkan Bukti Perikatan
      let paragraf2 = '';
      let hasilPeriksa = '';

      if (jenisKode === '002') {
        // SERAH TERIMA -> Nomor berdasarkan Berita Acara Hasil Pemeriksaan diambil dari bac_nomor_surat_pemeriksaan
        const noPemeriksaanTampil = customNoPemeriksaan || noBuktiStr;
        paragraf2 = `Dengan ini menyatakan dengan sebenarnya telah melakukan Serah Terima Hasil Pekerjaan berupa ${uraianPekerjaan} ${program}, ${kegiatan}, ${subKeg} berdasarkan Berita Acara Hasil Pemeriksaan Nomor : ${noPemeriksaanTampil} tanggal ${tglFormatted}, dari PIHAK KEDUA kepada PIHAK PERTAMA dan PIHAK PERTAMA menerima dengan baik pelaksanaan pengadaan tersebut dengan uraian sebagai berikut :`;
        hasilPeriksa = `"Pekerjaan/Barang telah diserahterimakan dalam keadaan baik dan lengkap serta dapat dipergunakan sebagaimana mestinya"`;
      } else {
        // PEMERIKSAAN (001)
        paragraf2 = `Dengan ini menyatakan dengan sebenarnya PIHAK PERTAMA telah melakukan Pemeriksaan terhadap Pekerjaan ${uraianPekerjaan}, ${program}, ${kegiatan}, ${subKeg} pada Badan Pengelola Keuangan dan Aset Kota Pekanbaru Tahun Anggaran ${tahunAnggaran} di Pekanbaru berdasarkan ${labelBukti} ${uraianPekerjaan} Nomor : ${noBuktiStr} tanggal ${tglFormatted} dengan kesimpulan sebagai berikut :`;
        hasilPeriksa = `"Barang/Jasa tersebut telah sesuai dengan spesifikasi, jumlah, dalam kondisi baik, lengkap dan dapat digunakan dengan sebagaimana mestinya serta disertai dengan kelengkapan-kelengkapannya"`;
      }

      return { paragraf1, paragraf2, hasilPeriksa };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [buktiPerikatanOptions]
  );

  // Load Master Dokumen & Master Jenis / Bukti on mount
  useEffect(() => {
    async function initOptions() {
      setLoadingOptions(true);
      const [resMdk, resJenis, resBukti] = await Promise.all([
        getMasterDokumenOptionsAction(),
        getMasterJenisBeritaAcaraAction(),
        getMasterBaBuktiPerikatanAction(),
      ]);

      if (resJenis.success && resJenis.data) {
        setJenisBaOptions(resJenis.data);
      }
      if (resBukti.success && resBukti.data) {
        setBuktiPerikatanOptions(resBukti.data);
      }

      if (resMdk.success && resMdk.data) {
        setMasterDokumenList(resMdk.data);
        const targetId = initialMasterDokumenId || (resMdk.data.length > 0 ? resMdk.data[0].mdk_id : '');
        if (targetId) {
          setSelectedMdkId(targetId);
          const found = resMdk.data.find((m) => m.mdk_id === targetId) || null;
          setSelectedMasterDokumen(found);
        }
      } else {
        showToast('error', resMdk.message || 'Gagal memuat opsi Master Dokumen.');
      }
      setLoadingOptions(false);
    }
    initOptions();
  }, [initialMasterDokumenId]);

  // Fetch BeritaAcara items & header whenever selected Master Dokumen or selectedJenisBa changes
  const loadBeritaAcaraForMdk = useCallback(
    async (
      mdkId: number,
      currentMdkObj?: MasterDokumen | null,
      jenisKode = selectedJenisBa
    ) => {
      setLoadingBeritaAcara(true);
      const [res, paketRes] = await Promise.all([
        getBeritaAcaraByMasterDokumenAction(mdkId, jenisKode),
        getPaketByMasterDokumenAction(mdkId),
      ]);

      const paket = paketRes.success && paketRes.data ? paketRes.data : null;
      const paketNoSpk = paket?.pkt_no_spk_kwitansi?.trim() || '';
      const paketBapp = paket?.pkt_bapp?.trim() || '';
      const paketBast = paket?.pkt_bast?.trim() || '';

      if (res.success && res.data) {
        const { header, items } = res.data;
        const isSaved = Boolean(header?.bac_id);
        setHasSavedData(isSaved);

        const mdk = currentMdkObj || selectedMasterDokumen;

        if (header) {
          const loadedJenis = header.bac_master_jenis_ba_id || jenisKode;
          const loadedBukti = header.bac_bukti_perikatan || '002';
          // Gunakan yang tersimpan, jika kosong tarik dari perhitungan paket
          const loadedNomorBukti = header.bac_nomor_bukti_perikatan || paketNoSpk || '';
          const noPem = header.bac_nomor_surat_pemeriksaan || (loadedJenis === '001' ? header.bac_nomor_surat : '') || paketBapp || '';
          const noSer = header.bac_nomor_surat_serah_terima || (loadedJenis === '002' ? header.bac_nomor_surat : '') || paketBast || '';

          setSelectedJenisBa(loadedJenis);
          setSelectedBuktiPerikatan(loadedBukti);
          setBacNomorBuktiPerikatan(loadedNomorBukti);
          setBacNomorSuratPemeriksaan(noPem);
          setBacNomorSuratSerahTerima(noSer);
          setBacParagrafPertama(header.bac_paragraf_pertama || '');
          setBacParagrafKedua(header.bac_paragraf_kedua || '');
          setBacHasilPemeriksaan(header.bac_hasil_pemeriksaan || '');
          setBacTanggal(formatDateYYYYMMDD(header.bac_tanggal) || formatDateYYYYMMDD(new Date()));
        } else {
          // Generate template narasi awal sesuai jenis & bukti perikatan yang aktif
          const defaultTanggal = formatDateYYYYMMDD(new Date());
          const defaultNoSurat = '/SEKRETARIAT-027.2/VIII/2026';
          const defaultNoBukti = paketNoSpk || mdk?.mdk_no_dpa || '/SEKRETARIAT-027.2/VIII/2026';
          const defaultBuktiKode = '002';

          const noPem = paketBapp || defaultNoSurat;
          const noSer = paketBast || defaultNoSurat;

          setBacNomorSuratPemeriksaan(noPem);
          setBacNomorSuratSerahTerima(noSer);
          setSelectedBuktiPerikatan(defaultBuktiKode);
          setBacNomorBuktiPerikatan(defaultNoBukti);
          setBacTanggal(defaultTanggal);

          const { paragraf1, paragraf2, hasilPeriksa } = generateNarratives(
            jenisKode,
            defaultBuktiKode,
            defaultNoBukti,
            defaultTanggal,
            mdk,
            noPem
          );

          setBacParagrafPertama(paragraf1);
          setBacParagrafKedua(paragraf2);
          setBacHasilPemeriksaan(hasilPeriksa);
        }

        if (items && items.length > 0) {
          setBeritaAcaraRows(
            items.map((item) => ({
              dba_id: item.dba_id,
              dba_berita_acara_id: item.dba_berita_acara_id,
              dba_master_dokumen_id: item.dba_master_dokumen_id,
              dba_uraian: item.dba_uraian || '',
              dba_volume: item.dba_volume || '',
              dba_satuan: item.dba_satuan || '',
              dba_status_pemeriksaan: item.dba_status_pemeriksaan || '100% Selesai',
            }))
          );
        } else {
          // Auto-fill detail items from Rencana Anggaran Biaya (RAB) if available
          const rabRes = await getRencanaAnggaranBiayaByMasterDokumenAction(mdkId);
          if (rabRes.success && rabRes.data && rabRes.data.length > 0) {
            setBeritaAcaraRows(
              rabRes.data.map((item) => ({
                dba_master_dokumen_id: mdkId,
                dba_uraian: item.rab_uraian_pekerjaan || '',
                dba_volume: item.rab_volume || '',
                dba_satuan: item.rab_waktu || '',
                dba_status_pemeriksaan: '100% Selesai',
              }))
            );
          } else {
            setBeritaAcaraRows([createEmptyRow()]);
          }
        }
      } else {
        setHasSavedData(false);
        setBeritaAcaraRows([createEmptyRow()]);
      }
      setLoadingBeritaAcara(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedMasterDokumen, generateNarratives]
  );

  const handleCopyFromRAB = async () => {
    if (!selectedMdkId || typeof selectedMdkId !== 'number') {
      showToast('error', 'Silakan pilih Master Dokumen terlebih dahulu.');
      return;
    }
    setLoadingBeritaAcara(true);
    const rabRes = await getRencanaAnggaranBiayaByMasterDokumenAction(selectedMdkId);
    if (rabRes.success && rabRes.data && rabRes.data.length > 0) {
      setBeritaAcaraRows(
        rabRes.data.map((item) => ({
          dba_master_dokumen_id: selectedMdkId,
          dba_uraian: item.rab_uraian_pekerjaan || '',
          dba_volume: item.rab_volume || '',
          dba_satuan: item.rab_waktu || '',
          dba_status_pemeriksaan: '100% Selesai',
        }))
      );
      showToast('success', 'Berhasil menyalin data rincian dari Rencana Anggaran Biaya (RAB).');
    } else {
      showToast('error', 'Tidak ada data Rencana Anggaran Biaya (RAB) untuk Master Dokumen ini.');
    }
    setLoadingBeritaAcara(false);
  };

  const handlePullFromPaket = async () => {
    if (!selectedMdkId || typeof selectedMdkId !== 'number') {
      showToast('error', 'Silakan pilih Master Dokumen terlebih dahulu.');
      return;
    }
    setLoadingBeritaAcara(true);
    const paketRes = await getPaketByMasterDokumenAction(selectedMdkId);
    if (paketRes.success && paketRes.data) {
      const p = paketRes.data;
      const noSpk = p.pkt_no_spk_kwitansi?.trim() || '';
      const bapp = p.pkt_bapp?.trim() || '';
      const bast = p.pkt_bast?.trim() || '';

      if (noSpk) setBacNomorBuktiPerikatan(noSpk);
      if (bapp) setBacNomorSuratPemeriksaan(bapp);
      if (bast) setBacNomorSuratSerahTerima(bast);

      // Refresh narasi paragraf sesuai data baru
      const { paragraf1, paragraf2, hasilPeriksa } = generateNarratives(
        selectedJenisBa,
        selectedBuktiPerikatan,
        noSpk || bacNomorBuktiPerikatan,
        bacTanggal,
        selectedMasterDokumen,
        bapp || bacNomorSuratPemeriksaan
      );
      setBacParagrafPertama(paragraf1);
      setBacParagrafKedua(paragraf2);
      setBacHasilPemeriksaan(hasilPeriksa);

      showToast('success', 'Berhasil menarik data Nomor SPK/Kwitansi, BAPP, dan BAST dari Perhitungan Paket!');
    } else {
      showToast('error', 'Data Perhitungan Paket belum tersedia atau belum disimpan.');
    }
    setLoadingBeritaAcara(false);
  };

  useEffect(() => {
    if (selectedMdkId && typeof selectedMdkId === 'number') {
      const found = masterDokumenList.find((m) => m.mdk_id === selectedMdkId) || null;
      setSelectedMasterDokumen(found);
      loadBeritaAcaraForMdk(selectedMdkId, found);
    } else {
      setSelectedMasterDokumen(null);
      setHasSavedData(false);
      setBacNomorSuratPemeriksaan('');
      setBacNomorSuratSerahTerima('');
      setBacParagrafPertama('');
      setBacParagrafKedua('');
      setBacHasilPemeriksaan('');
      setBacTanggal('');
      setBeritaAcaraRows([createEmptyRow()]);
    }
  }, [selectedMdkId, masterDokumenList, loadBeritaAcaraForMdk]);

  // Handle Dynamic Rows
  const handleAddRow = () => {
    setBeritaAcaraRows((prev) => [...prev, createEmptyRow()]);
  };

  const handleRemoveRow = (index: number) => {
    if (BeritaAcaraRows.length === 1) {
      setBeritaAcaraRows([createEmptyRow()]);
      return;
    }
    setBeritaAcaraRows((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleRowChange = (index: number, field: keyof BeritaAcaraItemRow, value: any) => {
    setBeritaAcaraRows((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Handler ketika Jenis Berita Acara berubah
  const handleJenisBaChange = async (newJenisKode: string) => {
    setSelectedJenisBa(newJenisKode);

    // Dapatkan nomor pemeriksaan yang ada untuk acuan serah terima
    let noPemeriksaanAcuan = bacNomorSuratPemeriksaan;
    if (newJenisKode === '002' && (!noPemeriksaanAcuan || noPemeriksaanAcuan.trim() === '')) {
      if (selectedMdkId && typeof selectedMdkId === 'number') {
        const headerPem = await getBeritaAcaraByMasterDokumenAction(selectedMdkId, '001');
        if (headerPem.success && headerPem.data?.header?.bac_nomor_surat_pemeriksaan) {
          noPemeriksaanAcuan = headerPem.data.header.bac_nomor_surat_pemeriksaan;
          setBacNomorSuratPemeriksaan(noPemeriksaanAcuan);
        }
      }
    }

    // Langsung update Paragraf 2 sesuai template jenis berita acara yang dipilih
    const { paragraf1, paragraf2, hasilPeriksa } = generateNarratives(
      newJenisKode,
      selectedBuktiPerikatan,
      bacNomorBuktiPerikatan,
      bacTanggal,
      selectedMasterDokumen,
      noPemeriksaanAcuan
    );
    setBacParagrafPertama(paragraf1);
    setBacParagrafKedua(paragraf2);
    setBacHasilPemeriksaan(hasilPeriksa);

    if (selectedMdkId && typeof selectedMdkId === 'number') {
      loadBeritaAcaraForMdk(selectedMdkId, selectedMasterDokumen, newJenisKode);
    }
  };

  // Handler ketika Bukti Perikatan berubah
  const handleBuktiPerikatanChange = (newBuktiKode: string) => {
    setSelectedBuktiPerikatan(newBuktiKode);
    // Refresh narasi dengan bukti perikatan baru
    const { paragraf1, paragraf2 } = generateNarratives(
      selectedJenisBa,
      newBuktiKode,
      bacNomorBuktiPerikatan,
      bacTanggal,
      selectedMasterDokumen
    );
    setBacParagrafPertama(paragraf1);
    setBacParagrafKedua(paragraf2);
  };

  // Handler ketika Nomor Bukti Perikatan berubah
  const handleNomorBuktiPerikatanChange = (newNomorBukti: string) => {
    setBacNomorBuktiPerikatan(newNomorBukti);
    const { paragraf1, paragraf2 } = generateNarratives(
      selectedJenisBa,
      selectedBuktiPerikatan,
      newNomorBukti,
      bacTanggal,
      selectedMasterDokumen
    );
    setBacParagrafPertama(paragraf1);
    setBacParagrafKedua(paragraf2);
  };

  // Handler ketika Tanggal Berita Acara berubah -> otomatis update narasi Paragraf 1 (hari & tanggal terbilang) & tanggal di Paragraf 2
  const handleTanggalChange = (newDateStr: string) => {
    setBacTanggal(newDateStr);
    const { fullSentence } = formatDateToLegalWords(newDateStr);
    setBacParagrafPertama(fullSentence);

    // Update juga tanggal di bacParagrafKedua jika ada
    if (bacParagrafKedua) {
      const tglFormatted = formatDateIndonesian(newDateStr);
      const updatedPar2 = bacParagrafKedua.replace(
        /(\btanggal\s+)([\w\d\s]+?)(\s+dengan\s+kesimpulan)/i,
        `$1${tglFormatted}$3`
      );
      if (updatedPar2 !== bacParagrafKedua) {
        setBacParagrafKedua(updatedPar2);
      }
    }
  };

  // Handler regenerate narasi sesuai data master dokumen terbaru
  const handleRegenerateNarasi = () => {
    const { paragraf1, paragraf2, hasilPeriksa } = generateNarratives(
      selectedJenisBa,
      selectedBuktiPerikatan,
      bacNomorBuktiPerikatan,
      bacTanggal,
      selectedMasterDokumen
    );
    setBacParagrafPertama(paragraf1);
    setBacParagrafKedua(paragraf2);
    setBacHasilPemeriksaan(hasilPeriksa);
    showToast('success', 'Narasi berhasil di-generate ulang sesuai template standar.');
  };

  // Save Batch Data
  const saveBatch = async () => {
    if (!selectedMdkId || typeof selectedMdkId !== 'number') return false;
    const validRows = BeritaAcaraRows.filter((r) => r.dba_uraian.trim() !== '');
    if (validRows.length === 0) return false;

    const res = await saveBeritaAcaraBatchAction({
      bac_master_dokumen_id: selectedMdkId,
      bac_master_jenis_ba_id: selectedJenisBa,
      bac_bukti_perikatan: selectedBuktiPerikatan,
      bac_nomor_bukti_perikatan: bacNomorBuktiPerikatan,
      bac_nomor_surat_pemeriksaan: bacNomorSuratPemeriksaan,
      bac_nomor_surat_serah_terima: bacNomorSuratSerahTerima,
      bac_nomor_surat: activeNomorSurat,
      bac_paragraf_pertama: bacParagrafPertama,
      bac_paragraf_kedua: bacParagrafKedua,
      bac_hasil_pemeriksaan: bacHasilPemeriksaan,
      bac_tanggal: bacTanggal,
      items: validRows.map((r) => ({
        dba_uraian: r.dba_uraian,
        dba_volume: r.dba_volume,
        dba_satuan: r.dba_satuan,
        dba_status_pemeriksaan: r.dba_status_pemeriksaan || '100% Selesai',
      })),
    });
    return res.success;
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMdkId || typeof selectedMdkId !== 'number') {
      showToast('error', 'Silakan pilih Master Dokumen terlebih dahulu.');
      return;
    }

    const validRows = BeritaAcaraRows.filter((r) => r.dba_uraian.trim() !== '');
    if (validRows.length === 0) {
      showToast('error', 'Minimal isi 1 Uraian Hasil Pekerjaan.');
      return;
    }

    setSaving(true);
    const success = await saveBatch();
    setSaving(false);

    if (success) {
      showToast('success', 'Berhasil menyimpan data Berita Acara!');
      setHasSavedData(true);
      // loadBeritaAcaraForMdk(selectedMdkId, selectedMasterDokumen, selectedJenisBa, selectedBuktiPerikatan);
    } else {
      showToast('error', 'Gagal menyimpan data Berita Acara.');
    }
  };

  // Open PDF in new tab
  const handlePrintPdf = useCallback(async () => {
    if (!selectedMdkId) return;
    const validRows = BeritaAcaraRows.filter((r) => r.dba_uraian.trim() !== '');
    if (validRows.length > 0) {
      await saveBatch();
      setHasSavedData(true);
    }
    window.open(`/berita-acara/print/${selectedMdkId}?jenis=${selectedJenisBa}`, '_blank');
  }, [selectedMdkId, BeritaAcaraRows, activeNomorSurat, bacParagrafPertama, bacParagrafKedua, bacHasilPemeriksaan, selectedJenisBa, saveBatch]);

  // Calculation metrics
  const paguNominal = Number(selectedMasterDokumen?.mdk_pagu_anggaran) || 0;
  const isLocked = selectedMasterDokumen?.mdk_is_lock === 1;
  const terbilangStr = terbilang(paguNominal);
  const isSaved = hasSavedData || BeritaAcaraRows.some((r) => Boolean(r.dba_id));

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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Formulir Berita Acara</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Kelola teks paragraf, nomor surat, dan rincian item hasil pemeriksaan pekerjaan
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
              subtitle="Pilih dokumen acuan untuk Berita Acara"
              masterDokumenList={masterDokumenList}
              selectedMdkId={selectedMdkId}
              selectedMasterDokumen={selectedMasterDokumen}
              onSelect={(val) => setSelectedMdkId(val)}
              loadingOptions={loadingOptions}
            />
          </div>
        )}

        {/* Right Side (Dynamic BeritaAcara Form Section) */}
        <div className="min-w-0 space-y-6">
          {selectedMasterDokumen ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Card 1: Informasi Header & Teks Paragraf Berita Acara */}
              <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                <div className="pb-3 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                        📄
                      </span>
                      Informasi & Teks Paragraf Berita Acara
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Pilih jenis berita acara, dasar bukti perikatan, serta nomor surat dan narasi
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePullFromPaket}
                      className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/40 dark:hover:bg-brand-900/60 text-brand-700 dark:text-brand-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Tarik otomatis No. SPK/Kwitansi, BAPP, dan BAST dari Perhitungan Paket"
                    >
                      <svg className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Tarik dari Perhitungan Paket
                    </button>
                    <button
                      type="button"
                      onClick={handleRegenerateNarasi}
                      className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Generate ulang narasi sesuai data Master Dokumen & Bukti Perikatan"
                    >
                      <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reset Template Narasi
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Row 1: Combo Box Jenis Berita Acara, Bukti Perikatan, & Nomor Bukti Perikatan */}
                  <div
                    className={`grid gap-4 p-3.5 rounded-xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/80 dark:border-gray-700/60 ${selectedJenisBa === '002' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-3'
                      }`}
                  >
                    {/* Jenis Berita Acara */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Jenis Berita Acara <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={selectedJenisBa}
                        onChange={(e) => handleJenisBaChange(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all cursor-pointer"
                      >
                        {jenisBaOptions.length > 0 ? (
                          jenisBaOptions.map((opt) => (
                            <option key={opt.mba_id} value={opt.mba_kode}>
                              {opt.mba_nama}
                            </option>
                          ))
                        ) : (
                          <>
                            <option value="001">PEMERIKSAAN</option>
                            <option value="002">SERAH TERIMA</option>
                          </>
                        )}
                      </select>
                    </div>

                    {/* Bukti Perikatan (Hanya tampil untuk Pemeriksaan) */}
                    {selectedJenisBa !== '002' && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                          Bukti Perikatan <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={selectedBuktiPerikatan}
                          onChange={(e) => handleBuktiPerikatanChange(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all cursor-pointer"
                        >
                          {buktiPerikatanOptions.length > 0 ? (
                            buktiPerikatanOptions.map((opt) => (
                              <option key={opt.mbk_id} value={opt.mbk_kode}>
                                {opt.mbk_nama}
                              </option>
                            ))
                          ) : (
                            <>
                              <option value="001">FAKTUR</option>
                              <option value="002">SPK</option>
                              <option value="003">SURAT PESANAN</option>
                              <option value="004">SURAT PERJANJIAN/KONTRAK</option>
                            </>
                          )}
                        </select>
                      </div>
                    )}

                    {/* Nomor Bukti Perikatan (Hanya tampil untuk Pemeriksaan) */}
                    {selectedJenisBa !== '002' && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                          Nomor Bukti Perikatan
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: 13/SPK-SEKRE/... atau nomor faktur"
                          value={bacNomorBuktiPerikatan}
                          onChange={(e) => handleNomorBuktiPerikatanChange(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all font-mono"
                        />
                      </div>
                    )}
                  </div>

                  {/* Nomor Surat & Tanggal — 2 kolom */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Nomor Surat Berita Acara */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Nomor Surat Berita Acara ({selectedJenisBa === '002' ? 'Serah Terima' : 'Pemeriksaan'}) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder={
                          selectedJenisBa === '002'
                            ? 'Contoh: 341/SEKR-027.2/III/2024'
                            : 'Contoh: 340/SEKR-027.2/III/2024'
                        }
                        value={activeNomorSurat}
                        onChange={(e) => setActiveNomorSurat(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all font-mono"
                      />
                    </div>

                    {/* Tanggal Berita Acara */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Tanggal Berita Acara <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="date"
                          value={bacTanggal}
                          onChange={(e) => handleTanggalChange(e.target.value)}
                          onClick={(e) => e.currentTarget.showPicker && e.currentTarget.showPicker()}
                          className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all font-sans cursor-pointer"
                        />
                        <div className="absolute left-3.5 pointer-events-none text-gray-400 dark:text-gray-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Paragraf Pertama */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Paragraf Pertama (Pembuka & Dasar Pelaksanaan)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Contoh: Pada hari ini, Jum'at Tanggal empat belas Bulan Agustus..."
                      value={bacParagrafPertama}
                      onChange={(e) => setBacParagrafPertama(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all leading-relaxed"
                    />
                  </div>

                  {/* Paragraf Kedua */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Paragraf Kedua (Keterangan SPK / Faktur Pesanan)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Contoh: Dengan ini menyatakan dengan sebenarnya telah melakukan pemeriksaan..."
                      value={bacParagrafKedua}
                      onChange={(e) => setBacParagrafKedua(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all leading-relaxed"
                    />
                  </div>

                  {/* Poin Nomor 2: Hasil Pemeriksaan */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Hasil Pemeriksaan (Poin No. 2)
                    </label>
                    <textarea
                      rows={2}
                      placeholder='Contoh: "Jasa telah diterima sesuai dengan kuantitas serta kualitas layanan yang disepakati"'
                      value={bacHasilPemeriksaan}
                      onChange={(e) => setBacHasilPemeriksaan(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all leading-relaxed font-serif italic"
                    />
                  </div>

                </div>
              </div>

              {/* Card 2: Tabel Dynamic Detail Items (Poin 1) */}
              <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">

                      Poin 1. Hasil Pekerjaan yang Diperiksa (Detail Items)
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Daftar rincian item pekerjaan, volume, satuan, dan status pemeriksaan
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

                {loadingBeritaAcara ? (
                  <div className="py-8 text-center text-xs text-gray-500 animate-pulse">Memuat data Berita Acara...</div>
                ) : (
                  <div className="space-y-3">
                    {/* Table Header Labels (Desktop) */}
                    <div className="hidden md:flex items-center gap-3 px-3.5 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      <div className="w-7 text-center shrink-0">No</div>
                      <div className="grid grid-cols-12 gap-3 flex-1">
                        <div className="col-span-4">Uraian Pekerjaan</div>
                        <div className="col-span-2">Volume</div>
                        <div className="col-span-2">Satuan</div>
                        <div className="col-span-4">Status Pemeriksaan</div>
                      </div>
                      <div className="w-8 shrink-0"></div>
                    </div>

                    {BeritaAcaraRows.map((row, index) => (
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
                              value={row.dba_uraian}
                              onChange={(e) => handleRowChange(index, 'dba_uraian', e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all"
                            />
                          </div>

                          {/* Volume */}
                          <div className="md:col-span-2">
                            <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1 md:hidden">Volume</label>
                            <input
                              type="text"
                              placeholder="ex: 2"
                              value={row.dba_volume}
                              onChange={(e) => handleRowChange(index, 'dba_volume', e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all"
                            />
                          </div>

                          {/* Satuan */}
                          <div className="md:col-span-2">
                            <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1 md:hidden">Satuan</label>
                            <input
                              type="text"
                              placeholder="ex: Unit"
                              value={row.dba_satuan}
                              onChange={(e) => handleRowChange(index, 'dba_satuan', e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all"
                            />
                          </div>

                          {/* Status Pemeriksaan */}
                          <div className="md:col-span-4">
                            <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1 md:hidden">Status Pemeriksaan</label>
                            <input
                              type="text"
                              placeholder="Contoh: 100% Selesai / Baik"
                              value={row.dba_status_pemeriksaan || ''}
                              onChange={(e) => handleRowChange(index, 'dba_status_pemeriksaan', e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all"
                            />
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
                      <span className="text-gray-500 dark:text-gray-400 block font-medium">Total Item:</span>
                      <strong className="text-sm font-bold text-gray-900 dark:text-white">
                        {BeritaAcaraRows.length} Item
                      </strong>
                    </div>

                    <div>
                      <span className="text-gray-500 dark:text-gray-400 block font-medium">Pagu Anggaran:</span>
                      <strong className="text-sm font-bold text-gray-900 dark:text-white">
                        {formatRupiah(paguNominal)}
                      </strong>
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

                {paguNominal > 0 && (
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-800 text-xs">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Terbilang Pagu : </span>
                    <span className="font-bold italic text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                      {terbilangStr}
                    </span>
                  </div>
                )}
              </div>
            </form>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 text-gray-400 text-sm h-64 flex flex-col items-center justify-center">
              <svg className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Pilih Master Dokumen di sebelah kiri untuk mulai mengisi data Berita Acara.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
