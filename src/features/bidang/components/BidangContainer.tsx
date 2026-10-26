"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Bidang, CreateBidangInput, UpdateBidangInput } from '../types';
import {
  getBidangListAction,
  createBidangAction,
  updateBidangAction,
  deleteBidangAction,
} from '../actions';
import { BidangHeader } from './BidangHeader';
import { BidangTable } from './BidangTable';
import { BidangFormCard } from './BidangFormCard';
import { BidangDeleteModal } from './BidangDeleteModal';
import { Toast } from '@/components/ui/Toast';

export const BidangContainer: React.FC = () => {
  const [data, setData] = useState<Bidang[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modal / Selection states
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBidang, setSelectedBidang] = useState<Bidang | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Toast notification state
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    const res = await getBidangListAction(search, page, 10);
    if (res.success && res.data) {
      setData(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } else {
      showToast('error', res.message || 'Gagal memuat data Bidang.');
    }
    setLoading(false);
  }, [search, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleOpenEditModal = (bidang: Bidang) => {
    setSelectedBidang(bidang);
  };

  const handleOpenDeleteModal = (bidang: Bidang) => {
    setSelectedBidang(bidang);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (inputData: CreateBidangInput | UpdateBidangInput) => {
    setActionLoading(true);
    let res;
    if ('bdg_id' in inputData) {
      res = await updateBidangAction(inputData as UpdateBidangInput);
    } else {
      res = await createBidangAction(inputData as CreateBidangInput);
    }

    setActionLoading(false);

    if (res.success) {
      setSelectedBidang(null);
      showToast('success', res.message);
      loadData();
    } else {
      showToast('error', res.message);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBidang) return;
    setActionLoading(true);
    const res = await deleteBidangAction(selectedBidang.bdg_id);
    setActionLoading(false);

    if (res.success) {
      setIsDeleteOpen(false);
      setSelectedBidang(null);
      showToast('success', res.message);
      loadData();
    } else {
      showToast('error', res.message);
    }
  };

  return (
    <div className="p-1 sm:p-1 w-full space-y-6">
      {/* Toast Notification */}
      {notification && (
        <Toast
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header with Search */}
      <BidangHeader
        search={search}
        onSearchChange={handleSearchChange}
      />

      {/* 2-Column Layout: Form (kiri) + Tabel (kanan) — selalu berdampingan */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', alignItems: 'flex-start', width: '100%' }}>
        {/* Kiri: Form Card */}
        <div style={{ width: '340px', flexShrink: 0 }}>
          <BidangFormCard
            onSubmit={handleFormSubmit}
            initialData={selectedBidang}
            onCancelEdit={() => setSelectedBidang(null)}
            loading={actionLoading}
          />
        </div>

        {/* Kanan: Tabel */}
        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
          <BidangTable
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
      <BidangDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        Bidang={selectedBidang}
        loading={actionLoading}
      />
    </div>
  );
};
