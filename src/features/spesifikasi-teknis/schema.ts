import { z } from 'zod';

export const detailSpesifikasiTeknisSchema = z.object({
  dpst_id: z.coerce.number().optional(),
  dspt_spt_id: z.coerce.number().optional(),
  dspt_item_barang_jasa: z.string().default(''),
  dspt_spesifikasi: z.string().default(''),
});

export const detailSpesifikasiJumlahSchema = z.object({
  dspj_id: z.coerce.number().optional(),
  dpsj_spt_id: z.coerce.number().optional(),
  dspj_item_barang_jasa: z.string().default(''),
  dspj_jumlah: z.coerce.number().default(0),
  dspj_satuan_id: z.coerce.number().nullable().optional(),
  st_nama: z.string().nullable().optional(),
});

export const detailDaftarPelakuUsahaSchema = z.object({
  dpu_id: z.coerce.number().optional(),
  dpu_spt_id: z.coerce.number().optional(),
  dpu_item: z.string().default(''),
  dpu_nama_pelaku_usaha_potensial: z.string().default(''),
  dpu_link_katalog: z.string().default(''),
  dpu_harga: z.coerce.number().default(0),
  dpu_evaluasi_berdasarkan_parameter: z.string().default(''),
});

export const saveSpesifikasiTeknisSchema = z.object({
  spt_id: z.coerce.number().nullable().optional(),
  spt_kak_id: z.coerce.number().positive('Dokumen Kerangka Acuan Kerja (KAK) harus dipilih'),
  spt_paket_pengadaan: z.string().nullable().optional(),
  spt_satuan_kerja: z.string().nullable().optional(),
  spt_spt_ppk_pgw_id: z.coerce.number().nullable().optional(),
  spd_id_rup: z.string().nullable().optional(),
  spt_nama_barang_type: z.string().nullable().optional(),
  spt_identifikasi_tkdn: z.string().nullable().optional(),
  spt_prioritas_penggunaan: z.string().nullable().optional(),
  spt_spesifikasi_jumlah: z.string().nullable().optional(),
  spt_spesifikasi_waktu_pelaksanaan: z.string().nullable().optional(),
  spt_spesifikasi_waktu_lokasi_kedatangan: z.string().nullable().optional(),
  spt_spesifikasi_pelayanan: z.string().nullable().optional(),
  spt_spesifikasi_lokasi: z.string().nullable().optional(),
  spt_rencana_poin_negosiasi_teknis: z.string().nullable().optional(),
  spt_nama_pelaku_usaha: z.string().nullable().optional(),
  spt_link_katalog: z.string().nullable().optional(),
  detailTeknis: z.array(detailSpesifikasiTeknisSchema).default([]),
  detailJumlah: z.array(detailSpesifikasiJumlahSchema).default([]),
  detailPelakuUsaha: z.array(detailDaftarPelakuUsahaSchema).default([]),
});

export type SaveSpesifikasiTeknisSchemaType = z.infer<typeof saveSpesifikasiTeknisSchema>;

