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
  const isPemeriksaan = judul.toUpperCase().includes('PEMERIKSAAN');
  const nomorSurat = isPemeriksaan
    ? (header?.bac_nomor_surat_pemeriksaan || header?.bac_nomor_surat || '/SEKRETARIAT-027.2/VIII/2026')
    : (header?.bac_nomor_surat_serah_terima || header?.bac_nomor_surat || '/SEKRETARIAT-027.2/VIII/2026');
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
    <div className="font-sans text-black leading-normal text-[12pt] space-y-2.5 max-w-[210mm] mx-auto px-6 py-0 bg-white" style={{ fontFamily: 'Arial, sans-serif', fontSize: '12pt' }}>
      {/* Kop Surat */}
      <KopSuratBpkad className="!mb-2" />

      {/* Judul & Nomor */}
      <div className="text-center space-y-0.5">
        <h1 className="text-[13pt] font-bold underline tracking-wide uppercase">
          {judul}
        </h1>
        <p className="text-[11pt] font-semibold">
          Nomor : <span className="font-mono">{nomorSurat}</span>
        </p>
      </div>

      {/* Paragraf Pertama */}
      <p className="text-justify indent-8 leading-normal">
        {paragrafPertama}
      </p>

      {/* Identitas Pihak Pertama & Kedua */}
      <div className="pl-6 space-y-2">
        {/* Pihak Pertama */}
        <table className="leading-tight text-[12pt]">
          <tbody>
            <tr>
              <td className="w-28">Nama</td>
              <td className="w-3">:</td>
              <td className="font-semibold">{kpaNama}</td>
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
        <p className="font-semibold text-[11.5pt]">Selanjutnya disebut <span className="font-bold">PIHAK PERTAMA</span>,</p>

        {/* Pihak Kedua */}
        <table className="leading-tight text-[12pt]">
          <tbody>
            <tr>
              <td className="w-28">Nama</td>
              <td className="w-3">:</td>
              <td className="font-semibold">{penyediaNamaPimpinan}</td>
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
        <p className="font-semibold text-[11.5pt]">Selanjutnya disebut <span className="font-bold">PIHAK KEDUA</span>.</p>
      </div>

      {/* Paragraf Kedua */}
      <p className="text-justify indent-8 leading-normal">
        {paragrafKedua}
      </p>

      {/* Poin-poin Pemeriksaan / Tabel */}
      <div className="space-y-2">
        {isPemeriksaan ? (
          <div>
            <p className="font-semibold">
              1. Hasil pekerjaan yang diperiksa oleh <span className="font-bold">PIHAK PERTAMA</span> dan <span className="font-bold">PIHAK KEDUA</span>, adalah berupa :
            </p>
          </div>
        ) : null}

        <table className="w-full border-collapse border border-black text-center text-[10.5pt]">
          <thead>
            <tr className="border-b border-black bg-gray-50 font-bold">
              <th className="border border-black px-2 py-1 text-center w-10">No</th>
              <th className="border border-black px-2 py-1 text-center">Uraian</th>
              <th className="border border-black px-2 py-1 text-center w-20">Volume</th>
              <th className="border border-black px-2 py-1 text-center w-20">Satuan</th>
              <th className="border border-black px-2 py-1 text-center w-32">Status Pemeriksaan</th>
            </tr>
          </thead>
          <tbody>
            {items && items.length > 0 ? (
              items.map((item, idx) => (
                <tr key={idx} className="border-b border-black">
                  <td className="border border-black px-2 py-1 text-center">{idx + 1}</td>
                  <td className="border border-black px-2 py-1 text-left">{item.dba_uraian}</td>
                  <td className="border border-black px-2 py-1 text-center">{item.dba_volume}</td>
                  <td className="border border-black px-2 py-1 text-center">{item.dba_satuan}</td>
                  <td className="border border-black px-2 py-1 text-center font-medium">{item.dba_status_pemeriksaan}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="border border-black px-3 py-2 text-center text-gray-500 italic">
                  Belum ada item rincian pekerjaan.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Poin 2 & Poin 3 khusus Berita Acara Pemeriksaan Hasil Pekerjaan */}
        {isPemeriksaan && (
          <div className="space-y-1.5 pt-0.5">
            <div>
              <p className="font-semibold">2. Hasil pemeriksaan adalah sebagai berikut :</p>
              <p className="pl-5 text-justify italic">
                {hasilPemeriksaan.startsWith('"') ? hasilPemeriksaan : `"${hasilPemeriksaan}"`}.
              </p>
            </div>
            <div className="flex items-start gap-1">
              <span className="font-semibold">3.</span>
              <p className="text-justify leading-normal">
                Selanjutnya dilanjutkan ke proses serah terima barang atas pekerjaan tersebut, sama dengan pada saat dilakukan pemeriksaan ini serta sesuai dengan ketentuan dan peraturan yang berlaku.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Penutup */}
      <p className="indent-8 text-justify leading-normal">
        Demikian Berita Acara ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya.
      </p>

      {!isPemeriksaan && (
        <p className="text-end text-[11pt]">Pekanbaru, {bacTanggalFormatted}</p>
      )}

      {/* Tanda Tangan */}
      <div className={`grid grid-cols-2 text-center gap-4 text-[11pt] ${isPemeriksaan ? 'pt-2' : 'pt-1'}`}>
        {/* Pihak Kedua */}
        <div className="space-y-0.5">
          <p className="font-semibold">Pihak Kedua</p>
          <p>Yang Menyerahkan,</p>
          <p className="font-bold uppercase">{penyediaPerusahaan}</p>
          <div className="h-14"></div>
          <p className="font-bold underline uppercase">{penyediaNamaPimpinan}</p>
          <p>{jabatanPimpinanPerusahaan}</p>
        </div>

        {/* Pihak Pertama */}
        <div className="space-y-0.5">
          <p className="font-semibold">Pihak Pertama</p>
          <p>Yang Menerima,</p>
          <p className="font-semibold">{masterDokumen.mdk_jabatan_pejabat?.trim().toUpperCase()} selaku PPK</p>
          <div className="h-14"></div>
          <p className="font-bold underline uppercase">{kpaNama}</p>
          <p>NIP. {kpaNip}</p>
        </div>
      </div>
    </div>
  );
};
