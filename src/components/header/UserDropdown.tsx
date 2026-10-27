"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Modal } from "../ui/modal";
import { AuthUser } from "@/types/auth";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  // Change password modal state
  const [showModal, setShowModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/auth/me")
      .then((res) => {
        if (res.status === 401 || res.status === 404) {
          fetch("/api/auth/logout", { method: "POST" }).finally(() => {
            window.location.href = "/signin";
          });
          return null;
        }
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (!isMounted || !data) return;
        if (data.success && data.user) {
          setUser(data.user);
        }
      })
      .catch((err) => console.error("Failed to load pegawai info:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  function openChangePassword() {
    closeDropdown();
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
    setFeedback(null);
    setShowModal(true);
  }

  function closeModal() {
    if (isSubmitting) return;
    setShowModal(false);
    setFeedback(null);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: data.message });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setFeedback({ type: 'error', message: data.message });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Terjadi kesalahan jaringan.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignOut(e: React.MouseEvent) {
    e.preventDefault();
    closeDropdown();
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      window.location.href = "/signin";
    }
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
        >
          <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
            <Image
              width={44}
              height={44}
              src="/images/user/images.png"
              alt="User"
            />
          </span>

          <span className="block mr-1 font-medium text-theme-sm">
            {user ? user.pgw_nama : "Pegawai"}
          </span>

          <svg
            className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
              }`}
            width="18"
            height="20"
            viewBox="0 0 18 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <Dropdown
          isOpen={isOpen}
          onClose={closeDropdown}
          className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
        >
          <div>
            <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
              {user ? user.pgw_nama : "Pegawai e-Doc"}
            </span>
            <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
              NIP: {user ? user.pgw_nip : "-"}
            </span>
          </div>

          <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
            <li>
              <DropdownItem
                onItemClick={openChangePassword}
                tag="button"
                className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 w-full text-left cursor-pointer"
              >
                {/* Lock / key icon */}
                <svg
                  className="fill-gray-500 group-hover:fill-gray-700 dark:fill-gray-400 dark:group-hover:fill-gray-300"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2a5 5 0 0 0-5 5v2H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm3 7V7a3 3 0 1 0-6 0v2h6Zm-3 3a1.5 1.5 0 0 1 .75 2.8V16a.75.75 0 0 1-1.5 0v-1.2A1.5 1.5 0 0 1 12 12Z"
                    fill=""
                  />
                </svg>
                Ubah Password
              </DropdownItem>
            </li>
          </ul>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 w-full text-left"
          >
            <svg
              className="fill-gray-500 group-hover:fill-gray-700 dark:group-hover:fill-gray-300"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z"
                fill=""
              />
            </svg>
            Sign out
          </button>
        </Dropdown>
      </div>

      {/* Modal Ubah Password */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        className="max-w-md w-full mx-4 p-6 sm:p-8"
        showCloseButton={!isSubmitting}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2a5 5 0 0 0-5 5v2H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm3 7V7a3 3 0 1 0-6 0v2h6Zm-3 3a1.5 1.5 0 0 1 .75 2.8V16a.75.75 0 0 1-1.5 0v-1.2A1.5 1.5 0 0 1 12 12Z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-white">Ubah Password</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Masukkan password lama dan password baru Anda</p>
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div
            className={`mb-4 flex items-start gap-2 rounded-lg px-3.5 py-3 text-sm font-medium ${feedback.type === 'success'
                ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
              }`}
          >
            {feedback.type === 'success' ? (
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M12 3a9 9 0 1 0 0 18A9 9 0 0 0 12 3z" />
              </svg>
            )}
            {feedback.message}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
          {/* Password Saat Ini */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              Password Saat Ini
            </label>
            <div className="relative">
              <input
                id="current-password"
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Masukkan password saat ini"
                className="w-full px-3 py-2.5 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                tabIndex={-1}
              >
                {showCurrent ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 0 1 1.563-3.029m5.858.908a3 3 0 1 1 4.243 4.243M9.878 9.878l4.242 4.242M3 3l3.59 3.59m0 0A9.953 9.953 0 0 1 12 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 0 1-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
          </div>

          {/* Password Baru */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              Password Baru
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Minimal 6 karakter"
                className="w-full px-3 py-2.5 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                tabIndex={-1}
              >
                {showNew ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 0 1 1.563-3.029m5.858.908a3 3 0 1 1 4.243 4.243M9.878 9.878l4.242 4.242M3 3l3.59 3.59m0 0A9.953 9.953 0 0 1 12 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 0 1-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
          </div>

          {/* Konfirmasi Password Baru */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              Konfirmasi Password Baru
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Ulangi password baru"
                className={`w-full px-3 py-2.5 pr-10 rounded-lg border bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 outline-none transition-all ${confirmPassword && confirmPassword !== newPassword
                    ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500'
                    : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500/20 focus:border-blue-500'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                tabIndex={-1}
              >
                {showConfirm ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 0 1 1.563-3.029m5.858.908a3 3 0 1 1 4.243 4.243M9.878 9.878l4.242 4.242M3 3l3.59 3.59m0 0A9.953 9.953 0 0 1 12 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 0 1-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
            {confirmPassword && confirmPassword !== newPassword && (
              <p className="mt-1 text-[11px] text-red-500">Password tidak cocok</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={closeModal}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v8H4z" />
                  </svg>
                  Menyimpan...
                </>
              ) : (
                'Simpan Password'
              )}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
