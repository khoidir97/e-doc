"use client";

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { MasterDokumen, CreateMasterDokumenInput, UpdateMasterDokumenInput } from '../types';
import { getPegawaiListAction } from '@/features/pegawai/actions';
import { Pegawai } from '@/features/pegawai/types';
import { getMasterSatuanListAction } from '@/features/master-satuan/actions';
import { MasterSatuan } from '@/features/master-satuan/types';
import { getPerusahaanListAction } from '@/features/perusahaan/actions';
import { Perusahaan } from '@/features/perusahaan/types';
import { getBidangListAction } from '@/features/bidang/actions';
import { Bidang } from '@/features/bidang/types';
import { RupiahInput } from '@/components/form/RupiahInput';
import { SearchableSelect } from '@/components/form/SearchableSelect';
import { BpkadApiService, Program, Kegiatan, SubKegiatan, RekeningBelanja, RincianObjek } from '@/services/bpkadApiService';
import { getAllKakOptionsAction, getKerangkaAcuanKerjaByIdAction } from '@/features/kerangka-acuan-kerja/actions';
import { KakOptionItem } from '@/features/kerangka-acuan-kerja/types';

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
  const [masterSatuanList, setMasterSatuanList] = useState<MasterSatuan[]>([]);
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

  // Rincian Objek (Item Barang Belanja) dari Api-RO
  const [rincianObjekList, setRincianObjekList] = useState<RincianObjek[]>([]);
  const [loadingRincianObjek, setLoadingRincianObjek] = useState(false);
  const [selectedKodeStandarHarga, setSelectedKodeStandarHarga] = useState<string[]>([]);
  const [savedItemObjects, setSavedItemObjects] = useState<RincianObjek[]>([]);
  const [expandedSpecs, setExpandedSpecs] = useState<Record<string, boolean>>({});
  const [searchRincianKeyword, setSearchRincianKeyword] = useState('');
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  // KAK (Kerangka Acuan Kerja) Options & Mode State
  const [inputMode, setInputMode] = useState<'manual' | 'kak'>('manual');
  const [kakOptions, setKakOptions] = useState<KakOptionItem[]>([]);
  const [selectedKakId, setSelectedKakId] = useState<number | ''>('');
  const [loadingKakOptions, setLoadingKakOptions] = useState(false);
  const [loadingKakDetail, setLoadingKakDetail] = useState(false);
  const [selectedKakDetail, setSelectedKakDetail] = useState<KakOptionItem | null>(null);

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
  const [mdkSatuan, setMdkSatuan] = useState<number | string>(0);
  const [mdkKeterangan, setMdkKeterangan] = useState('');

  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setMdkNamaPejabatId(initialData.mdk_nama_pejabat_id ?? 0);
      setMdkBidangId(initialData.mdk_bidang_id || 0);
      setMdkPaguAnggaran(initialData.mdk_pagu_anggaran ?? 0);
      setMdkSatuan(initialData.mdk_satuan ?? 0);

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
      setMdkKeterangan(initialData.mdk_keterangan || '');

      // Parse and restore selected mdk_item_barang
      if (initialData.mdk_item_barang) {
        try {
          const parsed = typeof initialData.mdk_item_barang === 'string'
            ? JSON.parse(initialData.mdk_item_barang)
            : initialData.mdk_item_barang;
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSavedItemObjects(parsed);
            setSelectedKodeStandarHarga(parsed.map((item: any) => item.KODE_STANDAR_HARGA).filter(Boolean));
          } else {
            setSavedItemObjects([]);
          }
        } catch (err) {
          console.error('Error parsing mdk_item_barang:', err);
          setSavedItemObjects([]);
        }
      } else {
        setSavedItemObjects([]);
      }
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
      setMdkSatuan(0);
      setMdkKeterangan('');
      setRincianObjekList([]);
      setSelectedKodeStandarHarga([]);
      setSavedItemObjects([]);
      setSearchRincianKeyword('');
      setAppliedNotice(null);
      setSelectedKakId('');
      setSelectedKakDetail(null);
      setInputMode('manual');
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
        const [pegawaiRes, perusahaanRes, bidangRes, satuanRes] = await Promise.allSettled([
          getPegawaiListAction('', 1, 500),
          getPerusahaanListAction('', 1, 500),
          getBidangListAction('', 1, 500),
          getMasterSatuanListAction('', 1, 500),
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
        if (satuanRes.status === 'fulfilled' && satuanRes.value.success && satuanRes.value.data) {
          setMasterSatuanList(satuanRes.value.data.data);
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

    // ── Fetch Daftar KAK untuk pilihan otomatisasi ──────────────────────────
    const fetchKakOptions = async () => {
      setLoadingKakOptions(true);
      try {
        const res = await getAllKakOptionsAction();
        if (res.success && res.data) {
          setKakOptions(res.data);
        }
      } catch (err) {
        console.error('Gagal mengambil daftar KAK:', err);
      } finally {
        setLoadingKakOptions(false);
      }
    };

    fetchInternalOptions();
    fetchProgram();
    fetchKakOptions();
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

  // ── Fetch Rincian Objek (Item Barang Belanja) saat mdkKodeSubKegiatan & mdkRekeningBelanja terisi ────
  useEffect(() => {
    if (!isOpen || !mdkKodeSubKegiatan || !mdkRekeningBelanja) {
      setRincianObjekList([]);
      setSelectedKodeStandarHarga([]);
      return;
    }

    let isMounted = true;
    const fetchRincianObjek = async () => {
      setLoadingRincianObjek(true);
      try {
        const data = await BpkadApiService.getRincianObjek(mdkKodeSubKegiatan, mdkRekeningBelanja);
        if (!isMounted) return;
        setRincianObjekList(data);

        // Pre-select items: prioritize mdk_item_barang if exists
        if (initialData?.mdk_item_barang) {
          try {
            const parsed = typeof initialData.mdk_item_barang === 'string'
              ? JSON.parse(initialData.mdk_item_barang)
              : initialData.mdk_item_barang;
            if (Array.isArray(parsed) && parsed.length > 0) {
              const savedCodes = parsed.map((item: any) => item.KODE_STANDAR_HARGA).filter(Boolean);
              if (savedCodes.length > 0) {
                setSelectedKodeStandarHarga(savedCodes);
                const sumPagu = data
                  .filter((item) => savedCodes.includes(item.KODE_STANDAR_HARGA))
                  .reduce((sum, item) => sum + (Number(item.PAGU_TOTAL) || 0), 0);
                if (sumPagu > 0) {
                  setMdkPaguAnggaran(sumPagu);
                }
                return;
              }
            }
          } catch (e) {
            console.error('Error checking mdk_item_barang in fetchRincianObjek:', e);
          }
        }

        // Fallback: match item names with initialData mdk_pekerjaan
        if (initialData?.mdk_pekerjaan) {
          const matchedCodes = data
            .filter((item) =>
              initialData.mdk_pekerjaan?.toLowerCase().includes(item.NAMA_STANDAR_HARGA.toLowerCase())
            )
            .map((item) => item.KODE_STANDAR_HARGA);
          if (matchedCodes.length > 0) {
            setSelectedKodeStandarHarga(matchedCodes);
            const sumPagu = data
              .filter((item) => matchedCodes.includes(item.KODE_STANDAR_HARGA))
              .reduce((sum, item) => sum + (Number(item.PAGU_TOTAL) || 0), 0);
            if (sumPagu > 0) {
              setMdkPaguAnggaran(sumPagu);
            }
          }
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Gagal mengambil rincian objek BPKAD:', err);
        setRincianObjekList([]);
      } finally {
        if (isMounted) setLoadingRincianObjek(false);
      }
    };

    fetchRincianObjek();

    return () => {
      isMounted = false;
    };
  }, [isOpen, mdkKodeSubKegiatan, mdkRekeningBelanja, initialData]);

  const handleSelectKak = async (kakId: number) => {
    setSelectedKakId(kakId);
    if (!kakId) {
      setSelectedKakDetail(null);
      return;
    }

    const kakItem = kakOptions.find((k) => k.kak_id === kakId);
    if (kakItem) {
      setSelectedKakDetail(kakItem);
    }

    setLoadingKakDetail(true);
    try {
      const res = await getKerangkaAcuanKerjaByIdAction(kakId);
      if (res.success && res.data) {
        const { kakDetails, masterDokumen: mdkFromKak } = res.data;
        const kak = kakDetails?.kak;

        // Ambil data program, kegiatan, sub kegiatan, rekening belanja
        const kodeProg = kak?.kak_kode_program || mdkFromKak?.mdk_kode_program || kakItem?.kak_kode_program || '';
        const namaProg = kak?.kak_program || mdkFromKak?.mdk_program || kakItem?.kak_program || '';
        const kodeKeg = kak?.kak_kode_kegiatan || mdkFromKak?.mdk_kode_kegiatan || kakItem?.kak_kode_kegiatan || '';
        const namaKeg = kak?.kak_kegiatan || mdkFromKak?.mdk_kegiatan || kakItem?.kak_kegiatan || '';
        const kodeSubKeg = mdkFromKak?.mdk_kode_sub_kegiatan || kakItem?.kak_kode_sub_kegiatan || '';
        const namaSubKeg = kak?.kak_sub_kegiatan || mdkFromKak?.mdk_sub_kegiatan || kakItem?.kak_sub_kegiatan || '';
        const kodeRek = kak?.kak_kode_rekening || mdkFromKak?.mdk_rekening_belanja || kakItem?.kak_kode_rekening || '';
        const namaRek = kak?.kak_rekening || mdkFromKak?.mdk_uraian_belanja || kakItem?.kak_rekening || '';
        const namaPekerjaan = kak?.kak_pekerjaan || mdkFromKak?.mdk_pekerjaan || kakItem?.kak_pekerjaan || '';
        const tahunAnggaran = kak?.kak_tahun_anggaran || mdkFromKak?.mdk_apbd || kakItem?.kak_tahun_anggaran || '';

        // Terapkan ke form states
        if (kodeProg) setMdkKodeProgram(kodeProg);
        if (namaProg) setMdkProgram(namaProg);
        if (kodeKeg) setMdkKodeKegiatan(kodeKeg);
        if (namaKeg) setMdkKegiatan(namaKeg);
        if (kodeSubKeg) setMdkKodeSubKegiatan(kodeSubKeg);
        if (namaSubKeg) setMdkSubKegiatan(namaSubKeg);
        if (kodeRek) setMdkRekeningBelanja(kodeRek);
        if (namaRek) setMdkUraianBelanja(namaRek);
        if (namaPekerjaan && !mdkPekerjaan) setMdkPekerjaan(namaPekerjaan);
        if (tahunAnggaran) {
          setMdkApbd(
            tahunAnggaran.startsWith('APBD')
              ? tahunAnggaran
              : `APBD Kota Pekanbaru Tahun ${tahunAnggaran}`
          );
        }

        // Terapkan Level 1-5 jika ada dari master dokumen sumber
        if (mdkFromKak) {
          if (mdkFromKak.mdk_kode_level1) setMdkKodeLevel1(mdkFromKak.mdk_kode_level1);
          if (mdkFromKak.mdk_nama_level1) setMdkNamaLevel1(mdkFromKak.mdk_nama_level1);
          if (mdkFromKak.mdk_kode_level2) setMdkKodeLevel2(mdkFromKak.mdk_kode_level2);
          if (mdkFromKak.mdk_nama_level2) setMdkNamaLevel2(mdkFromKak.mdk_nama_level2);
          if (mdkFromKak.mdk_kode_level3) setMdkKodeLevel3(mdkFromKak.mdk_kode_level3);
          if (mdkFromKak.mdk_nama_level3) setMdkNamaLevel3(mdkFromKak.mdk_nama_level3);
          if (mdkFromKak.mdk_kode_level4) setMdkKodeLevel4(mdkFromKak.mdk_kode_level4);
          if (mdkFromKak.mdk_nama_level4) setMdkNamaLevel4(mdkFromKak.mdk_nama_level4);
          if (mdkFromKak.mdk_kode_level5) setMdkKodeLevel5(mdkFromKak.mdk_kode_level5);
          if (mdkFromKak.mdk_nama_level5) setMdkNamaLevel5(mdkFromKak.mdk_nama_level5);
        }

        // Item Barang & Pagu Anggaran
        let itemObjectsToSet: any[] = [];
        let totalPagu = 0;

        // Cek jika master dokumen dari KAK memiliki mdk_item_barang
        if (mdkFromKak?.mdk_item_barang) {
          try {
            const parsed = typeof mdkFromKak.mdk_item_barang === 'string'
              ? JSON.parse(mdkFromKak.mdk_item_barang)
              : mdkFromKak.mdk_item_barang;
            if (Array.isArray(parsed) && parsed.length > 0) {
              itemObjectsToSet = parsed;
              totalPagu = parsed.reduce((sum: number, it: any) => sum + (Number(it.PAGU_TOTAL) || 0), 0);
            }
          } catch (e) {
            console.error('Error parsing mdk_item_barang from KAK:', e);
          }
        }

        // Jika tidak ada dari mdk_item_barang tapi ada perkiraanBiayaList di KAK
        if (itemObjectsToSet.length === 0 && kakDetails?.perkiraanBiayaList && kakDetails.perkiraanBiayaList.length > 0) {
          itemObjectsToSet = kakDetails.perkiraanBiayaList.map((biaya, idx) => {
            const lines = (biaya.kpb_uraian || '').split('\n');
            const namaItem = lines[0] || `Item KAK #${idx + 1}`;
            const spesifikasi = biaya.kpb_uraian.includes('Spesifikasi :')
              ? biaya.kpb_uraian.split('Spesifikasi :')[1]?.trim() || ''
              : lines.slice(1).join(' ').trim();

            return {
              KODE_STANDAR_HARGA: `KAK-${biaya.kpb_id || idx + 1}`,
              NAMA_STANDAR_HARGA: namaItem,
              SPESIFIKASI: spesifikasi,
              KOOFISIEN: String(biaya.kpb_volume || 1),
              SATUAN: 'Unit',
              HARGA_SATUAN: Number(biaya.kpb_harga || 0),
              PAGU_TOTAL: Number(biaya.kpb_jumlah || 0),
            };
          });
          totalPagu = itemObjectsToSet.reduce((sum, it) => sum + (Number(it.PAGU_TOTAL) || 0), 0);
        }

        if (itemObjectsToSet.length > 0) {
          setSavedItemObjects(itemObjectsToSet);
          setSelectedKodeStandarHarga(itemObjectsToSet.map((it: any) => it.KODE_STANDAR_HARGA));
          if (totalPagu > 0) {
            setMdkPaguAnggaran(totalPagu);
          }
        } else if (kakItem?.kak_pagu_total) {
          setMdkPaguAnggaran(kakItem.kak_pagu_total);
        }

        setAppliedNotice(
          `✓ Berhasil menarik data dari KAK #${kakId} (${namaPekerjaan || namaProg}) ke Program, Kegiatan, Rekening Belanja & Pagu Anggaran.`
        );
        setTimeout(() => setAppliedNotice(null), 5000);
      }
    } catch (err) {
      console.error('Gagal mengambil detail KAK:', err);
    } finally {
      setLoadingKakDetail(false);
    }
  };

  // Memoized options for SearchableSelect to ensure selected values are always displayed cleanly
  const programOptions = React.useMemo(() => {
    const opts = programList.map((p) => ({
      value: p.KODE_PROGRAM,
      label: p.NAMA_PROGRAM,
      sublabel: p.KODE_PROGRAM,
    }));
    if (mdkKodeProgram && !opts.some((o) => o.value === mdkKodeProgram)) {
      opts.unshift({
        value: mdkKodeProgram,
        label: mdkProgram || mdkKodeProgram,
        sublabel: mdkKodeProgram,
      });
    }
    return opts;
  }, [programList, mdkKodeProgram, mdkProgram]);

  const kegiatanOptions = React.useMemo(() => {
    const opts = kegiatanList.map((k) => ({
      value: k.KODE_KEGIATAN,
      label: k.NAMA_KEGIATAN,
      sublabel: `${k.KODE_KEGIATAN}${k.PAGU ? ` · Pagu: Rp ${Number(k.PAGU).toLocaleString('id-ID')}` : ''}`,
    }));
    if (mdkKodeKegiatan && !opts.some((o) => o.value === mdkKodeKegiatan)) {
      opts.unshift({
        value: mdkKodeKegiatan,
        label: mdkKegiatan || mdkKodeKegiatan,
        sublabel: mdkKodeKegiatan,
      });
    }
    return opts;
  }, [kegiatanList, mdkKodeKegiatan, mdkKegiatan]);

  const subKegiatanOptions = React.useMemo(() => {
    const opts = subKegiatanList.map((sk) => ({
      value: sk.KODE_SUB_KEGIATAN,
      label: sk.NAMA_SUB_KEGIATAN,
      sublabel: `${sk.KODE_SUB_KEGIATAN}${sk.PAGU ? ` · Pagu: Rp ${Number(sk.PAGU).toLocaleString('id-ID')}` : ''}`,
    }));
    if (mdkKodeSubKegiatan && !opts.some((o) => o.value === mdkKodeSubKegiatan)) {
      opts.unshift({
        value: mdkKodeSubKegiatan,
        label: mdkSubKegiatan || mdkKodeSubKegiatan,
        sublabel: mdkKodeSubKegiatan,
      });
    }
    return opts;
  }, [subKegiatanList, mdkKodeSubKegiatan, mdkSubKegiatan]);

  const rekeningBelanjaOptions = React.useMemo(() => {
    const opts = rekeningBelanjaList.map((r) => ({
      value: r.KODE_REKENING,
      label: r.NAMA_REKENING,
      sublabel: `${r.KODE_REKENING} · Pagu: Rp ${Number(r.PAGU).toLocaleString('id-ID')}`,
    }));
    if (mdkRekeningBelanja && !opts.some((o) => o.value === mdkRekeningBelanja)) {
      opts.unshift({
        value: mdkRekeningBelanja,
        label: mdkUraianBelanja || mdkRekeningBelanja,
        sublabel: mdkRekeningBelanja,
      });
    }
    return opts;
  }, [rekeningBelanjaList, mdkRekeningBelanja, mdkUraianBelanja]);

  const effectiveRincianList = rincianObjekList.length > 0 ? rincianObjekList : savedItemObjects;

  const toggleSelectItem = (kode: string) => {
    setSelectedKodeStandarHarga((prev) => {
      const next = prev.includes(kode) ? prev.filter((k) => k !== kode) : [...prev, kode];
      const sumPagu = effectiveRincianList
        .filter((item) => next.includes(item.KODE_STANDAR_HARGA))
        .reduce((sum, item) => sum + (Number(item.PAGU_TOTAL) || 0), 0);
      setMdkPaguAnggaran(sumPagu);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedKodeStandarHarga.length === effectiveRincianList.length) {
      setSelectedKodeStandarHarga([]);
      setMdkPaguAnggaran(0);
    } else {
      const allCodes = effectiveRincianList.map((item) => item.KODE_STANDAR_HARGA);
      setSelectedKodeStandarHarga(allCodes);
      const sumPagu = effectiveRincianList.reduce((sum, item) => sum + (Number(item.PAGU_TOTAL) || 0), 0);
      setMdkPaguAnggaran(sumPagu);
    }
  };

  const toggleExpandSpec = (kode: string) => {
    setExpandedSpecs((prev) => ({ ...prev, [kode]: !prev[kode] }));
  };

  const selectedRincianItems = effectiveRincianList.filter((item) =>
    selectedKodeStandarHarga.includes(item.KODE_STANDAR_HARGA)
  );

  const totalSelectedPagu = selectedRincianItems.reduce(
    (sum, item) => sum + (Number(item.PAGU_TOTAL) || 0),
    0
  );

  const filteredRincianList = effectiveRincianList.filter((item) => {
    if (!searchRincianKeyword.trim()) return true;
    const term = searchRincianKeyword.toLowerCase();
    return (
      item.NAMA_STANDAR_HARGA?.toLowerCase().includes(term) ||
      item.KODE_STANDAR_HARGA?.toLowerCase().includes(term) ||
      item.SPESIFIKASI?.toLowerCase().includes(term)
    );
  });

  const applySelectedItemsToForm = () => {
    if (selectedRincianItems.length === 0) return;

    // 1. Set mdkPekerjaan
    const namaList = selectedRincianItems.map((i) => i.NAMA_STANDAR_HARGA.trim()).filter(Boolean);
    const pekerjaanText = namaList.length === 1 ? namaList[0] : namaList.join(', ');
    setMdkPekerjaan(pekerjaanText);

    // 2. Set mdkPaguAnggaran
    setMdkPaguAnggaran(totalSelectedPagu);

    // 3. Set mdkVolume & mdkSatuan
    if (selectedRincianItems.length === 1) {
      setMdkVolume(selectedRincianItems[0].KOOFISIEN || '1');
      if (selectedRincianItems[0].SATUAN) {
        const foundSatuan = masterSatuanList.find(
          (s) => s.st_nama?.trim().toLowerCase() === selectedRincianItems[0].SATUAN.trim().toLowerCase()
        );
        if (foundSatuan) {
          setMdkSatuan(foundSatuan.st_id);
        }
      }
    } else {
      const totalVol = selectedRincianItems.reduce((acc, curr) => acc + (Number(curr.KOOFISIEN) || 0), 0);
      setMdkVolume(totalVol > 0 ? totalVol.toString() : selectedRincianItems.length.toString());

      const uniqueSatuans = Array.from(new Set(selectedRincianItems.map((i) => i.SATUAN?.trim().toLowerCase())));
      if (uniqueSatuans.length === 1 && uniqueSatuans[0]) {
        const foundSatuan = masterSatuanList.find(
          (s) => s.st_nama?.trim().toLowerCase() === uniqueSatuans[0]
        );
        if (foundSatuan) {
          setMdkSatuan(foundSatuan.st_id);
        }
      }
    }

    setAppliedNotice(
      `✓ Berhasil menerapkan ${selectedRincianItems.length} item barang ke Pekerjaan, Pagu (Rp ${totalSelectedPagu.toLocaleString('id-ID')}), Volume & Satuan.`
    );
    setTimeout(() => {
      setAppliedNotice(null);
    }, 4500);
  };

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

    // Ambil item rincian objek yang dicentang user untuk disimpan ke mdk_item_barang
    const selectedFromApi = rincianObjekList.filter((item) =>
      selectedKodeStandarHarga.includes(item.KODE_STANDAR_HARGA)
    );
    const finalItems = selectedFromApi.length > 0
      ? selectedFromApi
      : savedItemObjects.filter((item) => selectedKodeStandarHarga.includes(item.KODE_STANDAR_HARGA));

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
      mdk_satuan: Number(mdkSatuan) || 0,
      mdk_item_barang: finalItems.length > 0 ? finalItems : null,
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
    { id: 1, label: 'Program, Kegiatan & Rekening', icon: '📊' },
    { id: 2, label: 'Pekerjaan & DPA', icon: '📝' },
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
              <span className="text-gray-400 italic text-[11px]">Belum dipilih (Tab 1)</span>
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
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-7xl w-[96vw] p-6 lg:p-8">
      <div className="flex flex-col h-full max-h-[88vh]">
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
          {/* TAB 1: Program, Kegiatan & Rekening Belanja */}
          {activeTab === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3 bg-brand-50/50 dark:bg-brand-900/10 rounded-xl text-xs text-brand-700 dark:text-brand-300 font-medium flex flex-wrap items-center justify-between gap-2">
                <span>📊 Bagian 1: Pengodean Program, Kegiatan, Rekening Belanja &amp; Item Standar Harga</span>
                {totalSelectedPagu > 0 && (
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800 text-[11px]">
                    Total Pagu Terpilih: {formatRupiah(totalSelectedPagu)}
                  </span>
                )}
              </div>

              {/* Mode Switcher: Manual / SIPD BPKAD vs Berdasarkan KAK */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 bg-gray-50/90 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700">
                <div>
                  <span className="text-xs font-bold text-gray-900 dark:text-white block">
                    Metode Pengisian Data Program &amp; Kegiatan
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    Pilih apakah ingin mengisi mandiri via SIPD BPKAD atau menarik data langsung dari Kerangka Acuan Kerja (KAK)
                  </span>
                </div>

                <div className="inline-flex p-1 bg-gray-200/80 dark:bg-gray-900 rounded-xl shrink-0 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setInputMode('manual')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      inputMode === 'manual'
                        ? 'bg-white dark:bg-gray-800 text-brand-600 dark:text-brand-400 shadow-xs'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <span>✏️</span>
                    <span>Isi Manual / SIPD BPKAD</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode('kak')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      inputMode === 'kak'
                        ? 'bg-white dark:bg-gray-800 text-brand-600 dark:text-brand-400 shadow-xs'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <span>📋</span>
                    <span>Pilih Berdasarkan KAK</span>
                  </button>
                </div>
              </div>

              {/* Card Seleksi KAK saat mode Berdasarkan KAK dipilih */}
              {inputMode === 'kak' && (
                <div className="p-4 rounded-2xl bg-brand-50/50 dark:bg-brand-950/25 border border-brand-200/80 dark:border-brand-800/70 space-y-3 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-brand-600 text-white text-xs">📋</span>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                          Pilih Kerangka Acuan Kerja (KAK)
                        </h4>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                          Data program, kegiatan, sub kegiatan, rekening belanja, pekerjaan, dan pagu akan diisi otomatis dari KAK terpilih.
                        </p>
                      </div>
                    </div>
                    {loadingKakOptions && (
                      <span className="text-xs text-brand-600 dark:text-brand-400 flex items-center gap-1.5 self-start sm:self-auto">
                        <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Memuat KAK...
                      </span>
                    )}
                  </div>

                  <SearchableSelect
                    placeholder={loadingKakOptions ? 'Memuat daftar KAK...' : 'Pilih Dokumen KAK...'}
                    searchPlaceholder="Cari pekerjaan, program, atau rekening KAK..."
                    disabled={loadingKakOptions || loadingKakDetail}
                    value={selectedKakId ? String(selectedKakId) : ''}
                    options={kakOptions.map((k) => ({
                      value: String(k.kak_id),
                      label: k.kak_pekerjaan || `KAK #${k.kak_id}`,
                      sublabel: `KAK #${k.kak_id} · Rek: ${k.kak_kode_rekening || k.kak_rekening || '-'} · Pagu: Rp ${Number(k.kak_pagu_total || 0).toLocaleString('id-ID')}`,
                    }))}
                    onChange={(val: string) => {
                      if (val) handleSelectKak(Number(val));
                    }}
                  />

                  {loadingKakDetail && (
                    <div className="flex items-center gap-2 text-xs text-brand-600 dark:text-brand-400 py-1">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Sedang menarik detail dan rincian perkiraan biaya dari KAK...
                    </div>
                  )}

                  {selectedKakDetail && !loadingKakDetail && (
                    <div className="p-3.5 rounded-xl bg-white dark:bg-gray-900 border border-brand-200 dark:border-brand-800/80 shadow-xs space-y-2 text-xs animate-in fade-in">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                        <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                          <span className="text-emerald-600">✓</span>
                          Data KAK Terhubung: <span className="text-brand-600 dark:text-brand-400 font-mono">#{selectedKakDetail.kak_id}</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded text-[11px] border border-emerald-200/60">
                            Pagu KAK: Rp {Number(selectedKakDetail.kak_pagu_total || 0).toLocaleString('id-ID')}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedKakId('');
                              setSelectedKakDetail(null);
                            }}
                            className="text-xs text-gray-400 hover:text-red-600 dark:hover:text-red-400 font-medium cursor-pointer"
                          >
                            Ganti KAK
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-600 dark:text-gray-300">
                        <div>
                          <span className="text-gray-400 block text-[10px] uppercase font-semibold">Pekerjaan</span>
                          <span className="font-medium text-gray-900 dark:text-white">{selectedKakDetail.kak_pekerjaan || '-'}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[10px] uppercase font-semibold">Rekening Belanja</span>
                          <span className="font-medium text-gray-900 dark:text-white font-mono">{selectedKakDetail.kak_kode_rekening || selectedKakDetail.kak_rekening || '-'}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[10px] uppercase font-semibold">Program</span>
                          <span>{selectedKakDetail.kak_kode_program ? `${selectedKakDetail.kak_kode_program} - ` : ''}{selectedKakDetail.kak_program || '-'}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[10px] uppercase font-semibold">Kegiatan</span>
                          <span>{selectedKakDetail.kak_kode_kegiatan ? `${selectedKakDetail.kak_kode_kegiatan} - ` : ''}{selectedKakDetail.kak_kegiatan || '-'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Grid 2 Kolom untuk Form Select agar rapi dan tidak terlalu panjang ke samping */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Program (Kolom Kiri) */}
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
                    options={programOptions}
                    onChange={(val: string) => {
                      const found = programList.find((p) => p.KODE_PROGRAM === val);
                      setMdkKodeProgram(val);
                      setMdkProgram(found?.NAMA_PROGRAM ?? '');
                      // Reset turunan (Kegiatan, Sub Kegiatan, Rekening Belanja, Items)
                      setMdkKodeKegiatan('');
                      setMdkKegiatan('');
                      setMdkKodeSubKegiatan('');
                      setMdkSubKegiatan('');
                      setMdkRekeningBelanja('');
                      setRekeningBelanjaList([]);
                      setRincianObjekList([]);
                      setSelectedKodeStandarHarga([]);
                      setMdkPaguAnggaran(0);
                    }}
                  />
                  {mdkKodeProgram && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Kode: <span className="font-mono font-medium">{mdkKodeProgram}</span>
                    </p>
                  )}
                </div>

                {/* 2. Kegiatan (Kolom Kanan) */}
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
                    options={kegiatanOptions}
                    onChange={(val: string) => {
                      const found = kegiatanList.find((k) => k.KODE_KEGIATAN === val);
                      setMdkKodeKegiatan(val);
                      setMdkKegiatan(found?.NAMA_KEGIATAN ?? '');
                      // Reset turunan (Sub Kegiatan, Rekening Belanja, Items)
                      setMdkKodeSubKegiatan('');
                      setMdkSubKegiatan('');
                      setMdkRekeningBelanja('');
                      setRekeningBelanjaList([]);
                      setRincianObjekList([]);
                      setSelectedKodeStandarHarga([]);
                      setMdkPaguAnggaran(0);
                    }}
                  />
                  {mdkKodeKegiatan && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Kode: <span className="font-mono font-medium">{mdkKodeKegiatan}</span>
                    </p>
                  )}
                </div>

                {/* 3. Sub Kegiatan (Kolom Kiri) */}
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
                    options={subKegiatanOptions}
                    onChange={(val: string) => {
                      const found = subKegiatanList.find((sk) => sk.KODE_SUB_KEGIATAN === val);
                      setMdkKodeSubKegiatan(val);
                      setMdkSubKegiatan(found?.NAMA_SUB_KEGIATAN ?? '');
                      // Reset rekening belanja & item rincian
                      setMdkRekeningBelanja('');
                      setRekeningBelanjaList([]);
                      setRincianObjekList([]);
                      setSelectedKodeStandarHarga([]);
                      setMdkPaguAnggaran(0);
                    }}
                  />
                  {mdkKodeSubKegiatan && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Kode: <span className="font-mono font-medium">{mdkKodeSubKegiatan}</span>
                    </p>
                  )}
                </div>

                {/* 4. Rekening Belanja (Kolom Kanan) */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Rekening Belanja
                    {!mdkKodeSubKegiatan && (
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
                      Mengambil rekening belanja dari BPKAD...
                    </div>
                  )}
                  <SearchableSelect
                    placeholder={
                      !mdkKodeSubKegiatan
                        ? 'Pilih Sub Kegiatan terlebih dahulu...'
                        : loadingRekBel
                          ? 'Memuat data rekening...'
                          : 'Pilih Rekening Belanja...'
                    }
                    searchPlaceholder="Cari kode atau nama rekening..."
                    disabled={!mdkKodeSubKegiatan || loadingRekBel}
                    value={mdkRekeningBelanja}
                    options={rekeningBelanjaOptions}
                    onChange={(val: string) => {
                      const found = rekeningBelanjaList.find((r) => r.KODE_REKENING === val);
                      setMdkRekeningBelanja(val);
                      setSelectedKodeStandarHarga([]);
                      setRincianObjekList([]);
                      setMdkPaguAnggaran(0);
                      if (found) {
                        setMdkUraianBelanja(found.NAMA_REKENING || '');
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
              </div>

              {/* Pemilihan Item Barang (Daftar Rincian Belanja Standar Harga dari Api-RO) */}
              {mdkRekeningBelanja && (
                <div className="mt-2 p-4 sm:p-5 rounded-2xl bg-gray-50/80 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/80 space-y-3.5 transition-all">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2.5">
                      <span className="p-2 rounded-xl bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                          Daftar Rincian Belanja (Standar Harga)
                        </h4>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                          Pilih item belanja yang akan dimasukkan ke dalam paket pekerjaan ini. Nilai pagu dokumen akan otomatis dihitung dari item yang dicentang.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-start sm:self-auto">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {effectiveRincianList.length} Item
                      </span>
                      {effectiveRincianList.length > 0 && (
                        <button
                          type="button"
                          onClick={toggleSelectAll}
                          className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 hover:underline cursor-pointer"
                        >
                          {selectedKodeStandarHarga.length === effectiveRincianList.length ? 'Batalkan Semua' : 'Pilih Semua'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Notifikasi Terapkan */}
                  {appliedNotice && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center justify-between animate-in fade-in">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{appliedNotice}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAppliedNotice(null)}
                        className="text-emerald-500 hover:text-emerald-700 font-bold ml-2 text-sm leading-none cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* Loading State */}
                  {loadingRincianObjek ? (
                    <div className="py-8 text-center space-y-2.5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                      <div className="w-7 h-7 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Mengambil data rincian belanja (Api-RO) dari server BPKAD...
                      </p>
                    </div>
                  ) : effectiveRincianList.length === 0 ? (
                    <div className="py-6 text-center text-xs text-gray-400 dark:text-gray-500 bg-white/60 dark:bg-gray-900/40 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                      Tidak ditemukan item rincian objek belanja untuk rekening ini.
                    </div>
                  ) : (
                    <>
                      {/* Search bar when items > 2 */}
                      {effectiveRincianList.length > 2 && (
                        <div className="relative">
                          <input
                            type="text"
                            value={searchRincianKeyword}
                            onChange={(e) => setSearchRincianKeyword(e.target.value)}
                            placeholder="Filter rincian barang berdasarkan nama, kode, atau spesifikasi..."
                            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                          />
                          <svg
                            className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      )}

                      {/* Selected Summary & Quick Apply Action */}
                      {selectedKodeStandarHarga.length > 0 && (
                        <div className="p-3 bg-gradient-to-r from-brand-500/10 via-indigo-500/10 to-blue-500/10 dark:from-brand-950/40 dark:via-indigo-950/40 dark:to-blue-950/40 border border-brand-200 dark:border-brand-800/80 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs animate-in fade-in">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                              {selectedKodeStandarHarga.length}
                            </span>
                            <div>
                              <span className="text-xs font-bold text-gray-900 dark:text-white block">
                                {selectedKodeStandarHarga.length} dari {effectiveRincianList.length} item dipilih
                              </span>
                              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                Total Pagu Terpilih: Rp {totalSelectedPagu.toLocaleString('id-ID')}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={applySelectedItemsToForm}
                            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer self-stretch sm:self-auto"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Terapkan ke Form (Pekerjaan, Volume &amp; Satuan)
                          </button>
                        </div>
                      )}

                      {/* Grid 2 Kolom untuk Item Cards */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 max-h-[440px] overflow-y-auto pr-1">
                        {filteredRincianList.map((item) => {
                          const isChecked = selectedKodeStandarHarga.includes(item.KODE_STANDAR_HARGA);
                          const isExpanded = Boolean(expandedSpecs[item.KODE_STANDAR_HARGA]);
                          const hargaSatuanNum = Number(item.HARGA_SATUAN) || 0;
                          const paguTotalNum = Number(item.PAGU_TOTAL) || 0;

                          return (
                            <div
                              key={item.KODE_STANDAR_HARGA}
                              onClick={() => toggleSelectItem(item.KODE_STANDAR_HARGA)}
                              className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                                isChecked
                                  ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-950/30 ring-1.5 ring-brand-500/20 shadow-xs'
                                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="pt-0.5">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => toggleSelectItem(item.KODE_STANDAR_HARGA)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-4 h-4 rounded text-brand-600 border-gray-300 dark:border-gray-600 focus:ring-brand-500 cursor-pointer"
                                  />
                                </div>

                                <div className="flex-1 min-w-0 space-y-2">
                                  {/* Header: Title and Kode */}
                                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1.5">
                                    <h5 className="text-xs font-bold text-gray-900 dark:text-white leading-snug">
                                      {item.NAMA_STANDAR_HARGA}
                                    </h5>
                                    <span className="font-mono text-[10px] text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200/60 dark:border-gray-700 shrink-0">
                                      {item.KODE_STANDAR_HARGA}
                                    </span>
                                  </div>

                                  {/* Price, Koofisien & Total Pagu Badges */}
                                  <div className="flex flex-wrap items-center gap-2 text-xs">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold text-[11px]">
                                      📦 Vol: {item.KOOFISIEN} {item.SATUAN}
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-400 text-[11px]">
                                      @ Rp {hargaSatuanNum.toLocaleString('id-ID')}
                                    </span>
                                    <span className="ml-auto font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                                      Pagu: Rp {paguTotalNum.toLocaleString('id-ID')}
                                    </span>
                                  </div>

                                  {/* Spesifikasi Toggle */}
                                  {item.SPESIFIKASI && (
                                    <div className="pt-0.5">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleExpandSpec(item.KODE_STANDAR_HARGA);
                                        }}
                                        className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1 cursor-pointer"
                                      >
                                        <svg
                                          className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                        {isExpanded ? 'Tutup Spesifikasi' : 'Lihat Spesifikasi'}
                                      </button>

                                      {isExpanded && (
                                        <div
                                          onClick={(e) => e.stopPropagation()}
                                          className="mt-2 p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed font-sans whitespace-pre-wrap border border-gray-200/70 dark:border-gray-700"
                                        >
                                          {item.SPESIFIKASI}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Pekerjaan & Dokumen DPA */}
          {activeTab === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3 bg-brand-50/50 dark:bg-brand-900/10 rounded-xl text-xs text-brand-700 dark:text-brand-300 font-medium">
                📝 Bagian 2: APBD, Nomor DPA, Uraian Pekerjaan, Volume &amp; Satuan
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                      Pekerjaan
                    </label>
                    {selectedRincianItems.length > 0 && (
                      <span className="text-[11px] text-brand-600 dark:text-brand-400 font-medium">
                        (Dapat otomatis terisi dari tombol &quot;Terapkan ke Form&quot; di Tab 1)
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Nama paket pekerjaan"
                    value={mdkPekerjaan}
                    onChange={(e) => setMdkPekerjaan(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
                  />
                </div>

                <div className="md:col-span-2">
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

                  <SearchableSelect
                    options={masterSatuanList.map((satuan) => ({
                      value: satuan.st_id,
                      label: satuan.st_nama || '',
                    }))}
                    value={mdkSatuan}
                    onChange={(val) => setMdkSatuan(Number(val))}
                    placeholder="-- Pilih Satuan --"
                    searchPlaceholder="Cari berdasarkan nama..."
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
                      <span className="text-[11px] text-brand-600 dark:text-brand-400 font-medium">
                        (Otomatis dari total item checklist Tab 1)
                      </span>
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
                        .filter((pgw) => pgw.pgw_jabatan == 'PPTK')
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
                        .filter((pgw) => pgw.pgw_jabatan && pgw.pgw_jabatan.toLowerCase().includes('bendahara'))
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
