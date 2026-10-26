"use server";

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { verifyToken } from '@/services/authService';
import { BidangService } from './service';
import { createBidangSchema, updateBidangSchema } from './schema';
import { ActionResponse, CreateBidangInput, UpdateBidangInput, BidangListResult } from './types';

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

export async function getBidangListAction(
  search = '',
  page = 1,
  limit = 10
): Promise<ActionResponse<BidangListResult>> {
  try {
    const result = await BidangService.getList(search, page, limit);
    return {
      success: true,
      message: 'Berhasil mengambil data Bidang',
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data Bidang',
    };
  }
}

export async function createBidangAction(input: CreateBidangInput): Promise<ActionResponse> {
  try {
    const validation = createBidangSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        message: 'Validasi gagal, silakan periksa input Anda.',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const activeUserId = await getActiveUserId();

    await BidangService.create({
      ...validation.data,
      bdg_created_by: activeUserId,
    });

    revalidatePath('/Bidang');

    return {
      success: true,
      message: 'Berhasil menambahkan Bidang baru!',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal menambahkan Bidang',
    };
  }
}

export async function updateBidangAction(input: UpdateBidangInput): Promise<ActionResponse> {
  try {
    const validation = updateBidangSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        message: 'Validasi gagal, silakan periksa input Anda.',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const activeUserId = await getActiveUserId();

    await BidangService.update({
      ...validation.data,
      bdg_updated_by: activeUserId,
    });

    revalidatePath('/Bidang');

    return {
      success: true,
      message: 'Berhasil memperbarui data Bidang!',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengedit Bidang',
    };
  }
}

export async function deleteBidangAction(bdg_id: number): Promise<ActionResponse> {
  try {
    if (!bdg_id || bdg_id <= 0) {
      return {
        success: false,
        message: 'ID Bidang tidak valid.',
      };
    }

    const activeUserId = await getActiveUserId();

    await BidangService.delete(bdg_id, activeUserId);
    revalidatePath('/bidang');

    return {
      success: true,
      message: 'Berhasil menghapus Bidang.',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal menghapus Bidang',
    };
  }
}
