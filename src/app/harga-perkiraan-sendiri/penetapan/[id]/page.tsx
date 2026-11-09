"use client";

import React, { useEffect, useState, use } from 'react';
import { getHargaPerkiraanSendiriWithDetailsAction } from '@/features/harga-perkiraan-sendiri/actions';
import { HargaPerkiraanSendiri } from '@/features/harga-perkiraan-sendiri/types';
import { MasterDokumen } from '@/features/master-dokumen/types';
import { formatRupiah } from '@/lib/terbilang';
import { KopSuratBpkad } from '@/components/common/KopSuratBpkad';

export default function PenetapanHpsPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const mdkId = Number(resolvedParams.id);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    items: HargaPerkiraanSendiri[];
    masterDokumen: MasterDokumen | null;
  } | null>(null);

  // Editable fields for printing
  const currentYear = new Date().getFullYear();
  const [nomorSurat, setNomorSurat] = useState('');
  const [kodeKlasifikasi, setKodeKlasifikasi] = useState(`SEKRETARIAT-027.2/ X/ ${currentYear}`);
  const [lokasiPekerjaan, setLokasiPekerjaan] = useState('BPKAD Kota Pekanbaru');
  const [namaBulanTahun, setNamaBulanTahun] = useState(() => {
    const d = new Date();
    return d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  });
  const [tanggalSurat, setTanggalSurat] = useState('');

  useEffect(() => {
    async function loadData() {
      if (!mdkId) return;
      setLoading(true);
      const res = await getHargaPerkiraanSendiriWithDetailsAction(mdkId);
      if (res.success && res.data) {
        setData(res.data);
        if (res.data.masterDokumen?.mdk_apbd) {
          const matchYear = res.data.masterDokumen.mdk_apbd.match(/\b(20\d\d)\b/);
          if (matchYear) {
            setKodeKlasifikasi(`SEKRETARIAT-027.2/ X/ ${matchYear[1]}`);
          }
        }
      }
      setLoading(false);
    }
    loadData();
  }, [mdkId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-gray-600">Memuat Dokumen Penetapan HPS...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.masterDokumen) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center text-red-500 font-semibold">
          Dokumen tidak ditemukan atau gagal dimuat.
        </div>
      </div>
    );
  }

  const { items, masterDokumen } = data;

  // Total HPS
  const totalBarang = items.reduce((sum, item) => sum + (Number(item.hps_harga_perkiraan_sendiri) || 0), 0);
  const ppn = Math.round(totalBarang * 0.11);
  const totalHps = totalBarang + ppn;

  // Nama jabatan PPK / KPA
  const isPA = masterDokumen.mdk_jabatan_pejabat?.trim().toUpperCase() === 'PA';
  const labelKpaPpk = isPA ? 'Pengguna Anggaran (PA)' : 'Kuasa Pengguna Anggaran (KPA)';

  // Sumber dana APBD
  const apbdTahun = masterDokumen.mdk_apbd || `APBD Kota Pekanbaru Tahun Anggaran ${currentYear}`;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 print:py-0 print:bg-white text-black">
      {/* Floating Control Bar */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 dark:bg-gray-800/90 text-white px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-4 print:hidden">
        <span className="text-xs font-semibold">Cetak Penetapan & Lampiran HPS</span>
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
          }
          .print\\:hidden {
            display: none !important;
          }
          .page-break {
            page-break-before: always;
            break-before: page;
          }
          @page {
            size: A4 portrait;
            margin: 12mm 15mm 15mm 15mm;
          }
        }
      `}</style>

      {/* ======================================================== */}
      {/* HALAMAN 1: SURAT PENETAPAN HARGA PERKIRAAN SENDIRI (HPS) */}
      {/* ======================================================== */}
      <div className="mx-auto max-w-[210mm] bg-white text-black p-8 sm:p-12 shadow-xl print:shadow-none print:m-0 print:p-0 font-serif leading-relaxed text-[12px]">
        {/* Kop Surat BPKAD */}
        <KopSuratBpkad />

        {/* Judul Surat */}
        <div className="text-center my-4">
          <h2 className="font-extrabold text-sm sm:text-base underline tracking-wider uppercase">
            PENETAPAN HARGA PERKIRAAN SENDIRI (HPS)
          </h2>
          <div className="text-xs mt-1 flex items-center justify-center gap-1">
            <span>Nomor :</span>
            <input
              type="text"
              value={nomorSurat}
              onChange={(e) => setNomorSurat(e.target.value)}
              placeholder="..."
              className="w-16 border-b border-gray-400 text-center font-mono focus:outline-none print:border-none print:w-auto"
            />
            <span>/</span>
            <input
              type="text"
              value={kodeKlasifikasi}
              onChange={(e) => setKodeKlasifikasi(e.target.value)}
              className="border-b border-gray-400 font-mono text-center focus:outline-none print:border-none print:w-auto"
            />
          </div>
        </div>

        {/* Paragraf Pembuka */}
        <p className="text-justify leading-relaxed mb-3">
          Sehubungan dengan pelaksanaan {masterDokumen.mdk_uraian_belanja || 'Belanja Modal Peralatan Jaringan Kantor'} Pada Badan Pengelola Keuangan dan Aset Daerah (BPKAD) Kota Pekanbaru, dalam rangka pelaksanaan {apbdTahun}, maka perlu ditetapkan Harga Perkiraan Sendiri (HPS) bagi proses pelaksanaan :
        </p>

        {/* Detail Pelaksanaan */}
        <div className="mb-4 pl-2">
          <table className="w-full text-[12px] border-collapse">
            <tbody>
              <tr>
                <td className="w-40 py-1 align-top font-normal">Nama Kegiatan</td>
                <td className="w-4 py-1 align-top text-center">:</td>
                <td className="py-1 align-top font-normal">{masterDokumen.mdk_kegiatan || '-'}</td>
              </tr>
              <tr>
                <td className="py-1 align-top font-normal">Nama Sub Kegiatan</td>
                <td className="py-1 align-top text-center">:</td>
                <td className="py-1 align-top font-normal">{masterDokumen.mdk_sub_kegiatan || '-'}</td>
              </tr>
              <tr>
                <td className="py-1 align-top font-normal">Nama Pekerjaan</td>
                <td className="py-1 align-top text-center">:</td>
                <td className="py-1 align-top font-normal">{masterDokumen.mdk_pekerjaan || masterDokumen.mdk_uraian_belanja || '-'}</td>
              </tr>
              <tr>
                <td className="py-1 align-top font-normal">Lokasi Pekerjaan</td>
                <td className="py-1 align-top text-center">:</td>
                <td className="py-1 align-top font-normal">
                  <input
                    type="text"
                    value={lokasiPekerjaan}
                    onChange={(e) => setLokasiPekerjaan(e.target.value)}
                    className="w-full border-b border-gray-300 focus:outline-none print:border-none print:p-0"
                  />
                </td>
              </tr>
              <tr>
                <td className="py-1 align-top font-normal">Pagu Anggaran</td>
                <td className="py-1 align-top text-center">:</td>
                <td className="py-1 align-top font-bold">{formatRupiah(masterDokumen.mdk_pagu_anggaran)}</td>
              </tr>
              <tr>
                <td className="py-1 align-top font-normal">HPS</td>
                <td className="py-1 align-top text-center">:</td>
                <td className="py-1 align-top font-bold">{formatRupiah(totalHps)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Paragraf Penjelasan */}
        <p className="text-justify leading-relaxed mb-3">
          Adapun Rincian HPS Pekerjaan tersebut terlampir sebagaimana pada lampiran Harga Perkiraan Sendiri (HPS) ini.
        </p>

        <p className="text-justify leading-relaxed mb-3">
          Dengan diterbitkannya surat penetapan Harga Perkiraan Sendiri (HPS) ini, maka {masterDokumen.mdk_nama_pejabat_pengadaan ? `Pejabat Pengadaan ${masterDokumen.mdk_nama_pejabat_pengadaan}` : 'Pejabat Pengadaan Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru'} yang ditunjuk untuk melakukan pemesanan terhadap pekerjaan tersebut.
        </p>

        <p className="text-justify leading-relaxed mb-6">
          Surat Penetapan ini mulai berlaku sejak tanggal ditetapkan dengan ketentuan bahwa segala sesuatunya yang akan diperbaiki kembali sebagaimana mestinya apabila dikemudian hari ternyata terdapat kekeliruan dalam penetapan ini.
        </p>

        {/* Blok Tanda Tangan */}
        <div className="pt-2 flex justify-end">
          <div className="w-80 text-left text-[12px] space-y-1">
            <div className="flex items-center gap-1">
              <span>Ditetapkan : di Pekanbaru</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Pada Tanggal :</span>
              <input
                type="text"
                value={tanggalSurat}
                onChange={(e) => setTanggalSurat(e.target.value)}
                placeholder="..."
                className="w-8 border-b border-gray-400 text-center font-mono focus:outline-none print:border-none print:w-auto"
              />
              <input
                type="text"
                value={namaBulanTahun}
                onChange={(e) => setNamaBulanTahun(e.target.value)}
                className="border-b border-gray-400 focus:outline-none print:border-none print:w-auto"
              />
            </div>
            <div className="pt-3">
              <p className="font-semibold">{labelKpaPpk}</p>
              <p className="font-normal">Selaku</p>
              <p className="font-semibold">Pejabat Pembuat Komitmen (PPK)</p>
              <p className="font-semibold">BPKAD Kota Pekanbaru</p>
            </div>
            <div className="pt-20">
              <p className="font-bold underline uppercase text-sm">
                {masterDokumen.mdk_nama_pejabat || 'DANIEL PERDANA, SE'}
              </p>
              <p className="text-[11px] font-mono mt-0.5">
                NIP. {masterDokumen.mdk_nip_pejabat || '197507242001121006'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* HALAMAN 2: LAMPIRAN HARGA PERKIRAAN SENDIRI (HPS)       */}
      {/* ======================================================== */}
      <div className="page-break mx-auto max-w-[210mm] bg-white text-black p-8 sm:p-12 shadow-xl print:shadow-none print:m-0 print:p-0 font-serif leading-relaxed text-[12px] mt-8 print:mt-0">
        {/* Judul Lampiran */}
        <div className="text-center mb-6">
          <h2 className="font-extrabold text-sm sm:text-base underline tracking-wider uppercase">
            LAMPIRAN HARGA PERKIRAAN SENDIRI (HPS)
          </h2>
        </div>

        {/* Metadata Lampiran */}
        <div className="mb-4">
          <table className="w-full text-[12px] border-collapse">
            <tbody>
              <tr>
                <td className="w-36 py-0.5 font-normal">Kegiatan</td>
                <td className="w-4 py-0.5 text-center">:</td>
                <td className="py-0.5 font-normal">{masterDokumen.mdk_kegiatan || '-'}</td>
              </tr>
              <tr>
                <td className="py-0.5 font-normal">Sub Kegiatan</td>
                <td className="py-0.5 text-center">:</td>
                <td className="py-0.5 font-normal">{masterDokumen.mdk_sub_kegiatan || '-'}</td>
              </tr>
              <tr>
                <td className="py-0.5 font-normal">Pekerjaan</td>
                <td className="py-0.5 text-center">:</td>
                <td className="py-0.5 font-normal">{masterDokumen.mdk_pekerjaan || masterDokumen.mdk_uraian_belanja || '-'}</td>
              </tr>
              <tr>
                <td className="py-0.5 font-normal">Lokasi Pekerjaan</td>
                <td className="py-0.5 text-center">:</td>
                <td className="py-0.5 font-normal">{lokasiPekerjaan}</td>
              </tr>
              <tr>
                <td className="py-0.5 font-normal">Pagu Anggaran</td>
                <td className="py-0.5 text-center">:</td>
                <td className="py-0.5 font-normal">{formatRupiah(masterDokumen.mdk_pagu_anggaran)}</td>
              </tr>
              <tr>
                <td className="py-0.5 font-normal">HPS</td>
                <td className="py-0.5 text-center">:</td>
                <td className="py-0.5 font-normal">{formatRupiah(totalHps)}</td>
              </tr>
              <tr>
                <td className="py-0.5 font-normal">Sumber Dana</td>
                <td className="py-0.5 text-center">:</td>
                <td className="py-0.5 font-normal">{apbdTahun}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tabel Rincian HPS */}
        <div className="my-4">
          <table className="w-full border-collapse border border-black text-[11px]">
            <thead>
              <tr className="border-b border-black text-center font-bold">
                <th className="border border-black px-2 py-2 w-10">No.</th>
                <th className="border border-black px-3 py-2 text-center">Uraian</th>
                <th className="border border-black px-2 py-2 w-14 text-center">Vol</th>
                <th className="border border-black px-2 py-2 w-16 text-center">Satuan</th>
                <th className="border border-black px-3 py-2 w-28 text-center leading-tight">
                  Harga Satuan<br />(Rp)
                </th>
                <th className="border border-black px-3 py-2 w-32 text-center leading-tight">
                  Jumlah Harga<br />(Rp)
                </th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="border border-black px-4 py-4 text-center italic text-gray-500">
                    Belum ada data rincian Harga Perkiraan Sendiri.
                  </td>
                </tr>
              ) : (
                items.map((item, idx) => {
                  const vol = item.hps_volume || '-';
                  const sat = item.hps_waktu || '-';
                  const hargaSatuan = Number(item.hps_harga_satuan) || 0;
                  const jumlahHarga = Number(item.hps_harga_perkiraan_sendiri) || (Number(vol) * hargaSatuan);

                  return (
                    <tr key={idx} className="border-b border-black">
                      <td className="border border-black px-2 py-1.5 text-center">{idx + 1}</td>
                      <td className="border border-black px-3 py-1.5 leading-snug">{item.hps_uraian_pekerjaan}</td>
                      <td className="border border-black px-2 py-1.5 text-center">{vol}</td>
                      <td className="border border-black px-2 py-1.5 text-center">{sat}</td>
                      <td className="border border-black px-3 py-1.5 text-right font-mono">
                        {hargaSatuan ? formatRupiah(hargaSatuan).replace('Rp ', '') : '-'}
                      </td>
                      <td className="border border-black px-3 py-1.5 text-right font-mono font-semibold">
                        {jumlahHarga ? formatRupiah(jumlahHarga).replace('Rp ', '') : '-'}
                      </td>
                    </tr>
                  );
                })
              )}

              {/* Baris Total */}
              <tr className="font-bold border-t border-black">
                <td colSpan={5} className="border border-black px-3 py-1.5 text-right uppercase">
                  JUMLAH
                </td>
                <td className="border border-black px-3 py-1.5 text-right font-mono">
                  {formatRupiah(totalBarang).replace('Rp ', '')}
                </td>
              </tr>
              <tr className="font-bold">
                <td colSpan={5} className="border border-black px-3 py-1.5 text-right uppercase">
                  PPN
                </td>
                <td className="border border-black px-3 py-1.5 text-right font-mono">
                  {formatRupiah(ppn).replace('Rp ', '')}
                </td>
              </tr>
              <tr className="font-bold">
                <td colSpan={5} className="border border-black px-3 py-1.5 text-right uppercase">
                  TOTAL
                </td>
                <td className="border border-black px-3 py-1.5 text-right font-mono font-bold">
                  {formatRupiah(totalHps).replace('Rp ', '')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Blok Tanda Tangan Lampiran */}
        <div className="pt-4 flex justify-end">
          <div className="w-80 text-left text-[12px] space-y-1">
            <div className="flex items-center gap-1">
              <span>Pekanbaru,</span>
              <input
                type="text"
                value={tanggalSurat}
                onChange={(e) => setTanggalSurat(e.target.value)}
                placeholder="..."
                className="w-8 border-b border-gray-400 text-center font-mono focus:outline-none print:border-none print:w-auto"
              />
              <input
                type="text"
                value={namaBulanTahun}
                onChange={(e) => setNamaBulanTahun(e.target.value)}
                className="border-b border-gray-400 focus:outline-none print:border-none print:w-auto"
              />
            </div>
            <div className="pt-2">
              <p className="font-semibold">{labelKpaPpk}</p>
              <p className="font-normal">Selaku</p>
              <p className="font-semibold">Pejabat Pembuat Komitmen (PPK)</p>
              <p className="font-semibold">BPKAD Kota Pekanbaru</p>
            </div>
            <div className="pt-20">
              <p className="font-bold underline uppercase text-sm">
                {masterDokumen.mdk_nama_pejabat || 'DANIEL PERDANA, SE'}
              </p>
              <p className="text-[11px] font-mono mt-0.5">
                NIP. {masterDokumen.mdk_nip_pejabat || '197507242001121006'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
