import { z } from 'zod';

export const createBidangSchema = z.object({
  bdg_nama: z
    .string()
    .min(3, { message: 'Nama Bidang minimal 3 karakter' })
    .max(100, { message: 'Nama Bidang maksimal 100 karakter' }),
  bdg_keterangan: z.string().optional().default(''),
});

export const updateBidangSchema = z.object({
  bdg_id: z.coerce.number().positive(),
  bdg_nama: z
    .string()
    .min(3, { message: 'Nama Bidang minimal 3 karakter' })
    .max(100, { message: 'Nama Bidang maksimal 100 karakter' }),
  bdg_keterangan: z.string().optional().default(''),
});

export type CreateBidangSchemaType = z.infer<typeof createBidangSchema>;
export type UpdateBidangSchemaType = z.infer<typeof updateBidangSchema>;

