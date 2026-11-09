import { z } from 'zod';

export const PerhitunganPaketItemSchema = z.object({
  pak_nilai_invoice: z.coerce.number().min(0, 'Nilai invoice wajib diisi'),
  pak_dpp: z.coerce.number().min(0, 'DPP wajib diisi'),
  pak_ppn: z.coerce.number().min(0, 'PPN wajib diisi'),
  pak_pph23: z.coerce.number().min(0, 'PPh wajib diisi'),
  pak_jenis_pph: z.string().optional().nullable(),
  pak_dibayar: z.coerce.number().min(0, 'Dibayar wajib diisi'),
});

export const batchPerhitunganPaketSchema = z.object({
  pak_master_dokumen_id: z.coerce.number().positive('Pilih Master Dokumen yang valid'),
  pak_paket_id: z.coerce.number().optional().nullable(),
  items: z.array(PerhitunganPaketItemSchema),
});

export const createPerhitunganPaketSchema = z.object({
  pak_master_dokumen_id: z.coerce.number().positive(),
  pak_nilai_invoice: z.coerce.number().min(0, 'Nilai invoice wajib diisi'),
  pak_dpp: z.coerce.number().min(0, 'DPP wajib diisi'),
  pak_ppn: z.coerce.number().min(0, 'PPN wajib diisi'),
  pak_pph23: z.coerce.number().min(0, 'PPh 23 wajib diisi'),
  pak_dibayar: z.coerce.number().min(0, 'Dibayar wajib diisi'),
});

export const updatePerhitunganPaketSchema = z.object({
  pak_id: z.coerce.number().positive(),
  pak_master_dokumen_id: z.coerce.number().positive(),
  pak_nilai_invoice: z.coerce.number().min(0, 'Nilai invoice wajib diisi'),
  pak_dpp: z.coerce.number().min(0, 'DPP wajib diisi'),
  pak_ppn: z.coerce.number().min(0, 'PPN wajib diisi'),
  pak_pph23: z.coerce.number().min(0, 'PPh 23 wajib diisi'),
  pak_dibayar: z.coerce.number().min(0, 'Dibayar wajib diisi'),
});

export type BatchPerhitunganPaketSchemaType = z.infer<typeof batchPerhitunganPaketSchema>;
