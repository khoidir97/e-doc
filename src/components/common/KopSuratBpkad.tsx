"use client";

import React from 'react';

interface KopSuratBpkadProps {
  className?: string;
  showLogo?: boolean;
}

export const KopSuratBpkad: React.FC<KopSuratBpkadProps> = ({
  className = '',
  showLogo = true,
}) => {
  return (
    <div className={`w-full text-black font-sans mb-4 ${className}`}>
      <div className="flex items-center justify-between gap-3 pb-2 border-b-4 border-double border-black">
        {/* Logo Pemko Pekanbaru (Kiri) */}
        {showLogo ? (
          <div className="shrink-0 w-20 h-[70px] flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo/Logo_lambang_kota_pekanbaru.png"
              alt="Logo Kota Pekanbaru"
              className="max-h-[64px] max-w-full object-contain"
            />
          </div>
        ) : null}

        {/* Text Header (Tengah) */}
        <div className="flex-1 text-center font-sans tracking-tight">
          <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wide leading-tight text-gray-900">
            PEMERINTAH KOTA PEKANBARU
          </h2>
          <h1 className="text-sm sm:text-base md:text-lg font-extrabold uppercase tracking-wide leading-snug text-black my-0.5">
            BADAN PENGELOLA KEUANGAN DAN ASET DAERAH
          </h1>
          <p className="text-[11px] font-normal leading-tight text-gray-800">
            Komplek Perkantoran Sultan Muhammad Ali Abdul Jalil Muazzam Syah
          </p>
          <p className="text-[11px] font-normal leading-tight text-gray-800">
            Jalan Abdul Rahman Hamid, Gedung Lontiok (B3) Lt. 1 &amp; 2
          </p>
          <p className="text-[11px] font-normal leading-tight text-gray-800 mt-0.5">
            <span className="underline font-medium">Website :</span>{' '}
            <span className="underline">https://bpkad.pekanbaru.go.id</span>{' '}
            <span className="underline font-medium ml-2">Email :</span>{' '}
            <span className="underline">bpkad@pekanbaru.go.id</span>
          </p>
        </div>

        {/* Spacer kanan untuk menjaga keseimbangan teks tengah jika logo ada di kiri */}
        {showLogo ? <div className="w-20 shrink-0 hidden sm:block"></div> : null}
      </div>
    </div>
  );
};
