import { z } from 'zod';

export const RencanaAnggaranBiayaItemSchema = z.object({
  rab_uraian_pekerjaan: z.string().min(1, 'Uraian pekerjaan wajib diisi'),
  rab_volume: z.string().min(1, 'Volume wajib diisi'),
  rab_waktu: z.string().min(1, 'Waktu wajib diisi'),
  rab_harga_satuan: z.coerce.number().min(0, 'Harga satuan tidak boleh negatif'),
  rab_harga_perkiraan_sendiri: z.coerce.number().min(0, 'Harga perkiraan sendiri tidak boleh negatif'),
});

export const batchRencanaAnggaranBiayaSchema = z.object({
  rab_master_dokumen_id: z.coerce.number().positive('Pilih Master Dokumen yang valid'),
  items: z.array(RencanaAnggaranBiayaItemSchema),
});

export const createRencanaAnggaranBiayaSchema = z.object({
  rab_master_dokumen_id: z.coerce.number().positive(),
  rab_uraian_pekerjaan: z.string().min(1, 'Uraian pekerjaan wajib diisi'),
  rab_volume: z.string().min(1, 'Volume wajib diisi'),
  rab_waktu: z.string().min(1, 'Waktu wajib diisi'),
  rab_harga_satuan: z.coerce.number().min(0),
  rab_harga_perkiraan_sendiri: z.coerce.number().min(0),
});

export const updateRencanaAnggaranBiayaSchema = z.object({
  rab_id: z.coerce.number().positive(),
  rab_master_dokumen_id: z.coerce.number().positive(),
  rab_uraian_pekerjaan: z.string().min(1, 'Uraian pekerjaan wajib diisi'),
  rab_volume: z.string().min(1, 'Volume wajib diisi'),
  rab_waktu: z.string().min(1, 'Waktu wajib diisi'),
  rab_harga_satuan: z.coerce.number().min(0),
  rab_harga_perkiraan_sendiri: z.coerce.number().min(0),
});

export type BatchRencanaAnggaranBiayaSchemaType = z.infer<typeof batchRencanaAnggaranBiayaSchema>;
