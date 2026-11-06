"use client";

import React, { useEffect, useState, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { getBeritaAcaraWithDetailsAction } from '@/features/berita-acara/actions';
import { BeritaAcaraPrintSheet } from '@/features/berita-acara/components/BeritaAcaraPrintSheet';
import { MasterDokumen } from '@/features/master-dokumen/types';
import { BeritaAcara, BeritaAcaraHeader } from '@/features/berita-acara/types';

export default function BeritaAcaraPrintPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const mdkId = Number(resolvedParams.id);
    const searchParams = useSearchParams();
    const jenisParam = searchParams.get('jenis') || '001';

    const [loading, setLoading] = useState(true);
    const [masterDokumen, setMasterDokumen] = useState<MasterDokumen | null>(null);
    const [header, setHeader] = useState<BeritaAcaraHeader | null>(null);
    const [items, setItems] = useState<BeritaAcara[]>([]);

    const judul =
        jenisParam === '002'
            ? 'BERITA ACARA SERAH TERIMA HASIL PEKERJAAN'
            : 'BERITA ACARA PEMERIKSAAN HASIL PEKERJAAN';

    useEffect(() => {
        async function loadData() {
            if (!mdkId) return;
            setLoading(true);

            const res = await getBeritaAcaraWithDetailsAction(mdkId, jenisParam);

            if (res.success && res.data) {
                setMasterDokumen(res.data.masterDokumen);
                setHeader(res.data.fullData.header);
                setItems(res.data.fullData.items);
            }

            setLoading(false);
        }
        loadData();
    }, [mdkId, jenisParam]);

    useEffect(() => {
        if (!loading && masterDokumen) {
            const timer = setTimeout(() => window.print(), 600);
            return () => clearTimeout(timer);
        }
    }, [loading, masterDokumen]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center space-y-3">
                    <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-sm font-medium text-gray-600">Memuat Berita Acara PDF...</p>
                </div>
            </div>
        );
    }

    if (!masterDokumen) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center text-red-500 font-semibold">
                    Dokumen Berita Acara tidak ditemukan atau gagal dimuat.
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-6 print:py-0 print:bg-white">
            {/* Floating Control Bar */}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 text-white px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-4 print:hidden">
                <span className="text-xs font-semibold">Berita Acara PDF</span>
                <div className="h-4 w-px bg-gray-700"></div>
                <button
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Cetak / Simpan PDF
                </button>
                <button
                    onClick={() => window.close()}
                    className="px-3.5 py-1.5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold text-xs transition-all cursor-pointer"
                >
                    Tutup Tab
                </button>
            </div>

            <style jsx global>{`
              @media print {
                html, body {
                  background: white !important;
                  color: black !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  font-family: Arial, Helvetica, sans-serif !important;
                }
                .print-hidden { display: none !important; }
                @page {
                  size: A4 portrait;
                  margin: 0;
                }
              }
            `}</style>

            {/* Berita Acara Sheet */}
            <div
                className="mx-auto bg-white text-black shadow-xl print:shadow-none print:m-0"
                style={{
                    width: '210mm',
                    minHeight: '297mm',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    paddingTop: '10mm',
                    paddingBottom: '8mm',
                }}
            >
                <BeritaAcaraPrintSheet
                    masterDokumen={masterDokumen}
                    header={header}
                    items={items}
                    judul={judul}
                />
            </div>
        </div>
    );
}
