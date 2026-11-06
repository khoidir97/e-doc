import { z } from 'zod';

export const createPerusahaanSchema = z.object({
  psh_nama: z
    .string()
    .min(3, { message: 'Nama Perusahaan minimal 3 karakter' })
    .max(100, { message: 'Nama Perusahaan maksimal 100 karakter' }),
  psh_nama_pimpinan: z
    .string()
    .min(3, { message: 'Nama Pimpinan minimal 3 karakter' })
    .max(100, { message: 'Nama Pimpinan maksimal 100 karakter' }),
  psh_jabatan: z
    .string()
    .min(3, { message: 'Jabatan minimal 3 karakter' })
    .max(100, { message: 'Jabatan maksimal 100 karakter' }),
  psh_alamat: z
    .string()
    .min(2, { message: 'Alamat minimal 2 karakter' })
    .max(255, { message: 'Alamat maksimal 255 karakter' }),
  psh_npwp: z.string().optional(),
  psh_nomor_rekening: z.string().optional(),
  psh_nama_rekening: z.string().optional(),
  psh_nama_bank: z.string().optional(),
});

export const updatePerusahaanSchema = z.object({
  psh_id: z.coerce.number().positive(),
  psh_nama: z
    .string()
    .min(3, { message: 'Nama Perusahaan minimal 3 karakter' })
    .max(100, { message: 'Nama Perusahaan maksimal 100 karakter' }),
  psh_nama_pimpinan: z
    .string()
    .min(3, { message: 'Nama Pimpinan minimal 3 karakter' })
    .max(100, { message: 'Nama Pimpinan maksimal 100 karakter' }),
  psh_jabatan: z
    .string()
    .min(3, { message: 'Jabatan minimal 3 karakter' })
    .max(100, { message: 'Jabatan maksimal 100 karakter' }),
  psh_alamat: z.string().default(''),
  psh_npwp: z.string().optional(),
  psh_nomor_rekening: z.string().optional(),
  psh_nama_rekening: z.string().optional(),
  psh_nama_bank: z.string().optional(),
});

export type CreatePerusahaanSchemaType = z.infer<typeof createPerusahaanSchema>;
export type UpdatePerusahaanSchemaType = z.infer<typeof updatePerusahaanSchema>;

