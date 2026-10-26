import { z } from 'zod';

export const surveyItemSchema = z.object({
  dsrv_id: z.coerce.number().optional(),
  dsrv_jenis_spesifikasi: z.string().min(1, 'Spesifikasi/Jenis barang wajib diisi'),
  dsrv_harga_survey: z.coerce.number().min(0, 'Harga survey tidak boleh negatif'),
});

export const batchSurveySchema = z.object({
  srv_master_dokumen_id: z.coerce.number().positive('Pilih Master Dokumen yang valid'),
  srv_nomor: z.string().optional().default(''),
  srv_nama_kegiatan: z.string().optional().default(''),
  srv_paket_pekerjaan: z.string().optional().default(''),
  srv_tanggal_mulai: z.string().optional().nullable().default(null),
  srv_tanggal_selesai: z.string().optional().nullable().default(null),
  srv_nama_perusahaan: z.string().optional().default(''),
  srv_alamat_perusahaan: z.string().optional().default(''),
  items: z.array(surveyItemSchema),
});

export const createSurveySchema = z.object({
  dsrv_survey_id: z.coerce.number().positive(),
  dsrv_jenis_spesifikasi: z.string().min(1, 'Jenis spesifikasi wajib diisi'),
  dsrv_harga_survey: z.coerce.number().min(0),
});

export const updateSurveySchema = z.object({
  dsrv_id: z.coerce.number().positive(),
  dsrv_survey_id: z.coerce.number().positive(),
  dsrv_jenis_spesifikasi: z.string().min(1, 'Jenis spesifikasi wajib diisi'),
  dsrv_harga_survey: z.coerce.number().min(0),
});

export type BatchSurveySchemaType = z.infer<typeof batchSurveySchema>;

