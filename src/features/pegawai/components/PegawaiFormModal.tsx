"use client";

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Pegawai, CreatePegawaiInput, UpdatePegawaiInput } from '../types';

interface PegawaiFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePegawaiInput | UpdatePegawaiInput) => Promise<void>;
  initialData?: Pegawai | null;
  loading: boolean;
}

export const PegawaiFormModal: React.FC<PegawaiFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading,
}) => {
  const [pgwNip, setPgwNip] = useState('');
  const [pgwNama, setPgwNama] = useState('');
  const [pgwJabatan, setPgwJabatan] = useState('');
  const [pgwPassword, setPgwPassword] = useState('');
  const [pgwRole, setPgwRole] = useState(0);
  const [pgwStatusPegawai, setPgwStatusPegawai] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setPgwNip(initialData.pgw_nip);
      setPgwNama(initialData.pgw_nama);
      setPgwJabatan(initialData.pgw_jabatan);
      setPgwRole(initialData.pgw_role || 0);
      setPgwStatusPegawai(initialData.pgw_status_pegawai ?? 0);
      setPgwPassword('');
    } else {
      setPgwNip('');
      setPgwNama('');
      setPgwJabatan('');
      setPgwPassword('');
      setPgwRole(0);
      setPgwStatusPegawai(0);
    }
    setError('');
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!pgwNip.trim()) {
      setError('NIP wajib diisi.');
      return;
    }
    if (!pgwNama.trim()) {
      setError('Nama Pegawai wajib diisi.');
      return;
    }
    if (!initialData && !pgwPassword) {
      setError('Password wajib diisi untuk pegawai baru.');
      return;
    }

    try {
      if (initialData) {
        await onSubmit({
          pgw_id: initialData.pgw_id,
          pgw_nip: pgwNip.trim(),
          pgw_nama: pgwNama.trim(),
          pgw_jabatan: pgwJabatan.trim(),
          pgw_password: pgwPassword ? pgwPassword : undefined,
          pgw_role: Number(pgwRole),
          pgw_status_pegawai: Number(pgwStatusPegawai),
        });
      } else {
        await onSubmit({
          pgw_nip: pgwNip.trim(),
          pgw_nama: pgwNama.trim(),
          pgw_jabatan: pgwJabatan.trim(),
          pgw_password: pgwPassword,
          pgw_role: Number(pgwRole),
          pgw_status_pegawai: Number(pgwStatusPegawai),
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
              {initialData ? 'Edit Data Pegawai' : 'Tambah Pegawai Baru'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {initialData ? 'Perbarui informasi data pegawai di bawah ini' : 'Isi formulir di bawah untuk menambahkan data pegawai'}
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
              NIP Pegawai <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Masukkan NIP Pegawai"
              value={pgwNip}
              onChange={(e) => setPgwNip(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Masukkan Nama Lengkap"
              value={pgwNama}
              onChange={(e) => setPgwNama(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Jabatan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Masukkan Jabatan Pegawai"
              value={pgwJabatan}
              onChange={(e) => setPgwJabatan(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Apakah Pejabat Pengadaan?
            </label>
            <div className="flex items-center gap-6 pt-1">
              <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="radio"
                  name="pgwModalStatusPegawai"
                  value={1}
                  checked={pgwStatusPegawai === 1}
                  onChange={() => setPgwStatusPegawai(1)}
                  className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                />
                <span>Ya</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="radio"
                  name="pgwModalStatusPegawai"
                  value={0}
                  checked={pgwStatusPegawai === 0}
                  onChange={() => setPgwStatusPegawai(0)}
                  className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                />
                <span>Tidak</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password {initialData && <span className="text-xs text-gray-400 font-normal">(Opsional - isi jika ingin mengganti password)</span>}
              {!initialData && <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              placeholder={initialData ? 'Masukkan password baru (opsional)' : 'Masukkan password'}
              value={pgwPassword}
              onChange={(e) => setPgwPassword(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Hak Akses / Role
            </label>
            <select
              value={pgwRole}
              onChange={(e) => setPgwRole(Number(e.target.value))}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
            >
              <option value={0}>Pegawai Staff (Role 1)</option>
              <option value={1}>Administrator (Role 2)</option>
            </select>
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
