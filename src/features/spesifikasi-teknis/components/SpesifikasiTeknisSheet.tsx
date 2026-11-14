"use client";

import React from 'react';
import {
  SpesifikasiTeknis,
  DetailSpesifikasiTeknis,
  DetailSpesifikasiJumlah,
  DetailDaftarPelakuUsaha,
} from '../types';
import { MasterDokumen } from '@/features/master-dokumen/types';
import { KerangkaAcuanKerja } from '@/features/kerangka-acuan-kerja/types';
import { Pegawai } from '@/features/pegawai/types';
import { formatRupiah } from '@/lib/terbilang';

interface SpesifikasiTeknisSheetProps {
  spesifikasiTeknis: Partial<SpesifikasiTeknis>;
  detailTeknis: DetailSpesifikasiTeknis[];
  detailJumlah: DetailSpesifikasiJumlah[];
  detailPelakuUsaha: DetailDaftarPelakuUsaha[];
  kak?: KerangkaAcuanKerja | null;
  masterDokumen?: MasterDokumen | null;
  ppkPegawai?: Partial<Pegawai> | null;
  documentDate?: string;
}

const ensureHtml = (val?: string | null): string => {
  if (!val) return '';
  // Check if val already contains html tags
  if (/<(p|br|div|ul|ol|li|b|strong|i|em|u|span|table|h\d|a)[^>]*>/i.test(val)) {
    return val;
  }
  // Convert plain text line breaks to paragraphs or list items
  const lines = val.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return '';

  let inList = false;
  let listType: 'ul' | 'ol' = 'ul';
  const result: string[] = [];

  for (const line of lines) {
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList || listType !== 'ul') {
        if (inList) result.push(`</${listType}>`);
        result.push('<ul>');
        inList = true;
        listType = 'ul';
      }
      result.push(`<li>${line.substring(2)}</li>`);
    } else {
      const numMatch = line.match(/^(\d+)[\.\)]\s*(.*)/);
      if (numMatch) {
        if (!inList || listType !== 'ol') {
          if (inList) result.push(`</${listType}>`);
          result.push('<ol>');
          inList = true;
          listType = 'ol';
        }
        result.push(`<li>${numMatch[2]}</li>`);
      } else {
        if (inList) {
          result.push(`</${listType}>`);
          inList = false;
        }
        result.push(`<p>${line}</p>`);
      }
    }
  }

  if (inList) {
    result.push(`</${listType}>`);
  }

  return result.join('');
};

export const SpesifikasiTeknisSheet: React.FC<SpesifikasiTeknisSheetProps> = ({
  spesifikasiTeknis,
  detailTeknis = [],
  detailJumlah = [],
  detailPelakuUsaha = [],
  kak,
  masterDokumen,
  ppkPegawai,
  documentDate,
}) => {
  const paketPengadaan =
    spesifikasiTeknis.spt_paket_pengadaan ||
    kak?.kak_pekerjaan ||
    masterDokumen?.mdk_pekerjaan ||
    masterDokumen?.mdk_uraian_belanja ||
    'Pengadaan Barang/Jasa';

  const satuanKerja =
    spesifikasiTeknis.spt_satuan_kerja ||
    'Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru';

  const ppkNama =
    spesifikasiTeknis.ppk_nama ||
    ppkPegawai?.pgw_nama ||
    masterDokumen?.mdk_nama_pejabat ||
    'Daniel Perdana, SE';

  const ppkNip =
    spesifikasiTeknis.ppk_nip ||
    ppkPegawai?.pgw_nip ||
    masterDokumen?.mdk_nip_pejabat ||
    '197507242001121006';

  const idRup = spesifikasiTeknis.spd_id_rup || '-';
  const namaBarangType =
    spesifikasiTeknis.spt_nama_barang_type ||
    kak?.kak_pekerjaan ||
    masterDokumen?.mdk_pekerjaan ||
    '-';

  // Checkbox helpers
  const tkdnStr = spesifikasiTeknis.spt_identifikasi_tkdn || 'TKDN,PDN';
  const hasTkdn = tkdnStr.toUpperCase().includes('TKDN');
  const hasPdn = tkdnStr.toUpperCase().includes('PDN');
  const hasImpor = tkdnStr.toUpperCase().includes('IMPOR');

  const prioritasStr = spesifikasiTeknis.spt_prioritas_penggunaan || 'Usaha Kecil';
  const isUsahaKecil = prioritasStr.toLowerCase().includes('usaha kecil') || prioritasStr.toLowerCase() === 'usaha kecil';
  const isUsahaNonKecil = prioritasStr.toLowerCase().includes('usaha non kecil') || prioritasStr.toLowerCase().includes('non');

  // Spesifikasi Jumlah text
  const spesifikasiJumlahText =
    spesifikasiTeknis.spt_spesifikasi_jumlah ||
    '<p>Harga perolehan atas masing-masing uraian barang di atas harus sudah memperhitungkan komponen harga perolehan di bawah ini :</p><ul><li>Ongkos Kirim dan pajak</li></ul>';

  // Spesifikasi Waktu
  const waktuPelaksanaan =
    spesifikasiTeknis.spt_spesifikasi_waktu_pelaksanaan ||
    kak?.kak_jangka_waktu_pelaksanaan ||
    '30 (tiga puluh) Hari Kalender';

  const lokasiKedatangan =
    spesifikasiTeknis.spt_spesifikasi_waktu_lokasi_kedatangan ||
    'Kantor Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru';

  // Spesifikasi Pelayanan
  const spesifikasiPelayanan =
    spesifikasiTeknis.spt_spesifikasi_pelayanan ||
    '<p><strong>Tingkat pelayanan barang/jasa :</strong></p><ol><li><strong>Pengiriman</strong> : Vendor bertanggung jawab atas pengiriman ke lokasi dan harus memastikan bahwa barang sampai dalam kondisi baik.</li><li><strong>Jadwal</strong>: Vendor harus menyediakan jadwal pengadaan yang jelas,termasuk tenggat waktu untuk pengiriman.</li></ol>';

  // Spesifikasi Lokasi
  const spesifikasiLokasi =
    spesifikasiTeknis.spt_spesifikasi_lokasi ||
    '<p>Berdasarkan lokasi pengiriman terdekat dari lokasi tujuan pengiriman.</p>';

  // Rencana Poin Negosiasi
  const rencanaPoinNegosiasi =
    spesifikasiTeknis.spt_rencana_poin_negosiasi_teknis ||
    '<ol><li>Sebagaimana tersebut pada spesifikasi mutu</li><li>Sebagaimana tersebut pada spesifikasi waktu</li><li>Sebagaimana tersebut pada spesifikasi pelayanan</li><li>Sebagaimana tersebut pada spesifikasi lokasi</li></ol>';

  // Pelaku Usaha Lulus & Link Katalog
  const namaPelakuUsahaLulus =
    spesifikasiTeknis.spt_nama_pelaku_usaha ||
    masterDokumen?.mdk_nama_perusahaan ||
    (detailPelakuUsaha.length > 0 ? detailPelakuUsaha[0].dpu_nama_pelaku_usaha_potensial : '-');

  const linkKatalogLulus =
    spesifikasiTeknis.spt_link_katalog ||
    detailPelakuUsaha
      .filter((d) => d.dpu_link_katalog)
      .map((d) => d.dpu_link_katalog)
      .join('\n');

  // Format tanggal tanda tangan
  const getDisplayDate = () => {
    if (documentDate) return documentDate;
    const now = new Date();
    return now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Group detailPelakuUsaha by Item name
  const groupedPelakuUsaha: { [item: string]: DetailDaftarPelakuUsaha[] } = {};
  detailPelakuUsaha.forEach((d) => {
    const key = d.dpu_item || 'Item Lainnya';
    if (!groupedPelakuUsaha[key]) {
      groupedPelakuUsaha[key] = [];
    }
    groupedPelakuUsaha[key].push(d);
  });

  const renderSignature = () => (
    <div className="flex justify-end mt-8 break-inside-avoid">
      <div className="text-left w-72 text-[12px] leading-snug">
        <div>Pekanbaru, {getDisplayDate()}</div>
        <div>Sekretaris Badan</div>
        <div>Pengelola Keuangan dan Aset Daerah</div>
        <div>Kota Pekanbaru</div>
        <div>Selaku Pejabat Pembuat Komitmen</div>
        <div className="h-20"></div>
        <div className="font-bold underline uppercase">{ppkNama}</div>
        <div>NIP. {ppkNip}</div>
      </div>
    </div>
  );

  return (
    <div className="spt-document-root bg-white text-black font-sans text-xs leading-normal mx-auto max-w-4xl p-6 print:p-0 print:max-w-none print:w-full print:bg-white print:text-black">
      <style>{`
        .spt-rich-text ol {
          list-style-type: decimal !important;
          padding-left: 1.35rem !important;
          margin-top: 0.25rem !important;
          margin-bottom: 0.25rem !important;
        }
        .spt-rich-text ul {
          list-style-type: disc !important;
          padding-left: 1.35rem !important;
          margin-top: 0.25rem !important;
          margin-bottom: 0.25rem !important;
        }
        .spt-rich-text li {
          margin-bottom: 0.15rem !important;
        }
        .spt-rich-text p {
          margin-bottom: 0.25rem !important;
        }
        .spt-rich-text a {
          color: #1d4ed8 !important;
          text-decoration: underline !important;
          word-break: break-all !important;
        }
      `}</style>

      {/* ============================================================ */}
      {/* PAGE 1: DOKUMEN SPESIFIKASI TEKNIS PENGADAAN BARANG/JASA     */}
      {/* ============================================================ */}
      <div className="spt-page pb-6 break-after-page min-h-[1050px] flex flex-col justify-between">
        <div>
          {/* Header Title */}
          <div className="text-center font-bold text-sm tracking-wide uppercase mb-6 leading-relaxed">
            DOKUMEN SPESIFIKASI TEKNIS PENGADAAN BARANG/JASA<br />
            MELALUI E-PURCHASING
          </div>

          {/* Meta Table */}
          <table className="w-full border-collapse border border-black mb-4 text-xs">
            <tbody>
              <tr>
                <td className="border border-black px-2 py-1.5 w-40 font-normal">Paket Pengadaan</td>
                <td className="border border-black px-2 py-1.5 font-normal">{paketPengadaan}</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1.5 font-normal">Pemerintah Daerah</td>
                <td className="border border-black px-2 py-1.5 font-normal">Kota Pekanbaru</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1.5 font-normal">Satuan Kerja</td>
                <td className="border border-black px-2 py-1.5 font-normal">{satuanKerja}</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1.5 font-normal">PPK</td>
                <td className="border border-black px-2 py-1.5 font-normal">{ppkNama}</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1.5 font-normal">ID RUP</td>
                <td className="border border-black px-2 py-1.5 font-normal">{idRup}</td>
              </tr>
            </tbody>
          </table>

          {/* Section: SPESIFIKASI TEKNIS Header Bar */}
          <table className="w-full border-collapse border border-black mb-0 text-xs">
            <thead>
              <tr className="bg-gray-200">
                <th colSpan={3} className="border border-black px-2 py-1 text-center font-bold uppercase tracking-wider">
                  SPESIFIKASI TEKNIS
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black px-2 py-1.5 w-40 font-normal">Nama barang /tipe</td>
                <td colSpan={2} className="border border-black px-2 py-1.5 font-normal">{namaBarangType}</td>
              </tr>
            </tbody>
          </table>

          {/* Table: Item Barang/Jasa & Spesifikasi */}
          <table className="w-full border-collapse border border-black mb-4 text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-black px-2 py-1.5 w-12 text-center font-bold">No</th>
                <th className="border border-black px-2 py-1.5 w-64 text-center font-bold">Item Barang/Jasa</th>
                <th className="border border-black px-2 py-1.5 text-center font-bold">Spesifikasi</th>
              </tr>
            </thead>
            <tbody>
              {detailTeknis.length > 0 ? (
                detailTeknis.map((item, idx) => (
                  <tr key={idx} className="align-top">
                    <td className="border border-black px-2 py-2 text-center">{idx + 1}</td>
                    <td className="border border-black px-2 py-2 font-medium">{item.dspt_item_barang_jasa}</td>
                    <td className="border border-black px-2 py-2 whitespace-pre-wrap leading-relaxed">
                      {item.dspt_spesifikasi}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="border border-black px-2 py-4 text-center text-gray-500 italic">
                    Belum ada rincian spesifikasi teknis barang/jasa
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Checkbox: TKDN & PDN */}
          <div className="border border-black p-3 mb-4">
            <div className="font-normal mb-2">Identifikasi dan TKDN dan berlabel PDN : (pilih)</div>
            <div className="flex items-center gap-6 pl-2">
              <label className="flex items-center gap-2 cursor-default">
                <span className="w-6 h-6 border-2 border-black inline-flex items-center justify-center font-bold text-sm">
                  {hasTkdn ? '√' : ''}
                </span>
                <span className="font-semibold text-xs">TKDN</span>
              </label>

              <label className="flex items-center gap-2 cursor-default">
                <span className="w-6 h-6 border-2 border-black inline-flex items-center justify-center font-bold text-sm">
                  {hasPdn ? '√' : ''}
                </span>
                <span className="font-semibold text-xs">PDN</span>
              </label>

              <label className="flex items-center gap-2 cursor-default">
                <span className="w-6 h-6 border-2 border-black inline-flex items-center justify-center font-bold text-sm">
                  {hasImpor ? '√' : ''}
                </span>
                <span className="font-semibold text-xs">IMPOR</span>
              </label>
            </div>
          </div>

          {/* Checkbox: Usaha Kecil & Koperasi */}
          <div className="border border-black p-3 mb-4">
            <div className="font-normal mb-2 leading-relaxed">
              Prioritas Penggunaan Produk dari Penyedia dengan Kualifikasi Usaha Kecil serta Koperasi : (pilih)
            </div>
            <div className="flex items-center gap-8 pl-2">
              <label className="flex items-center gap-2 cursor-default">
                <span className="w-6 h-6 border-2 border-black inline-flex items-center justify-center font-bold text-sm">
                  {isUsahaKecil ? '√' : ''}
                </span>
                <span className="font-semibold text-xs">Usaha Kecil</span>
              </label>

              <label className="flex items-center gap-2 cursor-default">
                <span className="w-6 h-6 border-2 border-black inline-flex items-center justify-center font-bold text-sm">
                  {isUsahaNonKecil ? '√' : ''}
                </span>
                <span className="font-semibold text-xs">Usaha non kecil</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* PAGE 2: SPESIFIKASI JUMLAH, WAKTU, PELAYANAN, LOKASI & TTD  */}
      {/* ============================================================ */}
      <div className="spt-page pt-6 pb-6 break-after-page min-h-[1050px] flex flex-col justify-between">
        <div>
          {/* Header Section */}
          <div className="border border-black p-2 bg-gray-100 text-center font-bold uppercase mb-0 text-xs">
            SPESIFIKASI JUMLAH
          </div>
          <div className="border-x border-b border-black p-1 text-center font-bold text-xs mb-3">
            Daftar Kuantitas
          </div>

          {/* Kuantitas Table */}
          <table className="w-full border-collapse border border-black mb-3 text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-black px-2 py-1.5 w-12 text-center font-bold">No</th>
                <th className="border border-black px-2 py-1.5 text-center font-bold">Item Barang/Jasa</th>
                <th className="border border-black px-2 py-1.5 w-24 text-center font-bold">Jumlah</th>
                <th className="border border-black px-2 py-1.5 w-24 text-center font-bold">Satuan</th>
              </tr>
            </thead>
            <tbody>
              {detailJumlah.length > 0 ? (
                detailJumlah.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border border-black px-2 py-1.5 text-center">{idx + 1}</td>
                    <td className="border border-black px-2 py-1.5">{item.dspj_item_barang_jasa}</td>
                    <td className="border border-black px-2 py-1.5 text-center font-medium">{item.dspj_jumlah}</td>
                    <td className="border border-black px-2 py-1.5 text-center">{item.st_nama || 'Unit'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="border border-black px-2 py-3 text-center text-gray-500 italic">
                    Belum ada daftar kuantitas
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Catatan Komponen Harga Perolehan (Rich Text Styled) */}
          <div
            className="spt-rich-text text-xs leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: ensureHtml(spesifikasiJumlahText) }}
          />

          {/* Spesifikasi Waktu */}
          <div className="border border-black p-2 bg-gray-100 text-center font-bold uppercase mb-0 text-xs">
            SPESIFIKASI WAKTU
          </div>
          <table className="w-full border-collapse border border-black mb-4 text-xs">
            <tbody>
              <tr>
                <td className="border border-black px-2 py-1.5 w-52 font-normal">Waktu pelaksanaan</td>
                <td className="border border-black px-2 py-1.5 font-normal">{waktuPelaksanaan}</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1.5 font-normal">Lokasi kedatangan barang</td>
                <td className="border border-black px-2 py-1.5 font-normal">{lokasiKedatangan}</td>
              </tr>
            </tbody>
          </table>

          {/* Spesifikasi Pelayanan (Rich Text Styled) */}
          <div className="border border-black p-2 bg-gray-100 text-center font-bold uppercase mb-0 text-xs">
            SPESIFIKASI PELAYANAN
          </div>
          <div
            className="spt-rich-text border border-black border-t-0 p-3 mb-4 text-xs leading-relaxed"
            dangerouslySetInnerHTML={{ __html: ensureHtml(spesifikasiPelayanan) }}
          />

          {/* Spesifikasi Lokasi (Rich Text Styled) */}
          <div className="border border-black p-2 bg-gray-100 text-center font-bold uppercase mb-0 text-xs">
            SPESIFIKASI LOKASI
          </div>
          <div
            className="spt-rich-text border border-black border-t-0 p-3 mb-4 text-xs leading-relaxed"
            dangerouslySetInnerHTML={{ __html: ensureHtml(spesifikasiLokasi) }}
          />

          {/* Rencana Poin Negosiasi Teknis (Rich Text Styled) */}
          <div className="mb-4 text-xs">
            <div className="font-bold mb-1">Rencana poin negosiasi teknis:</div>
            <div
              className="spt-rich-text pl-1 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: ensureHtml(rencanaPoinNegosiasi) }}
            />
          </div>
        </div>

        {/* Signature Box */}
        {renderSignature()}
      </div>

      {/* ============================================================ */}
      {/* PAGE 3 & 4: DOKUMEN PENETAPAN PENYEDIA BARANG/JASA           */}
      {/* ============================================================ */}
      <div className="spt-page pt-6 pb-6 break-after-page min-h-[1050px] flex flex-col justify-between">
        <div>
          {/* Header Title */}
          <div className="text-center font-bold text-sm tracking-wide uppercase mb-6 leading-relaxed">
            DOKUMEN PENETAPAN PENYEDIA BARANG/JASA E-PURCHASING
          </div>

          {/* Meta Table */}
          <table className="w-full border-collapse border border-black mb-4 text-xs">
            <tbody>
              <tr>
                <td className="border border-black px-2 py-1.5 w-40 font-normal">Paket Pengadaan</td>
                <td className="border border-black px-2 py-1.5 font-normal">{paketPengadaan}</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1.5 font-normal">Pemerintah Daerah</td>
                <td className="border border-black px-2 py-1.5 font-normal">Kota Pekanbaru</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1.5 font-normal">Satuan Kerja</td>
                <td className="border border-black px-2 py-1.5 font-normal">{satuanKerja}</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1.5 font-normal">PPK</td>
                <td className="border border-black px-2 py-1.5 font-normal">{ppkNama}</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1.5 font-normal">ID RUP</td>
                <td className="border border-black px-2 py-1.5 font-normal">{idRup}</td>
              </tr>
              <tr>
                <td className="border border-black px-2 py-1.5 font-normal">Nama Barang / type</td>
                <td className="border border-black px-2 py-1.5 font-normal">{namaBarangType}</td>
              </tr>
            </tbody>
          </table>

          {/* Section: Daftar Pelaku Usaha Potensial */}
          <div className="mb-2">
            <div className="font-bold text-xs">Daftar pelaku usaha potensial</div>
            <div className="italic text-[11px] text-gray-700">(diisi daftar link katalog yang berpotensi relevan dengan kebutuhan)</div>
          </div>

          {/* Tabel Pelaku Usaha */}
          <table className="w-full border-collapse border border-black mb-4 text-xs">
            <thead>
              <tr className="bg-[#4f81bd] text-white">
                <th className="border border-black px-2 py-2 w-10 text-center font-bold">No</th>
                <th className="border border-black px-2 py-2 w-36 text-center font-bold">Item</th>
                <th className="border border-black px-2 py-2 w-36 text-center font-bold">Nama pelaku usaha potensial</th>
                <th className="border border-black px-2 py-2 text-center font-bold">Link Katalog</th>
                <th className="border border-black px-2 py-2 w-28 text-center font-bold">Harga</th>
                <th className="border border-black px-2 py-2 w-44 text-center font-bold">Evaluasi Berdasarkan Parameter</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(groupedPelakuUsaha).length > 0 ? (
                Object.entries(groupedPelakuUsaha).map(([itemName, vendors], itemIdx) => (
                  <React.Fragment key={itemIdx}>
                    {vendors.map((vendor, vendorIdx) => (
                      <tr key={`${itemIdx}-${vendorIdx}`} className="align-top">
                        {vendorIdx === 0 && (
                          <td
                            rowSpan={vendors.length}
                            className="border border-black px-2 py-2 text-center font-medium bg-white"
                          >
                            {itemIdx + 1}
                          </td>
                        )}
                        {vendorIdx === 0 && (
                          <td
                            rowSpan={vendors.length}
                            className="border border-black px-2 py-2 font-medium bg-white leading-snug"
                          >
                            {itemName}
                          </td>
                        )}
                        <td className="border border-black px-2 py-2 uppercase font-semibold leading-snug">
                          {vendor.dpu_nama_pelaku_usaha_potensial}
                        </td>
                        <td className="border border-black px-2 py-2 leading-relaxed">
                          {vendor.dpu_link_katalog ? (
                            <a
                              href={vendor.dpu_link_katalog.startsWith('http') ? vendor.dpu_link_katalog : `https://${vendor.dpu_link_katalog}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-700 underline break-all block"
                            >
                              {vendor.dpu_link_katalog}
                            </a>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="border border-black px-2 py-2 text-right font-medium whitespace-nowrap">
                          {formatRupiah(vendor.dpu_harga || 0)}
                        </td>
                        <td className="border border-black px-2 py-2 leading-snug whitespace-pre-wrap">
                          {vendor.dpu_evaluasi_berdasarkan_parameter || '-'}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="border border-black px-2 py-4 text-center text-gray-500 italic">
                    Belum ada data pelaku usaha potensial
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* PAGE 5: TABEL REFERENSI PERTIMBANGAN PENYEDIA KATALOG         */}
      {/* ============================================================ */}
      <div className="spt-page pt-6 pb-6 min-h-[1050px] flex flex-col justify-between">
        <div>
          {/* Header Title */}
          <div className="text-center font-bold text-sm tracking-wide uppercase mb-6 leading-relaxed">
            TABEL REFERENSI PERTIMBANGAN PENYEDIA KATALOG ELEKTRONIK<br />
            <span className="text-xs font-normal normal-case">(khusus pelaku usaha yang lulus saja)</span>
          </div>

          {/* Box Table */}
          <div className="border border-black mb-6 text-xs">
            <div className="p-3 border-b border-black">
              <div className="font-bold text-xs mb-2">
                Nama Pelaku Usaha : <span className="uppercase">{namaPelakuUsahaLulus}</span>
              </div>
              <div className="font-bold text-xs mb-1">Link Katalog :</div>
              <div className="pl-4 space-y-1">
                {linkKatalogLulus ? (
                  /<(p|br|div|ul|ol|li|b|strong|i|em|u|span|table|h\d|a)[^>]*>/i.test(linkKatalogLulus) ? (
                    <div
                      className="spt-rich-text leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: linkKatalogLulus }}
                    />
                  ) : (
                    linkKatalogLulus
                      .split('\n')
                      .map((l) => l.trim())
                      .filter(Boolean)
                      .map((link, idx) => (
                        <div key={idx} className="flex items-start gap-1 leading-relaxed">
                          <span className="shrink-0">{idx + 1}.</span>
                          <a
                            href={link.startsWith('http') ? link : `https://${link}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-700 underline break-all"
                          >
                            {link}
                          </a>
                        </div>
                      ))
                  )
                ) : (
                  <div className="text-gray-400 italic">Belum ada link katalog</div>
                )}
              </div>
            </div>

            {/* Pertimbangan Points */}
            <div className="p-4 leading-loose font-normal text-xs">
              <ol className="list-decimal pl-5 space-y-1">
                <li>Memenuhi Spesifikasi Mutu</li>
                <li>Memenuhi TKDN dan Berlabel PDN</li>
                <li>Memenuhi Usaha Kecil / Koperasi</li>
                <li>Memenuhi Spesifikasi Jumlah</li>
                <li>Memenuhi Spesifikasi Waktu</li>
                <li>Memenuhi Spesifikasi Pelayanan</li>
                <li>Memenuhi Spesifikasi Lokasi</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Signature Box */}
        {renderSignature()}
      </div>
    </div>
  );
};
