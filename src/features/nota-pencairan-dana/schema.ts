import { z } from 'zod';

export const NotaPencairanDanaItemSchema = z.object({
  dpd_uraian: z.string().min(1, 'Uraian kegiatan wajib diisi'),
  dpd_dpa_volume: z.string().min(1, 'Volume wajib diisi'),
  dpd_dpa_satuan: z.string().min(1, 'Satuan wajib diisi'),
  dpd_dpa_nilai: z.coerce.number().min(0, 'Harga HPS satuan tidak boleh negatif'),
  dpd_belum_volume: z.string().nullable().default(null),
  dpd_belum_nilai: z.coerce.number().nullable().default(null),
  dpd_saatini_volume: z.string().nullable().default(null),
  dpd_saatini_nilai: z.coerce.number().nullable().default(null),
  dpd_saatini_ppn: z.coerce.number().nullable().default(null),
  dpd_saatini_pph23: z.coerce.number().nullable().default(null),
  dpd_saatini_total_pajak: z.coerce.number().nullable().default(null),
  dpd_saatini_pembayaran: z.coerce.number().min(0, 'Harga NotaPencairanDanasiasi jumlah harga tidak boleh negatif'),
  dpd_sisa_volume: z.string().nullable().default(null),
  dpd_sisa_nilai: z.coerce.number().min(0, 'Harga NotaPencairanDanasiasi jumlah harga tidak boleh negatif'),
});

export const batchNotaPencairanDanaSchema = z.object({
  dpd_master_dokumen_id: z.coerce.number().positive('Pilih Master Dokumen yang valid'),
  items: z.array(NotaPencairanDanaItemSchema),
});

export const createNotaPencairanDanaSchema = z.object({
  dpd_master_dokumen_id: z.coerce.number().positive(),
  dpd_uraian: z.string().min(1, 'Uraian kegiatan wajib diisi'),
  dpd_dpa_volume: z.string().min(1, 'Volume wajib diisi'),
  dpd_dpa_satuan: z.string().min(1, 'Satuan wajib diisi'),
  dpd_dpa_nilai: z.coerce.number().min(0),
  dpd_belum_volume: z.string().optional(),
  dpd_belum_nilai: z.coerce.number().optional(),
  dpd_saatini_volume: z.string().optional(),
  dpd_saatini_nilai: z.coerce.number().optional(),
  dpd_saatini_ppn: z.coerce.number().optional(),
  dpd_saatini_pph23: z.coerce.number().optional(),
  dpd_saatini_total_pajak: z.coerce.number().optional(),
  dpd_saatini_pembayaran: z.coerce.number().optional(),
  dpd_sisa_volume: z.string().optional(),
  dpd_sisa_nilai: z.coerce.number().min(0),
});

export const updateNotaPencairanDanaSchema = z.object({
  dpd_id: z.coerce.number().positive(),
  dpd_master_dokumen_id: z.coerce.number().positive(),
  dpd_uraian: z.string().min(1, 'Uraian kegiatan wajib diisi'),
  dpd_dpa_volume: z.string().min(1, 'Volume wajib diisi'),
  dpd_dpa_satuan: z.string().min(1, 'Satuan wajib diisi'),
  dpd_dpa_nilai: z.coerce.number().min(0),
  dpd_belum_volume: z.string().optional(),
  dpd_belum_nilai: z.coerce.number().optional(),
  dpd_saatini_volume: z.string().optional(),
  dpd_saatini_nilai: z.coerce.number().optional(),
  dpd_saatini_ppn: z.coerce.number().optional(),
  dpd_saatini_pph23: z.coerce.number().optional(),
  dpd_saatini_total_pajak: z.coerce.number().optional(),
  dpd_saatini_pembayaran: z.coerce.number().optional(),
  dpd_sisa_volume: z.string().optional(),
  dpd_sisa_nilai: z.coerce.number().optional(),
});

export type BatchNotaPencairanDanaSchemaType = z.infer<typeof batchNotaPencairanDanaSchema>;
