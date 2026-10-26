import { z } from 'zod';

export const createPegawaiSchema = z.object({
  pgw_nip: z
    .string()
    .min(1, { message: 'NIP wajib diisi' })
    .max(50, { message: 'NIP maksimal 50 karakter' }),
  pgw_nama: z
    .string()
    .min(1, { message: 'Nama Pegawai wajib diisi' })
    .max(255, { message: 'Nama maksimal 255 karakter' }),
  pgw_jabatan: z
    .string()
    .min(1, { message: 'Jabatan wajib diisi' })
    .max(255, { message: 'Jabatan maksimal 255 karakter' }),
  pgw_password: z
    .string()
    .min(6, { message: 'Password minimal 6 karakter' }),
  pgw_role: z
    .coerce
    .number()
    .default(0),
  pgw_status_pegawai: z
    .coerce
    .number()
    .default(0),
});

export const updatePegawaiSchema = z.object({
  pgw_id: z.coerce.number().positive(),
  pgw_nip: z
    .string()
    .min(1, { message: 'NIP wajib diisi' })
    .max(50, { message: 'NIP maksimal 50 karakter' }),
  pgw_nama: z
    .string()
    .min(1, { message: 'Nama Pegawai wajib diisi' })
    .max(255, { message: 'Nama maksimal 255 karakter' }),
  pgw_jabatan: z
    .string()
    .min(1, { message: 'Jabatan wajib diisi' })
    .max(255, { message: 'Jabatan maksimal 255 karakter' }),
  pgw_password: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || val.length >= 6, {
      message: 'Password minimal 6 karakter jika ingin diubah',
    }),
  pgw_role: z.coerce.number().default(0),
  pgw_status_pegawai: z.coerce.number().default(0),
});

export type CreatePegawaiSchemaType = z.infer<typeof createPegawaiSchema>;
export type UpdatePegawaiSchemaType = z.infer<typeof updatePegawaiSchema>;
