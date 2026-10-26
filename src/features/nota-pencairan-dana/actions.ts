"use server";

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { verifyToken } from '@/services/authService';
import { NotaPencairanDanaService } from './service';
import { MasterDokumenService } from '../master-dokumen/service';
import { MasterDokumenRepository } from '../master-dokumen/repository';
import { MasterDokumen } from '../master-dokumen/types';
import { batchNotaPencairanDanaSchema, BatchNotaPencairanDanaSchemaType } from './schema';
import { ActionResponse, NotaPencairanDana } from './types';

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

export async function getNotaPencairanDanaWithDetailsAction(mdkId: number): Promise<ActionResponse<{
  items: NotaPencairanDana[];
  masterDokumen: MasterDokumen | null;
}>> {
  try {
    const items = await NotaPencairanDanaService.getByMasterDokumenId(mdkId);
    const masterDokumen = await MasterDokumenRepository.findById(mdkId);
    return {
      success: true,
      message: 'Berhasil mengambil data Nota Pencairan Dana',
      data: { items, masterDokumen },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data Nota Pencairan Dana',
      data: { items: [], masterDokumen: null },
    };
  }
}

export async function getMasterDokumenOptionsAction(): Promise<ActionResponse<any[]>> {
  try {
    const result = await MasterDokumenService.getList('', 1, 100);
    return {
      success: true,
      message: 'Berhasil mengambil opsi Master Dokumen',
      data: result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil opsi Master Dokumen',
      data: [],
    };
  }
}

export async function getNotaPencairanDanaByMasterDokumenAction(mdk_id: number): Promise<ActionResponse<NotaPencairanDana[]>> {
  try {
    const data = await NotaPencairanDanaService.getByMasterDokumenId(mdk_id);
    return {
      success: true,
      message: 'Berhasil mengambil data Nota Pencairan Dana',
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data Nota Pencairan Dana',
      data: [],
    };
  }
}

export async function saveNotaPencairanDanaBatchAction(input: BatchNotaPencairanDanaSchemaType): Promise<ActionResponse> {
  try {
    const validation = batchNotaPencairanDanaSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        message: 'Validasi gagal, silakan periksa kelengkapan input.',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const activeUserId = await getActiveUserId();

    await NotaPencairanDanaService.saveBatch(
      validation.data.dpd_master_dokumen_id,
      validation.data.items,
      activeUserId
    );

    revalidatePath('/nota-pencairan-dana');

    return {
      success: true,
      message: 'Berhasil menyimpan data Nota Pencairan Dana!',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal menyimpan data Nota Pencairan Dana',
    };
  }
}

export async function getNotaPencairanDanaListAction(search = '', page = 1, limit = 10): Promise<ActionResponse> {
  try {
    const result = await NotaPencairanDanaService.getList(search, page, limit);
    return {
      success: true,
      message: 'Berhasil mengambil data Nota Pencairan Dana',
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data Nota Pencairan Dana',
    };
  }
}

export async function deleteNotaPencairanDanaAction(dpd_id: number): Promise<ActionResponse> {
  try {
    if (!dpd_id || dpd_id <= 0) {
      return {
        success: false,
        message: 'ID Nota Pencairan Dana tidak valid.',
      };
    }

    const activeUserId = await getActiveUserId();
    await NotaPencairanDanaService.delete(dpd_id, activeUserId);
    revalidatePath('/nota-pencairan-dana');

    return {
      success: true,
      message: 'Berhasil menghapus Nota Pencairan Dana.',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal menghapus Nota Pencairan Dana',
    };
  }
}
