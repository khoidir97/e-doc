"use client";

import React from 'react';

interface NotaPencairanDanaHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
}

export const NotaPencairanDanaHeader: React.FC<NotaPencairanDanaHeaderProps> = ({
  search,
  onSearchChange,
  onAddClick,
}) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Data Nota Pencairan Dana
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Kelola data Nota Pencairan Dana
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Cari Nama Nota Pencairan Dana..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-10 pl-10 pr-4 text-sm rounded-lg border border-gray-300 bg-white focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-brand-500"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Add Button */}
        <button
          onClick={onAddClick}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white transition rounded-lg bg-brand-500 hover:bg-brand-600 shadow-theme-xs cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Nota Pencairan Dana
        </button>
      </div>
    </div>
  );
};
