import fs from 'fs';
import path from 'path';

const tabDirs = [
  'src/features/survey/components/SurveyContainer.tsx',
  'src/features/rencana-anggaran-biaya/components/RencanaAnggaranBiayaContainer.tsx',
  'src/features/harga-perkiraan-sendiri/components/HargaPerkiraanSendiriContainer.tsx',
  'src/features/penawaran/components/PenawaranContainer.tsx',
  'src/features/nego/components/NegoContainer.tsx',
  'src/features/perhitungan-paket/components/PerhitunganPaketContainer.tsx',
  'src/features/kwitansi/components/KwitansiContainer.tsx',
  'src/features/faktur/components/FakturContainer.tsx',
  'src/features/nota-pencairan-dana/components/NotaPencairanDanaContainer.tsx',
  'src/features/berita-acara/components/BeritaAcaraContainer.tsx'
];

for (const relPath of tabDirs) {
  const fullPath = path.resolve(relPath);
  if (!fs.existsSync(fullPath)) continue;

  let content = fs.readFileSync(fullPath, 'utf8');

  // 1. Add isLocked constant if not present
  const paguTarget = 'const paguNominal = Number(selectedMasterDokumen?.mdk_pagu_anggaran) || 0;';
  if (!content.includes('const isLocked =')) {
    content = content.replace(paguTarget, paguTarget + '\n  const isLocked = selectedMasterDokumen?.mdk_is_lock === 1;');
  }

  // 2. Disable save button(s) when isLocked === true
  if (relPath.includes('KwitansiContainer.tsx')) {
    content = content.replace('disabled={saving || isExceedingPagu}', 'disabled={saving || isExceedingPagu || isLocked}');
  } else if (relPath.includes('PerhitunganPaketContainer.tsx')) {
    content = content.replace('disabled={savingPaket}', 'disabled={savingPaket || isLocked}');
    content = content.replace('disabled={saving}', 'disabled={saving || isLocked}');
  } else if (relPath.includes('FakturContainer.tsx')) {
    content = content.replace(
      'type="submit"\n                    disabled={saving}',
      'type="submit"\n                    disabled={saving || isLocked}'
    );
  } else {
    // For survey, rab, hps, penawaran, nego, npd, berita-acara:
    // Replace the submit button's disabled={saving}
    content = content.replace('disabled={saving}', 'disabled={saving || isLocked}');
  }

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Updated container:', relPath);
}

