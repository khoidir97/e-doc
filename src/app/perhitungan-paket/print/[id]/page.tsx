"use client";

import React, { useEffect, useState, use } from 'react';
import { getPerhitunganPaketWithDetailsAction } from '@/features/perhitungan-paket/actions';
import { Paket, PerhitunganPaket } from '@/features/perhitungan-paket/types';
import { MasterDokumen } from '@/features/master-dokumen/types';
import { formatRupiah } from '@/lib/terbilang';

function formatDateID(val?: string | Date | null): string {
  if (!val) return '-';
  const d = new Date(val as string);
  if (isNaN(d.getTime())) return String(val);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function PerhitunganPaketPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const mdkId = Number(resolvedParams.id);

  const [loading, setLoading] = useState(true);
  const [paket, setPaket] = useState<Paket | null>(null);
  const [items, setItems] = useState<PerhitunganPaket[]>([]);
  const [masterDokumen, setMasterDokumen] = useState<MasterDokumen | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!mdkId) return;
      setLoading(true);
      const res = await getPerhitunganPaketWithDetailsAction(mdkId);
      if (res.success && res.data) {
        setPaket(res.data.paket);
        setItems(res.data.items);
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
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-gray-600">Memuat Perhitungan Nilai Pekerjaan PDF...</p>
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

  // Aggregated totals
  const totalNilaiInvoice = items.reduce((s, i) => s + (Number(i.pak_nilai_invoice) || 0), 0);
  const totalDpp = items.reduce((s, i) => s + (Number(i.pak_dpp) || 0), 0);
  const totalPpn = items.reduce((s, i) => s + (Number(i.pak_ppn) || 0), 0);
  const totalPph23 = items.reduce((s, i) => s + (Number(i.pak_pph23) || 0), 0);
  const totalDibayar = items.reduce((s, i) => s + (Number(i.pak_dibayar) || 0), 0);

  const spkKwitansi = paket?.pkt_spk_kwitansi !== null && paket?.pkt_spk_kwitansi !== undefined
    ? formatRupiah(Number(paket.pkt_spk_kwitansi)) : '-';
  const noSpkKwitansi = paket?.pkt_no_spk_kwitansi || '-';
  const tanggalSpk = paket?.pkt_tanggal_spk_kwitansi ? formatDateID(paket.pkt_tanggal_spk_kwitansi) : '-';
  const bapp = paket?.pkt_bapp || '-';
  const bast = paket?.pkt_bast || '-';
  const bap = paket?.pkt_bap || '-';
  const tanggal = paket?.pkt_tanggal ? formatDateID(paket.pkt_tanggal) : '-';
  const npwp = paket?.pkt_npwp || '-';
  const noRekening = paket?.pkt_no_rekening || '-';
  const namaRekening = paket?.pkt_nama_rekening || '-';
  const namaBank = paket?.pkt_nama_bank || '-';
  const paguRab = masterDokumen.mdk_pagu_anggaran ? formatRupiah(Number(masterDokumen.mdk_pagu_anggaran)) : '-';

  const infoRows: [string, string][] = [
    ['KEGIATAN', masterDokumen.mdk_kegiatan || '-'],
    ['SUB KEGIATAN', masterDokumen.mdk_sub_kegiatan || '-'],
    ['PEKERJAAN', masterDokumen.mdk_uraian_belanja || '-'],
    ['', ''],
    ['KODE SUB KEG', masterDokumen.mdk_kode_sub_kegiatan || masterDokumen.mdk_rekening_belanja || '-'],
    ['PAGU RAB', `Rp${paguRab}`],
    ['SPK/ KUITANSI', `Rp${spkKwitansi}`],
    ['NO SPK/ KUITANSI', noSpkKwitansi],
    ['TANGGAL', tanggalSpk],
    ['BAPP', bapp],
    ['BAST', bast],
    ['BAP', bap],
    ['TANGGAL', tanggal],
    ['NPWP', npwp],
    ['NO. REKENING', noRekening],
    ['NAMA REKENING', namaRekening],
    ['NAMA BANK', namaBank],
  ];

  const tdLabel = "text-[8px] uppercase py-0.5 pr-2 align-top w-36 text-gray-700";
  const tdColon = "text-center py-0.5 pr-2 align-top w-3";
  const tdValue = "text-[9px] py-0.5 align-top leading-snug";

  // Tentukan label PPh (PPh 22, PPh 23, atau PPh)
  const jenisPphHeader = items.some((i) => i.pak_jenis_pph === '22') || paket?.pkt_jenis_pph === '22'
    ? (items.some((i) => i.pak_jenis_pph === '23') ? 'PPh' : 'PPh 22')
    : 'PPh 23';

  return (
    <div className="min-h-screen bg-gray-100 py-6 print:py-0 print:bg-white">
      {/* Floating Control Bar */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 text-white px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-4 print:hidden">
        <span className="text-xs font-semibold">Perhitungan Nilai Pekerjaan PDF</span>
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

      {/* A4 Document */}
      <div
        className="mx-auto bg-white text-black shadow-xl print:shadow-none print:m-0"
        style={{ maxWidth: '210mm', padding: '15mm' }}
      >
        <style jsx global>{`
          @media print {
            html, body {
              background: white !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .print\\:hidden { display: none !important; }
            @page { size: A4 portrait; margin: 0; }
          }
        `}</style>

        {/* Title */}
        <div className="text-center mb-5">
          <h1 className="font-extrabold text-[13px] underline tracking-wider uppercase">
            PERHITUNGAN NILAI PEKERJAAN
          </h1>
        </div>

        {/* Info Table */}
        <table className="w-full border-collapse mb-5 text-[9px]">
          <tbody>
            {infoRows.map(([label, value], i) =>
              label === '' ? (
                <tr key={i}><td colSpan={3} className="py-1"></td></tr>
              ) : (
                <tr key={i}>
                  <td className={tdLabel}>{label}</td>
                  <td className={tdColon}>:</td>
                  <td className={tdValue}>{value}</td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {/* Empty spacer row before totals */}
        <div className="mb-1"></div>

        {/* Invoice Summary Table */}
        <table className="w-full border-collapse border-2 border-black text-[9px]">
          <thead>
            <tr className="bg-gray-100 font-extrabold text-center border-b-2 border-black">
              <th className="border border-black px-2 py-2">NILAI INVOICE</th>
              <th className="border border-black px-2 py-2">DPP</th>
              <th className="border border-black px-2 py-2">PPN</th>
              <th className="border border-black px-2 py-2">{jenisPphHeader}</th>
              <th className="border border-black px-2 py-2 bg-blue-50">DIBAYAR</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="border border-black px-2 py-4 text-center italic text-gray-400">
                  Belum ada data rincian invoice.
                </td>
              </tr>
            ) : (
              items.map((item, idx) => (
                <tr key={idx} className="text-center border-b border-dashed border-gray-300">
                  <td className="border border-black px-2 py-1.5 font-mono text-right">
                    <span className="text-[8px] mr-1">Rp</span>
                    <span className="font-semibold">{formatRupiah(item.pak_nilai_invoice)}</span>
                  </td>
                  <td className="border border-black px-2 py-1.5 font-mono text-right">
                    <span className="text-[8px] mr-1">Rp</span>
                    {formatRupiah(item.pak_dpp)}
                  </td>
                  <td className="border border-black px-2 py-1.5 font-mono text-right">
                    <span className="text-[8px] mr-1">Rp</span>
                    {item.pak_ppn > 0 ? formatRupiah(item.pak_ppn) : '-'}
                  </td>
                  <td className="border border-black px-2 py-1.5 font-mono text-right">
                    <span className="text-[8px] mr-1">Rp</span>
                    {item.pak_pph23 > 0 ? formatRupiah(item.pak_pph23) : '-'}
                  </td>
                  <td className="border border-black px-2 py-1.5 font-mono font-extrabold text-right bg-blue-50">
                    {formatRupiah(item.pak_dibayar)}
                  </td>
                </tr>
              ))
            )}

            {/* Total row */}
            {items.length > 0 && (
              <tr className="font-extrabold border-t-2 border-black bg-gray-50 text-right">
                <td className="border border-black px-2 py-1.5 font-mono">{formatRupiah(totalNilaiInvoice)}</td>
                <td className="border border-black px-2 py-1.5 font-mono">{formatRupiah(totalDpp)}</td>
                <td className="border border-black px-2 py-1.5 font-mono">{totalPpn > 0 ? formatRupiah(totalPpn) : '-'}</td>
                <td className="border border-black px-2 py-1.5 font-mono">{totalPph23 > 0 ? formatRupiah(totalPph23) : '-'}</td>
                <td className="border border-black px-2 py-1.5 font-mono text-blue-700 bg-blue-100">{formatRupiah(totalDibayar)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
