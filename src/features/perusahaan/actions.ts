"use server";

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { verifyToken } from '@/services/authService';
import { PerusahaanService } from './service';
import { createPerusahaanSchema, updatePerusahaanSchema } from './schema';
import { ActionResponse, CreatePerusahaanInput, UpdatePerusahaanInput, PerusahaanListResult } from './types';

async function getActiveUserId(): Promise<number | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;
    const user = await verifyToken(token);
    return user ? user.pgw_id : null;
  } catch {
    return null;
  }
}

export async function getPerusahaanListAction(
  search = '',
  page = 1,
  limit = 10
): Promise<ActionResponse<PerusahaanListResult>> {
  try {
    const result = await PerusahaanService.getList(search, page, limit);
    return {
      success: true,
      message: 'Berhasil mengambil data Perusahaan',
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data Perusahaan',
    };
  }
}

export async function createPerusahaanAction(input: CreatePerusahaanInput): Promise<ActionResponse> {
  try {
    const validation = createPerusahaanSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        message: 'Validasi gagal, silakan periksa input Anda.',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const activeUserId = await getActiveUserId();

    await PerusahaanService.create({
      ...validation.data,
      psh_created_by: activeUserId,
    });

    revalidatePath('/Perusahaan');

    return {
      success: true,
      message: 'Berhasil menambahkan Perusahaan baru!',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal menambahkan Perusahaan',
    };
  }
}

export async function updatePerusahaanAction(input: UpdatePerusahaanInput): Promise<ActionResponse> {
  try {
    const validation = updatePerusahaanSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        message: 'Validasi gagal, silakan periksa input Anda.',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const activeUserId = await getActiveUserId();

    await PerusahaanService.update({
      ...validation.data,
      psh_updated_by: activeUserId,
    });

    revalidatePath('/Perusahaan');

    return {
      success: true,
      message: 'Berhasil memperbarui data Perusahaan!',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengedit Perusahaan',
    };
  }
}

export async function deletePerusahaanAction(psh_id: number): Promise<ActionResponse> {
  try {
    if (!psh_id || psh_id <= 0) {
      return {
        success: false,
        message: 'ID Perusahaan tidak valid.',
      };
    }

    const activeUserId = await getActiveUserId();

    await PerusahaanService.delete(psh_id, activeUserId);
    revalidatePath('/perusahaan');

    return {
      success: true,
      message: 'Berhasil menghapus Perusahaan.',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal menghapus Perusahaan',
    };
  }
}
