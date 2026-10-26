"use server";

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { verifyToken } from '@/services/authService';
import { PegawaiService } from './service';
import { createPegawaiSchema, updatePegawaiSchema } from './schema';
import { ActionResponse, CreatePegawaiInput, UpdatePegawaiInput, PegawaiListResult } from './types';

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

export async function getPegawaiListAction(
  search = '',
  page = 1,
  limit = 10
): Promise<ActionResponse<PegawaiListResult>> {
  try {
    const result = await PegawaiService.getList(search, page, limit);
    return {
      success: true,
      message: 'Berhasil mengambil data pegawai',
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data pegawai',
    };
  }
}

export async function createPegawaiAction(input: CreatePegawaiInput): Promise<ActionResponse> {
  try {
    const validation = createPegawaiSchema.safeParse(input);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      const firstErrorMsg = Object.values(fieldErrors).flat()[0] || 'Validasi gagal, silakan periksa input Anda.';
      return {
        success: false,
        message: firstErrorMsg,
        errors: fieldErrors,
      };
    }

    const activeUserId = await getActiveUserId();

    await PegawaiService.create({
      ...validation.data,
      pgw_created_by: activeUserId,
    });

    revalidatePath('/pegawai');

    return {
      success: true,
      message: 'Berhasil menambahkan pegawai baru!',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal menambahkan pegawai',
    };
  }
}

export async function updatePegawaiAction(input: UpdatePegawaiInput): Promise<ActionResponse> {
  try {
    const validation = updatePegawaiSchema.safeParse(input);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      const firstErrorMsg = Object.values(fieldErrors).flat()[0] || 'Validasi gagal, silakan periksa input Anda.';
      return {
        success: false,
        message: firstErrorMsg,
        errors: fieldErrors,
      };
    }

    const activeUserId = await getActiveUserId();

    await PegawaiService.update({
      ...validation.data,
      pgw_updated_by: activeUserId,
    });

    revalidatePath('/pegawai');

    return {
      success: true,
      message: 'Berhasil memperbarui data pegawai!',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengedit pegawai',
    };
  }
}

export async function deletePegawaiAction(pgw_id: number): Promise<ActionResponse> {
  try {
    if (!pgw_id || pgw_id <= 0) {
      return {
        success: false,
        message: 'ID Pegawai tidak valid.',
      };
    }

    const activeUserId = await getActiveUserId();

    await PegawaiService.delete(pgw_id, activeUserId);
    revalidatePath('/pegawai');

    return {
      success: true,
      message: 'Berhasil menghapus pegawai.',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal menghapus pegawai',
    };
  }
}
