"use client";

import React, { useEffect, useState, use } from 'react';
import { getNotaPencairanDanaWithDetailsAction } from '@/features/nota-pencairan-dana/actions';
import { NotaPencairanDana } from '@/features/nota-pencairan-dana/types';
import { MasterDokumen } from '@/features/master-dokumen/types';
import { formatDateIndonesian } from '@/lib/date';

function formatNumber(val: number | string | null | undefined): string {
  if (val === null || val === undefined || val === '') return '-';
  const num = typeof val === 'number' ? val : Number(val);
  if (isNaN(num) || num === 0) return '-';
  return num.toLocaleString('id-ID');
}

export default function NotaPencairanDanaPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const mdkId = Number(resolvedParams?.id);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    items: NotaPencairanDana[];
    masterDokumen: MasterDokumen | null;
  } | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!mdkId || isNaN(mdkId)) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const res = await getNotaPencairanDanaWithDetailsAction(mdkId);
      if (res.success && res.data && res.data.masterDokumen) {
        setData(res.data);
      }
      setLoading(false);
    }
    loadData();
  }, [mdkId]);

  useEffect(() => {
    if (!loading && data) {
      const timer = setTimeout(() => {
        window.print();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [loading, data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-gray-600">Memuat Dokumen Nota Pencairan Dana PDF...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.masterDokumen) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center text-red-500 font-semibold">
          Dokumen Nota Pencairan Dana tidak ditemukan atau gagal dimuat.
        </div>
      </div>
    );
  }

  const { items, masterDokumen } = data;

  // Aggregate values
  const totalDpa = items.reduce((sum, i) => sum + (Number(i.dpd_dpa_nilai) || 0), 0) || Number(masterDokumen.mdk_pagu_anggaran) || 0;
  const totalBelumNilai = items.reduce((sum, i) => sum + (Number(i.dpd_belum_nilai) || 0), 0);
  const totalSaatIniNilai = items.reduce((sum, i) => sum + (Number(i.dpd_saatini_nilai) || 0), 0);
  const totalPpn = items.reduce((sum, i) => sum + (Number(i.dpd_saatini_ppn) || 0), 0);
  const totalPph23 = items.reduce((sum, i) => sum + (Number(i.dpd_saatini_pph23) || 0), 0);
  const totalTotalPajak = items.reduce((sum, i) => sum + (Number(i.dpd_saatini_total_pajak) || 0), 0);
  const totalPembayaran = items.reduce((sum, i) => sum + (Number(i.dpd_saatini_pembayaran) || 0), 0) || totalSaatIniNilai;
  const totalSisaNilai = totalDpa - totalBelumNilai - totalSaatIniNilai;

  const noNota = masterDokumen.mdk_no_dpa ? `/SEKRETARIS-${masterDokumen.mdk_no_dpa}` : '/SEKRETARIS-027.1/VIII/2026';
  const programStr = `${masterDokumen.mdk_kode_program || '5.02.01'} - ${masterDokumen.mdk_program || 'Program Penunjang Urusan Pemerintahan Daerah Kabupaten/Kota'}`;
  const kegiatanStr = `${masterDokumen.mdk_kode_kegiatan || '5.02.01.2.08'} - ${masterDokumen.mdk_kegiatan || 'Penyediaan Jasa Penunjang Urusan Pemerintahan Daerah'}`;
  const subKegiatanStr = `${masterDokumen.mdk_kode_sub_kegiatan || '5.02.01.2.08.0003'} - ${masterDokumen.mdk_sub_kegiatan || 'Penyediaan Jasa Peralatan dan Perlengkapan Kantor'}`;

  const kpaNama = masterDokumen.mdk_nama_pejabat || 'DANIEL PERDANA, SE';
  const kpaNip = masterDokumen.mdk_nip_pejabat || '197507242001121006';
  const pptkNama = masterDokumen.mdk_nama_pptk || 'MIRZA WALAD, S.E., M.Ak';
  const pptkNip = masterDokumen.mdk_nip_pptk || '198208012015031001';
  const tanggalDoc = formatDateIndonesian(masterDokumen.mdk_created_at);

  const labelPejabat = masterDokumen.mdk_jabatan_pejabat?.trim().toUpperCase() === 'PA'
    ? 'Pengguna Anggaran'
    : 'Kuasa Pengguna Anggaran';

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 print:py-0 print:bg-white text-black font-sans">
      {/* Floating Control Bar */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 dark:bg-gray-800/90 text-white px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-4 print:hidden">
        <span className="text-xs font-semibold">Nota Pencairan Dana PDF</span>
        <div className="h-4 w-px bg-gray-700"></div>
        <button
          onClick={() => window.print()}
          className="px-3.5 py-1.5 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
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

      {/* Printable Sheet Container */}
      <div className="mx-auto w-full max-w-[297mm] bg-white text-black p-6 sm:p-8 print:p-0 shadow-2xl print:shadow-none font-sans text-[11px] leading-snug">
        <style jsx global>{`
          @media print {
            html, body {
              background: white !important;
              color: black !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .print\\:hidden {
              display: none !important;
            }
            @page {
              size: A4 landscape;
              margin: 8mm 10mm;
            }
          }
        `}</style>

        {/* Title Header */}
        <div className="text-center mb-5">
          <h1 className="font-bold text-sm uppercase underline tracking-wide">NOTA PENCAIRAN DANA</h1>
          <p className="text-xs font-semibold mt-0.5">
            Nomor : &nbsp;&nbsp;&nbsp;&nbsp;{noNota}
          </p>
        </div>

        {/* Program / Kegiatan Metadata Header */}
        <div className="mb-4 text-[11px] space-y-1">
          <div className="flex">
            <span className="w-24 font-semibold shrink-0">Program</span>
            <span className="w-4 text-center shrink-0">:</span>
            <span className="font-semibold text-black">{programStr}</span>
          </div>
          <div className="flex">
            <span className="w-24 font-semibold shrink-0">Kegiatan</span>
            <span className="w-4 text-center shrink-0">:</span>
            <span className="font-semibold text-black">{kegiatanStr}</span>
          </div>
          <div className="flex">
            <span className="w-24 font-semibold shrink-0">Sub Kegiatan</span>
            <span className="w-4 text-center shrink-0">:</span>
            <span className="font-semibold text-black">{subKegiatanStr}</span>
          </div>
        </div>

        {/* Main 15-Column Table */}
        <div className="overflow-x-auto print:overflow-visible my-3">
          <table className="w-full border-collapse border border-black text-[10px] text-black">
            <thead>
              {/* Row 1 Header Groups */}
              <tr className="bg-white font-bold text-center">
                <th rowSpan={2} className="border border-black px-1 py-1.5 w-[75px] align-middle">
                  Rekening
                </th>
                <th rowSpan={2} className="border border-black px-2 py-1.5 min-w-[200px] align-middle">
                  Uraian
                </th>
                <th colSpan={3} className="border border-black px-1 py-1 align-middle">
                  Anggaran (DPA)
                </th>
                <th colSpan={2} className="border border-black px-1 py-1 align-middle">
                  Permintaan Sebelumnya
                </th>
                <th colSpan={6} className="border border-black px-1 py-1 align-middle">
                  Permintaan Saat Ini
                </th>
                <th colSpan={2} className="border border-black px-1 py-1 align-middle">
                  Sisa Anggaran
                </th>
              </tr>

              {/* Row 2 Sub-Headers */}
              <tr className="bg-white font-bold text-center">
                <th className="border border-black px-1 py-1 w-[40px]">Volume</th>
                <th className="border border-black px-1 py-1 w-[45px]">Satuan</th>
                <th className="border border-black px-1 py-1 w-[95px]">Nilai (Rp)</th>

                <th className="border border-black px-1 py-1 w-[45px]">Volume</th>
                <th className="border border-black px-1 py-1 w-[90px]">Nilai (Rp)</th>

                <th className="border border-black px-1 py-1 w-[45px]">Volume</th>
                <th className="border border-black px-1 py-1 w-[90px]">Nilai (Rp)</th>
                <th className="border border-black px-1 py-1 w-[70px]">PPN (Rp)</th>
                <th className="border border-black px-1 py-1 w-[70px]">PPH 23 (Rp)</th>
                <th className="border border-black px-1 py-1 w-[75px]">Total Pajak (Rp)</th>
                <th className="border border-black px-1 py-1 w-[95px]">Pembayaran (Rp)</th>

                <th className="border border-black px-1 py-1 w-[45px]">Volume</th>
                <th className="border border-black px-1 py-1 w-[95px]">Nilai (Rp)</th>
              </tr>

              {/* Row 3 Column Numbers / Formulas */}
              <tr className="bg-white font-bold text-center text-[9.5px]">
                <th className="border border-black p-1">1</th>
                <th className="border border-black p-1">2</th>
                <th className="border border-black p-1">3</th>
                <th className="border border-black p-1">4</th>
                <th className="border border-black p-1">5</th>
                <th className="border border-black p-1">6</th>
                <th className="border border-black p-1">7</th>
                <th className="border border-black p-1">8</th>
                <th className="border border-black p-1">9</th>
                <th className="border border-black p-1">10</th>
                <th className="border border-black p-1">11</th>
                <th className="border border-black p-1">12=10+11</th>
                <th className="border border-black p-1">13=9-12</th>
                <th className="border border-black p-1">14=3-6-8</th>
                <th className="border border-black p-1">15=5-7-9</th>
              </tr>
            </thead>

            <tbody className="align-top">
              {/* Account Code Hierarchy Rows (Level 1 - Level 5) */}
              {(() => {
                const rawLevelRows = [
                  { kode: masterDokumen.mdk_kode_level1, nama: masterDokumen.mdk_nama_level1 },
                  { kode: masterDokumen.mdk_kode_level2, nama: masterDokumen.mdk_nama_level2 },
                  { kode: masterDokumen.mdk_kode_level3, nama: masterDokumen.mdk_nama_level3 },
                  { kode: masterDokumen.mdk_kode_level4, nama: masterDokumen.mdk_nama_level4 },
                  { kode: masterDokumen.mdk_kode_level5, nama: masterDokumen.mdk_nama_level5 },
                ].filter((lvl) => (lvl.kode && lvl.kode.trim() !== '') || (lvl.nama && lvl.nama.trim() !== ''));

                const activeLevelRows = rawLevelRows.length > 0 ? rawLevelRows : [
                  { kode: '5.', nama: 'BELANJA DAERAH' },
                  { kode: '5.1.', nama: 'BELANJA OPERASI' },
                  { kode: '5.1.02.', nama: 'Belanja Barang dan Jasa' },
                  { kode: '5.1.02.02.', nama: 'Belanja Jasa' },
                  { kode: masterDokumen.mdk_rekening_belanja || '5.1.02.02.004.', nama: masterDokumen.mdk_uraian_belanja || 'Belanja Sewa Peralatan dan Mesin' },
                ];

                return activeLevelRows.map((lvl, idx) => (
                  <tr key={idx} className="font-bold">
                    <td className="border border-black px-1 py-1 text-left">{lvl.kode || '-'}</td>
                    <td className="border border-black px-2 py-1 text-left uppercase">{lvl.nama || '-'}</td>
                    <td className="border border-black px-1 py-1"></td>
                    <td className="border border-black px-1 py-1"></td>
                    <td className="border border-black px-1.5 py-1 text-right">{formatNumber(totalDpa)}</td>
                    <td className="border border-black px-1 py-1 text-center">-</td>
                    <td className="border border-black px-1.5 py-1 text-right">{formatNumber(totalBelumNilai)}</td>
                    <td className="border border-black px-1 py-1"></td>
                    <td className="border border-black px-1.5 py-1 text-right">{formatNumber(totalSaatIniNilai)}</td>
                    <td className="border border-black px-1 py-1 text-center">-</td>
                    <td className="border border-black px-1 py-1 text-center">-</td>
                    <td className="border border-black px-1 py-1 text-center">-</td>
                    <td className="border border-black px-1.5 py-1 text-right">{formatNumber(totalPembayaran)}</td>
                    <td className="border border-black px-1 py-1"></td>
                    <td className="border border-black px-1.5 py-1 text-right">{formatNumber(totalSisaNilai)}</td>
                  </tr>
                ));
              })()}



              {/* Items Rows */}
              {items && items.length > 0 ? (
                items.map((item, idx) => (
                  <tr key={item.dpd_id || idx} className="text-black">
                    <td className="border border-black px-1 py-1.5"></td>
                    <td className="border border-black px-2 py-1.5 text-left leading-tight">
                      {item.dpd_uraian}
                    </td>
                    <td className="border border-black px-1 py-1.5 text-center font-medium">
                      {item.dpd_dpa_volume || '-'}
                    </td>
                    <td className="border border-black px-1 py-1.5 text-center font-medium">
                      {item.dpd_dpa_satuan || '-'}
                    </td>
                    <td className="border border-black px-1 py-1.5 text-right font-medium">
                      {item.dpd_dpa_nilai ? (
                        <div className="flex justify-between w-full">
                          <span>Rp</span>
                          <span>{formatNumber(item.dpd_dpa_nilai)}</span>
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="border border-black px-1 py-1.5 text-center font-medium">
                      {item.dpd_belum_volume || '-'}
                    </td>
                    <td className="border border-black px-1.5 py-1.5 text-right font-medium">
                      {formatNumber(item.dpd_belum_nilai)}
                    </td>
                    <td className="border border-black px-1 py-1.5 text-center font-medium">
                      {item.dpd_saatini_volume || '-'}
                    </td>
                    <td className="border border-black px-1.5 py-1.5 text-right font-medium">
                      {formatNumber(item.dpd_saatini_nilai)}
                    </td>
                    <td className="border border-black px-1 py-1.5 text-center font-medium">
                      {formatNumber(item.dpd_saatini_ppn)}
                    </td>
                    <td className="border border-black px-1 py-1.5 text-center font-medium">
                      {formatNumber(item.dpd_saatini_pph23)}
                    </td>
                    <td className="border border-black px-1 py-1.5 text-center font-medium">
                      {formatNumber(item.dpd_saatini_total_pajak)}
                    </td>
                    <td className="border border-black px-1.5 py-1.5 text-right font-medium">
                      {formatNumber(item.dpd_saatini_pembayaran)}
                    </td>
                    <td className="border border-black px-1 py-1.5 text-center font-medium">
                      {item.dpd_sisa_volume || '-'}
                    </td>
                    <td className="border border-black px-1.5 py-1.5 text-right font-medium">
                      {formatNumber(item.dpd_sisa_nilai)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={15} className="border border-black p-4 text-center text-gray-500 italic">
                    Belum ada data rincian item Nota Pencairan Dana.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Info Below Table (Left) */}
        <div className="mt-4 mb-8 text-[11px]">
          <table className="border-collapse">
            <tbody>
              <tr>
                <td className="py-0.5 pr-2 font-medium">1. Nilai Permintaan</td>
                <td className="py-0.5 px-2 text-center">:</td>
                <td className="py-0.5 px-2 font-medium">Rp.</td>
                <td className="py-0.5 px-4 text-right font-bold w-36">
                  {formatNumber(totalSaatIniNilai)}
                </td>
              </tr>
              <tr>
                <td className="py-0.5 pr-2 font-medium">2. Nilai Potongan</td>
                <td className="py-0.5 px-2 text-center">:</td>
                <td className="py-0.5 px-2 font-medium">Rp.</td>
                <td className="py-0.5 px-4 text-right font-bold w-36">
                  {totalTotalPajak > 0 ? formatNumber(totalTotalPajak) : '-'}
                </td>
              </tr>
              <tr>
                <td className="py-0.5 pr-2 font-medium">3. Nilai Pembayaran</td>
                <td className="py-0.5 px-2 text-center">:</td>
                <td className="py-0.5 px-2 font-medium">Rp.</td>
                <td className="py-0.5 px-4 text-right font-bold w-36">
                  {formatNumber(totalPembayaran)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signatures Section */}
        <div className="mt-8 grid grid-cols-2 gap-8 text-[11px] break-inside-avoid">
          {/* Left Block (KPA) */}
          <div className="flex flex-col justify-between h-36">
            <div>
              <p className="font-semibold text-black">{labelPejabat}</p>
            </div>
            <div>
              <p className="font-bold text-black uppercase underline">{kpaNama}</p>
              <p className="text-black">NIP. {kpaNip}</p>
            </div>
          </div>

          {/* Right Block (PPTK) */}
          <div className="flex flex-col justify-between h-36 pl-12">
            <div>
              <p className="font-semibold text-black">Pekanbaru, {tanggalDoc}</p>
              <p className="font-semibold text-black">Pejabat Pelaksana Teknis Kegiatan (PPTK)</p>
            </div>
            <div>
              <p className="font-bold text-black uppercase underline">{pptkNama}</p>
              <p className="text-black">NIP. {pptkNip}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
