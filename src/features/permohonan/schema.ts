import { z } from 'zod';

export const savePermohonanSchema = z.object({
  pmh_id: z.coerce.number().nullable().optional(),
  pmh_kak_id: z.coerce.number().positive('Dokumen Kerangka Acuan Kerja (KAK) harus dipilih'),
  pmh_tanggal: z.string().nullable().optional(),
  pmh_nomor: z.string().nullable().optional(),
  pmh_sifat: z.string().nullable().optional(),
  pmh_lampiran: z.string().nullable().optional(),
  pmh_hal: z.string().nullable().optional(),
  pmh_paragraf1: z.string().nullable().optional(),
  pmh_kode_rup: z.string().nullable().optional(),
  pmh_nama_paket: z.string().nullable().optional(),
  pmh_pagu_anggaran: z.coerce.number().default(0),
  pmh_hps: z.coerce.number().default(0),
  pmh_metode_pemilihan: z.string().nullable().optional(),
  pmh_sumber_dana: z.string().nullable().optional(),
  pmh_paragraf2: z.string().nullable().optional(),
});

export type SavePermohonanSchemaType = z.infer<typeof savePermohonanSchema>;
