"use client";

import React, { useState, useEffect } from 'react';
import { Bidang, CreateBidangInput, UpdateBidangInput } from '../types';

interface BidangFormCardProps {
  onSubmit: (data: CreateBidangInput | UpdateBidangInput) => Promise<void>;
  initialData?: Bidang | null;
  onCancelEdit?: () => void;
  loading: boolean;
}

export const BidangFormCard: React.FC<BidangFormCardProps> = ({
  onSubmit,
  initialData,
  onCancelEdit,
  loading,
}) => {
  const [bdgNama, setBdgNama] = useState('');
  const [bdgKeterangan, setBdgKeterangan] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setBdgNama(initialData.bdg_nama || '');
      setBdgKeterangan(initialData.bdg_keterangan || '');
    } else {
      setBdgNama('');
      setBdgKeterangan('');
    }
    setError('');
  }, [initialData]);

  const handleReset = () => {
    setBdgNama('');
    setBdgKeterangan('');
    setError('');
    if (initialData && onCancelEdit) {
      onCancelEdit();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!bdgNama.trim()) {
      setError('Nama Bidang wajib diisi.');
      return;
    }

    try {
      if (initialData) {
        await onSubmit({
          bdg_id: initialData.bdg_id,
          bdg_nama: bdgNama.trim(),
          bdg_keterangan: bdgKeterangan.trim(),
        });
      } else {
        await onSubmit({
          bdg_nama: bdgNama.trim(),
          bdg_keterangan: bdgKeterangan.trim(),
        });
        // Reset form on successful creation
        setBdgNama('');
        setBdgKeterangan('');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan data.');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 lg:p-6 shadow-xs h-fit sticky top-24">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {initialData ? 'Edit Data Bidang' : 'Tambah Bidang Baru'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {initialData ? 'Perbarui informasi data Bidang' : 'Isi formulir di bawah ini'}
            </p>
          </div>
        </div>
        {initialData && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 hover:bg-amber-100 transition-colors"
          >
            Mode Edit ✕
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs dark:bg-red-900/30 dark:border-red-800 dark:text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
            Nama Bidang <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Masukkan Nama Bidang"
            value={bdgNama}
            onChange={(e) => setBdgNama(e.target.value)}
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
            Keterangan (Opsional)
          </label>
          <textarea
            rows={3}
            placeholder="Masukkan Keterangan (Opsional)"
            value={bdgKeterangan}
            onChange={(e) => setBdgKeterangan(e.target.value)}
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all resize-none"
          />
        </div>

        <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 py-2.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors cursor-pointer text-center"
          >
            {initialData ? 'Batal' : 'Reset'}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-white bg-brand-500 rounded-xl hover:bg-brand-600 shadow-theme-xs disabled:opacity-50 transition-colors cursor-pointer text-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Menyimpan...
              </>
            ) : initialData ? (
              'Perbarui Data'
            ) : (
              'Simpan Data'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
