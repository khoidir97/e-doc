/**
 * Mengubah angka menjadi kalimat terbilang Bahasa Indonesia.
 * Contoh: 14000000 -> "Empat Belas Juta Rupiah"
 */
export function terbilang(n: number): string {
  if (isNaN(n) || n === null || n === undefined) return '';

  const absolute = Math.abs(n);
  const nominal = Math.floor(absolute);

  const decimalStr = String(absolute).split('.')[1];
  let decimalVal = 0;
  if (decimalStr) {
    const padded = decimalStr.padEnd(2, '0').slice(0, 2);
    decimalVal = parseInt(padded, 10);
  }

  const satuan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];

  function konversi(nom: number): string {
    if (nom < 12) return satuan[nom];
    if (nom < 20) return konversi(nom - 10) + ' Belas';
    if (nom < 100) return konversi(Math.floor(nom / 10)) + ' Puluh ' + konversi(nom % 10);
    if (nom < 200) return 'Seratus ' + konversi(nom - 100);
    if (nom < 1000) return konversi(Math.floor(nom / 100)) + ' Ratus ' + konversi(nom % 100);
    if (nom < 2000) return 'Seribu ' + konversi(nom - 1000);
    if (nom < 1000000) return konversi(Math.floor(nom / 1000)) + ' Ribu ' + konversi(nom % 1000);
    if (nom < 1000000000) return konversi(Math.floor(nom / 1000000)) + ' Juta ' + konversi(nom % 1000000);
    if (nom < 1000000000000) return konversi(Math.floor(nom / 1000000000)) + ' Miliar ' + konversi(nom % 1000000000);
    if (nom < 1000000000000000) return konversi(Math.floor(nom / 1000000000000)) + ' Triliun ' + konversi(nom % 1000000000000);
    return nom.toString();
  }

  let hasil = nominal === 0 ? 'Nol' : konversi(nominal).replace(/\s+/g, ' ').trim();
  hasil = `${hasil} Rupiah`;

  if (decimalVal > 0) {
    const teksSen = konversi(decimalVal).replace(/\s+/g, ' ').trim();
    hasil += ` ${teksSen} Sen`;
  }

  return hasil;
}

export function formatRupiah(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return 'Rp 0';
  const hasDecimal = num % 1 !== 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: hasDecimal ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Mengubah angka/string numeric menjadi format ribuan Rupiah tanpa simbol Rp (e.g. 1000000 -> "1.000.000")
 */
export function formatRupiahInput(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '';
  const cleanNumber = String(value).replace(/\D/g, '');
  if (!cleanNumber) return '';
  return new Intl.NumberFormat('id-ID').format(parseInt(cleanNumber, 10));
}

/**
 * Mengubah string rupiah berformat ribuan kembali menjadi number murni untuk state / DB (e.g. "1.000.000" -> 1000000)
 */
export function parseRupiahInput(value: string | number | null | undefined): number {
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  if (!value) return 0;
  const cleanNumber = String(value).replace(/\D/g, '');
  return cleanNumber ? parseInt(cleanNumber, 10) : 0;
}

export function isBelowPajakThreshold(value: number | string | null | undefined): boolean {
  if (value === null || value === undefined || value === '') return false;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return false;
  return num > 2000000;
}
