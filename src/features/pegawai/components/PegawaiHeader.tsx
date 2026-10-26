"use client";

import React from 'react';

interface PegawaiHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export const PegawaiHeader: React.FC<PegawaiHeaderProps> = ({
  search,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Data Pegawai
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Kelola data pegawai, NIP, dan hak akses peran.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Cari NIP atau Nama..."
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
      </div>
    </div>
  );
};

