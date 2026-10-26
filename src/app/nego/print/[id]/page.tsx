"use client";

import React, { useEffect, useState, use } from 'react';
import { getNegoWithDetailsAction } from '@/features/nego/actions';
import { Nego } from '@/features/nego/types';
import { MasterDokumen } from '@/features/master-dokumen/types';
import { formatRupiah, terbilang } from '@/lib/terbilang';
import { formatDateIndonesian } from '@/lib/date';

function formatTanggalIndonesian(dateStr?: string | null): string {
  if (!dateStr) {
    const now = new Date();
    const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `Pekanbaru, ${now.getDate()} ${bulan[now.getMonth()]} ${now.getFullYear()}`;
  }
  const date = new Date(dateStr);
  const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return `Pekanbaru, ${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
}

export default function NegoPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const mdkId = Number(resolvedParams.id);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    items: Nego[];
    masterDokumen: MasterDokumen | null;
  } | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!mdkId) return;
      setLoading(true);
      const res = await getNegoWithDetailsAction(mdkId);
      if (res.success && res.data) {
        setData(res.data);
      }
      setLoading(false);
    }
    loadData();
  }, [mdkId]);

  useEffect(() => {
    if (!loading && data) {
      const timer = setTimeout(() => window.print(), 600);
      return () => clearTimeout(timer);
    }
  }, [loading, data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-gray-600">Memuat Berita Acara Negosiasi PDF...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.masterDokumen) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center text-red-500 font-semibold">
          Dokumen Negosiasi tidak ditemukan atau gagal dimuat.
        </div>
      </div>
    );
  }

  const { items, masterDokumen } = data;

  // Totals per column
  const totalHps = items.reduce((s, i) => s + (Number(i.nego_hps_jumlah_harga) || 0), 0);
  const totalPnw = items.reduce((s, i) => s + (Number(i.nego_pnw_jumlah_harga) || 0), 0);
  const totalNego = items.reduce((s, i) => s + (Number(i.nego_negosiasi_jumlah_harga) || 0), 0);

  const ppnHps = Math.round(totalHps * 0.11);
  const ppnPnw = Math.round(totalPnw * 0.11);
  const ppnNego = Math.round(totalNego * 0.11);

  const jumlahHps = totalHps + ppnHps;
  const jumlahPnw = totalPnw + ppnPnw;
  const jumlahNego = totalNego + ppnNego;

  const terbilangNego = terbilang(jumlahNego);

  const namaPerusahaan = masterDokumen.mdk_nama_perusahaan || 'PT SIBAYAK RIAU WISATA';
  const namaPimpinanPerusahaan = masterDokumen.mdk_nama_pimpinan_perusahaan || 'ELIAKIM SITEPU, SP';
  const jabatanPimpinanPerusahaan = masterDokumen.mdk_jabatan_pimpinan_perusahaan || 'Direktur';
  const namaPejabatPengadaan = masterDokumen.mdk_nama_pejabat_pengadaan || 'RIO MARK H.';
  const nipPejabatPengadaan = masterDokumen.mdk_nip_pejabat_pengadaan || '198208012015031001';
  const kodeRekening = masterDokumen.mdk_rekening_belanja || '5.02.01.2.08.0003';
  const tahunAnggaran = masterDokumen.mdk_apbd || new Date().getFullYear().toString();
  const tanggalDokumen = formatDateIndonesian(masterDokumen.mdk_created_at ? String(masterDokumen.mdk_created_at) : null);

  return (
    <div className="min-h-screen bg-gray-100 py-6 print:py-0 print:bg-white">
      {/* Floating Control Bar */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 text-white px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-4 print:hidden">
        <span className="text-xs font-semibold">Berita Acara Negosiasi PDF</span>
        <div className="h-4 w-px bg-gray-700"></div>
        <button onClick={() => window.print()} className="px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Cetak / Simpan PDF
        </button>
        <button onClick={() => window.close()} className="px-3.5 py-1.5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold text-xs transition-all cursor-pointer">
          Tutup Tab
        </button>
      </div>

      {/* A4 Landscape Document */}
      <div className="mx-auto bg-white text-black font-serif text-[9px] leading-tight shadow-xl print:shadow-none print:m-0 print:p-[12mm]"
        style={{ maxWidth: '297mm', padding: '10mm 12mm' }}>
        <style jsx global>{`
          @media print {
            html, body {
              background: white !important;
              color: black !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .print\\:hidden { display: none !important; }
            @page {
              size: A4 landscape;
              margin: 0;
            }
          }
        `}</style>

        {/* Title */}
        <div className="text-center mb-4">
          <h2 className="font-extrabold text-[11px] underline tracking-wider uppercase">
            LAMPIRAN BERITA ACARA NEGOSIASI PENAWARAN
          </h2>
        </div>

        {/* Metadata left-column list */}
        <div className="mb-3">
          <table className="text-[9px] border-collapse w-auto">
            <tbody>
              {[
                ['KEGIATAN', masterDokumen.mdk_kegiatan || '-'],
                ['PEKERJAAN', masterDokumen.mdk_uraian_belanja || '-'],
                ['LOKASI', masterDokumen.mdk_bagian || masterDokumen.bdg_nama || 'Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru'],
                ['TAHUN ANGGARAN', tahunAnggaran],
                ['NAMA PENYEDIA', namaPerusahaan],
                ['PAGU DPA', `${formatRupiah(masterDokumen.mdk_pagu_anggaran)}`],
              ].map(([label, value]) => (
                <tr key={label}>
                  <td className="font-bold w-42 py-0.5 align-top">{label}</td>
                  <td className="w-4 py-0.5 text-center align-top">:</td>
                  <td className="py-0.5 align-top">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Main Nego Table — landscape wide */}
        <table className="w-full border-collapse border border-black text-[8.5px] mb-3">
          <thead>
            {/* Top header row */}
            <tr className="bg-gray-100 text-center font-bold border-b border-black">
              <th rowSpan={3} className="border border-black px-1 py-1 w-8">NO.</th>
              <th rowSpan={3} className="border border-black px-2 py-1">URAIAN KEGIATAN</th>
              <th rowSpan={3} className="border border-black px-1 py-1 w-14">VOLUME</th>
              <th rowSpan={3} className="border border-black px-1 py-1 w-14">WAKTU</th>
              {/* HPS/OE group */}
              <th colSpan={2} className="border border-black px-1 py-1">HPS/OE</th>
              {/* Harga Penawaran group */}
              <th colSpan={2} className="border border-black px-1 py-1">HARGA PENAWARAN</th>
              {/* Harga Negosiasi group */}
              <th colSpan={2} className="border border-black px-1 py-1">HARGA NEGOSIASI</th>
            </tr>
            <tr className="bg-gray-100 text-center font-bold border-b border-black">
              <th className="border border-black px-1 py-0.5">HARGA SATUAN<br /><span className="font-normal">(Rp.)</span></th>
              <th className="border border-black px-1 py-0.5">JUMLAH HARGA<br /><span className="font-normal">(Rp.)</span></th>
              <th className="border border-black px-1 py-0.5">HARGA SATUAN<br /><span className="font-normal">(Rp.)</span></th>
              <th className="border border-black px-1 py-0.5">JUMLAH HARGA<br /><span className="font-normal">(Rp.)</span></th>
              <th className="border border-black px-1 py-0.5">HARGA SATUAN<br /><span className="font-normal">(Rp.)</span></th>
              <th className="border border-black px-1 py-0.5">JUMLAH HARGA<br /><span className="font-normal">(Rp.)</span></th>
            </tr>
            {/* Column numbers row */}
            <tr className="bg-gray-100 text-center font-bold border-b border-black text-[8px]">
              {['1', '2', '3', '4', '5', '6'].map((n, i) => (
                <td key={i} className="border border-black px-1 py-0.5">{n}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Kode Rekening sub-header row */}
            <tr className="font-bold border-b border-black">
              <td className="border border-black px-1 py-1 text-center"></td>
              <td colSpan={9} className="border border-black px-2 py-1 font-bold">{kodeRekening}</td>
            </tr>

            {items.length === 0 ? (
              <tr>
                <td colSpan={10} className="border border-black px-4 py-6 text-center italic text-gray-500">
                  Belum ada rincian item Negosiasi.
                </td>
              </tr>
            ) : (
              items.map((item, idx) => {
                const volParts = item.nego_volume?.split(' ') || [];
                const volNum = volParts[0] || '-';
                const volSat = volParts[1] || '';
                const waktuParts = item.nego_waktu?.split(' ') || [];
                const waktuNum = waktuParts[0] || '-';
                const waktuSat = waktuParts[1] || '';
                return (
                  <tr key={idx} className="align-top border-b border-dashed border-gray-400">
                    <td className="border border-black px-1 py-1 text-center">{idx + 1}</td>
                    <td className="border border-black px-2 py-1 leading-relaxed">{item.nego_uraian_kegiatan}</td>
                    <td className="border border-black px-1 py-1 text-center">
                      {volNum}<br /><span className="text-[7.5px]">{volSat}</span>
                    </td>
                    <td className="border border-black px-1 py-1 text-center">
                      {waktuNum}<br /><span className="text-[7.5px]">{waktuSat}</span>
                    </td>
                    <td className="border border-black px-1 py-1 text-right font-mono">{formatRupiah(item.nego_hps_harga_satuan)}</td>
                    <td className="border border-black px-1 py-1 text-right font-mono font-semibold">{formatRupiah(item.nego_hps_jumlah_harga)}</td>
                    <td className="border border-black px-1 py-1 text-right font-mono">{formatRupiah(item.nego_pnw_harga_satuan)}</td>
                    <td className="border border-black px-1 py-1 text-right font-mono font-semibold">{formatRupiah(item.nego_pnw_jumlah_harga)}</td>
                    <td className="border border-black px-1 py-1 text-right font-mono">{formatRupiah(item.nego_negosiasi_harga_satuan)}</td>
                    <td className="border border-black px-1 py-1 text-right font-mono font-semibold">{formatRupiah(item.nego_negosiasi_jumlah_harga)}</td>
                  </tr>
                );
              })
            )}

            {/* Totals rows */}
            {[
              { label: 'TOTAL', hps: totalHps, pnw: totalPnw, nego: totalNego, bold: false },
              { label: 'PPN 11%', hps: ppnHps, pnw: ppnPnw, nego: ppnNego, bold: false },
              { label: 'JUMLAH', hps: jumlahHps, pnw: jumlahPnw, nego: jumlahNego, bold: true },
              { label: 'PEMBULATAN', hps: jumlahHps, pnw: jumlahPnw, nego: jumlahNego, bold: true },
            ].map(({ label, hps, pnw, nego, bold }) => (
              <tr key={label} className={`border-t border-black ${bold ? 'bg-gray-50' : ''}`}>
                <td colSpan={4} className="border-none"></td>
                <td className={`border border-black px-1 py-1 text-right font-mono ${bold ? 'font-extrabold' : 'font-bold'}`}>{formatRupiah(hps)}</td>
                <td className="border border-black px-1 py-1 text-right font-bold text-[9px] uppercase">{label}</td>
                <td className={`border border-black px-1 py-1 text-right font-mono ${bold ? 'font-extrabold' : 'font-bold'}`}>{formatRupiah(pnw)}</td>
                <td className="border border-black px-1 py-1"></td>
                <td className={`border border-black px-1 py-1 text-right font-mono ${bold ? 'font-extrabold' : 'font-bold'}`}>{formatRupiah(nego)}</td>
                <td className="border border-black px-1 py-1"></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Terbilang */}
        <div className="mb-4 text-[9px]">
          <span className="font-semibold">Terbilang : </span>
          <span className="italic font-bold">{terbilangNego || 'Nol Rupiah'}</span>
        </div>

        {/* Tanggal dan Tanda Tangan */}
        <div className="mt-2">
          <div className="text-right text-[9px] mb-4">{tanggalDokumen}</div>

          <div className="grid grid-cols-2 gap-4 text-[9px]">
            {/* Kiri: Penyedia */}
            <div className="space-y-1">
              <p className="font-semibold">Setuju Dilaksanakan :</p>
              <p className="font-bold uppercase">PENYEDIA JASA</p>
              <p className="font-bold uppercase">{namaPerusahaan}</p>
              <br /><br /><br /><br /><br /><br /><br /><br />
              <div className="mt-12 pt-2 border-b border-black w-48"></div>
              <p className="font-bold underline uppercase">{namaPimpinanPerusahaan}</p>
              <p>{jabatanPimpinanPerusahaan}</p>
            </div>

            {/* Kanan: Pejabat Pengadaan */}
            <div className="space-y-1 text-left">
              <p className="font-bold uppercase">PEJABAT PENGADAAN BARANG DAN JASA</p>
              <p className="font-bold uppercase">DI LINGKUNGAN BADAN PENGELOLA KEUANGAN</p>
              <p className="font-bold uppercase">DAN ASET DAERAH KOTA PEKANBARU</p>
              <br /><br /><br /><br /><br /><br /><br /><br />
              <div className="mt-12 pt-2 border-b border-black w-48"></div>
              <p className="font-bold underline uppercase">{namaPejabatPengadaan}</p>
              <p>NIP: {nipPejabatPengadaan}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
