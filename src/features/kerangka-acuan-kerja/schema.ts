import { z } from 'zod';

export const detailKakPerkiraanBiayaSchema = z.object({
  kpb_id: z.coerce.number().optional(),
  kpb_uraian: z.string().default(''),
  kpb_volume: z.coerce.number().default(0),
  kpb_harga: z.coerce.number().default(0),
  kpb_jumlah: z.coerce.number().default(0),
});

export const detailKakSpesifikasiTeknisSchema = z.object({
  kst_id: z.coerce.number().optional(),
  kst_uraian: z.string().default(''),
  kst_spesifikasi: z.string().default(''),
});

export const saveKakSchema = z.object({
  kak_id: z.coerce.number().nullable().optional(),
  kak_master_dokumen_id: z.coerce.number().nullable().optional(),
  kak_program: z.string().nullable().optional(),
  kak_kode_program: z.string().nullable().optional(),
  kak_kegiatan: z.string().nullable().optional(),
  kak_kode_kegiatan: z.string().nullable().optional(),
  kak_sub_kegiatan: z.string().nullable().optional(),
  kak_rekening: z.string().nullable().optional(),
  kak_kode_rekening: z.string().nullable().optional(),
  kak_pekerjaan: z.string().nullable().optional(),
  kak_tahun_anggaran: z.string().nullable().optional(),
  kak_latar_belakang: z.string().nullable().optional(),
  kak_maksud_dan_tujuan: z.string().nullable().optional(),
  kak_referensi_hukum: z.string().nullable().optional(),
  kak_target_sasaran: z.string().nullable().optional(),
  kak_nama_organisasi_dan_pengadaan: z.string().nullable().optional(),
  kak_sumber_dana_perkiraan_biaya: z.string().nullable().optional(),
  kak_perkiraan_biaya_id: z.coerce.number().nullable().optional(),
  kak_ruang_lingkup_lokasi_pekerjaan: z.string().nullable().optional(),
  kak_jangka_waktu_pelaksanaan: z.string().nullable().optional(),
  kak_metode_pemilihan: z.string().nullable().optional(),
  kak_spesifikasi_teknis_id: z.coerce.number().nullable().optional(),
  kak_persyaratan_kualifikasi_penyedia: z.string().nullable().optional(),
  kak_penutup: z.string().nullable().optional(),
  perkiraanBiayaList: z.array(detailKakPerkiraanBiayaSchema).default([]),
  spesifikasiTeknisList: z.array(detailKakSpesifikasiTeknisSchema).default([]),
});

export type SaveKakSchemaType = z.infer<typeof saveKakSchema>;

