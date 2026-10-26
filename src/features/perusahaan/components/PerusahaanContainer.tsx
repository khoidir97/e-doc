"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Perusahaan, CreatePerusahaanInput, UpdatePerusahaanInput } from '../types';
import {
  getPerusahaanListAction,
  createPerusahaanAction,
  updatePerusahaanAction,
  deletePerusahaanAction,
} from '../actions';
import { PerusahaanHeader } from './PerusahaanHeader';
import { PerusahaanTable } from './PerusahaanTable';
import { PerusahaanFormModal } from './PerusahaanFormModal';
import { PerusahaanDeleteModal } from './PerusahaanDeleteModal';
import { Toast } from '@/components/ui/Toast';

export const PerusahaanContainer: React.FC = () => {
  const [data, setData] = useState<Perusahaan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPerusahaan, setSelectedPerusahaan] = useState<Perusahaan | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Toast / Alert notification state
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    const res = await getPerusahaanListAction(search, page, 10);
    if (res.success && res.data) {
      setData(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } else {
      showToast('error', res.message || 'Gagal memuat data Perusahaan.');
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

  const handleOpenAddModal = () => {
    setSelectedPerusahaan(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (Perusahaan: Perusahaan) => {
    setSelectedPerusahaan(Perusahaan);
    setIsFormOpen(true);
  };

  const handleOpenDeleteModal = (Perusahaan: Perusahaan) => {
    setSelectedPerusahaan(Perusahaan);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (inputData: CreatePerusahaanInput | UpdatePerusahaanInput) => {
    setActionLoading(true);
    let res;
    if ('psh_id' in inputData) {
      res = await updatePerusahaanAction(inputData as UpdatePerusahaanInput);
    } else {
      res = await createPerusahaanAction(inputData as CreatePerusahaanInput);
    }

    setActionLoading(false);

    if (res.success) {
      setIsFormOpen(false);
      showToast('success', res.message);
      loadData();
    } else {
      showToast('error', res.message);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPerusahaan) return;
    setActionLoading(true);
    const res = await deletePerusahaanAction(selectedPerusahaan.psh_id);
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
    <div className="p-1 sm:p-1 w-full space-y-6">
      {/* Toast Notification Banner */}
      {notification && (
        <Toast
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header with Search and Add button */}
      <PerusahaanHeader
        search={search}
        onSearchChange={handleSearchChange}
        onAddClick={handleOpenAddModal}
      />

      {/* Table displaying Perusahaan list */}
      <PerusahaanTable
        data={data}
        loading={loading}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDeleteModal}
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
      />

      {/* Modal Form for Create / Edit */}
      <PerusahaanFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedPerusahaan}
        loading={actionLoading}
      />

      {/* Modal Confirmation for Delete */}
      <PerusahaanDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        Perusahaan={selectedPerusahaan}
        loading={actionLoading}
      />
    </div>
  );
};
