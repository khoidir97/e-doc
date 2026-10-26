import { z } from 'zod';

export const NegoItemSchema = z.object({
  nego_uraian_kegiatan: z.string().min(1, 'Uraian kegiatan wajib diisi'),
  nego_volume: z.string().min(1, 'Volume wajib diisi'),
  nego_waktu: z.string().min(1, 'Waktu wajib diisi'),
  nego_hps_harga_satuan: z.coerce.number().min(0, 'Harga HPS satuan tidak boleh negatif'),
  nego_hps_jumlah_harga: z.coerce.number().min(0, 'Harga HPS jumlah harga tidak boleh negatif'),
  nego_pnw_harga_satuan: z.coerce.number().min(0, 'Harga PnW satuan tidak boleh negatif'),
  nego_pnw_jumlah_harga: z.coerce.number().min(0, 'Harga PnW jumlah harga tidak boleh negatif'),
  nego_negosiasi_harga_satuan: z.coerce.number().min(0, 'Harga negosiasi satuan tidak boleh negatif'),
  nego_negosiasi_jumlah_harga: z.coerce.number().min(0, 'Harga negosiasi jumlah harga tidak boleh negatif'),
});

export const batchNegoSchema = z.object({
  nego_master_dokumen_id: z.coerce.number().positive('Pilih Master Dokumen yang valid'),
  items: z.array(NegoItemSchema),
});

export const createNegoSchema = z.object({
  nego_master_dokumen_id: z.coerce.number().positive(),
  nego_uraian_kegiatan: z.string().min(1, 'Uraian kegiatan wajib diisi'),
  nego_volume: z.string().min(1, 'Volume wajib diisi'),
  nego_waktu: z.string().min(1, 'Waktu wajib diisi'),
  nego_hps_harga_satuan: z.coerce.number().min(0),
  nego_hps_jumlah_harga: z.coerce.number().min(0),
  nego_pnw_harga_satuan: z.coerce.number().min(0),
  nego_pnw_jumlah_harga: z.coerce.number().min(0),
  nego_negosiasi_harga_satuan: z.coerce.number().min(0),
  nego_negosiasi_jumlah_harga: z.coerce.number().min(0),
});

export const updateNegoSchema = z.object({
  nego_id: z.coerce.number().positive(),
  nego_master_dokumen_id: z.coerce.number().positive(),
  nego_uraian_kegiatan: z.string().min(1, 'Uraian kegiatan wajib diisi'),
  nego_volume: z.string().min(1, 'Volume wajib diisi'),
  nego_waktu: z.string().min(1, 'Waktu wajib diisi'),
  nego_hps_harga_satuan: z.coerce.number().min(0),
  nego_hps_jumlah_harga: z.coerce.number().min(0),
  nego_pnw_harga_satuan: z.coerce.number().min(0),
  nego_pnw_jumlah_harga: z.coerce.number().min(0),
  nego_negosiasi_harga_satuan: z.coerce.number().min(0),
  nego_negosiasi_jumlah_harga: z.coerce.number().min(0),
});

export type BatchNegoSchemaType = z.infer<typeof batchNegoSchema>;
