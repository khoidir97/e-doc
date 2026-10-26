"use client";

import React from 'react';
import { formatRupiahInput, parseRupiahInput } from '@/lib/terbilang';

export interface RupiahInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number | string | null | undefined;
  onChange?: (numericValue: number) => void;
  prefix?: string;
  className?: string;
}

/**
 * Reusable Component Input Rupiah
 * Menampilkan angka berformat ribuan Rupiah saat di-ketik (contoh: 1.000.000)
 * Namun mengembalikan nilai number murni ke state / DB (contoh: 1000000)
 */
export const RupiahInput: React.FC<RupiahInputProps> = ({
  value,
  onChange,
  prefix = "Rp",
  className = "",
  placeholder = "0",
  ...props
}) => {
  const displayValue = formatRupiahInput(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;
    const rawValue = e.target.value;
    const numericValue = parseRupiahInput(rawValue);
    onChange(numericValue);
  };

  return (
    <div className="relative w-full">
      {prefix && (
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-gray-400 pointer-events-none select-none">
          {prefix}
        </span>
      )}
      <input
        {...props}
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        value={displayValue}
        onChange={handleChange}
        className={`w-full ${prefix ? 'pl-8' : 'px-3'} ${className}`}
      />
    </div>
  );
};
