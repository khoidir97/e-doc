import { z } from 'zod';

export const FakturItemSchema = z.object({
  fkt_id: z.coerce.number().optional(),
  fkt_jenis_spesifikasi: z.string().min(1, 'Jenis dan Spesifikasi Barang wajib diisi'),
  fkt_unit: z.coerce.number().min(0, 'Unit tidak boleh negatif'),
  fkt_hari: z.coerce.string().max(200).default(''),
  fkt_harga_satuan: z.coerce.number().min(0, 'Harga satuan tidak boleh negatif'),
  fkt_total: z.coerce.number().min(0, 'Total tidak boleh negatif'),
});

export const batchFakturSchema = z.object({
  fkt_master_dokumen_id: z.coerce.number().positive('Pilih Master Dokumen yang valid'),
  fak_nomor_faktur: z.string().optional().nullable(),
  fak_tanggal_faktur: z.string().optional().nullable(),
  items: z.array(FakturItemSchema),
});

export const createFakturSchema = z.object({
  fkt_master_dokumen_id: z.coerce.number().positive(),
  fkt_jenis_spesifikasi: z.string().min(1, 'Jenis dan Spesifikasi Barang wajib diisi'),
  fkt_unit: z.coerce.number().min(0),
  fkt_hari: z.coerce.string().max(200).default(''),
  fkt_harga_satuan: z.coerce.number().min(0),
  fkt_total: z.coerce.number().min(0),
});

export const updateFakturSchema = z.object({
  fkt_id: z.coerce.number().positive(),
  fkt_master_dokumen_id: z.coerce.number().positive(),
  fkt_jenis_spesifikasi: z.string().min(1, 'Jenis dan Spesifikasi Barang wajib diisi'),
  fkt_unit: z.coerce.number().min(0),
  fkt_hari: z.coerce.string().max(200).default(''),
  fkt_harga_satuan: z.coerce.number().min(0),
  fkt_total: z.coerce.number().min(0),
});

export type BatchFakturSchemaType = z.infer<typeof batchFakturSchema>;
