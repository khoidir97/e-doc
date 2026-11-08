import React from 'react';
import { MasterDokumen } from '@/features/master-dokumen/types';
import { terbilang } from '@/lib/terbilang';
import { formatKwitansiRupiahInput, parseKwitansiRupiahInput } from '../kwitansiDecimalUtils';
import { formatDateIndonesian, formatDateYYYYMMDD } from '@/lib/date';

interface KwitansiOfficialSheetProps {
  masterDokumen: MasterDokumen;
  noBukuKas?: string;
  onNoBukuKasChange?: (val: string) => void;
  uangSejumlah?: number | string;
  onUangSejumlahChange?: (val: string) => void;
  maxUangSejumlah?: number;
  sudahTerimaDari?: string;
  onSudahTerimaDariChange?: (val: string) => void;
  yaituKet?: string;
  onYaituKetChange?: (val: string) => void;
  tanggalLunasDibayar?: string;
  onTanggalLunasDibayarChange?: (val: string) => void;
  tanggalTerimaUang?: string;
  onTanggalTerimaUangChange?: (val: string) => void;
  isEditable?: boolean;
}

export const KwitansiOfficialSheet: React.FC<KwitansiOfficialSheetProps> = ({
  masterDokumen,
  noBukuKas = '',
  onNoBukuKasChange,
  uangSejumlah,
  onUangSejumlahChange,
  maxUangSejumlah,
  sudahTerimaDari = '',
  onSudahTerimaDariChange,
  yaituKet = '',
  onYaituKetChange,
  tanggalLunasDibayar = '',
  onTanggalLunasDibayarChange,
  tanggalTerimaUang = '',
  onTanggalTerimaUangChange,
  isEditable = true,
}) => {
  const paguNominal = Number(masterDokumen.mdk_pagu_anggaran) || 0;
  const parsedUang = uangSejumlah !== undefined && uangSejumlah !== null && String(uangSejumlah).trim() !== '' ? parseKwitansiRupiahInput(uangSejumlah) : undefined;
  const currentAmount = parsedUang !== undefined && !isNaN(parsedUang)
    ? parsedUang
    : (maxUangSejumlah !== undefined ? maxUangSejumlah : paguNominal);
  const nominalTerbilang = terbilang(currentAmount);

  const defaultSudahTerima = masterDokumen.mdk_jabatan_pejabat === 'PA'
    ? `PENGGUNA ANGGARAN/PEJABAT PEMBUAT KOMITMEN BADAN PENGELOLA KEUANGAN DAN ASET DAERAH KOTA PEKANBARU`
    : `KUASA PENGGUNA ANGGARAN/PEJABAT PEMBUAT KOMITMEN BADAN PENGELOLA KEUANGAN DAN ASET DAERAH KOTA PEKANBARU`;
  const defaultYaitu = `Pembayaran ${masterDokumen.mdk_uraian_belanja || '-'} ${masterDokumen.mdk_pekerjaan || '-'} ${masterDokumen.mdk_volume || '-'} ${masterDokumen.mdk_satuan || '-'}${masterDokumen.mdk_sub_kegiatan ? ` Pada Sub Kegiatan ${masterDokumen.mdk_sub_kegiatan}` : ''
    }`;
  const currentSudahTerima = sudahTerimaDari && sudahTerimaDari.trim() !== '' ? sudahTerimaDari : defaultSudahTerima;
  const currentYaituKet = yaituKet && yaituKet.trim() !== '' ? yaituKet : defaultYaitu;
  const labelPejabat = masterDokumen.mdk_jabatan_pejabat?.trim().toUpperCase() === 'PA'
    ? 'Pengguna Anggaran'
    : 'Kuasa Pengguna Anggaran';

  const tahunAnggaran =
    masterDokumen.mdk_apbd ||
    (masterDokumen.mdk_created_at
      ? new Date(masterDokumen.mdk_created_at).getFullYear().toString()
      : '2026');

  return (
    <div className="kwitansi-sheet-wrapper bg-white text-black font-sans text-xs p-2 sm:p-4 max-w-5xl mx-auto w-full print:p-0 print:m-0">
      {/* Outer Spreadsheet Table Box */}
      <table className="w-full border-2 border-black border-collapse text-black bg-white">
        <tbody>
          {/* ROW 1: A + B (left)  |  Header, Title, Main Fields (right) */}
          <tr>
            {/* LEFT COLUMN TOP (A, B) - Width 32% */}
            <td className="w-[33%] border-r-2 border-black align-top p-0">
              <div className="h-full flex flex-col justify-between">
                {/* A. PEMBAYARAN TAHUN DINAS */}
                <div className="border-b-2 border-black p-3 shrink-0">
                  <div className="font-bold text-[11px]">A. PEMBAYARAN TAHUN DINAS</div>
                  <div className="text-center mt-2 space-y-1">
                    <div className="font-bold text-xs">{tahunAnggaran}</div>
                    <div className="font-bold text-[11px] mt-2">KODE REKENING</div>
                    <div className="font-sans text-[11px] font-normal break-all">
                      {masterDokumen.mdk_kode_sub_kegiatan} {masterDokumen.mdk_rekening_belanja || '-'}
                    </div>
                  </div>
                </div>

                {/* B. SETUJU DIBAYAR */}
                <div className="p-2 sm:p-3 flex flex-col justify-between flex-1 min-h-[160px] print:min-h-[140px]">
                  <div>
                    <div className="font-bold text-[11px]">B. SETUJU DIBAYAR</div>
                    <div className="text-center mt-2 leading-snug">
                      <div>{labelPejabat}</div>
                      <div>Selaku</div>
                      <div>Pejabat Pembuat Komitmen</div>
                    </div>
                  </div>
                  <div className="text-center mt-auto pt-15 space-y-0.5">
                    <div className="font-bold underline uppercase text-[11px]">
                      {masterDokumen.mdk_nama_pejabat || '...........................................'}
                    </div>
                    <div className="text-[10px]">
                      {masterDokumen.mdk_nip_pejabat || masterDokumen.mdk_nip_pejabat_pengadaan
                        ? `NIP. ${masterDokumen.mdk_nip_pejabat || masterDokumen.mdk_nip_pejabat_pengadaan}`
                        : '...........................................'}
                    </div>
                  </div>
                </div>
              </div>
            </td>

            {/* RIGHT COLUMN TOP (Header, Title, Fields) - Width 68% */}
            <td className="w-[68%] align-top p-2 sm:p-4 pb-4 print:p-2 print:pb-2">
              <div className="text-right font-bold text-[11px] pr-2">
                Buku Kas Umum No :{' '}
                {isEditable ? (
                  <input
                    type="text"
                    value={noBukuKas}
                    onChange={(e) => onNoBukuKasChange?.(e.target.value)}
                    placeholder=""
                    className="font-bold text-black bg-transparent dark:text-black border-b border-dashed border-gray-400 focus:border-black outline-none px-1 text-right w-24 print:border-none print:w-auto"
                  />
                ) : (
                  <span>{noBukuKas || '............'}</span>
                )}
              </div>
              <div className="text-center mt-1 mb-5">
                <h1 className="text-base sm:text-lg font-extrabold uppercase tracking-widest">
                  KWITANSI
                </h1>
              </div>

              {/* Main Form Fields */}
              <div className="space-y-4 text-xs">
                {/* Sudah terima dari */}
                <table className="w-full text-xs border-none">
                  <tbody>
                    <tr>
                      <td className="w-32 align-top font-normal py-1">Sudah terima dari</td>
                      <td className="w-4 align-top py-1 font-bold text-center">:</td>
                      <td className="align-top py-1 font-bold uppercase leading-snug">
                        {isEditable ? (
                          <textarea
                            rows={2}
                            value={currentSudahTerima}
                            onChange={(e) => onSudahTerimaDariChange?.(e.target.value)}
                            className="w-full font-bold uppercase leading-snug text-xs text-black bg-transparent dark:text-black border-b border-dashed border-gray-400 focus:border-black outline-none resize-none px-1 print:border-none print:resize-none"
                          />
                        ) : (
                          <span className="whitespace-pre-line">{currentSudahTerima}</span>
                        )}
                      </td>
                    </tr>

                    {/* Spacer */}
                    <tr>
                      <td colSpan={3} className="h-3"></td>
                    </tr>

                    {/* Uang Sejumlah */}
                    <tr>
                      <td className="w-32 align-top font-normal py-1">Uang Sejumlah</td>
                      <td className="w-4 align-top py-1 font-bold text-center">:</td>
                      <td className="align-top py-1">
                        <div className="flex items-center gap-1.5 font-bold text-sm">
                          <span>Rp. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                          {isEditable ? (
                            <div className="inline-flex items-center flex-wrap gap-1">
                              <input
                                type="text"
                                inputMode="decimal"
                                value={uangSejumlah !== undefined && uangSejumlah !== null && String(uangSejumlah).trim() !== '' ? formatKwitansiRupiahInput(uangSejumlah) : ''}
                                onChange={(e) => {
                                  const raw = e.target.value;
                                  if (raw === '') {
                                    onUangSejumlahChange?.('');
                                    return;
                                  }

                                  if (raw.endsWith(',')) {
                                    const parsedInt = parseKwitansiRupiahInput(raw);
                                    if (maxUangSejumlah !== undefined && parsedInt > maxUangSejumlah) {
                                      onUangSejumlahChange?.(maxUangSejumlah.toString());
                                    } else {
                                      onUangSejumlahChange?.(raw);
                                    }
                                    return;
                                  }

                                  const val = parseKwitansiRupiahInput(raw);
                                  if (maxUangSejumlah !== undefined && val > maxUangSejumlah) {
                                    onUangSejumlahChange?.(maxUangSejumlah.toString());
                                  } else {
                                    onUangSejumlahChange?.(val.toString());
                                  }
                                }}
                                className={`font-bold text-sm text-black bg-transparent dark:text-black border-b border-dashed outline-none px-1 w-48 print:border-none print:w-auto ${maxUangSejumlah !== undefined && (uangSejumlah ? parseKwitansiRupiahInput(uangSejumlah) : 0) > maxUangSejumlah
                                  ? 'border-red-500 text-red-600'
                                  : 'border-gray-400 focus:border-black'
                                  }`}
                                placeholder="0"
                              />
                              {maxUangSejumlah !== undefined && (
                                <span className="text-[10px] text-gray-500 font-normal ml-2 print:hidden">
                                  (Maks: {formatKwitansiRupiahInput(maxUangSejumlah)})
                                </span>
                              )}
                            </div>
                          ) : (
                            <span>{formatKwitansiRupiahInput(currentAmount) || '0'}</span>
                          )}
                        </div>
                        <div className="italic font-medium text-xs mt-1.5 capitalize">
                          {nominalTerbilang}
                        </div>
                      </td>
                    </tr>

                    {/* Spacer */}
                    <tr>
                      <td colSpan={3} className="h-4"></td>
                    </tr>

                    {/* Yaitu */}
                    <tr>
                      <td className="w-32 align-top font-normal py-1">Y a i t u</td>
                      <td className="w-4 align-top py-1 font-bold text-center">:</td>
                      <td className="align-top py-1 leading-relaxed text-[11px]">
                        {isEditable ? (
                          <textarea
                            rows={4}
                            value={currentYaituKet}
                            onChange={(e) => onYaituKetChange?.(e.target.value)}
                            className="w-full text-xs text-black bg-transparent dark:text-black border-b border-dashed border-gray-400 focus:border-black outline-none resize-none px-1 leading-relaxed print:border-none print:resize-none"
                          />
                        ) : (
                          <span className="whitespace-pre-line">{currentYaituKet}</span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>

          {/* ROW 2: C. LUNAS DIBAYAR (left) | Mengetahui PPTK | Yang Terima Uang */}
          <tr>
            <td colSpan={2} className="p-0">
              <table className="w-full border-collapse text-xs">
                <colgroup>
                  <col className="w-[33%]" />
                  <col className="w-[33%]" />
                  <col className="w-[34%]" />
                </colgroup>
                <tbody>
                  {/* Row 2a: title + date, only present in the left column. */}
                  <tr>
                    <td className="border-r-2 border-t-2 border-black align-top px-3 pt-3">
                      <div className="font-bold text-[11px]">C. LUNAS DIBAYAR</div>
                      <div className="mt-1 font-normal text-[11px] flex items-center gap-1">
                        <span className="shrink-0">Pada Tanggal :</span>
                        {isEditable ? (
                          <>
                            <input
                              type="date"
                              value={formatDateYYYYMMDD(tanggalLunasDibayar)}
                              onChange={(e) => onTanggalLunasDibayarChange?.(e.target.value)}
                              className="text-black bg-transparent dark:text-black border-b border-dashed border-gray-400 focus:border-black outline-none px-1 text-xs w-28 print:hidden cursor-pointer"
                            />
                            <span className="hidden print:inline font-normal">
                              {formatDateIndonesian(tanggalLunasDibayar)}
                            </span>
                          </>
                        ) : (
                          <span>{formatDateIndonesian(tanggalLunasDibayar)}</span>
                        )}
                      </div>
                    </td>
                    <td className="align-top px-3 pt-3"></td>
                    <td className="align-top px-3 pt-3"></td>
                  </tr>

                  {/* Row 2b: the three signature labels */}
                  <tr>
                    <td className="border-r-2 border-black align-top px-3 pt-3 text-center leading-snug vertical-align-bottom">
                      {masterDokumen.mdk_jabatan_bendahara || 'Bendahara Pengeluaran Pembantu'}
                    </td>
                    <td className="align-top px-3 pt-3 text-center leading-snug">
                      <div>Mengetahui</div>
                      <div>Pejabat Pelaksana Teknis Kegiatan</div>
                    </td>
                    <td className="align-top px-3 pt-3 text-center leading-snug">
                      <div className="flex items-center justify-center gap-1">
                        <span>Pekanbaru,</span>
                        {isEditable ? (
                          <>
                            <input
                              type="date"
                              value={formatDateYYYYMMDD(tanggalTerimaUang)}
                              onChange={(e) => onTanggalTerimaUangChange?.(e.target.value)}
                              className="text-black bg-transparent dark:text-black border-b border-dashed border-gray-400 focus:border-black outline-none px-1 text-xs w-28 print:hidden cursor-pointer"
                            />
                            <span className="hidden print:inline font-normal">
                              {formatDateIndonesian(tanggalTerimaUang)}
                            </span>
                          </>
                        ) : (
                          <span>{formatDateIndonesian(tanggalTerimaUang)}</span>
                        )}
                      </div>
                      <div>Yang terima uang,</div>
                      <div className="font-bold uppercase text-[11px] mt-0.5 truncate">
                        {masterDokumen.mdk_nama_perusahaan || '...........................................'}
                      </div>
                    </td>
                  </tr>

                  {/* Row 2c: signature name / NIP / jabatan */}
                  <tr>
                    <td className="border-r-2 border-black align-bottom px-2 pt-15 pb-2 print:pt-4 print:pb-1.5 text-center">
                      <div className="font-bold underline uppercase text-[11px]">
                        {masterDokumen.mdk_nama_bendahara || '...........................................'}
                      </div>
                      <div className="text-[10px]">
                        {masterDokumen.mdk_nip_bendahara
                          ? `NIP. ${masterDokumen.mdk_nip_bendahara}`
                          : '...........................................'}
                      </div>
                    </td>
                    <td className="align-bottom px-2 pt-15 pb-2 print:pt-4 print:pb-1.5 text-center">
                      <div className="font-bold underline uppercase text-[11px]">
                        {masterDokumen.mdk_nama_pptk || '...........................................'}
                      </div>
                      <div className="text-[10px]">
                        {masterDokumen.mdk_nip_pptk
                          ? `NIP. ${masterDokumen.mdk_nip_pptk}`
                          : '...........................................'}
                      </div>
                    </td>
                    <td className="align-bottom px-2 pt-20 pb-2 print:pt-4 print:pb-1.5 text-center">
                      <div className="font-bold underline uppercase text-[11px]">
                        {masterDokumen.mdk_nama_pimpinan_perusahaan || '...........................................'}
                      </div>
                      <div className="font-bold text-[11px]">{masterDokumen.mdk_jabatan_pimpinan_perusahaan || 'DIREKTUR'}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};