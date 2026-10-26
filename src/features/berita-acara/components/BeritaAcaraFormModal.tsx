"use client";

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { BeritaAcara, CreateBeritaAcaraInput, UpdateBeritaAcaraInput } from '../types';

interface BeritaAcaraFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBeritaAcaraInput | UpdateBeritaAcaraInput) => Promise<void>;
  initialData?: BeritaAcara | null;
  loading: boolean;
}

export const BeritaAcaraFormModal: React.FC<BeritaAcaraFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading,
}) => {
  const [uraianPekerjaan, setUraianPekerjaan] = useState('');
  const [volume, setVolume] = useState('');
  const [satuan, setSatuan] = useState('');
  const [statusPemeriksaan, setStatusPemeriksaan] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setUraianPekerjaan(initialData.dba_uraian);
      setVolume(initialData.dba_volume);
      setSatuan(initialData.dba_satuan);
      setStatusPemeriksaan(initialData.dba_status_pemeriksaan);
    } else {
      setUraianPekerjaan('');
      setVolume('');
      setSatuan('');
      setStatusPemeriksaan('Belum Diperiksa');
    }
    setError('');
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!uraianPekerjaan.trim()) {
      setError('Uraian Pekerjaan wajib diisi.');
      return;
    }

    try {
      if (initialData) {
        await onSubmit({
          dba_id: initialData.dba_id,
          dba_master_dokumen_id: initialData.dba_master_dokumen_id,
          dba_uraian: uraianPekerjaan.trim(),
          dba_volume: volume,
          dba_satuan: satuan,
          dba_status_pemeriksaan: statusPemeriksaan,
        });
      } else {
        await onSubmit({
          dba_master_dokumen_id: 0,
          dba_uraian: uraianPekerjaan.trim(),
          dba_volume: volume,
          dba_satuan: satuan,
          dba_status_pemeriksaan: statusPemeriksaan,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan data.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[560px] p-6 lg:p-8">
      <div>
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {initialData ? 'Edit Data HPS' : 'Tambah HPS Baru'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {initialData ? 'Perbarui informasi data HPS di bawah ini' : 'Isi formulir di bawah untuk menambahkan data HPS'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm dark:bg-red-900/30 dark:border-red-800 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Uraian Berita Acara <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Masukkan Uraian Berita Acara"
              value={uraianPekerjaan}
              onChange={(e) => setUraianPekerjaan(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Volume <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              placeholder="Masukkan Volume"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="w-full px-4 py-2.5 text-sm font-mono rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Satuan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Masukkan Satuan"
              value={satuan}
              onChange={(e) => setSatuan(e.target.value)}
              className="w-full px-4 py-2.5 text-sm font-mono rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status Pemeriksaan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Masukkan Status Pemeriksaan"
              value={statusPemeriksaan}
              onChange={(e) => setStatusPemeriksaan(e.target.value)}
              className="w-full px-4 py-2.5 text-sm font-mono rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
            />
          </div>


          <div className="flex justify-end gap-3 pt-5 mt-6 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 shadow-theme-xs disabled:opacity-50 transition-colors cursor-pointer"
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
                'Simpan Data'
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
