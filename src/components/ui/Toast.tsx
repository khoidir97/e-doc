"use client";

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface ToastProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  type,
  message,
  onClose,
  duration = 4000,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!mounted) return null;

  const bgStyles = {
    success: 'bg-emerald-600 dark:bg-emerald-700 text-white border-emerald-500 shadow-emerald-900/30',
    error: 'bg-red-600 dark:bg-red-700 text-white border-red-500 shadow-red-900/30',
    warning: 'bg-amber-500 dark:bg-amber-600 text-white border-amber-400 shadow-amber-900/30',
    info: 'bg-blue-600 dark:bg-blue-700 text-white border-blue-500 shadow-blue-900/30',
  };

  const icons = {
    success: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  const content = (
    <div className="fixed top-5 right-5 z-[99999] pointer-events-auto max-w-md w-[calc(100vw-2.5rem)] sm:w-auto transition-all transform duration-300 ease-out">
      <div className={`px-4 py-3.5 rounded-xl shadow-2xl flex items-center justify-between gap-3 text-sm font-semibold border ${bgStyles[type]}`}>
        <div className="flex items-center gap-3">
          {icons[type]}
          <span className="leading-snug">{message}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg opacity-80 hover:opacity-100 hover:bg-white/20 transition-all cursor-pointer flex items-center justify-center ml-2"
          title="Tutup"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};
