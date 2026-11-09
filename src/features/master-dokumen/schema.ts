import { z } from 'zod';

export const createMasterDokumenSchema = z.object({
  mdk_nama_pejabat_id: z.coerce.number().default(0),
  mdk_bidang_id: z.coerce.number().default(0),
  mdk_pagu_anggaran: z.coerce.number().default(0),
  mdk_nama_pejabat_pengadaan_id: z.coerce.number().default(0),
  mdk_nama_pptk_id: z.coerce.number().default(0),
  mdk_nama_bendahara_id: z.coerce.number().default(0),
  mdk_nama_perusahaan_id: z.coerce.number().default(0),
  mdk_nama_pimpinan_perusahaan: z.string().default(''),
  mdk_jabatan_pimpinan_perusahaan: z.string().default(''),
  mdk_pekerjaan: z.string().default(''),
  mdk_alamat: z.string().default(''),
  mdk_program: z.string().default(''),
  mdk_kode_program: z.string().default(''),
  mdk_kegiatan: z.string().default(''),
  mdk_kode_kegiatan: z.string().default(''),
  mdk_sub_kegiatan: z.string().default(''),
  mdk_kode_sub_kegiatan: z.string().default(''),
  mdk_uraian_belanja: z.string().default(''),
  mdk_rekening_belanja: z.string().default(''),
  mdk_kode_level1: z.string().default(''),
  mdk_nama_level1: z.string().default(''),
  mdk_kode_level2: z.string().default(''),
  mdk_nama_level2: z.string().default(''),
  mdk_kode_level3: z.string().default(''),
  mdk_nama_level3: z.string().default(''),
  mdk_kode_level4: z.string().default(''),
  mdk_nama_level4: z.string().default(''),
  mdk_kode_level5: z.string().default(''),
  mdk_nama_level5: z.string().default(''),
  mdk_keterangan: z.string().default(''),
  mdk_apbd: z.string().default(''),
  mdk_no_dpa: z.string().default(''),
  mdk_volume: z.string().default(''),
  mdk_satuan: z.coerce.number().default(0),
  mdk_item_barang: z.any().optional(),
});

export const updateMasterDokumenSchema = createMasterDokumenSchema.extend({
  mdk_id: z.coerce.number().positive(),
});

export type CreateMasterDokumenSchemaType = z.infer<typeof createMasterDokumenSchema>;
export type UpdateMasterDokumenSchemaType = z.infer<typeof updateMasterDokumenSchema>;
