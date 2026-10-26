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
 * Alias singkat untuk formatDateIndonesian
 */
export const formatDateID = formatDateIndonesian;

