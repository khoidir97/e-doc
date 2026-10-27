"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { MasterDokumen, CreateMasterDokumenInput, UpdateMasterDokumenInput } from '../types';
import {
  getMasterDokumenListAction,
  createMasterDokumenAction,
  updateMasterDokumenAction,
  deleteMasterDokumenAction,
  copyMasterDokumenAction,
  toggleLockMasterDokumenAction,
} from '../actions';
import { MasterDokumenHeader } from './MasterDokumenHeader';
import { MasterDokumenTable } from './MasterDokumenTable';
import { MasterDokumenFormModal } from './MasterDokumenFormModal';
import { MasterDokumenDeleteModal } from './MasterDokumenDeleteModal';
import { MasterDokumenCopyModal } from './MasterDokumenCopyModal';
import { MasterDokumenPrintModal, DocumentType } from './MasterDokumenPrintModal';
import { MasterDokumenPrintPreview } from './MasterDokumenPrintPreview';
import { Toast } from '@/components/ui/Toast';

export const MasterDokumenContainer: React.FC = () => {
  const [data, setData] = useState<MasterDokumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isCopyOpen, setIsCopyOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>('rab');
  const [selectedMasterDokumen, setSelectedMasterDokumen] = useState<MasterDokumen | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [userRole, setUserRole] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted || !data) return;
        if (data.success && data.user) {
          setUserRole(data.user.pgw_role);
        }
      })
      .catch((err) => console.error('Failed to load user info:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  // Toast / Alert notification state
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    const res = await getMasterDokumenListAction(search, page, 10);
    if (res.success && res.data) {
      setData(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } else {
      showToast('error', res.message || 'Gagal memuat data Master Dokumen.');
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
    setSelectedMasterDokumen(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (masterDokumen: MasterDokumen) => {
    setSelectedMasterDokumen(masterDokumen);
    setIsFormOpen(true);
  };

  const handleOpenDeleteModal = (masterDokumen: MasterDokumen) => {
    setSelectedMasterDokumen(masterDokumen);
    setIsDeleteOpen(true);
  };

  const handleOpenCopyModal = (masterDokumen: MasterDokumen) => {
    setSelectedMasterDokumen(masterDokumen);
    setIsCopyOpen(true);
  };

  const handleOpenPrintModal = (masterDokumen: MasterDokumen) => {
    setSelectedMasterDokumen(masterDokumen);
    setIsPrintModalOpen(true);
  };

  const handleSelectDocument = (docType: DocumentType) => {
    setSelectedDocType(docType);
    setIsPrintModalOpen(false);
    setIsPrintPreviewOpen(true);
  };

  const handleFormSubmit = async (inputData: CreateMasterDokumenInput | UpdateMasterDokumenInput) => {
    setActionLoading(true);
    let res;
    if ('mdk_id' in inputData) {
      res = await updateMasterDokumenAction(inputData as UpdateMasterDokumenInput);
    } else {
      res = await createMasterDokumenAction(inputData as CreateMasterDokumenInput);
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
    if (!selectedMasterDokumen) return;
    setActionLoading(true);
    const res = await deleteMasterDokumenAction(selectedMasterDokumen.mdk_id);
    setActionLoading(false);

    if (res.success) {
      setIsDeleteOpen(false);
      showToast('success', res.message);
      loadData();
    } else {
      showToast('error', res.message);
    }
  };

  const handleCopyConfirm = async () => {
    if (!selectedMasterDokumen) return;
    setActionLoading(true);
    const res = await copyMasterDokumenAction(selectedMasterDokumen.mdk_id);
    setActionLoading(false);

    if (res.success) {
      setIsCopyOpen(false);
      showToast('success', res.message);
      loadData();
    } else {
      showToast('error', res.message);
    }
  };

  const handleToggleLock = async (masterDokumen: MasterDokumen) => {
    const newLockStatus = masterDokumen.mdk_is_lock === 1 ? 0 : 1;
    setActionLoading(true);
    const res = await toggleLockMasterDokumenAction(masterDokumen.mdk_id, newLockStatus);
    setActionLoading(false);

    if (res.success) {
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
      <MasterDokumenHeader
        search={search}
        onSearchChange={handleSearchChange}
        onAddClick={handleOpenAddModal}
      />

      {/* Table displaying Master Dokumen list */}
      <MasterDokumenTable
        data={data}
        loading={loading}
        onEdit={handleOpenEditModal}
        onCopy={handleOpenCopyModal}
        onDelete={handleOpenDeleteModal}
        onPrint={handleOpenPrintModal}
        onToggleLock={handleToggleLock}
        userRole={userRole}
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
      />

      {/* Modal Form for Create / Edit */}
      <MasterDokumenFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedMasterDokumen}
        loading={actionLoading}
      />

      {/* Modal Confirmation for Delete */}
      <MasterDokumenDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        masterDokumen={selectedMasterDokumen}
        loading={actionLoading}
      />

      {/* Modal Confirmation for Copy */}
      <MasterDokumenCopyModal
        isOpen={isCopyOpen}
        onClose={() => setIsCopyOpen(false)}
        onConfirm={handleCopyConfirm}
        masterDokumen={selectedMasterDokumen}
        loading={actionLoading}
      />

      {/* Modal for Selecting Printable Document */}
      <MasterDokumenPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        masterDokumen={selectedMasterDokumen}
        onSelectDocument={handleSelectDocument}
      />

      {/* Printable Document Fullscreen Preview Overlay */}
      {isPrintPreviewOpen && selectedMasterDokumen && (
        <MasterDokumenPrintPreview
          masterDokumen={selectedMasterDokumen}
          initialDocType={selectedDocType}
          onClose={() => setIsPrintPreviewOpen(false)}
        />
      )}
    </div>
  );
};
