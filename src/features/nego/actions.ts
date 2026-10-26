"use server";

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { verifyToken } from '@/services/authService';
import { NegoService } from './service';
import { MasterDokumenService } from '../master-dokumen/service';
import { MasterDokumenRepository } from '../master-dokumen/repository';
import { MasterDokumen } from '../master-dokumen/types';
import { batchNegoSchema, BatchNegoSchemaType } from './schema';
import { ActionResponse, Nego } from './types';

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

export async function getNegoWithDetailsAction(mdkId: number): Promise<ActionResponse<{
  items: Nego[];
  masterDokumen: MasterDokumen | null;
}>> {
  try {
    const items = await NegoService.getByMasterDokumenId(mdkId);
    const masterDokumen = await MasterDokumenRepository.findById(mdkId);
    return {
      success: true,
      message: 'Berhasil mengambil data Nego',
      data: { items, masterDokumen },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data Nego',
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

export async function getNegoByMasterDokumenAction(mdk_id: number): Promise<ActionResponse<Nego[]>> {
  try {
    const data = await NegoService.getByMasterDokumenId(mdk_id);
    return {
      success: true,
      message: 'Berhasil mengambil data Nego',
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data Nego',
      data: [],
    };
  }
}

export async function saveNegoBatchAction(input: BatchNegoSchemaType): Promise<ActionResponse> {
  try {
    const validation = batchNegoSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        message: 'Validasi gagal, silakan periksa kelengkapan input.',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const activeUserId = await getActiveUserId();

    await NegoService.saveBatch(
      validation.data.nego_master_dokumen_id,
      validation.data.items,
      activeUserId
    );

    revalidatePath('/Nego');

    return {
      success: true,
      message: 'Berhasil menyimpan data Nego!',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal menyimpan data Nego',
    };
  }
}

export async function getNegoListAction(search = '', page = 1, limit = 10): Promise<ActionResponse> {
  try {
    const result = await NegoService.getList(search, page, limit);
    return {
      success: true,
      message: 'Berhasil mengambil data Nego',
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data Nego',
    };
  }
}

export async function deleteNegoAction(nego_id: number): Promise<ActionResponse> {
  try {
    if (!nego_id || nego_id <= 0) {
      return {
        success: false,
        message: 'ID Nego tidak valid.',
      };
    }

    const activeUserId = await getActiveUserId();
    await NegoService.delete(nego_id, activeUserId);
    revalidatePath('/Nego');

    return {
      success: true,
      message: 'Berhasil menghapus Nego.',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal menghapus Nego',
    };
  }
}
