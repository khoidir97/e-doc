import { z } from 'zod';

export const PenawaranItemSchema = z.object({
  pnw_uraian_pekerjaan: z.string().min(1, 'Uraian pekerjaan wajib diisi'),
  pnw_volume: z.string().min(1, 'Volume wajib diisi'),
  pnw_waktu: z.string().min(1, 'Waktu wajib diisi'),
  pnw_harga_satuan: z.coerce.number().min(0, 'Harga satuan tidak boleh negatif'),
  pnw_harga_perkiraan_sendiri: z.coerce.number().min(0, 'Harga perkiraan sendiri tidak boleh negatif'),
});

export const batchPenawaranSchema = z.object({
  pnw_master_dokumen_id: z.coerce.number().positive('Pilih Master Dokumen yang valid'),
  items: z.array(PenawaranItemSchema),
});

export const createPenawaranSchema = z.object({
  pnw_master_dokumen_id: z.coerce.number().positive(),
  pnw_uraian_pekerjaan: z.string().min(1, 'Uraian pekerjaan wajib diisi'),
  pnw_volume: z.string().min(1, 'Volume wajib diisi'),
  pnw_waktu: z.string().min(1, 'Waktu wajib diisi'),
  pnw_harga_satuan: z.coerce.number().min(0),
  pnw_harga_perkiraan_sendiri: z.coerce.number().min(0),
});

export const updatePenawaranSchema = z.object({
  pnw_id: z.coerce.number().positive(),
  pnw_master_dokumen_id: z.coerce.number().positive(),
  pnw_uraian_pekerjaan: z.string().min(1, 'Uraian pekerjaan wajib diisi'),
  pnw_volume: z.string().min(1, 'Volume wajib diisi'),
  pnw_waktu: z.string().min(1, 'Waktu wajib diisi'),
  pnw_harga_satuan: z.coerce.number().min(0),
  pnw_harga_perkiraan_sendiri: z.coerce.number().min(0),
});

export type BatchPenawaranSchemaType = z.infer<typeof batchPenawaranSchema>;
