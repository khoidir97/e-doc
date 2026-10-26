"use client";

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Nego, CreateNegoInput, UpdateNegoInput } from '../types';
import { formatRupiah } from '@/lib/terbilang';

interface NegoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateNegoInput | UpdateNegoInput) => Promise<void>;
  initialData?: Nego | null;
  loading: boolean;
}

function CurrencyInput({
  label,
  value,
  onChange,
  id,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  id: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 pointer-events-none">
          Rp
        </span>
        <input
          id={id}
          type="number"
          min={0}
          placeholder="0"
          value={value || ''}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full pl-9 pr-3 py-2 text-sm font-mono rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
        />
      </div>
      {value > 0 && (
        <p className="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500 font-mono">
          {formatRupiah(value)}
        </p>
      )}
    </div>
  );
}

export const NegoFormModal: React.FC<NegoFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading,
}) => {
  const [uraianKegiatan, setUraianKegiatan] = useState('');
  const [volume, setVolume] = useState('');
  const [waktu, setWaktu] = useState('');
  const [hpsHargaSatuan, setHpsHargaSatuan] = useState(0);
  const [hpsJumlahHarga, setHpsJumlahHarga] = useState(0);
  const [pnwHargaSatuan, setPnwHargaSatuan] = useState(0);
  const [pnwJumlahHarga, setPnwJumlahHarga] = useState(0);
  const [negoHargaSatuan, setNegoHargaSatuan] = useState(0);
  const [negoJumlahHarga, setNegoJumlahHarga] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setUraianKegiatan(initialData.nego_uraian_kegiatan);
      setVolume(initialData.nego_volume);
      setWaktu(initialData.nego_waktu);
      setHpsHargaSatuan(initialData.nego_hps_harga_satuan);
      setHpsJumlahHarga(initialData.nego_hps_jumlah_harga);
      setPnwHargaSatuan(initialData.nego_pnw_harga_satuan);
      setPnwJumlahHarga(initialData.nego_pnw_jumlah_harga);
      setNegoHargaSatuan(initialData.nego_negosiasi_harga_satuan);
      setNegoJumlahHarga(initialData.nego_negosiasi_jumlah_harga);
    } else {
      setUraianKegiatan('');
      setVolume('');
      setWaktu('');
      setHpsHargaSatuan(0);
      setHpsJumlahHarga(0);
      setPnwHargaSatuan(0);
      setPnwJumlahHarga(0);
      setNegoHargaSatuan(0);
      setNegoJumlahHarga(0);
    }
    setError('');
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!uraianKegiatan.trim()) {
      setError('Uraian Kegiatan wajib diisi.');
      return;
    }
    try {
      const basePayload = {
        nego_uraian_kegiatan: uraianKegiatan.trim(),
        nego_volume: volume,
        nego_waktu: waktu,
        nego_hps_harga_satuan: hpsHargaSatuan,
        nego_hps_jumlah_harga: hpsJumlahHarga,
        nego_pnw_harga_satuan: pnwHargaSatuan,
        nego_pnw_jumlah_harga: pnwJumlahHarga,
        nego_negosiasi_harga_satuan: negoHargaSatuan,
        nego_negosiasi_jumlah_harga: negoJumlahHarga,
      };
      if (initialData) {
        await onSubmit({
          nego_id: initialData.nego_id,
          nego_master_dokumen_id: initialData.nego_master_dokumen_id,
          ...basePayload,
        } as UpdateNegoInput);
      } else {
        await onSubmit({
          nego_master_dokumen_id: 0,
          ...basePayload,
        } as CreateNegoInput);
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan data.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl p-6 lg:p-8">
      <div>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {initialData ? 'Edit Data Negosiasi' : 'Tambah Data Negosiasi'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {initialData
                ? 'Perbarui informasi uraian kegiatan dan data harga negosiasi'
                : 'Isi formulir di bawah untuk menambahkan data negosiasi baru'}
            </p>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm dark:bg-red-900/30 dark:border-red-800 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Uraian Kegiatan */}
          <div>
            <label htmlFor="nego-uraian" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Uraian Kegiatan <span className="text-red-500">*</span>
            </label>
            <input id="nego-uraian" type="text"
              placeholder="Contoh: Sewa Kendaraan Dinas Bermotor Penumpang - Big Bus"
              value={uraianKegiatan}
              onChange={(e) => setUraianKegiatan(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all" />
          </div>

          {/* Volume & Waktu */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="nego-volume" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Volume <span className="text-red-500">*</span>
              </label>
              <input id="nego-volume" type="text" placeholder="Contoh: 2.00 Unit"
                value={volume} onChange={(e) => setVolume(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all" />
            </div>
            <div>
              <label htmlFor="nego-waktu" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Waktu <span className="text-red-500">*</span>
              </label>
              <input id="nego-waktu" type="text" placeholder="Contoh: 1.00 Hari"
                value={waktu} onChange={(e) => setWaktu(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all" />
            </div>
          </div>

          {/* HPS / OE */}
          <div className="rounded-xl border border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-900/10 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
              <h4 className="text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-400">HPS / OE</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <CurrencyInput id="hps-satuan" label="Harga Satuan (Rp.)" value={hpsHargaSatuan} onChange={setHpsHargaSatuan} />
              <CurrencyInput id="hps-jumlah" label="Jumlah Harga (Rp.)" value={hpsJumlahHarga} onChange={setHpsJumlahHarga} />
            </div>
          </div>

          {/* Harga Penawaran */}
          <div className="rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/10 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
              <h4 className="text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-400">Harga Penawaran</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <CurrencyInput id="pnw-satuan" label="Harga Satuan (Rp.)" value={pnwHargaSatuan} onChange={setPnwHargaSatuan} />
              <CurrencyInput id="pnw-jumlah" label="Jumlah Harga (Rp.)" value={pnwJumlahHarga} onChange={setPnwJumlahHarga} />
            </div>
          </div>

          {/* Harga Negosiasi */}
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-900/10 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <h4 className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">Harga Negosiasi</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <CurrencyInput id="nego-satuan" label="Harga Satuan (Rp.)" value={negoHargaSatuan} onChange={setNegoHargaSatuan} />
              <CurrencyInput id="nego-jumlah" label="Jumlah Harga (Rp.)" value={negoJumlahHarga} onChange={setNegoJumlahHarga} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors cursor-pointer">
              Batal
            </button>
            <button type="submit" disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 shadow-theme-xs disabled:opacity-50 transition-colors cursor-pointer">
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
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
        </form>
      </div>
    </Modal>
  );
};
