"use client";

import React, { useEffect, useState, use } from 'react';
import {
  getPermohonanByIdAction,
  getPermohonanByKakIdAction,
} from '@/features/permohonan/actions';
import { PermohonanWithDetails } from '@/features/permohonan/types';
import { formatRupiah, terbilang } from '@/lib/terbilang';
import { KopSuratBpkad } from '@/components/common/KopSuratBpkad';

export default function PermohonanPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const rawId = resolvedParams.id;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PermohonanWithDetails | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!rawId) return;
      setLoading(true);

      if (rawId.startsWith('kak-')) {
        const kakId = Number(rawId.replace('kak-', ''));
        const res = await getPermohonanByKakIdAction(kakId);
        if (res.success && res.data) {
          setData(res.data);
        }
      } else {
        const numId = Number(rawId);
        // Try by pmhId first
        const res = await getPermohonanByIdAction(numId);
        if (res.success && res.data && res.data.permohonan) {
          setData(res.data);
        } else {
          // Fallback try by kakId
          const resKak = await getPermohonanByKakIdAction(numId);
          if (resKak.success && resKak.data) {
            setData(resKak.data);
          }
        }
      }

      setLoading(false);
    }
    loadData();
  }, [rawId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-gray-600">Memuat Dokumen Nota Dinas Permohonan...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.kak) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center text-red-500 font-semibold">
          Dokumen Permohonan atau KAK tidak ditemukan.
        </div>
      </div>
    );
  }

  const { permohonan, kak, masterDokumen, totalBiayaKak, totalHps } = data;

  const tahun = kak?.kak_tahun_anggaran || '2026';
  const defaultPaket = kak?.kak_pekerjaan || kak?.kak_rekening || masterDokumen?.mdk_pekerjaan || masterDokumen?.mdk_uraian_belanja || 'Pengadaan Barang / Jasa';
  const defaultMetode = kak?.kak_metode_pemilihan || 'e-purchasing melalui e katalog v.6';
  const defaultPagu = Number(masterDokumen?.mdk_pagu_anggaran) || totalHps || totalBiayaKak || 0;
  const defaultHps = totalHps || totalBiayaKak || 0;

  // Nilai-nilai dokumen
  const nomorSurat = permohonan?.pmh_nomor || `S.000.3.1/ BPKAD-ND/      / ${tahun}`;
  const sifatSurat = permohonan?.pmh_sifat || 'Segera';
  const lampiranSurat = permohonan?.pmh_lampiran || '3 (tiga)';
  const halSurat = permohonan?.pmh_hal || 'Permintaan Proses Pengadaan Barang/Jasa';

  const tanggalDate = permohonan?.pmh_tanggal
    ? new Date(permohonan.pmh_tanggal)
    : new Date();
  const tanggalSuratIndo = tanggalDate.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const paragraf1 = permohonan?.pmh_paragraf1 ||
    `Memperhatikan DPA Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru Tahun Anggaran ${tahun}, bersama ini Pejabat Pengadaan Barang/Jasa pada Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru diminta untuk melaksanakan paket Pengadaan melalui e-purchasing pada Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru dengan rincian sebagai berikut :`;

  const kodeRup = permohonan?.pmh_kode_rup || '-';
  const namaPaket = permohonan?.pmh_nama_paket || defaultPaket;
  const paguAnggaran = Number(permohonan?.pmh_pagu_anggaran) || defaultPagu;
  const hps = Number(permohonan?.pmh_hps) || defaultHps;
  const metodePemilihan = permohonan?.pmh_metode_pemilihan || defaultMetode;
  const sumberDana = permohonan?.pmh_sumber_dana || `APBD Pemerintah Kota Pekanbaru Tahun Anggaran ${tahun}`;

  const ensureHtmlParagraf = (val: string) => {
    if (!val) return '';
    if (/<[a-z][\s\S]*>/i.test(val)) return val;
    const lines = val.split('\n').map((l) => l.trim()).filter(Boolean);
    const result: string[] = [];
    let inList = false;
    for (const line of lines) {
      const listMatch = line.match(/^\d+[\.\)]\s*(.+)/);
      if (listMatch) {
        if (!inList) {
          result.push('<ol>');
          inList = true;
        }
        result.push(`<li>${listMatch[1]}</li>`);
      } else {
        if (inList) {
          result.push('</ol>');
          inList = false;
        }
        result.push(`<p>${line}</p>`);
      }
    }
    if (inList) result.push('</ol>');
    return result.join('');
  };

  const defaultParagraf1Html =
    '<p>Memperhatikan DPA Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru Tahun Anggaran 2026, bersama ini Pejabat Pengadaan Barang/Jasa pada Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru diminta untuk melaksanakan paket Pengadaan melalui e-purchasing pada Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru dengan rincian sebagai berikut :</p>';

  const paragraf1Html = permohonan?.pmh_paragraf1
    ? ensureHtmlParagraf(permohonan.pmh_paragraf1)
    : defaultParagraf1Html;

  const defaultParagraf2Html =
    '<p>Berkaitan dengan hal tersebut di atas, bersama ini kami lampirkan Dokumen Persiapan Pengadaan (DPP), antara lain:</p><ol><li>KAK</li><li>Spesifikasi Teknis</li></ol><p>Demikian disampaikan untuk diproses lebih lanjut sesuai dengan ketentuan dan peraturan perundang-undangan yang berlaku.</p>';

  const paragraf2Html = permohonan?.pmh_paragraf2
    ? ensureHtmlParagraf(permohonan.pmh_paragraf2)
    : defaultParagraf2Html;

  // Pejabat PPK
  const namaPpk = masterDokumen?.mdk_nama_pejabat || 'DANIEL PERDANA, SE';
  const nipPpk = masterDokumen?.mdk_nip_pejabat || '197507242001121006';
  const jabatanPpk = masterDokumen?.mdk_jabatan_pejabat || 'Plt. Kepala Badan';

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 print:py-0 print:bg-white text-black font-serif">
      {/* Floating Control Bar */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 text-white px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-4 print:hidden">
        <span className="text-xs font-semibold">Cetak Nota Dinas Permohonan</span>
        <div className="h-4 w-px bg-gray-700"></div>
        <button
          onClick={() => window.print()}
          className="px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
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
          }
          .print\\:hidden {
            display: none !important;
          }
          .avoid-break {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          @page {
            size: A4 portrait;
            margin: 15mm 20mm 15mm 20mm;
          }
        }

        .pmh-content ul {
          list-style-type: disc !important;
          margin-left: 1.35rem !important;
          padding-left: 0.2rem !important;
          margin-top: 0.25rem !important;
          margin-bottom: 0.25rem !important;
        }
        .pmh-content ol {
          list-style-type: decimal !important;
          margin-left: 1.35rem !important;
          padding-left: 0.2rem !important;
          margin-top: 0.25rem !important;
          margin-bottom: 0.25rem !important;
        }
        .pmh-content p {
          margin-bottom: 0.45rem !important;
          line-height: 1.6 !important;
        }
        .pmh-content li {
          margin-bottom: 0.2rem !important;
          line-height: 1.55 !important;
        }
      `}</style>

      {/* Lembar Dokumen Nota Dinas */}
      <div className="mx-auto max-w-[210mm] min-h-[297mm] bg-white text-black p-8 sm:p-12 shadow-xl print:shadow-none print:m-0 print:p-0 leading-relaxed text-[13px] flex flex-col justify-between">
        <div className="space-y-4">
          {/* 1. KOP SURAT BPKAD */}
          <KopSuratBpkad />

          {/* 2. JUDUL NOTA DINAS */}
          <div className="text-center pt-2 pb-2">
            <h1 className="font-extrabold text-base tracking-widest uppercase underline">
              NOTA DINAS
            </h1>
          </div>

          {/* 3. METADATA HEADER SURAT */}
          <table className="w-full text-[13px] border-collapse leading-snug">
            <tbody>
              <tr>
                <td className="w-28 py-0.5 align-top">Kepada</td>
                <td className="w-4 py-0.5 align-top text-center">:</td>
                <td className="py-0.5 align-top">
                  Pejabat Pengadaan Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru
                </td>
              </tr>
              <tr>
                <td className="py-0.5 align-top">Dari</td>
                <td className="py-0.5 align-top text-center">:</td>
                <td className="py-0.5 align-top">
                  Pejabat Pembuat Komitmen Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru
                </td>
              </tr>
              <tr>
                <td className="py-0.5 align-top">Tembusan</td>
                <td className="py-0.5 align-top text-center">:</td>
                <td className="py-0.5 align-top">
                  Kepala Bagian Pengadaan Barang dan Jasa Sekretariat Daerah Kota Pekanbaru
                </td>
              </tr>
              <tr>
                <td className="py-0.5 align-top">Tanggal</td>
                <td className="py-0.5 align-top text-center">:</td>
                <td className="py-0.5 align-top">{tanggalSuratIndo}</td>
              </tr>
              <tr>
                <td className="py-0.5 align-top">Nomor</td>
                <td className="py-0.5 align-top text-center">:</td>
                <td className="py-0.5 align-top font-mono">{nomorSurat}</td>
              </tr>
              <tr>
                <td className="py-0.5 align-top">Sifat</td>
                <td className="py-0.5 align-top text-center">:</td>
                <td className="py-0.5 align-top">{sifatSurat}</td>
              </tr>
              <tr>
                <td className="py-0.5 align-top">Lampiran</td>
                <td className="py-0.5 align-top text-center">:</td>
                <td className="py-0.5 align-top">{lampiranSurat}</td>
              </tr>
              <tr>
                <td className="py-0.5 align-top">Hal</td>
                <td className="py-0.5 align-top text-center">:</td>
                <td className="py-0.5 align-top font-semibold">{halSurat}</td>
              </tr>
            </tbody>
          </table>

          {/* 4. PARAGRAF PEMBUKA */}
          <div
            className="pt-2 text-justify leading-relaxed pmh-content"
            dangerouslySetInnerHTML={{ __html: paragraf1Html }}
          />

          {/* 5. TABEL RINCIAN PAKET */}
          <div className="pl-6 py-1">
            <table className="w-full text-[13px] border-collapse leading-snug">
              <tbody>
                <tr>
                  <td className="w-44 py-1 align-top">Kode RUP</td>
                  <td className="w-4 py-1 align-top text-center">:</td>
                  <td className="py-1 align-top font-mono">{kodeRup}</td>
                </tr>
                <tr>
                  <td className="py-1 align-top">Nama Paket</td>
                  <td className="w-4 py-1 align-top text-center">:</td>
                  <td className="py-1 align-top font-semibold">{namaPaket}</td>
                </tr>
                <tr>
                  <td className="py-1 align-top">Pagu Anggaran</td>
                  <td className="w-4 py-1 align-top text-center">:</td>
                  <td className="py-1 align-top">
                    <span>{formatRupiah(paguAnggaran).replace('Rp ', 'Rp. ')},-</span>
                    {paguAnggaran > 0 && (
                      <div className="italic text-[12px] text-gray-800">
                        ({terbilang(paguAnggaran)})
                      </div>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 align-top">HPS</td>
                  <td className="w-4 py-1 align-top text-center">:</td>
                  <td className="py-1 align-top">
                    <span>{formatRupiah(hps).replace('Rp ', 'Rp. ')},-</span>
                    {hps > 0 && (
                      <div className="italic text-[12px] text-gray-800">
                        ({terbilang(hps)})
                      </div>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 align-top">Metode Pemilihan</td>
                  <td className="w-4 py-1 align-top text-center">:</td>
                  <td className="py-1 align-top">{metodePemilihan}</td>
                </tr>
                <tr>
                  <td className="py-1 align-top">Sumber Dana</td>
                  <td className="w-4 py-1 align-top text-center">:</td>
                  <td className="py-1 align-top">{sumberDana}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 6. PARAGRAF PENUTUP & LAMPIRAN */}
          <div
            className="pt-2 text-justify leading-relaxed pmh-content"
            dangerouslySetInnerHTML={{ __html: paragraf2Html }}
          />
        </div>

        {/* 7. TANDA TANGAN PPK */}
        <div className="avoid-break pt-8 flex justify-end">
          <div className="w-80 text-left text-[12px] space-y-1">
            <div>Pekanbaru, {tanggalSuratIndo}</div>
            <div>
              <p className="font-semibold">{jabatanPpk}</p>
              <p className="font-semibold">Pengelola Keuangan dan Aset Daerah</p>
              <p className="font-semibold">Kota Pekanbaru</p>
              <p className="font-semibold">Selaku Pejabat Pembuat Komitmen,</p>
            </div>
            <div className="pt-24">
              <p className="font-bold underline uppercase text-sm">{namaPpk}</p>
              <p className="text-[11px] font-mono mt-0.5">NIP. {nipPpk}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

