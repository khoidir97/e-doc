/**
 * kwitansiDecimalUtils.ts
 * Utilitas format & parse khusus untuk Kwitansi yang membutuhkan input angka desimal (berkoma).
 * Terisolasi agar tidak mengganggu komponen RupiahInput di menu lain.
 */

export function formatKwitansiRupiahInput(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '';

  if (typeof value === 'number') {
    if (isNaN(value)) return '';
    const isNegative = value < 0;
    const absVal = Math.abs(value);
    const intPart = Math.floor(absVal);
    const formattedInt = new Intl.NumberFormat('id-ID').format(intPart);
    const strVal = String(absVal);

    if (strVal.includes('.')) {
      const decPart = strVal.split('.')[1];
      return `${isNegative ? '-' : ''}${formattedInt},${decPart}`;
    }
    return `${isNegative ? '-' : ''}${formattedInt}`;
  }

  const str = String(value).trim();
  if (!str) return '';

  let integerStr = '';
  let decimalStr = '';
  let hasComma = false;

  if (str.includes(',')) {
    hasComma = true;
    const parts = str.split(',');
    integerStr = parts[0].replace(/\D/g, '');
    decimalStr = parts[1].replace(/[^\d]/g, '');
  } else if (str.includes('.')) {
    const dotCount = (str.match(/\./g) || []).length;
    const parts = str.split('.');
    const lastPart = parts[parts.length - 1];

    if (dotCount === 1 && lastPart.length > 0 && lastPart.length < 3 && !/^\d{1,3}\.\d{3}$/.test(str)) {
      // Single dot with 1 or 2 digits after it, e.g. "4000.5" -> treat as decimal
      hasComma = true;
      integerStr = parts[0].replace(/\D/g, '');
      decimalStr = lastPart.replace(/[^\d]/g, '');
    } else {
      // Thousand separators, e.g. "4.000", "4.000.000", "4.0000" -> treat all dots as thousand separators
      integerStr = str.replace(/\D/g, '');
    }
  } else {
    integerStr = str.replace(/\D/g, '');
  }

  if (!integerStr && !decimalStr) return '';

  const formattedInt = integerStr
    ? new Intl.NumberFormat('id-ID').format(parseInt(integerStr, 10))
    : '0';

  if (hasComma) {
    return `${formattedInt},${decimalStr}`;
  }
  return formattedInt;
}

export function parseKwitansiRupiahInput(value: string | number | null | undefined): number {
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  if (value === null || value === undefined) return 0;

  let str = String(value).trim();
  if (!str) return 0;

  if (str.includes(',')) {
    const parts = str.split(',');
    const integerPart = parts[0].replace(/\D/g, '');
    const decimalPart = parts[1].replace(/[^\d]/g, '');
    const combined = integerPart + (decimalPart !== '' ? '.' + decimalPart : '');
    const num = parseFloat(combined);
    return isNaN(num) ? 0 : num;
  }

  if (str.includes('.')) {
    const dotCount = (str.match(/\./g) || []).length;
    const parts = str.split('.');
    const lastPart = parts[parts.length - 1];

    if (dotCount === 1 && lastPart.length > 0 && lastPart.length < 3 && !/^\d{1,3}\.\d{3}$/.test(str)) {
      // Single dot with 1 or 2 digits after it, e.g. "4000.5" -> treat as decimal
      const integerPart = parts[0].replace(/\D/g, '');
      const decimalPart = lastPart.replace(/[^\d]/g, '');
      const combined = integerPart + (decimalPart !== '' ? '.' + decimalPart : '');
      const num = parseFloat(combined);
      return isNaN(num) ? 0 : num;
    }
    // Otherwise, all dots are thousand separators
    const cleanNumber = str.replace(/\D/g, '');
    return cleanNumber ? parseFloat(cleanNumber) : 0;
  }

  const cleanNumber = str.replace(/\D/g, '');
  return cleanNumber ? parseFloat(cleanNumber) : 0;
}
