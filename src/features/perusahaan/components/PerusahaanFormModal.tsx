"use client";

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Perusahaan, CreatePerusahaanInput, UpdatePerusahaanInput } from '../types';

interface PerusahaanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePerusahaanInput | UpdatePerusahaanInput) => Promise<void>;
  initialData?: Perusahaan | null;
  loading: boolean;
}

export const PerusahaanFormModal: React.FC<PerusahaanFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading,
}) => {
  const [pshNama, setPshNama] = useState('');
  const [pshNamaPimpinan, setPshNamaPimpinan] = useState('');
  const [pshJabatan, setPshJabatan] = useState('');
  const [pshAlamat, setPshAlamat] = useState('');
  const [pshNpwp, setPshNpwp] = useState('');
  const [pshNomorRekening, setPshNomorRekening] = useState('');
  const [pshNamaRekening, setPshNamaRekening] = useState('');
  const [pshNamaBank, setPshNamaBank] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setPshNama(initialData.psh_nama);
      setPshNamaPimpinan(initialData.psh_nama_pimpinan);
      setPshJabatan(initialData.psh_jabatan);
      setPshAlamat(initialData.psh_alamat);
      setPshNpwp(initialData.psh_npwp || '');
      setPshNomorRekening(initialData.psh_nomor_rekening || '');
      setPshNamaRekening(initialData.psh_nama_rekening || '');
      setPshNamaBank(initialData.psh_nama_bank || '');
    } else {
      setPshNama('');
      setPshNamaPimpinan('');
      setPshJabatan('');
      setPshAlamat('');
      setPshNpwp('');
      setPshNomorRekening('');
      setPshNamaRekening('');
      setPshNamaBank('');
    }
    setError('');
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!pshNama.trim()) {
      setError('Nama wajib diisi.');
      return;
    }
    if (!pshNamaPimpinan.trim()) {
      setError('Nama Pimpinan wajib diisi.');
      return;
    }
    if (!pshJabatan.trim()) {
      setError('Jabatan wajib diisi.');
      return;
    }
    if (!pshAlamat.trim()) {
      setError('Alamat wajib diisi.');
      return;
    }

    try {
      if (initialData) {
        await onSubmit({
          psh_id: initialData.psh_id,
          psh_nama: pshNama.trim(),
          psh_nama_pimpinan: pshNamaPimpinan.trim(),
          psh_jabatan: pshJabatan.trim(),
          psh_alamat: pshAlamat.trim(),
          psh_npwp: pshNpwp.trim() || null,
          psh_nomor_rekening: pshNomorRekening.trim() || null,
          psh_nama_rekening: pshNamaRekening.trim() || null,
          psh_nama_bank: pshNamaBank.trim() || null,
        });
      } else {
        await onSubmit({
          psh_nama: pshNama.trim(),
          psh_nama_pimpinan: pshNamaPimpinan.trim(),
          psh_jabatan: pshJabatan.trim(),
          psh_alamat: pshAlamat.trim(),
          psh_npwp: pshNpwp.trim() || null,
          psh_nomor_rekening: pshNomorRekening.trim() || null,
          psh_nama_rekening: pshNamaRekening.trim() || null,
          psh_nama_bank: pshNamaBank.trim() || null,
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
              {initialData ? 'Edit Data Perusahaan' : 'Tambah Perusahaan Baru'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {initialData ? 'Perbarui informasi data Perusahaan di bawah ini' : 'Isi formulir di bawah untuk menambahkan data Perusahaan'}
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
              Nama Perusahaan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Masukkan Nama Perusahaan"
              value={pshNama}
              onChange={(e) => setPshNama(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nama Pimpinan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Masukkan Nama Pimpinan"
              value={pshNamaPimpinan || ''}
              onChange={(e) => setPshNamaPimpinan(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Jabatan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Masukkan Jabatan"
              value={pshJabatan || ''}
              onChange={(e) => setPshJabatan(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              NPWP <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Masukkan NPWP"
              value={pshNpwp || ''}
              onChange={(e) => setPshNpwp(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nomor Rekening <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Masukkan Nomor Rekening"
              value={pshNomorRekening || ''}
              onChange={(e) => setPshNomorRekening(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nama Rekening <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Masukkan Nama Rekening"
              value={pshNamaRekening || ''}
              onChange={(e) => setPshNamaRekening(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nama Bank <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Masukkan Nama Bank"
              value={pshNamaBank || ''}
              onChange={(e) => setPshNamaBank(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Alamat <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Masukkan Alamat"
              value={pshAlamat}
              onChange={(e) => setPshAlamat(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
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
