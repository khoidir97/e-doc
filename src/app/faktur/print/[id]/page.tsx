"use client";

import React, { useEffect, useState, use } from 'react';
import { getFakturWithDetailsAction } from '@/features/faktur/actions';
import { FakturHeader, Faktur } from '@/features/faktur/types';
import { MasterDokumen } from '@/features/master-dokumen/types';
import { formatRupiah, isBelowPajakThreshold } from '@/lib/terbilang';

function formatDateID(val?: string | Date | null): string {
  if (!val) return '-';
  const d = new Date(val as string);
  if (isNaN(d.getTime())) return String(val);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function FakturPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const mdkId = Number(resolvedParams.id);

  const [loading, setLoading] = useState(true);
  const [header, setHeader] = useState<FakturHeader | null>(null);
  const [details, setDetails] = useState<Faktur[]>([]);
  const [masterDokumen, setMasterDokumen] = useState<MasterDokumen | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!mdkId) return;
      setLoading(true);
      const res = await getFakturWithDetailsAction(mdkId);
      if (res.success && res.data) {
        setHeader(res.data.header);
        setDetails(res.data.details);
        setMasterDokumen(res.data.masterDokumen);
      }
      setLoading(false);
    }
    loadData();
  }, [mdkId]);

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
          <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-gray-600">Memuat Dokumen Faktur Pesanan...</p>
        </div>
      </div>
    );
  }

  if (!masterDokumen) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center text-red-500 font-semibold">Dokumen tidak ditemukan atau gagal dimuat.</div>
      </div>
    );
  }

  const totalHarga = details.reduce((acc, curr) => acc + (Number(curr.fkt_total) || 0), 0);
  const countPPN = isBelowPajakThreshold(totalHarga) ? totalHarga * (11 / 100) : 0;
  const nomorFaktur = header?.fak_nomor_faktur || '/SEKRETARIS-027.1/VI/2026';
  const tanggalFaktur = header?.fak_tanggal_faktur ? formatDateID(header.fak_tanggal_faktur) : formatDateID(new Date());

  return (
    <div className="min-h-screen bg-gray-200 print:bg-white p-0 sm:p-6 print:p-0">
      {/* Floating Action Bar (Hidden during Print) */}
      <div className="max-w-[210mm] mx-auto mb-4 print:hidden bg-white/90 backdrop-blur border border-gray-300 p-3 rounded-xl shadow-md flex items-center justify-between">
        <div className="text-xs font-semibold text-gray-700">
          Mode Cetak PDF - Faktur Pesanan
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.close()}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all cursor-pointer"
          >
            Tutup
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-brand-600 text-white hover:bg-brand-700 shadow transition-all cursor-pointer flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Cetak Dokumen
          </button>
        </div>
      </div>

      {/* Sheet Printable Document */}
      <div className="bg-white p-8 max-w-[210mm] mx-auto text-black font-sans text-[12px] leading-relaxed shadow-lg print:shadow-none print:max-w-none print:w-full">
        {/* Title & Document Number */}
        <div className="text-center mb-6">
          <h1 className="font-bold text-[14px] uppercase tracking-wider border-b-2 border-black inline-block pb-0.5">
            FAKTUR PESANAN
          </h1>
          <div className="text-[11px] font-semibold mt-1">
            NO : &nbsp; {nomorFaktur}
          </div>
        </div>

        {/* Header Metadata Info */}
        <div className="mb-6 text-[11px]">
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="font-bold w-[140px] align-top py-0.5">Program</td>
                <td className="w-[12px] align-top py-0.5">:</td>
                <td className="align-top py-0.5">
                  {masterDokumen.mdk_kode_program ? `${masterDokumen.mdk_kode_program} - ` : ''}
                  {masterDokumen.mdk_program || '-'}
                </td>
              </tr>
              <tr>
                <td className="font-bold align-top py-0.5">Kegiatan</td>
                <td className="align-top py-0.5">:</td>
                <td className="align-top py-0.5">
                  {masterDokumen.mdk_kode_kegiatan ? `${masterDokumen.mdk_kode_kegiatan} - ` : ''}
                  {masterDokumen.mdk_kegiatan || '-'}
                </td>
              </tr>
              <tr>
                <td className="font-bold align-top py-0.5">Sub Kegiatan</td>
                <td className="align-top py-0.5">:</td>
                <td className="align-top py-0.5">
                  {masterDokumen.mdk_kode_sub_kegiatan ? `${masterDokumen.mdk_kode_sub_kegiatan} - ` : ''}
                  {masterDokumen.mdk_sub_kegiatan || '-'}
                </td>
              </tr>
              <tr>
                <td className="font-bold align-top py-0.5">Belanja</td>
                <td className="align-top py-0.5">:</td>
                <td className="align-top py-0.5">
                  {masterDokumen.mdk_rekening_belanja ? `${masterDokumen.mdk_rekening_belanja} - ` : ''}
                  {masterDokumen.mdk_uraian_belanja || '-'}
                </td>
              </tr>
              <tr>
                <td className="font-bold align-top py-0.5">Pekerjaan</td>
                <td className="align-top py-0.5">:</td>
                <td className="align-top py-0.5">{masterDokumen.mdk_uraian_belanja || '-'}</td>
              </tr>
              <tr>
                <td className="font-bold align-top py-0.5">Dari</td>
                <td className="align-top py-0.5">:</td>
                <td className="align-top py-0.5">Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru</td>
              </tr>
              <tr>
                <td className="font-bold align-top py-0.5">Kepada</td>
                <td className="align-top py-0.5">:</td>
                <td className="align-top py-0.5 font-bold uppercase">{masterDokumen.mdk_nama_perusahaan || '-'}</td>
              </tr>
              <tr>
                <td className="font-bold align-top py-0.5">Alamat Pemesanan</td>
                <td className="align-top py-0.5">:</td>
                <td className="align-top py-0.5">{masterDokumen.mdk_alamat || '-'}</td>
              </tr>
              <tr>
                <td className="font-bold align-top py-0.5">Tanggal Pesanan</td>
                <td className="align-top py-0.5">:</td>
                <td className="align-top py-0.5">{tanggalFaktur}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Item Details Table */}
        <table className="w-full border-collapse border border-black text-[11px] mb-6">
          <thead>
            <tr className="bg-gray-100 text-center font-bold">
              <th rowSpan={2} className="border border-black p-1.5 w-[35px]">No.</th>
              <th rowSpan={2} className="border border-black p-1.5 text-center">Jenis dan Spesifikasi Barang</th>
              <th colSpan={2} className="border border-black p-1.5">Volume</th>
              <th colSpan={2} className="border border-black p-1.5">Harga (Rp) + PPN</th>
            </tr>
            <tr className="bg-gray-100 text-center font-bold">
              <th className="border border-black p-1.5 w-[55px]">Unit</th>
              <th className="border border-black p-1.5 w-[55px]">Hari</th>
              <th className="border border-black p-1.5 w-[110px]">Harga Satuan</th>
              <th className="border border-black p-1.5 w-[120px]">Total</th>
            </tr>
            <tr className="bg-gray-50 text-center font-semibold text-[10px]">
              <td className="border border-black py-0.5">1</td>
              <td className="border border-black py-0.5">2</td>
              <td className="border border-black py-0.5">3</td>
              <td className="border border-black py-0.5">4</td>
              <td className="border border-black py-0.5">5</td>
              <td className="border border-black py-0.5">6=3x4x5</td>
            </tr>
          </thead>
          <tbody>
            {details.length > 0 ? (
              details.map((item, idx) => (
                <tr key={idx} className="align-top">
                  <td className="border border-black p-1.5 text-center">{idx + 1}</td>
                  <td className="border border-black p-1.5">{item.fkt_jenis_spesifikasi}</td>
                  <td className="border border-black p-1.5 text-center">{item.fkt_unit || '-'}</td>
                  <td className="border border-black p-1.5 text-center">{item.fkt_hari || '-'}</td>
                  <td className="border border-black p-1.5 text-right font-mono">
                    {formatRupiah(item.fkt_harga_satuan)}
                  </td>
                  <td className="border border-black p-1.5 text-right font-mono font-bold">
                    {formatRupiah(item.fkt_total)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="border border-black p-4 text-center text-gray-500 italic">
                  Belum ada item rincian faktur.
                </td>
              </tr>
            )}

            {/* Subtotal PPN */}
            <tr>
              <td colSpan={4} className="border border-black p-1.5 font-bold text-right">PPN</td>
              <td colSpan={2} className="border border-black p-1.5 text-right font-mono">
                {formatRupiah(countPPN)}
              </td>
            </tr>
            {/* Grand Total */}
            <tr className="font-bold">
              <td colSpan={4} className="border border-black p-1.5 text-center uppercase tracking-wider">TOTAL</td>
              <td colSpan={2} className="border border-black p-1.5 text-right font-mono text-[12px]">
                {formatRupiah(totalHarga)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Signatures Section */}
        <div className="grid grid-cols-2 gap-8 text-[11px] mt-8 page-break-inside-avoid">
          {/* Left Side: Penyedia / Rekanan */}
          <div className="text-center space-y-1">
            <div>Penyedia,</div>
            <div className="font-bold uppercase">
              {masterDokumen.mdk_nama_perusahaan || 'PT / CV ...'}
            </div>
            <div className="h-20"></div>
            <div className="font-bold underline uppercase">
              {masterDokumen.mdk_nama_pimpinan_perusahaan || '................................'}
            </div>
            <div>{masterDokumen.mdk_jabatan_pimpinan_perusahaan || 'Direktur'}</div>
          </div>

          {/* Right Side: Pemesan / PPTK */}
          <div className="text-center space-y-1">
            <div>Pekanbaru, {tanggalFaktur}</div>
            <div>Pemesan,</div>
            <div className="font-bold">Pejabat Pelaksana Teknis Kegiatan</div>
            <div className="h-20"></div>
            <div className="font-bold underline uppercase">
              {masterDokumen.mdk_nama_pptk || '................................'}
            </div>
            <div>
              {masterDokumen.mdk_nip_pptk ? `NIP. ${masterDokumen.mdk_nip_pptk}` : 'NIP. ................................'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
