import { z } from 'zod';
import { formatDateYYYYMMDD } from '@/lib/date';

export const BeritaAcaraItemSchema = z.object({
  dba_id: z.number().optional(),
  dba_uraian: z.string().min(1, 'Uraian pekerjaan wajib diisi'),
  dba_volume: z.string().min(1, 'Volume wajib diisi'),
  dba_satuan: z.string().min(1, 'Satuan wajib diisi'),
  dba_status_pemeriksaan: z.string().min(1, 'Status pemeriksaan wajib diisi'),
});

export const batchBeritaAcaraSchema = z.object({
  bac_master_dokumen_id: z.coerce.number().positive('Pilih Master Dokumen yang valid'),
  bac_master_jenis_ba_id: z.string().optional().default('001'),
  bac_bukti_perikatan: z.string().optional().default('002'),
  bac_nomor_bukti_perikatan: z.string().optional().default(''),
  bac_nomor_surat_pemeriksaan: z.string().optional().default(''),
  bac_nomor_surat_serah_terima: z.string().optional().default(''),
  bac_nomor_surat: z.string().optional().default(''),
  bac_paragraf_pertama: z.string().optional().default(''),
  bac_paragraf_kedua: z.string().optional().default(''),
  bac_hasil_pemeriksaan: z.string().optional().default(''),
  bac_tanggal: z.union([z.string(), z.date()]).transform((val) => formatDateYYYYMMDD(val) || formatDateYYYYMMDD(new Date())),
  items: z.array(BeritaAcaraItemSchema),
});

export const createBeritaAcaraSchema = z.object({
  dba_master_dokumen_id: z.coerce.number().positive(),
  dba_uraian: z.string().min(1, 'Uraian pekerjaan wajib diisi'),
  dba_volume: z.string().min(1, 'Volume wajib diisi'),
  dba_satuan: z.string().min(1, 'Satuan wajib diisi'),
  dba_status_pemeriksaan: z.string().min(1, 'Status pemeriksaan wajib diisi'),
});

export const updateBeritaAcaraSchema = z.object({
  dba_id: z.coerce.number().positive(),
  dba_master_dokumen_id: z.coerce.number().positive(),
  dba_uraian: z.string().min(1, 'Uraian pekerjaan wajib diisi'),
  dba_volume: z.string().min(1, 'Volume wajib diisi'),
  dba_satuan: z.string().min(1, 'Satuan wajib diisi'),
  dba_status_pemeriksaan: z.string().min(1, 'Status pemeriksaan wajib diisi'),
});

export type BatchBeritaAcaraInputType = z.input<typeof batchBeritaAcaraSchema>;
export type BatchBeritaAcaraSchemaType = z.infer<typeof batchBeritaAcaraSchema>;

