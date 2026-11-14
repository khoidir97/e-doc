"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MasterDokumen } from '@/features/master-dokumen/types';
import {
  getMasterDokumenOptionsAction,
  getKerangkaAcuanKerjaByMasterDokumenAction,
  getKerangkaAcuanKerjaByIdAction,
  getManualKakListAction,
  saveKerangkaAcuanKerjaAction,
  getHpsItemsForKakAction,
} from '../actions';
import {
  KerangkaAcuanKerja,
  DetailKakPerkiraanBiaya,
  DetailKakSpesifikasiTeknis,
  SaveKakPayload,
} from '../types';
import { SearchableSelect } from '@/components/form/SearchableSelect';
import { RichTextEditor } from '@/components/form/RichTextEditor';
import { RupiahInput } from '@/components/form/RupiahInput';
import { formatRupiah, terbilang } from '@/lib/terbilang';
import { Toast } from '@/components/ui/Toast';
import {
  BpkadApiService,
  Program,
  Kegiatan,
  SubKegiatan,
  RekeningBelanja,
  RincianObjek,
} from '@/services/bpkadApiService';

interface KerangkaAcuanKerjaContainerProps {
  initialMasterDokumenId?: number;
}

export const KerangkaAcuanKerjaContainer: React.FC<KerangkaAcuanKerjaContainerProps> = ({
  initialMasterDokumenId,
}) => {
  // Mode: 'master' (menggunakan Master Dokumen) atau 'manual' (mengisi manual / tarik API BPKAD)
  const [selectedMode, setSelectedMode] = useState<'master' | 'manual'>('master');

  // Master Dokumen states
  const [masterDokumenList, setMasterDokumenList] = useState<MasterDokumen[]>([]);
  const [selectedMdkId, setSelectedMdkId] = useState<number | ''>(initialMasterDokumenId || '');
  const [selectedMasterDokumen, setSelectedMasterDokumen] = useState<MasterDokumen | null>(null);

  // Manual KAK states
  const [manualKakList, setManualKakList] = useState<KerangkaAcuanKerja[]>([]);
  const [selectedManualKakId, setSelectedManualKakId] = useState<number | 'new'>('new');
  const [loadingManualList, setLoadingManualList] = useState(false);

  // BPKAD API options state & loading
  const [programList, setProgramList] = useState<Program[]>([]);
  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
  const [subKegiatanList, setSubKegiatanList] = useState<SubKegiatan[]>([]);
  const [rekeningBelanjaList, setRekeningBelanjaList] = useState<RekeningBelanja[]>([]);

  const [loadingProgram, setLoadingProgram] = useState(false);
  const [loadingKegiatan, setLoadingKegiatan] = useState(false);
  const [loadingSubKegiatan, setLoadingSubKegiatan] = useState(false);
  const [loadingRekBel, setLoadingRekBel] = useState(false);

  // Rincian Objek (Item Belanja dari Api-RO)
  const [rincianObjekList, setRincianObjekList] = useState<RincianObjek[]>([]);
  const [loadingRincianObjek, setLoadingRincianObjek] = useState(false);
  const [selectedKodeStandarHarga, setSelectedKodeStandarHarga] = useState<string[]>([]);
  const [searchRincianKeyword, setSearchRincianKeyword] = useState('');
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  // Status & Notifications
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadingKak, setLoadingKak] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pullingHps, setPullingHps] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [hasSavedData, setHasSavedData] = useState(false);

  // Form states matching kerangka_acuan_kerja (9 database fields baru + 12 konten poin)
  const [kakId, setKakId] = useState<number | null>(null);
  const [kakProgram, setKakProgram] = useState('');
  const [kakKodeProgram, setKakKodeProgram] = useState('');
  const [kakKegiatan, setKakKegiatan] = useState('');
  const [kakKodeKegiatan, setKakKodeKegiatan] = useState('');
  const [kakSubKegiatan, setKakSubKegiatan] = useState('');
  const [kakKodeSubKegiatan, setKakKodeSubKegiatan] = useState('');
  const [kakRekening, setKakRekening] = useState(''); // sama dengan belanja
  const [kakKodeRekening, setKakKodeRekening] = useState(''); // sama dengan kode rekening belanja
  const [kakPekerjaan, setKakPekerjaan] = useState('');
  const [kakTahunAnggaran, setKakTahunAnggaran] = useState('2026');

  // Konten 12 Poin KAK
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

  // Helper untuk generate template cerdas (boilerplate) untuk 12 poin KAK
  const getSmartDefaults = useCallback((data: {
    pekerjaan?: string;
    tahunAnggaran?: string;
    noDpa?: string;
    ppkNama?: string;
  }) => {
    const namaPekerjaan = data.pekerjaan || 'Pengadaan Barang / Jasa';
    const tahunAnggaran = data.tahunAnggaran || '2026';
    const noDpa = data.noDpa || '-';
    const ppkNama = data.ppkNama || 'DANIEL PERDANA, SE';

    const defaultLatarBelakang = `<p>Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru merupakan perangkat daerah yang mempunyai tugas melaksanakan sebagian urusan pemerintahan daerah di bidang pengelolaan keuangan daerah dan pengelolaan aset daerah. Dalam pelaksanaan tugas dan fungsinya, BPKAD Kota Pekanbaru melaksanakan antara lain pengelolaan anggaran, perbendaharaan, aset daerah, akuntansi, serta fasilitasi penyusunan, penetapan, perubahan dan pertanggungjawaban pelaksanaan Anggaran Pendapatan dan Belanja Daerah (APBD).</p><p>Sejalan dengan meningkatnya kebutuhan akses sistem informasi, aplikasi berbasis Cloud, dan pertukaran data di lingkungan BPKAD Kota Pekanbaru, diperlukan infrastruktur dan sarana prasarana yang andal dan aman guna mendukung percepatan kinerja dan pelayanan.</p><p>Untuk memenuhi kebutuhan tersebut, pada Tahun Anggaran ${tahunAnggaran} BPKAD Kota Pekanbaru melaksanakan kegiatan ${namaPekerjaan} sebagai bagian dari upaya pemenuhan sarana dan prasarana kerja guna menunjang pelaksanaan tugas dan fungsi organisasi.</p>`;

    const defaultMaksudTujuan = `<p><strong>a. Maksud</strong></p><p>Melakukan ${namaPekerjaan} di lingkungan Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru.</p><p><strong>b. Tujuan</strong></p><ul><li>Mengoptimalkan sarana dan prasarana kerja aparatur dalam menunjang pelaksanaan tugas secara efisien dan akuntabel.</li><li>Meningkatkan keandalan operasional sistem informasi dan pertukaran data internal SKPD.</li><li>Memastikan ketersediaan sarana pendukung yang terstandarisasi dan bergaransi resmi.</li></ul>`;

    const defaultReferensiHukum = `<ul><li>Undang-Undang Nomor 23 Tahun 2014 tentang Pemerintahan Daerah sebagaimana telah diubah beberapa kali terakhir dengan Undang-Undang Nomor 11 tahun 2020 tentang Cipta Kerja;</li><li>Peraturan Pemerintah Nomor 27 Tahun 2014 tentang Pengelolaan Barang Milik Negara/Daerah sebagaimana telah diubah dengan Peraturan Pemerintah Nomor 28 Tahun 2020;</li><li>Peraturan Pemerintah Nomor 12 Tahun 2019 tentang Pengelolaan Keuangan Daerah;</li><li>Peraturan Presiden Nomor 16 Tahun 2018 tentang Pengadaan Barang/Jasa Pemerintah sebagaimana telah diubah dengan Peraturan Presiden Nomor 12 Tahun 2021;</li><li>Peraturan Menteri Dalam Negeri Nomor 77 Tahun 2020 tentang Pedoman Teknis Pengelolaan Keuangan Daerah;</li><li>Peraturan Daerah Kota Pekanbaru Nomor 01 Tahun 2023 tentang Pengelolaan Keuangan Daerah;</li><li>Peraturan Wali Kota Pekanbaru Nomor 7 Tahun 2022 tentang Sistem dan Prosedur Pengelolaan Keuangan Daerah.</li></ul>`;

    const defaultTarget = `<p>Terpasangnya dan beroperasinya ${namaPekerjaan} yang memenuhi standar spesifikasi teknis yang dipersyaratkan guna mendukung kelancaran operasional di Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru.</p>`;

    const defaultNamaOrganisasi = `<p>Nama organisasi yang menyelenggarakan/melaksanakan pengadaan barang/jasa:</p><p>a. K/L/PD : Pemerintah Kota Pekanbaru</p><p>b. PD : Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru</p><p>c. PPK : ${ppkNama}</p>`;

    const defaultSumberDanaIntro = `<p><strong>a. Sumber Dana :</strong><br>Anggaran Pendapatan dan Belanja Daerah (APBD) Tahun Anggaran ${tahunAnggaran} Pemerintah Kota Pekanbaru Badan Pengelola Keuangan dan Aset Daerah${noDpa && noDpa !== '-' ? ` (No. DPA SKPD : ${noDpa})` : ''}</p><p><strong>b. Total perkiraan biaya yang diperlukan :</strong></p>`;

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

  // Fetch Manual KAK List
  const fetchManualKakList = useCallback(async () => {
    setLoadingManualList(true);
    const res = await getManualKakListAction();
    if (res.success && res.data) {
      setManualKakList(res.data);
    }
    setLoadingManualList(false);
  }, []);

  useEffect(() => {
    fetchManualKakList();
  }, [fetchManualKakList]);

  // Fetch BPKAD API Program (saat pertama kali atau saat mode manual aktif)
  useEffect(() => {
    if (programList.length === 0) {
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
      fetchProgram();
    }
  }, [programList.length]);

  // Fetch Kegiatan saat kakKodeProgram terisi
  useEffect(() => {
    if (selectedMode !== 'manual' || !kakKodeProgram) {
      setKegiatanList([]);
      return;
    }

    const fetchKegiatan = async () => {
      setLoadingKegiatan(true);
      try {
        const data = await BpkadApiService.getKegiatan(kakKodeProgram);
        setKegiatanList(data);
      } catch (err) {
        console.error('Gagal mengambil kegiatan BPKAD:', err);
        setKegiatanList([]);
      } finally {
        setLoadingKegiatan(false);
      }
    };
    fetchKegiatan();
  }, [selectedMode, kakKodeProgram]);

  // Fetch Sub Kegiatan saat kakKodeKegiatan terisi
  useEffect(() => {
    if (selectedMode !== 'manual' || !kakKodeKegiatan) {
      setSubKegiatanList([]);
      return;
    }

    const fetchSubKegiatan = async () => {
      setLoadingSubKegiatan(true);
      try {
        const data = await BpkadApiService.getSubKegiatan(kakKodeKegiatan);
        setSubKegiatanList(data);
      } catch (err) {
        console.error('Gagal mengambil sub kegiatan BPKAD:', err);
        setSubKegiatanList([]);
      } finally {
        setLoadingSubKegiatan(false);
      }
    };
    fetchSubKegiatan();
  }, [selectedMode, kakKodeKegiatan]);

  // Fetch Rekening Belanja saat kakKodeSubKegiatan terisi
  useEffect(() => {
    if (selectedMode !== 'manual' || !kakKodeSubKegiatan) {
      setRekeningBelanjaList([]);
      return;
    }

    const fetchRekBel = async () => {
      setLoadingRekBel(true);
      try {
        const data = await BpkadApiService.getRekeningBelanja(kakKodeSubKegiatan);
        setRekeningBelanjaList(data);
      } catch (err) {
        console.error('Gagal mengambil rekening belanja BPKAD:', err);
        setRekeningBelanjaList([]);
      } finally {
        setLoadingRekBel(false);
      }
    };
    fetchRekBel();
  }, [selectedMode, kakKodeSubKegiatan]);

  // Fetch Rincian Objek Belanja (Api-RO) saat sub kegiatan & rekening belanja terpilih
  useEffect(() => {
    if (selectedMode !== 'manual' || !kakKodeSubKegiatan || !kakKodeRekening) {
      setRincianObjekList([]);
      setSelectedKodeStandarHarga([]);
      return;
    }

    let isMounted = true;
    const fetchRincian = async () => {
      setLoadingRincianObjek(true);
      try {
        const data = await BpkadApiService.getRincianObjek(kakKodeSubKegiatan, kakKodeRekening);
        if (!isMounted) return;
        setRincianObjekList(data);
      } catch (err) {
        if (!isMounted) return;
        console.error('Gagal mengambil rincian objek BPKAD:', err);
        setRincianObjekList([]);
      } finally {
        if (isMounted) setLoadingRincianObjek(false);
      }
    };

    fetchRincian();
    return () => {
      isMounted = false;
    };
  }, [selectedMode, kakKodeSubKegiatan, kakKodeRekening]);

  // Load KAK Data when Master Dokumen changes
  const loadKakForMdk = useCallback(
    async (mdkId: number, targetMaster?: MasterDokumen | null) => {
      setLoadingKak(true);
      const currentMaster = targetMaster ?? selectedMasterDokumen;

      const res = await getKerangkaAcuanKerjaByMasterDokumenAction(mdkId);

      if (res.success && res.data?.kakDetails.kak) {
        const kak = res.data.kakDetails.kak;
        setKakId(kak.kak_id);

        // Populate fields (ambil dari KAK atau fallback ke master dokumen)
        setKakProgram(kak.kak_program || currentMaster?.mdk_program || '');
        setKakKodeProgram(kak.kak_kode_program || currentMaster?.mdk_kode_program || '');
        setKakKegiatan(kak.kak_kegiatan || currentMaster?.mdk_kegiatan || '');
        setKakKodeKegiatan(kak.kak_kode_kegiatan || currentMaster?.mdk_kode_kegiatan || '');
        setKakSubKegiatan(kak.kak_sub_kegiatan || currentMaster?.mdk_sub_kegiatan || '');
        setKakRekening(kak.kak_rekening || currentMaster?.mdk_uraian_belanja || '');
        setKakKodeRekening(kak.kak_kode_rekening || currentMaster?.mdk_rekening_belanja || '');
        setKakPekerjaan(kak.kak_pekerjaan || currentMaster?.mdk_pekerjaan || currentMaster?.mdk_uraian_belanja || '');
        setKakTahunAnggaran(
          kak.kak_tahun_anggaran ||
          currentMaster?.mdk_apbd?.match(/\b(20\d\d)\b/)?.[1] ||
          '2026'
        );

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
          const namaPekerjaan = currentMaster.mdk_pekerjaan || currentMaster.mdk_uraian_belanja || 'Pengadaan Barang / Jasa';
          const tahunAnggaran = currentMaster.mdk_apbd?.match(/\b(20\d\d)\b/)?.[1] || '2026';
          const noDpa = currentMaster.mdk_no_dpa || '-';
          const ppkNama = currentMaster.mdk_nama_pejabat || 'DANIEL PERDANA, SE';

          // Set 9 DB fields
          setKakProgram(currentMaster.mdk_program || '');
          setKakKodeProgram(currentMaster.mdk_kode_program || '');
          setKakKegiatan(currentMaster.mdk_kegiatan || '');
          setKakKodeKegiatan(currentMaster.mdk_kode_kegiatan || '');
          setKakSubKegiatan(currentMaster.mdk_sub_kegiatan || '');
          setKakRekening(currentMaster.mdk_uraian_belanja || '');
          setKakKodeRekening(currentMaster.mdk_rekening_belanja || '');
          setKakPekerjaan(namaPekerjaan);
          setKakTahunAnggaran(tahunAnggaran);

          const defaults = getSmartDefaults({
            pekerjaan: namaPekerjaan,
            tahunAnggaran,
            noDpa,
            ppkNama,
          });

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
            setPerkiraanBiayaList([{ kpb_uraian: namaPekerjaan, kpb_volume: 1, kpb_harga: 0, kpb_jumlah: 0 }]);
            setSpesifikasiTeknisList([{ kst_uraian: namaPekerjaan, kst_spesifikasi: '' }]);
          }
        }
      }
      setLoadingKak(false);
    },
    [selectedMasterDokumen, getSmartDefaults]
  );

  useEffect(() => {
    if (selectedMode === 'master' && selectedMdkId) {
      loadKakForMdk(Number(selectedMdkId));
    }
  }, [selectedMode, selectedMdkId, loadKakForMdk]);

  // Load KAK Data when Manual KAK is selected
  const loadManualKak = useCallback(
    async (kakTargetId: number) => {
      setLoadingKak(true);
      const res = await getKerangkaAcuanKerjaByIdAction(kakTargetId);

      if (res.success && res.data?.kakDetails.kak) {
        const kak = res.data.kakDetails.kak;
        setKakId(kak.kak_id);
        setSelectedManualKakId(kak.kak_id);

        setKakProgram(kak.kak_program || '');
        setKakKodeProgram(kak.kak_kode_program || '');
        setKakKegiatan(kak.kak_kegiatan || '');
        setKakKodeKegiatan(kak.kak_kode_kegiatan || '');
        setKakSubKegiatan(kak.kak_sub_kegiatan || '');
        setKakRekening(kak.kak_rekening || '');
        setKakKodeRekening(kak.kak_kode_rekening || '');
        setKakPekerjaan(kak.kak_pekerjaan || '');
        setKakTahunAnggaran(kak.kak_tahun_anggaran || '2026');

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
      }
      setLoadingKak(false);
    },
    []
  );

  // Buat KAK Manual Baru (Reset Form ke Template Kosong)
  const handleCreateNewManualKak = () => {
    setSelectedManualKakId('new');
    setKakId(null);
    setHasSavedData(false);

    setKakProgram('');
    setKakKodeProgram('');
    setKakKegiatan('');
    setKakKodeKegiatan('');
    setKakSubKegiatan('');
    setKakKodeSubKegiatan('');
    setKakRekening('');
    setKakKodeRekening('');
    setKakPekerjaan('');
    setKakTahunAnggaran('2026');

    const defaults = getSmartDefaults({
      pekerjaan: 'Pengadaan Barang / Jasa',
      tahunAnggaran: '2026',
    });

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

    setPerkiraanBiayaList([{ kpb_uraian: '', kpb_volume: 1, kpb_harga: 0, kpb_jumlah: 0 }]);
    setSpesifikasiTeknisList([{ kst_uraian: '', kst_spesifikasi: '' }]);
    setSelectedKodeStandarHarga([]);
    setRincianObjekList([]);
  };

  const handleSelectMasterDokumen = (mdkId: number | string) => {
    if (mdkId === 'manual') {
      setSelectedMode('manual');
      handleCreateNewManualKak();
      return;
    }
    const numId = Number(mdkId);
    setSelectedMdkId(numId);
    const found = masterDokumenList.find((m) => m.mdk_id === numId) || null;
    setSelectedMasterDokumen(found);
    loadKakForMdk(numId, found);
  };

  // Pull HPS items manually (hanya jika ada master dokumen)
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

      const existingSpecsWithContent = spesifikasiTeknisList.filter(
        (s) => s.kst_uraian.trim() !== '' || s.kst_spesifikasi.trim() !== ''
      );
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

  // Terapkan item terpilih dari Api-RO ke Form KAK
  const applySelectedRincianItems = () => {
    const selectedItems = rincianObjekList.filter((item) =>
      selectedKodeStandarHarga.includes(item.KODE_STANDAR_HARGA)
    );
    if (selectedItems.length === 0) return;

    // 1. Set kakPekerjaan jika masih kosong atau ganti dengan gabungan nama barang
    const namaList = selectedItems.map((i) => i.NAMA_STANDAR_HARGA.trim()).filter(Boolean);
    const pekerjaanText = namaList.join(', ');
    setKakPekerjaan(pekerjaanText);

    // 2. Set Tabel Perkiraan Biaya
    const rows: DetailKakPerkiraanBiaya[] = selectedItems.map((item) => {
      const vol = Number(item.KOOFISIEN) || 1;
      const harga = Number(item.HARGA_SATUAN) || 0;
      const jumlah = Number(item.PAGU_TOTAL) || vol * harga;
      return {
        kpb_uraian: item.NAMA_STANDAR_HARGA,
        kpb_volume: vol,
        kpb_harga: harga,
        kpb_jumlah: jumlah,
      };
    });
    setPerkiraanBiayaList(rows);

    // 3. Set Tabel Spesifikasi Teknis
    const specRows: DetailKakSpesifikasiTeknis[] = selectedItems.map((item) => ({
      kst_uraian: item.NAMA_STANDAR_HARGA,
      kst_spesifikasi: item.SPESIFIKASI || '',
    }));
    setSpesifikasiTeknisList(specRows);

    // 4. Update Smart Defaults Template agar sinkron dengan nama pekerjaan baru
    const defaults = getSmartDefaults({
      pekerjaan: pekerjaanText,
      tahunAnggaran: kakTahunAnggaran,
    });
    setLatarBelakang(defaults.defaultLatarBelakang);
    setMaksudDanTujuan(defaults.defaultMaksudTujuan);
    setTargetSasaran(defaults.defaultTarget);
    setRuangLingkup(defaults.defaultRuangLingkup);

    setAppliedNotice(
      `✓ Berhasil menerapkan ${selectedItems.length} item barang ke Pekerjaan, Tabel Perkiraan Biaya, dan Spesifikasi Teknis!`
    );
    setTimeout(() => {
      setAppliedNotice(null);
    }, 4500);
  };

  // Regenerate template KAK teks dengan data terbaru
  const handleRegenerateTemplate = () => {
    const defaults = getSmartDefaults({
      pekerjaan: kakPekerjaan || kakRekening || 'Pengadaan Barang / Jasa',
      tahunAnggaran: kakTahunAnggaran,
      noDpa: selectedMasterDokumen?.mdk_no_dpa || '-',
      ppkNama: selectedMasterDokumen?.mdk_nama_pejabat || 'DANIEL PERDANA, SE',
    });
    setLatarBelakang(defaults.defaultLatarBelakang);
    setMaksudDanTujuan(defaults.defaultMaksudTujuan);
    setReferensiHukum(defaults.defaultReferensiHukum);
    setTargetSasaran(defaults.defaultTarget);
    setNamaOrganisasi(defaults.defaultNamaOrganisasi);
    setSumberDanaIntro(defaults.defaultSumberDanaIntro);
    setRuangLingkup(defaults.defaultRuangLingkup);
    setJangkaWaktu(defaults.defaultJangkaWaktu);
    setPersyaratanKualifikasi(defaults.defaultPersyaratan);
    setPenutup(defaults.defaultPenutup);
    showToast('success', 'Template 12 poin KAK berhasil disesuaikan dengan data terbaru!');
  };

  // Save handler
  const handleSave = async (e?: React.FormEvent): Promise<number | null> => {
    if (e) e.preventDefault();

    if (selectedMode === 'master' && !selectedMdkId) {
      showToast('error', 'Pilih Master Dokumen terlebih dahulu.');
      return null;
    }

    if (selectedMode === 'manual' && !kakPekerjaan.trim() && !kakProgram.trim()) {
      showToast('error', 'Silakan pilih Program atau isi Nama Pekerjaan terlebih dahulu.');
      return null;
    }

    setSaving(true);
    const payload: SaveKakPayload = {
      kak_id: kakId || null,
      kak_master_dokumen_id: selectedMode === 'master' && selectedMdkId ? Number(selectedMdkId) : null,
      kak_program: kakProgram || null,
      kak_kode_program: kakKodeProgram || null,
      kak_kegiatan: kakKegiatan || null,
      kak_kode_kegiatan: kakKodeKegiatan || null,
      kak_sub_kegiatan: kakSubKegiatan || null,
      kak_rekening: kakRekening || null, // sama dengan belanja
      kak_kode_rekening: kakKodeRekening || null, // sama dengan kode rekening belanja
      kak_pekerjaan: kakPekerjaan || null,
      kak_tahun_anggaran: kakTahunAnggaran || null,
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
    let savedId: number | null = null;
    if (res.success && res.data) {
      savedId = res.data.kakId;
      setKakId(savedId);
      setHasSavedData(true);
      showToast('success', res.message || 'Kerangka Acuan Kerja berhasil disimpan!');
      if (selectedMode === 'manual') {
        setSelectedManualKakId(savedId);
        fetchManualKakList();
      }
    } else {
      showToast('error', res.message || 'Gagal menyimpan Kerangka Acuan Kerja.');
    }
    setSaving(false);
    return savedId;
  };

  // Print PDF in new tab
  const handlePrintPdf = async () => {
    const savedId = await handleSave();
    const targetKakId = savedId || kakId;

    if (selectedMode === 'master' && selectedMdkId) {
      window.open(`/kerangka-acuan-kerja/print/${selectedMdkId}`, '_blank');
    } else if (targetKakId) {
      window.open(`/kerangka-acuan-kerja/print/kak-${targetKakId}`, '_blank');
    } else {
      showToast('error', 'Simpan dokumen terlebih dahulu sebelum mencetak PDF.');
    }
  };

  // Calculation for perkiraan biaya
  const totalBiaya = perkiraanBiayaList.reduce((acc, curr) => acc + (Number(curr.kpb_jumlah) || 0), 0);
  const terbilangBiaya = terbilang(totalBiaya);

  // Filtered Rincian Objek list
  const filteredRincianList = rincianObjekList.filter((item) => {
    if (!searchRincianKeyword.trim()) return true;
    const term = searchRincianKeyword.toLowerCase();
    return (
      item.NAMA_STANDAR_HARGA?.toLowerCase().includes(term) ||
      item.KODE_STANDAR_HARGA?.toLowerCase().includes(term) ||
      item.SPESIFIKASI?.toLowerCase().includes(term)
    );
  });

  const toggleSelectAllRincian = () => {
    if (selectedKodeStandarHarga.length === rincianObjekList.length) {
      setSelectedKodeStandarHarga([]);
    } else {
      setSelectedKodeStandarHarga(rincianObjekList.map((item) => item.KODE_STANDAR_HARGA));
    }
  };

  const toggleSelectRincianItem = (kode: string) => {
    setSelectedKodeStandarHarga((prev) =>
      prev.includes(kode) ? prev.filter((k) => k !== kode) : [...prev, kode]
    );
  };

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

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handlePrintPdf}
            disabled={saving}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
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
      </div>

      {/* CARD UTAMA: MODE SELECTOR & PENGATURAN SUMBER DATA */}
      <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
        {/* Tab Switcher Mode */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Sumber Data Acuan KAK</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Pilih menggunakan Master Dokumen yang sudah ada atau isi manual dengan menarik data langsung dari API BPKAD
            </p>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setSelectedMode('master')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${selectedMode === 'master'
                ? 'bg-white dark:bg-gray-900 text-brand-600 dark:text-brand-400 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              <span>📋</span>
              Pilih Master Dokumen
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedMode('manual');
                if (selectedManualKakId === 'new' && !kakProgram) {
                  handleCreateNewManualKak();
                }
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${selectedMode === 'manual'
                ? 'bg-white dark:bg-gray-900 text-brand-600 dark:text-brand-400 shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              <span>⚡</span>
              Isi Manual (Tarik API BPKAD)
            </button>
          </div>
        </div>

        {/* ── MODE 1: PILIH MASTER DOKUMEN ──────────────────────────────── */}
        {selectedMode === 'master' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Pilih Master Dokumen Acuan:
              </label>
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
                options={[
                  ...masterDokumenList.map((mdk) => ({
                    value: mdk.mdk_id,
                    label: mdk.mdk_uraian_belanja || 'Dokumen Tanpa Judul',
                    sublabel: `[${mdk.mdk_pekerjaan || '-'}] (No. DPA: ${mdk.mdk_no_dpa || '-'})`,
                  })),
                  {
                    value: 'manual',
                    label: '➕ Buat KAK Manual Baru (Tarik dari API BPKAD)',
                    sublabel: 'Pilih opsi ini jika dokumen tidak terdapat di Master Dokumen',
                  },
                ]}
                value={selectedMdkId}
                onChange={(val) => handleSelectMasterDokumen(val)}
                placeholder="-- Pilih Master Dokumen --"
                searchPlaceholder="Cari berdasarkan uraian belanja, bidang, atau No. DPA..."
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
                      {selectedMasterDokumen.mdk_kode_program ? `[${selectedMasterDokumen.mdk_kode_program}] ` : ''}
                      {selectedMasterDokumen.mdk_program || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 block font-medium">Kegiatan:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedMasterDokumen.mdk_kode_kegiatan ? `[${selectedMasterDokumen.mdk_kode_kegiatan}] ` : ''}
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
        )}

        {/* ── MODE 2: ISI MANUAL (TARIK DARI API BPKAD) ─────────────────── */}
        {selectedMode === 'manual' && (
          <div className="space-y-4">
            {/* Selector KAK Manual yang sudah tersimpan */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Pilih KAK Manual Tersimpan:
                </label>
                {loadingManualList ? (
                  <div className="h-9 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
                ) : (
                  <SearchableSelect
                    options={[
                      {
                        value: 'new',
                        label: '➕ [Baru] Buat KAK Manual Baru',
                        sublabel: 'Mulai buat form Kerangka Acuan Kerja dari awal',
                      },
                      ...manualKakList.map((k) => ({
                        value: k.kak_id,
                        label: k.kak_pekerjaan || k.kak_rekening || `Dokumen KAK #${k.kak_id}`,
                        sublabel: `Program: ${k.kak_program || '-'} · Rekening: ${k.kak_kode_rekening || '-'}`,
                      })),
                    ]}
                    value={selectedManualKakId}
                    onChange={(val) => {
                      if (val === 'new') {
                        handleCreateNewManualKak();
                      } else {
                        loadManualKak(Number(val));
                      }
                    }}
                    placeholder="-- Pilih Dokumen KAK Manual --"
                    searchPlaceholder="Cari pekerjaan, rekening, atau program..."
                  />
                )}
              </div>

              <button
                type="button"
                onClick={handleCreateNewManualKak}
                className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer self-stretch sm:self-end"
              >
                <span>➕</span> Buat KAK Baru
              </button>
            </div>

            {/* Grid Form Tarik Data dari API BPKAD */}
            <div className="p-4 rounded-xl border border-brand-200 dark:border-brand-900/50 bg-brand-50/20 dark:bg-brand-950/10 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-brand-200/50 dark:border-brand-900/30">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-brand-500 text-white text-xs">🌐</span>
                  <div>
                    <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                      Tarik Data Bertingkat dari API BPKAD
                    </h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      Pilih Program, Kegiatan, Sub Kegiatan, dan Rekening Belanja untuk mengisi data KAK
                    </p>
                  </div>
                </div>

                {hasSavedData && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    ✓ Tersimpan di Database
                  </span>
                )}
              </div>

              {/* Grid 2 Kolom untuk Form Select */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Program */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Program (API)
                  </label>
                  {loadingProgram && (
                    <div className="flex items-center gap-2 text-xs text-brand-600 dark:text-brand-400 mb-1.5">
                      <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Memuat program BPKAD...
                    </div>
                  )}
                  <SearchableSelect
                    placeholder={loadingProgram ? 'Memuat data program...' : 'Pilih Program...'}
                    searchPlaceholder="Cari kode atau nama program..."
                    disabled={loadingProgram}
                    value={kakKodeProgram}
                    options={programList.map((p) => ({
                      value: p.KODE_PROGRAM,
                      label: p.NAMA_PROGRAM,
                      sublabel: p.KODE_PROGRAM,
                    }))}
                    onChange={(val: string) => {
                      const found = programList.find((p) => p.KODE_PROGRAM === val);
                      setKakKodeProgram(val);
                      setKakProgram(found?.NAMA_PROGRAM ?? '');

                      // Reset turunan
                      setKakKodeKegiatan('');
                      setKakKegiatan('');
                      setKakSubKegiatan('');
                      setKakKodeSubKegiatan('');
                      setKakRekening('');
                      setKakKodeRekening('');
                      setKegiatanList([]);
                      setSubKegiatanList([]);
                      setRekeningBelanjaList([]);
                      setRincianObjekList([]);
                      setSelectedKodeStandarHarga([]);
                    }}
                  />
                  {kakKodeProgram && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Kode: <span className="font-mono font-medium">{kakKodeProgram}</span>
                    </p>
                  )}
                </div>

                {/* 2. Kegiatan */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Kegiatan (API)
                    {!kakKodeProgram && (
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
                      Memuat kegiatan...
                    </div>
                  )}
                  <SearchableSelect
                    placeholder={
                      !kakKodeProgram
                        ? 'Pilih Program terlebih dahulu...'
                        : loadingKegiatan
                          ? 'Memuat kegiatan...'
                          : 'Pilih Kegiatan...'
                    }
                    searchPlaceholder="Cari kode atau nama kegiatan..."
                    disabled={loadingKegiatan || !kakKodeProgram}
                    value={kakKodeKegiatan}
                    options={kegiatanList.map((k) => ({
                      value: k.KODE_KEGIATAN,
                      label: k.NAMA_KEGIATAN,
                      sublabel: `${k.KODE_KEGIATAN}${k.PAGU ? ` · Pagu: Rp ${Number(k.PAGU).toLocaleString('id-ID')}` : ''}`,
                    }))}
                    onChange={(val: string) => {
                      const found = kegiatanList.find((k) => k.KODE_KEGIATAN === val);
                      setKakKodeKegiatan(val);
                      setKakKegiatan(found?.NAMA_KEGIATAN ?? '');

                      // Reset turunan
                      setKakSubKegiatan('');
                      setKakKodeSubKegiatan('');
                      setKakRekening('');
                      setKakKodeRekening('');
                      setSubKegiatanList([]);
                      setRekeningBelanjaList([]);
                      setRincianObjekList([]);
                      setSelectedKodeStandarHarga([]);
                    }}
                  />
                  {kakKodeKegiatan && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Kode: <span className="font-mono font-medium">{kakKodeKegiatan}</span>
                    </p>
                  )}
                </div>

                {/* 3. Sub Kegiatan */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sub Kegiatan (API)
                    {!kakKodeKegiatan && (
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
                      Memuat sub kegiatan...
                    </div>
                  )}
                  <SearchableSelect
                    placeholder={
                      !kakKodeKegiatan
                        ? 'Pilih Kegiatan terlebih dahulu...'
                        : loadingSubKegiatan
                          ? 'Memuat sub kegiatan...'
                          : 'Pilih Sub Kegiatan...'
                    }
                    searchPlaceholder="Cari kode atau nama sub kegiatan..."
                    disabled={loadingSubKegiatan || !kakKodeKegiatan}
                    value={kakKodeSubKegiatan}
                    options={subKegiatanList.map((sk) => ({
                      value: sk.KODE_SUB_KEGIATAN,
                      label: sk.NAMA_SUB_KEGIATAN,
                      sublabel: `${sk.KODE_SUB_KEGIATAN}${sk.PAGU ? ` · Pagu: Rp ${Number(sk.PAGU).toLocaleString('id-ID')}` : ''}`,
                    }))}
                    onChange={(val: string) => {
                      const found = subKegiatanList.find((sk) => sk.KODE_SUB_KEGIATAN === val);
                      setKakKodeSubKegiatan(val);
                      setKakSubKegiatan(found?.NAMA_SUB_KEGIATAN ?? '');

                      // Reset rekening belanja
                      setKakRekening('');
                      setKakKodeRekening('');
                      setRekeningBelanjaList([]);
                      setRincianObjekList([]);
                      setSelectedKodeStandarHarga([]);
                    }}
                  />
                  {kakKodeSubKegiatan && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Kode: <span className="font-mono font-medium">{kakKodeSubKegiatan}</span>
                    </p>
                  )}
                </div>

                {/* 4. Rekening Belanja (Belanja & Kode Rekening Belanja) */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Rekening Belanja / Belanja (API)
                    {!kakKodeSubKegiatan && (
                      <span className="ml-2 text-gray-400 dark:text-gray-500 font-normal">
                        (Pilih Sub Kegiatan terlebih dahulu)
                      </span>
                    )}
                  </label>
                  {loadingRekBel && (
                    <div className="flex items-center gap-2 text-xs text-brand-600 dark:text-brand-400 mb-1.5">
                      <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Mengambil rekening belanja...
                    </div>
                  )}
                  <SearchableSelect
                    placeholder={
                      !kakKodeSubKegiatan
                        ? 'Pilih Sub Kegiatan terlebih dahulu...'
                        : loadingRekBel
                          ? 'Memuat data rekening...'
                          : 'Pilih Rekening Belanja...'
                    }
                    searchPlaceholder="Cari kode atau nama rekening..."
                    disabled={!kakKodeSubKegiatan || loadingRekBel}
                    value={kakKodeRekening}
                    options={rekeningBelanjaList.map((r) => ({
                      value: r.KODE_REKENING,
                      label: r.NAMA_REKENING,
                      sublabel: `${r.KODE_REKENING} · Pagu: Rp ${Number(r.PAGU).toLocaleString('id-ID')}`,
                    }))}
                    onChange={(val: string) => {
                      const found = rekeningBelanjaList.find((r) => r.KODE_REKENING === val);
                      setKakKodeRekening(val);
                      setKakRekening(found?.NAMA_REKENING ?? '');
                      setSelectedKodeStandarHarga([]);
                      setRincianObjekList([]);

                      // Jika pekerjaan masih kosong, isi dengan nama rekening
                      if (!kakPekerjaan.trim() && found?.NAMA_REKENING) {
                        setKakPekerjaan(found.NAMA_REKENING);
                      }
                    }}
                  />
                  {kakKodeRekening && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Kode: <span className="font-mono font-medium">{kakKodeRekening}</span>
                      {kakRekening && (
                        <span className="ml-2">
                          · Uraian: <span className="font-medium text-gray-700 dark:text-gray-300">{kakRekening}</span>
                        </span>
                      )}
                    </p>
                  )}
                </div>

                {/* 5. Pekerjaan */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nama Pekerjaan / Pengadaan
                  </label>
                  <input
                    type="text"
                    value={kakPekerjaan}
                    onChange={(e) => setKakPekerjaan(e.target.value)}
                    placeholder="Contoh: Pengadaan Komputer All In One, Sewa Bandwidth Cloud..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                {/* 6. Tahun Anggaran */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tahun Anggaran
                  </label>
                  <input
                    type="text"
                    value={kakTahunAnggaran}
                    onChange={(e) => setKakTahunAnggaran(e.target.value)}
                    placeholder="Contoh: 2026"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Pemilihan Item Rincian Objek dari Api-RO (Optional Quick Apply) */}
              {kakKodeRekening && (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700/60 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">📦</span>
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                        Item Barang Belanja (Standar Harga dari Api-RO):
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {rincianObjekList.length} item
                      </span>
                    </div>

                    {rincianObjekList.length > 0 && (
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={toggleSelectAllRincian}
                          className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
                        >
                          {selectedKodeStandarHarga.length === rincianObjekList.length
                            ? 'Batalkan Semua'
                            : 'Pilih Semua'}
                        </button>

                        {selectedKodeStandarHarga.length > 0 && (
                          <button
                            type="button"
                            onClick={applySelectedRincianItems}
                            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <span>✓</span> Terapkan ({selectedKodeStandarHarga.length} item) ke KAK
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {appliedNotice && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
                      <span>{appliedNotice}</span>
                      <button
                        type="button"
                        onClick={() => setAppliedNotice(null)}
                        className="text-emerald-500 hover:text-emerald-700 font-bold ml-2"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {loadingRincianObjek ? (
                    <div className="py-4 text-center text-xs text-gray-500">
                      <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-1.5" />
                      Mengambil item rincian objek dari server BPKAD...
                    </div>
                  ) : rincianObjekList.length === 0 ? (
                    <div className="py-3 text-center text-xs text-gray-400 italic">
                      Tidak ada data item rincian standar harga pada rekening belanja ini. Anda dapat mengetik rincian secara langsung di tabel biaya di bawah.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {rincianObjekList.length > 3 && (
                        <input
                          type="text"
                          value={searchRincianKeyword}
                          onChange={(e) => setSearchRincianKeyword(e.target.value)}
                          placeholder="Filter item berdasarkan nama atau spesifikasi..."
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                        />
                      )}
                      <div className="max-h-48 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900">
                        {filteredRincianList.map((item) => {
                          const isChecked = selectedKodeStandarHarga.includes(item.KODE_STANDAR_HARGA);
                          return (
                            <label
                              key={item.KODE_STANDAR_HARGA}
                              className={`flex items-start gap-2.5 p-2.5 text-xs cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${isChecked ? 'bg-brand-50/40 dark:bg-brand-950/20' : ''
                                }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleSelectRincianItem(item.KODE_STANDAR_HARGA)}
                                className="mt-0.5 rounded text-brand-600 focus:ring-brand-500"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-semibold text-gray-900 dark:text-white">
                                    {item.NAMA_STANDAR_HARGA}
                                  </span>
                                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                                    Rp {Number(item.PAGU_TOTAL || 0).toLocaleString('id-ID')}
                                  </span>
                                </div>
                                <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 flex flex-wrap gap-2">
                                  <span>Vol: {item.KOOFISIEN} {item.SATUAN}</span>
                                  <span>•</span>
                                  <span>Harga: Rp {Number(item.HARGA_SATUAN || 0).toLocaleString('id-ID')}</span>
                                  {item.SPESIFIKASI && (
                                    <>
                                      <span>•</span>
                                      <span className="truncate max-w-[280px]">Spec: {item.SPESIFIKASI}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RINGKASAN PROGRAM & ANGGARAN (Format seperti pada form master_dokumen) */}
            <div className="bg-gray-50/90 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 space-y-3.5">
              <div className="flex items-center justify-between pb-2.5 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-base">📌</span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Ringkasan Program &amp; Anggaran KAK
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={handleRegenerateTemplate}
                  className="px-2.5 py-1 text-xs rounded-lg text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/40 font-semibold cursor-pointer transition-colors"
                >
                  🔄 Sinkronkan ke Teks KAK
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                {/* Program */}
                <div>
                  <span className="text-gray-400 dark:text-gray-500 font-semibold block text-[10px] uppercase tracking-wider mb-0.5">
                    Program
                  </span>
                  <p className="font-medium text-gray-800 dark:text-gray-200 leading-snug">
                    {kakKodeProgram ? (
                      <>
                        <span className="font-mono text-brand-600 dark:text-brand-400 font-semibold">
                          {kakKodeProgram}
                        </span>
                        <span className="mx-1.5 text-gray-300 dark:text-gray-600">•</span>
                        <span>{kakProgram}</span>
                      </>
                    ) : (
                      <span className="text-gray-400 italic text-[11px]">Belum dipilih</span>
                    )}
                  </p>
                </div>

                {/* Kegiatan */}
                <div>
                  <span className="text-gray-400 dark:text-gray-500 font-semibold block text-[10px] uppercase tracking-wider mb-0.5">
                    Kegiatan
                  </span>
                  <p className="font-medium text-gray-800 dark:text-gray-200 leading-snug">
                    {kakKodeKegiatan ? (
                      <>
                        <span className="font-mono text-brand-600 dark:text-brand-400 font-semibold">
                          {kakKodeKegiatan}
                        </span>
                        <span className="mx-1.5 text-gray-300 dark:text-gray-600">•</span>
                        <span>{kakKegiatan}</span>
                      </>
                    ) : (
                      <span className="text-gray-400 italic text-[11px]">Belum dipilih</span>
                    )}
                  </p>
                </div>

                {/* Sub Kegiatan */}
                <div>
                  <span className="text-gray-400 dark:text-gray-500 font-semibold block text-[10px] uppercase tracking-wider mb-0.5">
                    Sub Kegiatan
                  </span>
                  <p className="font-medium text-gray-800 dark:text-gray-200 leading-snug">
                    {kakSubKegiatan ? (
                      <span>{kakSubKegiatan}</span>
                    ) : (
                      <span className="text-gray-400 italic text-[11px]">Belum dipilih</span>
                    )}
                  </p>
                </div>

                {/* Rekening Belanja / Belanja */}
                <div>
                  <span className="text-gray-400 dark:text-gray-500 font-semibold block text-[10px] uppercase tracking-wider mb-0.5">
                    Rekening Belanja / Belanja
                  </span>
                  <p className="font-medium text-gray-800 dark:text-gray-200 leading-snug">
                    {kakKodeRekening ? (
                      <>
                        <span className="font-mono text-brand-600 dark:text-brand-400 font-semibold">
                          {kakKodeRekening}
                        </span>
                        <span className="mx-1.5 text-gray-300 dark:text-gray-600">•</span>
                        <span>{kakRekening}</span>
                      </>
                    ) : (
                      <span className="text-gray-400 italic text-[11px]">Belum dipilih</span>
                    )}
                  </p>
                </div>

                {/* Pekerjaan */}
                <div>
                  <span className="text-gray-400 dark:text-gray-500 font-semibold block text-[10px] uppercase tracking-wider mb-0.5">
                    Pekerjaan
                  </span>
                  <p className="font-bold text-brand-600 dark:text-brand-400 leading-snug">
                    {kakPekerjaan || <span className="text-gray-400 italic text-[11px] font-normal">Belum diisi</span>}
                  </p>
                </div>

                {/* Tahun Anggaran */}
                <div>
                  <span className="text-gray-400 dark:text-gray-500 font-semibold block text-[10px] uppercase tracking-wider mb-0.5">
                    Tahun Anggaran
                  </span>
                  <p className="font-semibold text-gray-900 dark:text-white leading-snug">
                    Tahun {kakTahunAnggaran || '2026'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── BAGIAN ISI FORM KAK (12 POIN) ───────────────────────────────── */}
      {loadingKak ? (
        <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-500">Memuat isi form Kerangka Acuan Kerja...</p>
        </div>
      ) : (
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

              {selectedMode === 'master' && selectedMdkId && (
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
              )}
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
                              className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
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
                            className="p-1 text-red-500 hover:text-red-700 rounded hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
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
                disabled={saving}
                className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
      )}
    </div>
  );
};
