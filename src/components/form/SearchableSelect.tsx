import React, { useState, useRef, useEffect } from 'react';

export interface SearchableOption {
  value: number | string;
  label: string;
  sublabel?: string;
  [key: string]: any;
}

interface SearchableSelectProps {
  options: SearchableOption[];
  value: number | string;
  onChange: (value: any) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  disabled?: boolean;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Pilih opsi...',
  searchPlaceholder = 'Cari...',
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  const filteredOptions = options.filter((opt) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const labelMatch = opt.label.toLowerCase().includes(q);
    const sublabelMatch = opt.sublabel ? opt.sublabel.toLowerCase().includes(q) : false;
    return labelMatch || sublabelMatch;
  });

  const handleSelect = (val: number | string) => {
    onChange(val);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full px-4 py-3 rounded-xl border text-left text-sm font-medium flex items-center justify-between transition-all cursor-pointer ${
          isOpen
            ? 'border-brand-500 ring-2 ring-brand-500/20 dark:border-brand-500'
            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
        } bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <span className="min-w-0 truncate pr-2 flex-1">
          {selectedOption ? (
            <div className="flex flex-col truncate">
              <span className="font-semibold text-gray-900 dark:text-white truncate block">{selectedOption.label}</span>
              {selectedOption.sublabel && (
                <span className="text-[11px] text-gray-500 dark:text-gray-400 font-normal truncate block">
                  {selectedOption.sublabel}
                </span>
              )}
            </div>
          ) : (
            <span className="text-gray-400 dark:text-gray-500 truncate block">{placeholder}</span>
          )}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-brand-500' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
          {/* Search Bar */}
          <div className="p-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-gray-400 dark:text-gray-500 ml-2 shrink-0"
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
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent px-2 py-1.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Options List */}
          <ul className="max-h-60 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800/40 p-1">
            {filteredOptions.length === 0 ? (
              <li className="px-4 py-3 text-sm text-center text-gray-400 dark:text-gray-500">
                Tidak ada data yang cocok.
              </li>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <li key={opt.value}>
                    <button
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 font-semibold'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 font-normal'
                      }`}
                    >
                      <div className="flex flex-col gap-0.5 truncate pr-2">
                        <span className="truncate font-medium">{opt.label}</span>
                        {opt.sublabel && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-normal truncate">
                            {opt.sublabel}
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <svg
                          className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
