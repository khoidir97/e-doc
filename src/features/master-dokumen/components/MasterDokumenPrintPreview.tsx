"use client";

import React, { useState, useEffect } from 'react';
import { MasterDokumen } from '../types';
import { DocumentType, DOCUMENT_OPTIONS } from './MasterDokumenPrintModal';
import { formatRupiah, terbilang } from '@/lib/terbilang';
import { KwitansiOfficialSheet } from '@/features/kwitansi/components/KwitansiOfficialSheet';
import { getKwitansiByMasterDokumenIdAction } from '@/features/kwitansi/actions';
import { getFakturWithDetailsAction } from '@/features/faktur/actions';
import { FakturHeader, Faktur } from '@/features/faktur/types';

function formatDateID(val?: string | Date | null): string {
  if (!val) return '-';
  const d = new Date(val as string);
  if (isNaN(d.getTime())) return String(val);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

interface MasterDokumenPrintPreviewProps {
  masterDokumen: MasterDokumen;
  initialDocType: DocumentType;
  onClose: () => void;
}

export const MasterDokumenPrintPreview: React.FC<MasterDokumenPrintPreviewProps> = ({
  masterDokumen,
  initialDocType,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<DocumentType>(initialDocType);
  const [noBukuKas, setNoBukuKas] = useState<string>('');
  const [uangSejumlah, setUangSejumlah] = useState<string>('');
  const [tanggalLunasDibayar, setTanggalLunasDibayar] = useState<string>('');
  const [tanggalTerimaUang, setTanggalTerimaUang] = useState<string>('');
  const [fakturHeader, setFakturHeader] = useState<FakturHeader | null>(null);
  const [fakturItems, setFakturItems] = useState<Faktur[]>([]);

  useEffect(() => {
    async function loadFaktur() {
      if (masterDokumen?.mdk_id) {
        const res = await getFakturWithDetailsAction(masterDokumen.mdk_id);
        if (res.success && res.data) {
          setFakturHeader(res.data.header);
          setFakturItems(res.data.details);
        }
      }
    }
    loadFaktur();
  }, [masterDokumen]);

  useEffect(() => {
    async function loadKwitansi() {
      if (masterDokumen?.mdk_id) {
        const res = await getKwitansiByMasterDokumenIdAction(masterDokumen.mdk_id);
        if (res.success && res.data) {
          const { kwitansi, pak_dibayar, nego_jumlah } = res.data;
          if (kwitansi) {
            setNoBukuKas(kwitansi.kwt_buku_kas_umum_no || '');
            if (kwitansi.kwt_tanggal_lunas_dibayar) {
              setTanggalLunasDibayar(String(kwitansi.kwt_tanggal_lunas_dibayar));
            }
            if (kwitansi.kwt_tanggal_terima_uang) {
              setTanggalTerimaUang(String(kwitansi.kwt_tanggal_terima_uang));
            }
            if (kwitansi.kwt_uang_sejumlah && Number(kwitansi.kwt_uang_sejumlah) > 0) {
              setUangSejumlah(kwitansi.kwt_uang_sejumlah.toString());
            } else if (nego_jumlah && nego_jumlah > 0) {
              setUangSejumlah(nego_jumlah.toString());
            } else if (pak_dibayar && pak_dibayar > 0) {
              setUangSejumlah(pak_dibayar.toString());
            } else {
              setUangSejumlah(masterDokumen.mdk_pagu_anggaran ? masterDokumen.mdk_pagu_anggaran.toString() : '');
            }
          } else if (nego_jumlah && nego_jumlah > 0) {
            setUangSejumlah(nego_jumlah.toString());
          } else if (pak_dibayar && pak_dibayar > 0) {
            setUangSejumlah(pak_dibayar.toString());
          } else {
            setUangSejumlah(masterDokumen.mdk_pagu_anggaran ? masterDokumen.mdk_pagu_anggaran.toString() : '');
          }
        }
      }
    }
    loadKwitansi();
  }, [masterDokumen]);

  const handlePrint = () => {
    window.print();
  };

  const paguNominal = Number(masterDokumen.mdk_pagu_anggaran) || 0;
  const nominalTerbilang = terbilang(paguNominal);

  // Helper render Kop Surat
  const renderKopSurat = () => (
    <div className="border-b-4 border-double border-black pb-3 mb-4 text-center">
      <div className="font-bold text-base tracking-wide uppercase">PEMERINTAH KOTA PEKANBARU</div>
      <div className="font-extrabold text-lg uppercase">BADAN PENGELOLA KEUANGAN DAN ASET DAERAH</div>
      <div className="text-xs italic text-gray-700 dark:text-gray-300 mt-0.5">
        Jl. Abdul Muis No. 1 Pekanbaru - Riau | Telp: (0761) 30001
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400">
        Website: bpkad.pekanbaru.go.id | Email: bpkad@pekanbaru.go.id
      </div>
    </div>
  );

  // Helper render Tanda Tangan Pejabat
  const renderSignatures = (types: ('pa' | 'pptk' | 'pengadaan' | 'bendahara' | 'perusahaan')[]) => (
    <div className="mt-8 pt-4 grid grid-cols-2 gap-8 text-xs break-inside-avoid">
      {types.includes('pa') && (
        <div className="text-center space-y-12">
          <div>
            <p className="font-semibold">Pengguna Anggaran / KPA</p>
            <p className="text-[11px] text-gray-600 dark:text-gray-400">{masterDokumen.mdk_bagian || 'BPKAD Kota Pekanbaru'}</p>
          </div>
          <div>
            <p className="font-bold underline uppercase">{masterDokumen.mdk_nama_pejabat || 'DANIEL PERDANA, S.E'}</p>
            <p className="text-[11px]">NIP. {masterDokumen.mdk_nip_pejabat_pengadaan || '197507242001121006'}</p>
          </div>
        </div>
      )}

      {types.includes('pptk') && (
        <div className="text-center space-y-12">
          <div>
            <p className="font-semibold">Pejabat Pelaksana Teknis Kegiatan</p>
            <p className="text-[11px] text-gray-600 dark:text-gray-400">(PPTK)</p>
          </div>
          <div>
            <p className="font-bold underline uppercase">{masterDokumen.mdk_nama_pptk || 'MIRZA WALAD, S.E., M.Ak'}</p>
            <p className="text-[11px]">NIP. {masterDokumen.mdk_nip_pejabat_pengadaan || '198208012015031001'}</p>
          </div>
        </div>
      )}

      {types.includes('pengadaan') && (
        <div className="text-center space-y-12">
          <div>
            <p className="font-semibold">Pejabat Pengadaan</p>
            <p className="text-[11px] text-gray-600 dark:text-gray-400">BPKAD Kota Pekanbaru</p>
          </div>
          <div>
            <p className="font-bold underline uppercase">{masterDokumen.mdk_nama_pejabat_pengadaan || 'RIO MARK H.'}</p>
            <p className="text-[11px]">NIP. {masterDokumen.mdk_nip_pejabat_pengadaan || '1975003242006041008'}</p>
          </div>
        </div>
      )}

      {types.includes('perusahaan') && (
        <div className="text-center space-y-12">
          <div>
            <p className="font-semibold">Penyedia / Perusahaan</p>
            <p className="font-bold text-[11px]">{masterDokumen.mdk_nama_perusahaan || 'PT. SIBAAYAK RIAU WISATA'}</p>
          </div>
          <div>
            <p className="font-bold underline uppercase">{masterDokumen.mdk_nama_pimpinan_perusahaan || 'ELIAKIM SITEPU, SP'}</p>
            <p className="text-[11px]">Direktur</p>
          </div>
        </div>
      )}

      {types.includes('bendahara') && (
        <div className="text-center space-y-12">
          <div>
            <p className="font-semibold">Bendahara Pengeluaran</p>
            <p className="text-[11px] text-gray-600 dark:text-gray-400">BPKAD Kota Pekanbaru</p>
          </div>
          <div>
            <p className="font-bold underline uppercase">{masterDokumen.mdk_nama_bendahara || 'GIRI GUTRIANSYAH, A.Md.Kom'}</p>
            <p className="text-[11px]">NIP. 200111012025041002</p>
          </div>
        </div>
      )}
    </div>
  );

  // Individual Sheet Templates
  const renderDocumentContent = (docType: DocumentType) => {
    switch (docType) {
      case 'survey':
        return (
          <div className="space-y-4">
            {renderKopSurat()}
            <div className="text-center mb-4">
              <h2 className="font-bold text-sm underline uppercase">SURAT USULAN & SURVEY HARGA PASAR</h2>
              <p className="text-xs font-mono">Nomor DPA: {masterDokumen.mdk_no_dpa || '-'}</p>
            </div>
            <table className="w-full text-xs border-collapse border border-black">
              <tbody>
                <tr className="border-b border-black">
                  <td className="p-2 font-semibold w-1/3 bg-gray-100 border-r border-black">Bagian / SKPD</td>
                  <td className="p-2">{masterDokumen.mdk_bagian || '-'}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-semibold bg-gray-100 border-r border-black">Program</td>
                  <td className="p-2">[{masterDokumen.mdk_kode_program || '-'}] {masterDokumen.mdk_program || '-'}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-semibold bg-gray-100 border-r border-black">Kegiatan</td>
                  <td className="p-2">[{masterDokumen.mdk_kode_kegiatan || '-'}] {masterDokumen.mdk_kegiatan || '-'}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-semibold bg-gray-100 border-r border-black">Sub Kegiatan</td>
                  <td className="p-2">[{masterDokumen.mdk_kode_sub_kegiatan || '-'}] {masterDokumen.mdk_sub_kegiatan || '-'}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-semibold bg-gray-100 border-r border-black">Uraian Pekerjaan / Belanja</td>
                  <td className="p-2 font-bold">{masterDokumen.mdk_uraian_belanja || '-'}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-semibold bg-gray-100 border-r border-black">Rekening Belanja</td>
                  <td className="p-2 font-mono">{masterDokumen.mdk_rekening_belanja || '-'}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-semibold bg-gray-100 border-r border-black">Perusahaan Penyedia Usulan</td>
                  <td className="p-2">{masterDokumen.mdk_nama_perusahaan || '-'} ({masterDokumen.mdk_nama_pimpinan_perusahaan || '-'})</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-semibold bg-gray-100 border-r border-black">Estimasi Pagu Anggaran</td>
                  <td className="p-2 font-bold text-sm">{formatRupiah(paguNominal)}</td>
                </tr>
              </tbody>
            </table>
            {renderSignatures(['pptk', 'pengadaan'])}
          </div>
        );

      case 'rab':
        return (
          <div className="space-y-4">
            {renderKopSurat()}
            <div className="text-center mb-4">
              <h2 className="font-bold text-sm underline uppercase">RENCANA ANGGARAN BIAYA (RAB)</h2>
              <p className="text-xs font-mono">Tahun Anggaran: {masterDokumen.mdk_apbd || '2026'}</p>
            </div>
            <div className="text-xs space-y-1 mb-2">
              <p><strong>Pekerjaan:</strong> {masterDokumen.mdk_uraian_belanja || '-'}</p>
              <p><strong>Program / Sub Kegiatan:</strong> {masterDokumen.mdk_sub_kegiatan || '-'}</p>
              <p><strong>Lokasi:</strong> BPKAD Kota Pekanbaru</p>
            </div>
            <table className="w-full text-xs border-collapse border border-black text-center">
              <thead>
                <tr className="bg-gray-100 font-bold border-b border-black">
                  <th className="border-r border-black p-2 w-10">No</th>
                  <th className="border-r border-black p-2 text-left">Uraian Komponen / Spesifikasi</th>
                  <th className="border-r border-black p-2 w-20">Volume</th>
                  <th className="border-r border-black p-2 w-28">Harga Satuan</th>
                  <th className="p-2 w-32">Total Harga</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-black">
                  <td className="border-r border-black p-2">1</td>
                  <td className="border-r border-black p-2 text-left font-semibold">
                    {masterDokumen.mdk_uraian_belanja || 'Pengadaan / Sewa Barang & Jasa'}
                  </td>
                  <td className="border-r border-black p-2">1 Paket</td>
                  <td className="border-r border-black p-2 font-mono">{formatRupiah(paguNominal)}</td>
                  <td className="p-2 font-mono font-bold">{formatRupiah(paguNominal)}</td>
                </tr>
                <tr className="font-bold bg-gray-50 border-t-2 border-black">
                  <td colSpan={4} className="border-r border-black p-2 text-right">TOTAL ANGGARAN BIAYA</td>
                  <td className="p-2 font-mono text-sm">{formatRupiah(paguNominal)}</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs italic font-semibold">Terbilang: {nominalTerbilang}</p>
            {renderSignatures(['pptk', 'pa'])}
          </div>
        );

      case 'hps':
        return (
          <div className="space-y-4">
            {renderKopSurat()}
            <div className="text-center mb-4">
              <h2 className="font-bold text-sm underline uppercase">HARGA PERKIRAAN SENDIRI (HPS)</h2>
              <p className="text-xs font-mono">No. DPA: {masterDokumen.mdk_no_dpa || '-'}</p>
            </div>
            <table className="w-full text-xs border-collapse border border-black">
              <tbody>
                <tr className="border-b border-black">
                  <td className="p-2 font-semibold w-1/3 bg-gray-100 border-r border-black">Nama Paket Pekerjaan</td>
                  <td className="p-2 font-bold">{masterDokumen.mdk_uraian_belanja || '-'}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-semibold bg-gray-100 border-r border-black">Kode Rekening Belanja</td>
                  <td className="p-2 font-mono">{masterDokumen.mdk_rekening_belanja || '-'}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-semibold bg-gray-100 border-r border-black">Nilai HPS Disahkan</td>
                  <td className="p-2 font-bold text-sm">{formatRupiah(paguNominal)}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-semibold bg-gray-100 border-r border-black">Terbilang HPS</td>
                  <td className="p-2 italic font-semibold">{nominalTerbilang}</td>
                </tr>
              </tbody>
            </table>
            {renderSignatures(['pengadaan', 'pa'])}
          </div>
        );

      case 'penawaran':
        return (
          <div className="space-y-4">
            <div className="border-b-2 border-black pb-2 text-center">
              <h2 className="font-bold text-base uppercase">{masterDokumen.mdk_nama_perusahaan || 'PT. SIBAAYAK RIAU WISATA'}</h2>
              <p className="text-xs">{masterDokumen.mdk_alamat || 'Jl. Tembusu Pekanbaru'}</p>
            </div>
            <div className="text-center my-3">
              <h3 className="font-bold text-sm underline uppercase">SURAT PENAWARAN HARGA</h3>
              <p className="text-xs">Nomor: 045/SPH/{new Date().getFullYear()}</p>
            </div>
            <div className="text-xs space-y-2">
              <p>Kepada Yth.</p>
              <p className="font-semibold">Pejabat Pengadaan BPKAD Kota Pekanbaru</p>
              <p>Di tempat</p>
              <p className="mt-3">Dengan hormat, sehubungan dengan pengadaan pekerjaan <strong>{masterDokumen.mdk_uraian_belanja || '-'}</strong>, kami mengajukan penawaran harga sebagai berikut:</p>
            </div>
            <table className="w-full text-xs border-collapse border border-black text-center my-2">
              <thead>
                <tr className="bg-gray-100 font-bold border-b border-black">
                  <th className="border-r border-black p-2">No</th>
                  <th className="border-r border-black p-2 text-left">Nama Pekerjaan</th>
                  <th className="border-r border-black p-2">Volume</th>
                  <th className="p-2">Harga Penawaran (Rp)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-black">
                  <td className="border-r border-black p-2">1</td>
                  <td className="border-r border-black p-2 text-left font-semibold">{masterDokumen.mdk_uraian_belanja}</td>
                  <td className="border-r border-black p-2">1 Paket</td>
                  <td className="p-2 font-mono font-bold">{formatRupiah(paguNominal)}</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs italic">Terbilang: {nominalTerbilang}</p>
            {renderSignatures(['perusahaan'])}
          </div>
        );

      case 'nego':
        return (
          <div className="space-y-4">
            {renderKopSurat()}
            <div className="text-center mb-4">
              <h2 className="font-bold text-sm underline uppercase">BERITA ACARA NEGOSIASI HARGA</h2>
              <p className="text-xs font-mono">Nomor: BA.NEGO/BPKAD/{new Date().getFullYear()}</p>
            </div>
            <p className="text-xs leading-relaxed">
              Pada hari ini, kami yang bertanda tangan di bawah ini telah melakukan klarifikasi dan negosiasi teknis serta harga untuk paket pekerjaan: <strong>{masterDokumen.mdk_uraian_belanja}</strong>.
            </p>
            <table className="w-full text-xs border-collapse border border-black my-3">
              <tbody>
                <tr className="border-b border-black">
                  <td className="p-2 font-semibold w-1/3 bg-gray-100 border-r border-black">Harga Penawaran Awal</td>
                  <td className="p-2 font-mono">{formatRupiah(paguNominal)}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-semibold bg-gray-100 border-r border-black">Hasil Negosiasi Final</td>
                  <td className="p-2 font-mono font-bold text-sm">{formatRupiah(paguNominal)}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-semibold bg-gray-100 border-r border-black">Terbilang Hasil Nego</td>
                  <td className="p-2 italic font-semibold">{nominalTerbilang}</td>
                </tr>
              </tbody>
            </table>
            {renderSignatures(['perusahaan', 'pengadaan'])}
          </div>
        );

      case 'perhitungan':
        return (
          <div className="space-y-4">
            {renderKopSurat()}
            <div className="text-center mb-4">
              <h2 className="font-bold text-sm underline uppercase">PERHITUNGAN PAKET PEKERJAAN</h2>
              <p className="text-xs font-mono">Kode Sub Kegiatan: {masterDokumen.mdk_kode_sub_kegiatan || '-'}</p>
            </div>
            <table className="w-full text-xs border-collapse border border-black">
              <tbody>
                <tr className="border-b border-black">
                  <td className="p-2 font-semibold w-1/3 bg-gray-100 border-r border-black">Program</td>
                  <td className="p-2">{masterDokumen.mdk_program}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-semibold bg-gray-100 border-r border-black">Kegiatan</td>
                  <td className="p-2">{masterDokumen.mdk_kegiatan}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-semibold bg-gray-100 border-r border-black">Sub Kegiatan</td>
                  <td className="p-2">{masterDokumen.mdk_sub_kegiatan}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-semibold bg-gray-100 border-r border-black">Total Hasil Perhitungan</td>
                  <td className="p-2 font-mono font-bold">{formatRupiah(paguNominal)}</td>
                </tr>
              </tbody>
            </table>
            {renderSignatures(['pptk', 'pa'])}
          </div>
        );

      case 'kuitansi':
        return (
          <KwitansiOfficialSheet
            masterDokumen={masterDokumen}
            noBukuKas={noBukuKas}
            uangSejumlah={uangSejumlah ? Number(uangSejumlah) : undefined}
            tanggalLunasDibayar={tanggalLunasDibayar}
            tanggalTerimaUang={tanggalTerimaUang}
            isEditable={false}
          />
        );

      case 'faktur':
        const totalHargaFaktur = fakturItems.reduce((acc, curr) => acc + (Number(curr.fkt_total) || 0), 0);
        const nomorFaktur = fakturHeader?.fak_nomor_faktur || '/SEKRETARIS-027.1/VI/2026';
        const tglFakturFormatted = fakturHeader?.fak_tanggal_faktur ? formatDateID(fakturHeader.fak_tanggal_faktur) : formatDateID(new Date());

        return (
          <div className="space-y-4 text-[11px] leading-tight">
            {/* Title & Document Number */}
            <div className="text-center mb-4">
              <h2 className="font-bold text-sm uppercase tracking-wider border-b-2 border-black inline-block pb-0.5">
                FAKTUR PESANAN
              </h2>
              <div className="text-[11px] font-semibold mt-1">
                NO : &nbsp; {nomorFaktur}
              </div>
            </div>

            {/* Header Metadata Info */}
            <div className="mb-4 text-[11px]">
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
                    <td className="align-top py-0.5">{tglFakturFormatted}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Item Details Table */}
            <table className="w-full border-collapse border border-black text-[11px] mb-4">
              <thead>
                <tr className="bg-gray-100 text-center font-bold">
                  <th rowSpan={2} className="border border-black p-1 w-[35px]">No.</th>
                  <th rowSpan={2} className="border border-black p-1 text-center">Jenis dan Spesifikasi Barang</th>
                  <th colSpan={2} className="border border-black p-1">Volume</th>
                  <th colSpan={2} className="border border-black p-1">Harga (Rp) + PPN</th>
                </tr>
                <tr className="bg-gray-100 text-center font-bold">
                  <th className="border border-black p-1 w-[50px]">Unit</th>
                  <th className="border border-black p-1 w-[50px]">Hari</th>
                  <th className="border border-black p-1 w-[100px]">Harga Satuan</th>
                  <th className="border border-black p-1 w-[110px]">Total</th>
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
                {fakturItems.length > 0 ? (
                  fakturItems.map((item, idx) => (
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
                  <tr className="align-top">
                    <td className="border border-black p-1.5 text-center">1</td>
                    <td className="border border-black p-1.5">{masterDokumen.mdk_uraian_belanja}</td>
                    <td className="border border-black p-1.5 text-center">1</td>
                    <td className="border border-black p-1.5 text-center">1</td>
                    <td className="border border-black p-1.5 text-right font-mono">{formatRupiah(paguNominal)}</td>
                    <td className="border border-black p-1.5 text-right font-mono font-bold">{formatRupiah(paguNominal)}</td>
                  </tr>
                )}

                {/* Subtotal PPN */}
                <tr>
                  <td colSpan={4} className="border border-black p-1 font-bold text-right">PPN</td>
                  <td colSpan={2} className="border border-black p-1 text-right font-mono">
                    Rp -
                  </td>
                </tr>
                {/* Grand Total */}
                <tr className="font-bold">
                  <td colSpan={4} className="border border-black p-1 text-center uppercase tracking-wider">TOTAL</td>
                  <td colSpan={2} className="border border-black p-1 text-right font-mono text-[11px]">
                    {formatRupiah(fakturItems.length > 0 ? totalHargaFaktur : paguNominal)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-6 text-[11px] mt-6">
              <div className="text-center space-y-1">
                <div>Penyedia,</div>
                <div className="font-bold uppercase">{masterDokumen.mdk_nama_perusahaan || 'PT / CV ...'}</div>
                <div className="h-16"></div>
                <div className="font-bold underline uppercase">{masterDokumen.mdk_nama_pimpinan_perusahaan || '................................'}</div>
                <div>Direktur</div>
              </div>
              <div className="text-center space-y-1">
                <div>Pekanbaru, {tglFakturFormatted}</div>
                <div>Pemesan,</div>
                <div className="font-bold">Pejabat Pelaksana Teknis Kegiatan</div>
                <div className="h-16"></div>
                <div className="font-bold underline uppercase">{masterDokumen.mdk_nama_pptk || '................................'}</div>
                <div>{masterDokumen.mdk_nip_pptk ? `NIP. ${masterDokumen.mdk_nip_pptk}` : 'NIP. ................................'}</div>
              </div>
            </div>
          </div>
        );

      case 'npd':
        return (
          <div className="space-y-4">
            {renderKopSurat()}
            <div className="text-center mb-4">
              <h2 className="font-bold text-sm underline uppercase">NOTA PERMINTAAN DANA (NPD)</h2>
              <p className="text-xs font-mono">No. DPA: {masterDokumen.mdk_no_dpa || '-'}</p>
            </div>
            <table className="w-full text-xs border-collapse border border-black">
              <tbody>
                <tr className="border-b border-black">
                  <td className="p-2 font-semibold w-1/3 bg-gray-100 border-r border-black">Bagian / PPTK</td>
                  <td className="p-2">{masterDokumen.mdk_bagian} / {masterDokumen.mdk_nama_pptk}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-semibold bg-gray-100 border-r border-black">Jumlah Uang Yang Diminta</td>
                  <td className="p-2 font-mono font-bold text-sm">{formatRupiah(paguNominal)}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2 font-semibold bg-gray-100 border-r border-black">Terbilang Uang</td>
                  <td className="p-2 italic font-semibold">{nominalTerbilang}</td>
                </tr>
              </tbody>
            </table>
            {renderSignatures(['pptk', 'pa'])}
          </div>
        );

      case 'all':
        return (
          <div className="space-y-12">
            {DOCUMENT_OPTIONS.filter((d) => d.id !== 'all').map((d, index) => (
              <div key={d.id} className={index > 0 ? 'page-break-before pt-8 border-t-2 border-dashed border-gray-300' : ''}>
                {renderDocumentContent(d.id)}
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/80 backdrop-blur-sm overflow-y-auto flex flex-col items-center p-2 sm:p-6">
      {/* Top Floating Control Bar (Hidden on print) */}
      <div className="print:hidden w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 mb-4 flex flex-wrap items-center justify-between gap-3 border border-gray-200 dark:border-gray-700 sticky top-2 z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Kembali"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Pratinjau Cetak Dokumen</h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-xs sm:max-w-md">
              {masterDokumen.mdk_uraian_belanja}
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 scrollbar-none">
          {DOCUMENT_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setActiveTab(opt.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${activeTab === opt.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
            >
              {opt.icon} {opt.label}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Cetak Sekarang
          </button>
          <button
            onClick={onClose}
            className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>

      {/* Printable Sheet Canvas */}
      <div className="w-full max-w-4xl bg-white text-black p-8 sm:p-12 shadow-2xl rounded-xl border border-gray-300 font-sans print:shadow-none print:border-none print:w-full print:max-w-none print:p-0 print:m-0">
        {renderDocumentContent(activeTab)}
      </div>

      <style jsx global>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .page-break-before {
            page-break-before: always;
          }
        }
      `}</style>
    </div>
  );
};
