/**
 * Memformat Date atau string ke format YYYY-MM-DD untuk input date HTML (tanpa pergeseran timezone UTC).
 */
export function formatDateYYYYMMDD(dateInput?: string | Date | null): string {
  if (!dateInput) return '';
  if (typeof dateInput === 'string') {
    const trimmed = dateInput.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
    if (trimmed.includes('T')) {
      const part = trimmed.split('T')[0];
      if (/^\d{4}-\d{2}-\d{2}$/.test(part)) return part;
    }
  }
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Memformat tanggal ke string Bahasa Indonesia (contoh: "26 Agustus 2026").
 */
export function formatDateIndonesian(dateInput?: string | Date | null): string {
  if (!dateInput) {
    const now = new Date();
    return now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  if (typeof dateInput === 'string') {
    const trimmed = dateInput.trim();
    const dateOnly = trimmed.includes('T') ? trimmed.split('T')[0] : trimmed;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
      const [y, m, day] = dateOnly.split('-').map(Number);
      const localDate = new Date(y, m - 1, day);
      return localDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    }
  }
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

/**
 * Mengubah angka menjadi kata terbilang dengan huruf kapital di setiap kata (Title Case)
 * Contoh: 21 -> "Dua Puluh Satu", 2024 -> "Dua Ribu Dua Puluh Empat"
 */
export function numberToWordsIndonesian(nom: number): string {
  const satuan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
  if (nom < 12) return satuan[nom];
  if (nom < 20) return `${numberToWordsIndonesian(nom - 10)} Belas`.trim();
  if (nom < 100) return `${numberToWordsIndonesian(Math.floor(nom / 10))} Puluh ${nom % 10 !== 0 ? numberToWordsIndonesian(nom % 10) : ''}`.trim();
  if (nom < 200) return `Seratus ${nom - 100 !== 0 ? numberToWordsIndonesian(nom - 100) : ''}`.trim();
  if (nom < 1000) return `${numberToWordsIndonesian(Math.floor(nom / 100))} Ratus ${nom % 100 !== 0 ? numberToWordsIndonesian(nom % 100) : ''}`.trim();
  if (nom < 2000) return `Seribu ${nom - 1000 !== 0 ? numberToWordsIndonesian(nom - 1000) : ''}`.trim();
  if (nom < 10000) return `${numberToWordsIndonesian(Math.floor(nom / 1000))} Ribu ${nom % 1000 !== 0 ? numberToWordsIndonesian(nom % 1000) : ''}`.trim();
  return nom.toString();
}

/**
 * Mengubah tanggal menjadi format kalimat hukum formal Berita Acara
 * Contoh: "2024-03-21" -> { hari: "Kamis", tanggalTerbilang: "Dua Puluh Satu", bulan: "Maret", tahunTerbilang: "Dua Ribu Dua Puluh Empat" }
 */
export function formatDateToLegalWords(dateInput?: string | Date | null): {
  hari: string;
  tanggalTerbilang: string;
  bulan: string;
  tahunTerbilang: string;
  fullSentence: string;
} {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  let d = new Date();
  if (dateInput) {
    if (typeof dateInput === 'string') {
      const trimmed = dateInput.trim();
      const dateOnly = trimmed.includes('T') ? trimmed.split('T')[0] : trimmed;
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
        const [y, m, day] = dateOnly.split('-').map(Number);
        d = new Date(y, m - 1, day);
      } else {
        const parsed = new Date(dateInput);
        if (!isNaN(parsed.getTime())) d = parsed;
      }
    } else if (dateInput instanceof Date && !isNaN(dateInput.getTime())) {
      d = dateInput;
    }
  }

  const hari = days[d.getDay()] || 'Kamis';
  const tanggalTerbilang = numberToWordsIndonesian(d.getDate()) || 'Satu';
  const bulan = months[d.getMonth()] || 'Januari';
  const tahunTerbilang = numberToWordsIndonesian(d.getFullYear()) || 'Dua Ribu Dua Puluh Enam';

  const fullSentence = `Pada hari ini ${hari} Tanggal ${tanggalTerbilang} bulan ${bulan} Tahun ${tahunTerbilang}, bertempat di Kantor Badan Pengelola Keuangan dan Aset Kota Pekanbaru yang bertanda tangan dibawah ini :`;

  return { hari, tanggalTerbilang, bulan, tahunTerbilang, fullSentence };
}

/**
 * Alias singkat untuk formatDateIndonesian
 */
export const formatDateID = formatDateIndonesian;

