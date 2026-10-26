"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Pegawai, CreatePegawaiInput, UpdatePegawaiInput } from '../types';
import {
  getPegawaiListAction,
  createPegawaiAction,
  updatePegawaiAction,
  deletePegawaiAction,
} from '../actions';
import { PegawaiHeader } from './PegawaiHeader';
import { PegawaiTable } from './PegawaiTable';
import { PegawaiFormCard } from './PegawaiFormCard';
import { PegawaiDeleteModal } from './PegawaiDeleteModal';
import { Toast } from '@/components/ui/Toast';

export const PegawaiContainer: React.FC = () => {
  const [data, setData] = useState<Pegawai[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Selection / modal states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPegawai, setSelectedPegawai] = useState<Pegawai | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Toast / Alert notification state
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    const res = await getPegawaiListAction(search, page, 10);
    if (res.success && res.data) {
      setData(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } else {
      showToast('error', res.message || 'Gagal memuat data pegawai.');
    }
    setLoading(false);
  }, [search, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Debounced search reset page
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleOpenEditModal = (pegawai: Pegawai) => {
    setSelectedPegawai(pegawai);
  };

  const handleOpenDeleteModal = (pegawai: Pegawai) => {
    setSelectedPegawai(pegawai);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (inputData: CreatePegawaiInput | UpdatePegawaiInput) => {
    setActionLoading(true);
    let res;
    if ('pgw_id' in inputData) {
      res = await updatePegawaiAction(inputData as UpdatePegawaiInput);
    } else {
      res = await createPegawaiAction(inputData as CreatePegawaiInput);
    }

    setActionLoading(false);

    if (res.success) {
      if ('pgw_id' in inputData) setSelectedPegawai(null);
      showToast('success', res.message);
      loadData();
    } else {
      showToast('error', res.message);
    }
    return res;
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPegawai) return;
    setActionLoading(true);
    const res = await deletePegawaiAction(selectedPegawai.pgw_id);
    setActionLoading(false);

    if (res.success) {
      setIsDeleteOpen(false);
      showToast('success', res.message);
      loadData();
    } else {
      showToast('error', res.message);
    }
  };

  return (
    <div className="p-1 sm:p-1 w-full max-w-full overflow-x-hidden space-y-6">
      {/* Toast Notification Banner */}
      {notification && (
        <Toast
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header with Search */}
      <PegawaiHeader
        search={search}
        onSearchChange={handleSearchChange}
      />

      {/* 2-Column Layout: Form (kiri) + Tabel (kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full min-w-0">
        {/* Kiri: Form Card */}
        <div className="lg:col-span-4 xl:col-span-4 w-full min-w-0">
          <PegawaiFormCard
            onSubmit={handleFormSubmit}
            initialData={selectedPegawai}
            onCancelEdit={() => setSelectedPegawai(null)}
            loading={actionLoading}
          />
        </div>

        {/* Kanan: Tabel */}
        <div className="lg:col-span-8 xl:col-span-8 w-full min-w-0 overflow-hidden">
          <PegawaiTable
            data={data}
            loading={loading}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
            page={page}
            totalPages={totalPages}
            total={total}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* Modal Confirmation for Delete */}
      <PegawaiDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        pegawai={selectedPegawai}
        loading={actionLoading}
      />
    </div>
  );
};
