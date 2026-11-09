"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  disabled?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Ketik teks di sini...",
  minHeight = "130px",
  disabled = false,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    insertUnorderedList: false,
    insertOrderedList: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
    justifyFull: false,
  });

  // Sync value from props to editor content without disrupting cursor
  useEffect(() => {
    if (editorRef.current) {
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const updateActiveFormats = useCallback(() => {
    if (typeof document === 'undefined') return;
    try {
      setActiveFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strikeThrough: document.queryCommandState('strikeThrough'),
        insertUnorderedList: document.queryCommandState('insertUnorderedList'),
        insertOrderedList: document.queryCommandState('insertOrderedList'),
        justifyLeft: document.queryCommandState('justifyLeft'),
        justifyCenter: document.queryCommandState('justifyCenter'),
        justifyRight: document.queryCommandState('justifyRight'),
        justifyFull: document.queryCommandState('justifyFull'),
      });
    } catch {
      // Ignored if queryCommandState fails
    }
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
      updateActiveFormats();
    }
  };

  const exec = (command: string, arg: string | undefined = undefined) => {
    if (disabled || typeof document === 'undefined') return;
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    handleInput();
    updateActiveFormats();
  };

  return (
    <div className={`rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 ${disabled ? 'opacity-60 pointer-events-none' : ''}`}>
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-1.5 border-b border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/50 rounded-t-xl text-gray-700 dark:text-gray-300 text-xs">
        {/* Headings / Paragraph */}
        <button
          type="button"
          onClick={() => exec('formatBlock', '<p>')}
          className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 font-semibold"
          title="Paragraf"
        >
          P
        </button>
        <button
          type="button"
          onClick={() => exec('formatBlock', '<h3>')}
          className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 font-bold"
          title="Judul 3 (H3)"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => exec('formatBlock', '<h4>')}
          className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 font-bold"
          title="Judul 4 (H4)"
        >
          H4
        </button>

        <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-0.5" />

        {/* Inline styles */}
        <button
          type="button"
          onClick={() => exec('bold')}
          className={`p-1.5 rounded transition-colors ${activeFormats.bold ? 'bg-brand-500 text-white font-bold' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Tebal (Ctrl+B)"
        >
          <span className="font-extrabold px-1">B</span>
        </button>
        <button
          type="button"
          onClick={() => exec('italic')}
          className={`p-1.5 rounded transition-colors ${activeFormats.italic ? 'bg-brand-500 text-white font-bold' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Miring (Ctrl+I)"
        >
          <span className="italic font-serif px-1">I</span>
        </button>
        <button
          type="button"
          onClick={() => exec('underline')}
          className={`p-1.5 rounded transition-colors ${activeFormats.underline ? 'bg-brand-500 text-white font-bold' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Garis Bawah (Ctrl+U)"
        >
          <span className="underline px-1">U</span>
        </button>
        <button
          type="button"
          onClick={() => exec('strikeThrough')}
          className={`p-1.5 rounded transition-colors ${activeFormats.strikeThrough ? 'bg-brand-500 text-white font-bold' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Coret"
        >
          <span className="line-through px-1">S</span>
        </button>

        <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-0.5" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => exec('insertUnorderedList')}
          className={`p-1.5 rounded transition-colors ${activeFormats.insertUnorderedList ? 'bg-brand-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Daftar Butir (Bullet List)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16M2 6h.01M2 12h.01M2 18h.01" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => exec('insertOrderedList')}
          className={`p-1.5 rounded transition-colors ${activeFormats.insertOrderedList ? 'bg-brand-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Daftar Bernomor (Numbered List)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 6h13M7 12h13M7 18h13M3 6h.01M3 12h.01M3 18h.01" />
          </svg>
        </button>

        <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-0.5" />

        {/* Alignments */}
        <button
          type="button"
          onClick={() => exec('justifyLeft')}
          className={`p-1.5 rounded transition-colors ${activeFormats.justifyLeft ? 'bg-brand-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Rata Kiri"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h10M4 18h14" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => exec('justifyCenter')}
          className={`p-1.5 rounded transition-colors ${activeFormats.justifyCenter ? 'bg-brand-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Rata Tengah"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M7 12h10M5 18h14" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => exec('justifyRight')}
          className={`p-1.5 rounded transition-colors ${activeFormats.justifyRight ? 'bg-brand-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Rata Kanan"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M10 12h10M6 18h14" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => exec('justifyFull')}
          className={`p-1.5 rounded transition-colors ${activeFormats.justifyFull ? 'bg-brand-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          title="Rata Kanan Kiri (Justify)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-0.5" />

        {/* Clear formatting */}
        <button
          type="button"
          onClick={() => exec('removeFormat')}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-red-600"
          title="Hapus Format"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Editable Content Area */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        onKeyUp={updateActiveFormats}
        onMouseUp={updateActiveFormats}
        className="p-3 text-sm text-gray-800 dark:text-gray-200 focus:outline-none leading-relaxed prose dark:prose-invert max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-1.5 [&_h3]:text-base [&_h3]:font-bold [&_h4]:text-sm [&_h4]:font-bold"
        style={{ minHeight }}
        data-placeholder={placeholder}
      />
    </div>
  );
};

