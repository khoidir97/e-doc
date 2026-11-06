"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MasterDokumen } from '../../master-dokumen/types';
import { Paket, UpsertPaketInput } from '../types';
import {
  getMasterDokumenOptionsAction,
  getPerhitunganPaketByMasterDokumenAction,
  savePerhitunganPaketBatchAction,
  deletePerhitunganPaketAction,
  getPaketByMasterDokumenAction,
  savePaketAction,
} from '../actions';
import { getNegoByMasterDokumenAction } from '@/features/nego/actions';
import { formatRupiah } from '@/lib/terbilang';
import { formatDateYYYYMMDD } from '@/lib/date';
import { MasterDokumenSelectorCard } from '@/features/master-dokumen/components/MasterDokumenSelectorCard';
import { RupiahInput } from '@/components/form/RupiahInput';
import { Toast } from '@/components/ui/Toast';

interface PerhitunganPaketItemRow {
  pak_id?: number;
  pak_master_dokumen_id?: number;
  pak_nilai_invoice: number;
  pak_dpp: number;
  pak_ppn: number;
  pak_pph23: number;
  pak_jenis_pph?: '23' | '22';
  pak_dibayar: number;
}

const createEmptyRow = (defaultJenisPph: '23' | '22' = '23'): PerhitunganPaketItemRow => ({
  pak_nilai_invoice: 0,
  pak_dpp: 0,
  pak_ppn: 0,
  pak_pph23: 0,
  pak_jenis_pph: defaultJenisPph,
  pak_dibayar: 0,
});

// Hitung tarif PPh: PPh 23 = 2% (0.02) atau 1.5% (0.015), PPh 22 = 1.5% (0.015)
// Default rumus: PPh 23 = 2% (Math.round(dpp * 0.02)), PPh 22 = 1.5% (Math.round(dpp * 0.015))
const getPphRate = (jenisPph: '23' | '22' = '23') => {
  return jenisPph === '22' ? 0.015 : 0.02;
};

// Hitung otomatis turunan dari Nilai Invoice (invoice sudah termasuk PPN 11%)
const calcFromInvoice = (
  invoice: number,
  ppnOverride?: number,
  jenisPph: '23' | '22' = '23'
): Omit<PerhitunganPaketItemRow, 'pak_id' | 'pak_master_dokumen_id'> => {
  const nilai = Number(invoice) || 0;
  const ppn = ppnOverride !== undefined ? ppnOverride : Math.round((nilai * 11) / 111);
  const dpp = nilai - ppn;
  const rate = getPphRate(jenisPph);
  const pph = Math.round(dpp * rate);
  return {
    pak_nilai_invoice: nilai,
    pak_ppn: ppn,
    pak_dpp: dpp,
    pak_pph23: pph,
    pak_jenis_pph: jenisPph,
    pak_dibayar: dpp - pph,
  };
};

interface PerhitunganPaketContainerProps {
  initialMasterDokumenId?: number;
  hideMasterDokumenSelector?: boolean;
}

// Reusable field input component
const Field = ({
  label, value, onChange, type = 'text', placeholder = '', className = ''
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
}) => (
  <div className={className}>
    <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all"
    />
  </div>
);

export const PerhitunganPaketContainer: React.FC<PerhitunganPaketContainerProps> = ({
  initialMasterDokumenId,
  hideMasterDokumenSelector = false,
}) => {
  const [masterDokumenList, setMasterDokumenList] = useState<MasterDokumen[]>([]);
  const [selectedMdkId, setSelectedMdkId] = useState<number | ''>(initialMasterDokumenId || '');
  const [selectedMasterDokumen, setSelectedMasterDokumen] = useState<MasterDokumen | null>(null);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Paket header state (tabel perhitungan_paket)
  const todayYmd = formatDateYYYYMMDD(new Date());
  const [paketData, setPaketData] = useState<Paket | null>(null);
  const [pktSpkKwitansi, setPktSpkKwitansi] = useState(0);
  const [pktNoSpkKwitansi, setPktNoSpkKwitansi] = useState('');
  const [pktTanggalSpkKwitansi, setPktTanggalSpkKwitansi] = useState(todayYmd);
  const [pktBapp, setPktBapp] = useState('');
  const [pktBast, setPktBast] = useState('');
  const [pktBap, setPktBap] = useState('');
  const [pktTanggal, setPktTanggal] = useState(todayYmd);
  const [pktNpwp, setPktNpwp] = useState('');
  const [pktNoRekening, setPktNoRekening] = useState('');
  const [pktNamaRekening, setPktNamaRekening] = useState('');
  const [pktNamaBank, setPktNamaBank] = useState('');
  const [pktJenisPph, setPktJenisPph] = useState<'23' | '22'>('23');
  const [savingPaket, setSavingPaket] = useState(false);

  // Detail rows state (tabel detail_perhitungan_paket)
  const [PerhitunganPaketRows, setPerhitunganPaketRows] = useState<PerhitunganPaketItemRow[]>([createEmptyRow()]);
  const [loadingPerhitunganPaket, setLoadingPerhitunganPaket] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasSavedData, setHasSavedData] = useState(false);

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

  const loadPerhitunganPaketForMdk = useCallback(async (mdkId: number) => {
    setLoadingPerhitunganPaket(true);
    const [res, negoRes] = await Promise.all([
      getPerhitunganPaketByMasterDokumenAction(mdkId),
      getNegoByMasterDokumenAction(mdkId),
    ]);

    // Nilai Invoice = Total + PPN (11%) dari Harga Negosiasi
    let negoCalc: ReturnType<typeof calcFromInvoice> | null = null;
    if (negoRes.success && negoRes.data && negoRes.data.length > 0) {
      const totalNego = negoRes.data.reduce((acc, n) => acc + (Number(n.nego_negosiasi_jumlah_harga) || 0), 0);
      if (totalNego > 0) {
        const ppnNego = Math.round(totalNego * 0.11);
        negoCalc = calcFromInvoice(totalNego + ppnNego, ppnNego);
      }
    }

    const isSaved = Boolean(res.success && res.data && res.data.length > 0);
    setHasSavedData(isSaved);

    if (isSaved && res.data) {
      setPerhitunganPaketRows(res.data.map((item, idx) => {
        const itemJenisPph: '23' | '22' = item.pak_jenis_pph === '22' ? '22' : '23';
        const base = {
          pak_id: item.pak_id,
          pak_master_dokumen_id: item.pak_master_dokumen_id,
          pak_jenis_pph: itemJenisPph,
        };
        // Jika invoice tersimpan masih kosong, ambil dari Nego (baris pertama)
        if (idx === 0 && !Number(item.pak_nilai_invoice) && negoCalc) {
          return { ...base, ...negoCalc };
        }
        return {
          ...base,
          pak_nilai_invoice: item.pak_nilai_invoice || 0,
          pak_dpp: item.pak_dpp || 0,
          pak_ppn: item.pak_ppn || 0,
          pak_pph23: item.pak_pph23 || 0,
          pak_dibayar: item.pak_dibayar || 0,
        };
      }));
    } else {
      setPerhitunganPaketRows([negoCalc ? { ...negoCalc } : createEmptyRow(pktJenisPph)]);
    }
    setLoadingPerhitunganPaket(false);
  }, [pktJenisPph]);

  const loadPaketForMdk = useCallback(async (mdkId: number) => {
    const res = await getPaketByMasterDokumenAction(mdkId);
    if (res.success && res.data) {
      const p = res.data;
      setPaketData(p);
      setPktSpkKwitansi(p.pkt_spk_kwitansi || 0);
      setPktNoSpkKwitansi(p.pkt_no_spk_kwitansi || '');
      setPktTanggalSpkKwitansi(
        p.pkt_tanggal_spk_kwitansi ? formatDateYYYYMMDD(p.pkt_tanggal_spk_kwitansi) : todayYmd
      );
      setPktBapp(p.pkt_bapp || '');
      setPktBast(p.pkt_bast || '');
      setPktBap(p.pkt_bap || '');
      setPktTanggal(
        p.pkt_tanggal ? formatDateYYYYMMDD(p.pkt_tanggal) : todayYmd
      );
      setPktNpwp(p.pkt_npwp || '');
      setPktNoRekening(p.pkt_no_rekening || '');
      setPktNamaRekening(p.pkt_nama_rekening || '');
      setPktNamaBank(p.pkt_nama_bank || '');
      if (p.pkt_jenis_pph === '22' || p.pkt_jenis_pph === '23') {
        setPktJenisPph(p.pkt_jenis_pph);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedMdkId && typeof selectedMdkId === 'number') {
      const found = masterDokumenList.find((m) => m.mdk_id === selectedMdkId) || null;
      setSelectedMasterDokumen(found);
      loadPerhitunganPaketForMdk(selectedMdkId);
      loadPaketForMdk(selectedMdkId);
    } else {
      setSelectedMasterDokumen(null);
      setHasSavedData(false);
      setPerhitunganPaketRows([createEmptyRow()]);
      setPaketData(null);
    }
  }, [selectedMdkId, masterDokumenList, loadPerhitunganPaketForMdk, loadPaketForMdk]);

  const handleAddRow = () => setPerhitunganPaketRows((prev) => [...prev, createEmptyRow(pktJenisPph)]);

  const handleRemoveRow = (index: number) => {
    if (PerhitunganPaketRows.length === 1) {
      setPerhitunganPaketRows([createEmptyRow(pktJenisPph)]);
      return;
    }
    setPerhitunganPaketRows((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleRowChange = (index: number, field: keyof PerhitunganPaketItemRow, value: any) => {
    setPerhitunganPaketRows((prev) => {
      const updated = [...prev];
      let row = { ...updated[index], [field]: value };
      const currentJenisPph = row.pak_jenis_pph || pktJenisPph || '23';

      if (field === 'pak_jenis_pph') {
        const newJenis = value as '23' | '22';
        row.pak_jenis_pph = newJenis;
        if (row.pak_nilai_invoice > 0) {
          row = { ...row, ...calcFromInvoice(row.pak_nilai_invoice, row.pak_ppn, newJenis) };
        } else if (row.pak_dpp > 0) {
          const rate = getPphRate(newJenis);
          row.pak_pph23 = Math.round(row.pak_dpp * rate);
          row.pak_dibayar = row.pak_dpp - row.pak_pph23;
        }
      } else if (field === 'pak_nilai_invoice') {
        // Invoice berubah -> hitung ulang semua
        const num = Number(value) || 0;
        row = { ...row, ...calcFromInvoice(num, undefined, currentJenisPph) };
      } else if (field === 'pak_ppn') {
        // PPN diubah manual -> DPP, PPh, Dibayar menyesuaikan
        const num = Number(value) || 0;
        row = { ...row, ...calcFromInvoice(row.pak_nilai_invoice, num, currentJenisPph) };
      } else if (field === 'pak_dpp') {
        const num = Number(value) || 0;
        const rate = getPphRate(currentJenisPph);
        row.pak_pph23 = Math.round(num * rate);
        row.pak_dibayar = num - row.pak_pph23;
      } else if (field === 'pak_pph23') {
        const num = Number(value) || 0;
        row.pak_dibayar = (Number(row.pak_dpp) || 0) - num;
      }

      updated[index] = row;
      return updated;
    });
  };

  // Ubah jenis PPh untuk semua baris sekaligus
  const handleBulkJenisPphChange = (newJenis: '23' | '22') => {
    setPktJenisPph(newJenis);
    setPerhitunganPaketRows((prev) =>
      prev.map((r) => {
        const row = { ...r, pak_jenis_pph: newJenis };
        if (row.pak_nilai_invoice > 0) {
          return { ...row, ...calcFromInvoice(row.pak_nilai_invoice, row.pak_ppn, newJenis) };
        } else if (row.pak_dpp > 0) {
          const rate = getPphRate(newJenis);
          const pph = Math.round(row.pak_dpp * rate);
          return { ...row, pak_pph23: pph, pak_dibayar: row.pak_dpp - pph };
        }
        return row;
      })
    );
  };

  const getPaketInputPayload = (mdkId: number): UpsertPaketInput => ({
    pkt_master_dokumen_id: mdkId,
    pkt_spk_kwitansi: pktSpkKwitansi ? Number(pktSpkKwitansi) : null,
    pkt_no_spk_kwitansi: pktNoSpkKwitansi ? pktNoSpkKwitansi.trim() : null,
    pkt_tanggal_spk_kwitansi: pktTanggalSpkKwitansi ? formatDateYYYYMMDD(pktTanggalSpkKwitansi) : null,
    pkt_bapp: pktBapp ? pktBapp.trim() : null,
    pkt_bast: pktBast ? pktBast.trim() : null,
    pkt_bap: pktBap ? pktBap.trim() : null,
    pkt_tanggal: pktTanggal ? formatDateYYYYMMDD(pktTanggal) : null,
    pkt_npwp: pktNpwp ? pktNpwp.trim() : null,
    pkt_no_rekening: pktNoRekening ? pktNoRekening.trim() : null,
    pkt_nama_rekening: pktNamaRekening ? pktNamaRekening.trim() : null,
    pkt_nama_bank: pktNamaBank ? pktNamaBank.trim() : null,
    pkt_jenis_pph: pktJenisPph || '23',
  });

  const handleSavePaket = async () => {
    if (!selectedMdkId || typeof selectedMdkId !== 'number') return;
    setSavingPaket(true);
    const res = await savePaketAction(getPaketInputPayload(selectedMdkId));
    setSavingPaket(false);
    if (res.success) {
      showToast('success', 'Info dokumen berhasil disimpan!');
      loadPaketForMdk(selectedMdkId);
    } else {
      showToast('error', res.message);
    }
  };

  const handleSubmitDetail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMdkId || typeof selectedMdkId !== 'number') {
      showToast('error', 'Silakan pilih Master Dokumen terlebih dahulu.');
      return;
    }
    const validRows = PerhitunganPaketRows.filter((r) => r.pak_nilai_invoice > 0);
    if (validRows.length === 0) {
      showToast('error', 'Minimal isi 1 Nilai Invoice.');
      return;
    }
    setSaving(true);
    const [paketRes, batchRes] = await Promise.all([
      savePaketAction(getPaketInputPayload(selectedMdkId)),
      savePerhitunganPaketBatchAction({
        pak_master_dokumen_id: selectedMdkId,
        items: validRows.map((r) => ({
          pak_nilai_invoice: r.pak_nilai_invoice,
          pak_dpp: r.pak_dpp,
          pak_ppn: r.pak_ppn,
          pak_pph23: r.pak_pph23,
          pak_jenis_pph: r.pak_jenis_pph || pktJenisPph || '23',
          pak_dibayar: r.pak_dibayar,
        })),
      }),
    ]);
    setSaving(false);
    if (paketRes.success && batchRes.success) {
      showToast('success', 'Info Dokumen & Rincian Paket berhasil disimpan!');
      loadPaketForMdk(selectedMdkId);
      loadPerhitunganPaketForMdk(selectedMdkId);
    } else if (!paketRes.success) {
      showToast('error', paketRes.message || 'Gagal menyimpan Info Dokumen');
    } else {
      showToast('error', batchRes.message || 'Gagal menyimpan Rincian Paket');
    }
  };

  const handlePrintPdf = async () => {
    if (!selectedMdkId || typeof selectedMdkId !== 'number') return;
    // Auto-save both before printing
    await handleSavePaket();
    window.open(`/perhitungan-paket/print/${selectedMdkId}`, '_blank');
  };

  const totalNilaiInvoice = PerhitunganPaketRows.reduce((a, c) => a + (Number(c.pak_nilai_invoice) || 0), 0);
  const totalDpp = PerhitunganPaketRows.reduce((a, c) => a + (Number(c.pak_dpp) || 0), 0);
  const totalPpn = PerhitunganPaketRows.reduce((a, c) => a + (Number(c.pak_ppn) || 0), 0);
  const totalPph23 = PerhitunganPaketRows.reduce((a, c) => a + (Number(c.pak_pph23) || 0), 0);
  const totalDibayar = PerhitunganPaketRows.reduce((a, c) => a + (Number(c.pak_dibayar) || 0), 0);
  const paguNominal = Number(selectedMasterDokumen?.mdk_pagu_anggaran) || 0;
  const isLocked = selectedMasterDokumen?.mdk_is_lock === 1;
  const selisihNominal = paguNominal - totalNilaiInvoice;
  const isSaved = hasSavedData || PerhitunganPaketRows.some((r) => Boolean(r.pak_id));

  const inputCls = "w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all";
  const labelCls = "block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1";

  return (
    <div className="p-1 sm:p-1 w-full space-y-6 overflow-hidden">
      {/* Reusable Toast Notification */}
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Formulir Perhitungan Nilai Pekerjaan</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Kelola info SPK/Kuitansi, BAPP, BAST, BAP, dan rincian nilai invoice
            </p>
          </div>
          {selectedMasterDokumen && (
            <button
              onClick={handlePrintPdf}
              className="flex-1 sm:flex-initial px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white dark:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Cetak PDF
            </button>
          )}
        </div>
      )}

      {/* 2-Column Layout */}
      <div className="grid gap-6 items-start" style={{
        gridTemplateColumns: hideMasterDokumenSelector ? '1fr' : 'minmax(0, 380px) minmax(0, 1fr)',
      }}>
        {/* Left: Master Dokumen Selector */}
        {!hideMasterDokumenSelector && (
          <div className="min-w-0 space-y-5">
            <MasterDokumenSelectorCard
              title="Pilih Master Dokumen"
              subtitle="Pilih dokumen acuan untuk Perhitungan Paket"
              masterDokumenList={masterDokumenList}
              selectedMdkId={selectedMdkId}
              selectedMasterDokumen={selectedMasterDokumen}
              onSelect={(val) => setSelectedMdkId(val)}
              loadingOptions={loadingOptions}
            />
          </div>
        )}

        {/* Right: Form Section */}
        <div className="min-w-0 space-y-6">
          {selectedMasterDokumen ? (
            <>
              {/* ── Section 1: Info Dokumen (Paket Header) ── */}
              <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white">Info Dokumen</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">SPK/Kuitansi, BAPP, BAST, BAP, NPWP, Rekening</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSavePaket}
                    disabled={savingPaket || isLocked}
                    className="px-3.5 py-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400 font-semibold text-xs hover:bg-brand-100 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {savingPaket ? 'Menyimpan...' : 'Simpan Info'}
                  </button>
                </div>

                {/* Compact multi-column grid layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                  <div>
                    <label className={labelCls}>SPK / Kuitansi (Rp.)</label>
                    <RupiahInput
                      value={pktSpkKwitansi}
                      onChange={(e) => setPktSpkKwitansi(e)}
                      placeholder="Contoh: 12000000"
                      className={inputCls}
                    />

                  </div>
                  <Field label="No SPK / Kuitansi" value={pktNoSpkKwitansi} onChange={setPktNoSpkKwitansi} placeholder="Nomor SPK/Kuitansi" />
                  <div>
                    <label className={labelCls}>Tanggal SPK</label>
                    <input type="date" value={pktTanggalSpkKwitansi} onChange={(e) => setPktTanggalSpkKwitansi(e.target.value)} className={inputCls} />
                  </div>
                  <Field label="NPWP" value={pktNpwp} onChange={setPktNpwp} placeholder="Contoh: 053.439..." />

                  <Field label="BAPP" value={pktBapp} onChange={setPktBapp} placeholder="No/keterangan BAPP" />
                  <Field label="BAST" value={pktBast} onChange={setPktBast} placeholder="No/keterangan BAST" />
                  <Field label="BAP" value={pktBap} onChange={setPktBap} placeholder="No/keterangan BAP" />
                  <div>
                    <label className={labelCls}>Tanggal BAP</label>
                    <input type="date" value={pktTanggal} onChange={(e) => setPktTanggal(e.target.value)} className={inputCls} />
                  </div>

                  <Field label="No. Rekening" value={pktNoRekening} onChange={setPktNoRekening} placeholder="Nomor Rekening" />
                  <Field label="Nama Rekening" value={pktNamaRekening} onChange={setPktNamaRekening} placeholder="Nama Pemilik Rekening" />
                  <Field label="Nama Bank" value={pktNamaBank} onChange={setPktNamaBank} placeholder="Contoh: BNI, BRI" />
                </div>
              </div>

              {/* ── Section 2: Rincian Invoice ── */}
              <form onSubmit={handleSubmitDetail} className="space-y-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 gap-3">
                    <div>
                      <h2 className="text-base font-bold text-gray-900 dark:text-white">Rincian Nilai Invoice</h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Isi nilai invoice, DPP, PPN, PPh 23 / PPh 22, dan jumlah dibayar</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
                        <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 px-1.5">Pajak PPh:</span>
                        <button
                          type="button"
                          onClick={() => handleBulkJenisPphChange('23')}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            pktJenisPph === '23'
                              ? 'bg-brand-600 text-white shadow-xs'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          PPh 23 (2%)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBulkJenisPphChange('22')}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            pktJenisPph === '22'
                              ? 'bg-brand-600 text-white shadow-xs'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          PPh 22 (1.5%)
                        </button>
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
                  </div>

                  {loadingPerhitunganPaket ? (
                    <div className="py-8 text-center text-xs text-gray-500 animate-pulse">Memuat data...</div>
                  ) : (
                    <div className="space-y-3">
                      {/* Table Header */}
                      <div className="hidden md:grid grid-cols-12 gap-2 px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider items-center">
                        <div className="col-span-1 text-center">No</div>
                        <div className="col-span-2">Nilai Invoice</div>
                        <div className="col-span-2">DPP</div>
                        <div className="col-span-2">PPN (11%)</div>
                        <div className="col-span-2">Jenis & Nilai PPh</div>
                        <div className="col-span-2">Dibayar</div>
                        <div className="col-span-1"></div>
                      </div>

                      {PerhitunganPaketRows.map((row, index) => {
                        const rowJenis = row.pak_jenis_pph || pktJenisPph || '23';
                        return (
                          <div key={index} className="p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                              <div className="hidden md:flex items-center justify-center col-span-1">
                                <span className="w-6 h-6 rounded-md bg-gray-200 dark:bg-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 flex items-center justify-center">{index + 1}</span>
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1 md:hidden">Nilai Invoice</label>
                                <RupiahInput
                                  placeholder="0"
                                  value={row.pak_nilai_invoice || ''}
                                  onChange={(e) => handleRowChange(index, 'pak_nilai_invoice', Number(e))}
                                  className="w-full px-2.5 py-2 text-xs font-mono rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1 md:hidden">DPP</label>
                                <RupiahInput
                                  placeholder="0"
                                  value={row.pak_dpp || ''}
                                  onChange={(e) => handleRowChange(index, 'pak_dpp', Number(e))}
                                  className="w-full px-2.5 py-2 text-xs font-mono rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1 md:hidden">PPN</label>
                                <RupiahInput
                                  placeholder="0"
                                  value={row.pak_ppn || ''}
                                  onChange={(e) => handleRowChange(index, 'pak_ppn', Number(e))}
                                  className="w-full px-2.5 py-2 text-xs font-mono rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <div className="flex items-center justify-between mb-1 md:mb-0.5">
                                  <label className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                                    PPh {rowJenis} ({rowJenis === '22' ? '1.5%' : '2%'})
                                  </label>
                                  <select
                                    value={rowJenis}
                                    onChange={(e) => handleRowChange(index, 'pak_jenis_pph', e.target.value)}
                                    className="text-[10px] py-0.5 px-1.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-none font-bold cursor-pointer"
                                    title="Pilih Jenis PPh untuk baris ini"
                                  >
                                    <option value="23">PPh 23 (2%)</option>
                                    <option value="22">PPh 22 (1.5%)</option>
                                  </select>
                                </div>
                                <RupiahInput
                                  placeholder="0"
                                  value={row.pak_pph23 || ''}
                                  onChange={(e) => handleRowChange(index, 'pak_pph23', Number(e))}
                                  className="w-full px-2.5 py-2 text-xs font-mono rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1 md:hidden">Dibayar</label>
                                <RupiahInput
                                  placeholder="0"
                                  value={row.pak_dibayar || ''}
                                  onChange={(e) => handleRowChange(index, 'pak_dibayar', Number(e))}
                                  className="w-full px-2.5 py-2 text-xs font-mono font-bold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-brand-600 dark:text-brand-400 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none"
                                />
                              </div>
                              <div className="md:col-span-1 flex justify-end">
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
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Summary & Save Detail */}
                <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                  {/* Total row table */}
                  <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
                    <table className="w-full text-[11px]">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800 text-gray-500 font-semibold uppercase tracking-wide">
                          <th className="px-3 py-2 text-left">Nilai Invoice</th>
                          <th className="px-3 py-2 text-left">DPP</th>
                          <th className="px-3 py-2 text-left">PPN</th>
                          <th className="px-3 py-2 text-left">PPh ({pktJenisPph === '22' ? '22' : '23'})</th>
                          <th className="px-3 py-2 text-left font-extrabold text-brand-600 dark:text-brand-400">Dibayar</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="font-mono font-bold text-gray-900 dark:text-white">
                          <td className="px-3 py-2">{formatRupiah(totalNilaiInvoice)}</td>
                          <td className="px-3 py-2">{formatRupiah(totalDpp)}</td>
                          <td className="px-3 py-2">{formatRupiah(totalPpn)}</td>
                          <td className="px-3 py-2">{formatRupiah(totalPph23)}</td>
                          <td className="px-3 py-2 text-brand-600 dark:text-brand-400 font-extrabold">{formatRupiah(totalDibayar)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Selisih vs Pagu:{' '}
                      <span className={`font-bold ${selisihNominal >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {selisihNominal >= 0 ? `Sisa ${formatRupiah(selisihNominal)}` : `Surplus ${formatRupiah(Math.abs(selisihNominal))}`}
                      </span>
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
                            {isSaved ? 'Update Data' : 'Simpan Data'}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 text-gray-400 text-sm h-64 flex flex-col items-center justify-center">
              <svg className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Pilih Master Dokumen di sebelah kiri untuk mulai mengisi data Perhitungan Paket.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
