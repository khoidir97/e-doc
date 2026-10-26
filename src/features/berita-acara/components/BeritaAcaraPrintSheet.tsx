import React from 'react';
import { MasterDokumen } from '../../master-dokumen/types';
import { BeritaAcara, BeritaAcaraHeader } from '../types';
import { KopSuratBpkad } from '@/components/common/KopSuratBpkad';
import { formatDateIndonesian } from '@/lib/date';

interface BeritaAcaraPrintSheetProps {
  masterDokumen: MasterDokumen;
  header: BeritaAcaraHeader | null;
  items: BeritaAcara[];
  judul?: string;
}

export const BeritaAcaraPrintSheet: React.FC<BeritaAcaraPrintSheetProps> = ({
  masterDokumen,
  header,
  items,
  judul = 'BERITA ACARA PEMERIKSAAN HASIL PEKERJAAN',
}) => {
  const nomorSurat = header?.bac_nomor_surat || '/SEKRETARIAT-027.2/VIII/2026';
  const bacTanggalFormatted = formatDateIndonesian(header?.bac_tanggal);
  const labelPejabat = masterDokumen.mdk_jabatan_pejabat?.trim().toUpperCase() === 'PA'
    ? 'Pengguna Anggaran'
    : 'Kuasa Pengguna Anggaran';
  const paragrafPertama =
    header?.bac_paragraf_pertama ||
    `Pada hari ini, Jum'at Tanggal empat belas Bulan Agustus Tahun Dua Ribu Dua Puluh Enam bertempat di Kantor Badan Pengelola Keuangan dan Aset Daerah (BPKAD) Kota Pekanbaru, berdasarkan Surat Keputusan Kepala BPKAD Kota Pekanbaru Nomor : 343 Tahun 2026 tentang penunjukkan ${labelPejabat} dilingkungan BPKAD Kota Pekanbaru Tahun Anggaran 2026, kami yang bertandatangan di bawah ini :`;

  const paragrafKedua =
    header?.bac_paragraf_kedua ||
    `Dengan ini menyatakan dengan sebenarnya telah melakukan pemeriksaan hasil pekerjaan ${masterDokumen?.mdk_uraian_belanja || masterDokumen?.mdk_kegiatan || 'Penyediaan Jasa'
    }, pada Sub Kegiatan ${masterDokumen?.mdk_sub_kegiatan || 'Penyediaan Jasa Peralatan dan Perlengkapan Kantor'
    } sesuai dengan faktur pesanan BPKAD Kota Pekanbaru nomor : ${nomorSurat}. Setelah dilakukan pemeriksaan, dengan ini menyatakan bahwa :`;

  const hasilPemeriksaan =
    header?.bac_hasil_pemeriksaan ||
    '"Jasa telah diterima sesuai dengan kuantitas serta kualitas layanan transportasi bus yang disepakati"';

  const kpaNama = masterDokumen?.mdk_nama_pejabat || masterDokumen?.mdk_nama_pejabat_pengadaan || 'DANIEL PERDANA, SE';
  const kpaNip = masterDokumen?.mdk_nip_pejabat || masterDokumen?.mdk_nip_pejabat_pengadaan || '197507242001121006';
  const kpaJabatan = `${labelPejabat} selaku Pejabat Pembuat Komitmen (PPPK)`;

  const penyediaNamaPimpinan = masterDokumen?.mdk_nama_pimpinan_perusahaan || 'ELIAKIM SITEPU, SP';
  const jabatanPimpinanPerusahaan = masterDokumen?.mdk_jabatan_pimpinan_perusahaan || 'Direktur';
  const penyediaPerusahaan = masterDokumen?.mdk_nama_perusahaan || 'PT Sibayak Riau Wisata';
  const penyediaAlamat =
    masterDokumen?.mdk_alamat ||
    'Jl. Tembusu Blok C. 25 No. 24, Perum Pandau Permai, Kel. Pandau Jaya, Kec. Siak Hulu, Kab Kampar';

  return (
    <div className="font-serif text-black leading-normal text-xs sm:text-sm space-y-4 max-w-[210mm] mx-auto px-4 pb-4 pt-0 sm:px-8 sm:pb-8 sm:pt-0 bg-white">
      {/* Title */}
      <KopSuratBpkad />
      <div className="text-center space-y-1">
        <h1 className="text-base font-bold underline tracking-wide uppercase">
          {judul}
        </h1>
        <p className="text-xs font-semibold">
          Nomor : <span className="font-mono">{nomorSurat}</span>
        </p>
      </div>

      {/* Paragraf Pertama */}
      <p className="text-justify indent-8 leading-relaxed">
        {paragrafPertama}
      </p>

      {/* Identitas Pihak Pertama & Kedua */}
      <div className="pl-6 space-y-3">
        {/* Pihak Pertama */}

        <table>
          <tbody >
            <tr>
              <td>Nama</td>
              <td>:</td>
              <td>{kpaNama}</td>
            </tr>
            <tr>
              <td>NIP</td>
              <td>:</td>
              <td>{kpaNip}</td>
            </tr>
            <tr style={{ verticalAlign: 'top' }}>
              <td>Jabatan</td>
              <td>:</td>
              <td>{kpaJabatan}</td>
            </tr>
          </tbody>
        </table>
        <p className="font-semibold">Selanjutnya disebut <span className="font-bold">PIHAK PERTAMA</span>.</p>

        {/* Pihak Kedua */}

        <table>
          <tbody>
            <tr>
              <td>Nama</td>
              <td>:</td>
              <td>{penyediaNamaPimpinan}</td>
            </tr>
            <tr>
              <td>Jabatan</td>
              <td>:</td>
              <td>{jabatanPimpinanPerusahaan}</td>
            </tr>
            <tr style={{ verticalAlign: 'top' }}>
              <td>Perusahaan</td>
              <td>:</td>
              <td>{penyediaPerusahaan}</td>
            </tr>
            <tr style={{ verticalAlign: 'top' }}>
              <td>Alamat</td>
              <td>:</td>
              <td>{penyediaAlamat}</td>
            </tr>
          </tbody>
        </table>
        <p className="font-semibold">Selanjutnya disebut <span className="font-bold">PIHAK KEDUA</span>.</p>
      </div>

      {/* Paragraf Kedua */}
      <p className="text-justify indent-8 leading-relaxed">
        {paragrafKedua}
      </p>

      {/* Poin 1: Hasil Pekerjaan Table */}
      <div className="space-y-2">
        <p className="font-semibold">
          1. <span className="underline">Hasil pekerjaan yang diperiksa oleh <span className="font-bold">PIHAK PERTAMA</span> dan <span className="font-bold">PIHAK KEDUA</span>, adalah berupa :</span>
        </p>

        <table className="w-full border-collapse border border-black text-center text-xs">
          <thead>
            <tr className="border-b border-black bg-gray-50">
              <th className="border border-black px-3 py-2 text-center w-12">No</th>
              <th className="border border-black px-3 py-2 text-center">Uraian</th>
              <th className="border border-black px-3 py-2 text-center w-20">Volume</th>
              <th className="border border-black px-3 py-2 text-center w-20">Satuan</th>
              <th className="border border-black px-3 py-2 text-center w-32">Status Pemeriksaan</th>
            </tr>
          </thead>
          <tbody>
            {items && items.length > 0 ? (
              items.map((item, idx) => (
                <tr key={idx} className="border-b border-black">
                  <td className="border border-black px-2 py-2 text-center">{idx + 1}</td>
                  <td className="border border-black px-3 py-2 text-left">{item.dba_uraian}</td>
                  <td className="border border-black px-2 py-2 text-center">{item.dba_volume}</td>
                  <td className="border border-black px-2 py-2 text-center">{item.dba_satuan}</td>
                  <td className="border border-black px-2 py-2 text-center font-semibold">{item.dba_status_pemeriksaan}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="border border-black px-3 py-4 text-center text-gray-500 italic">
                  Belum ada item rincian pekerjaan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>



      {/* Penutup */}
      <p className="indent-8 text-justify leading-relaxed">
        Demikian Berita Acara ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya.
      </p>

      {/* Tanda Tangan */}
      <div className="pt-6 grid grid-cols-2 text-center gap-8 text-xs sm:text-sm">
        {/* Pihak Kedua */}
        <div className="space-y-1">
          <p className="font-semibold">Pihak Kedua</p>
          <p>Yang Menyerahkan,</p>
          <p className="font-bold uppercase">{penyediaPerusahaan}</p>
          <div className="h-20"></div>
          <p className="font-bold underline uppercase">{penyediaNamaPimpinan}</p>
          <p>{jabatanPimpinanPerusahaan}</p>
        </div>

        {/* Pihak Pertama */}
        <div className="space-y-1">
          <p>Pekanbaru, {bacTanggalFormatted}</p>
          <p className="font-semibold">Pihak Pertama</p>
          <p>Yang Menerima,</p>
          <p className="font-semibold">{masterDokumen.mdk_jabatan_pejabat?.trim().toUpperCase()} selaku PPK</p>
          <div className="h-20"></div>
          <p className="font-bold underline uppercase">{kpaNama}</p>
          <p>NIP. {kpaNip}</p>
        </div>
      </div>
    </div >
  );
};
