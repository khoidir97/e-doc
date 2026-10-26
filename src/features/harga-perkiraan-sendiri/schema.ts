import { z } from 'zod';

export const HargaPerkiraanSendiriItemSchema = z.object({
  hps_uraian_pekerjaan: z.string().min(1, 'Uraian pekerjaan wajib diisi'),
  hps_volume: z.string().min(1, 'Volume wajib diisi'),
  hps_waktu: z.string().min(1, 'Waktu wajib diisi'),
  hps_harga_satuan: z.coerce.number().min(0, 'Harga satuan tidak boleh negatif'),
  hps_harga_perkiraan_sendiri: z.coerce.number().min(0, 'Harga perkiraan sendiri tidak boleh negatif'),
});

export const batchHargaPerkiraanSendiriSchema = z.object({
  hps_master_dokumen_id: z.coerce.number().positive('Pilih Master Dokumen yang valid'),
  items: z.array(HargaPerkiraanSendiriItemSchema),
});

export const createHargaPerkiraanSendiriSchema = z.object({
  hps_master_dokumen_id: z.coerce.number().positive(),
  hps_uraian_pekerjaan: z.string().min(1, 'Uraian pekerjaan wajib diisi'),
  hps_volume: z.string().min(1, 'Volume wajib diisi'),
  hps_waktu: z.string().min(1, 'Waktu wajib diisi'),
  hps_harga_satuan: z.coerce.number().min(0),
  hps_harga_perkiraan_sendiri: z.coerce.number().min(0),
});

export const updateHargaPerkiraanSendiriSchema = z.object({
  hps_id: z.coerce.number().positive(),
  hps_master_dokumen_id: z.coerce.number().positive(),
  hps_uraian_pekerjaan: z.string().min(1, 'Uraian pekerjaan wajib diisi'),
  hps_volume: z.string().min(1, 'Volume wajib diisi'),
  hps_waktu: z.string().min(1, 'Waktu wajib diisi'),
  hps_harga_satuan: z.coerce.number().min(0),
  hps_harga_perkiraan_sendiri: z.coerce.number().min(0),
});

export type BatchHargaPerkiraanSendiriSchemaType = z.infer<typeof batchHargaPerkiraanSendiriSchema>;
