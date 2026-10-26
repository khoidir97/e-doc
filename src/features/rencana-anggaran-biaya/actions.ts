"use server";

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { verifyToken } from '@/services/authService';
import { RencanaAnggaranBiayaService } from './service';
import { MasterDokumenService } from '../master-dokumen/service';
import { MasterDokumenRepository } from '../master-dokumen/repository';
import { MasterDokumen } from '../master-dokumen/types';
import { batchRencanaAnggaranBiayaSchema, BatchRencanaAnggaranBiayaSchemaType } from './schema';
import { ActionResponse, RencanaAnggaranBiaya } from './types';

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

export async function getRencanaAnggaranBiayaWithDetailsAction(mdkId: number): Promise<ActionResponse<{
  items: RencanaAnggaranBiaya[];
  masterDokumen: MasterDokumen | null;
}>> {
  try {
    const items = await RencanaAnggaranBiayaService.getByMasterDokumenId(mdkId);
    const masterDokumen = await MasterDokumenRepository.findById(mdkId);
    return {
      success: true,
      message: 'Berhasil mengambil data RAB',
      data: { items, masterDokumen },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data RAB',
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

export async function getRencanaAnggaranBiayaByMasterDokumenAction(mdk_id: number): Promise<ActionResponse<RencanaAnggaranBiaya[]>> {
  try {
    const data = await RencanaAnggaranBiayaService.getByMasterDokumenId(mdk_id);
    return {
      success: true,
      message: 'Berhasil mengambil data RencanaAnggaranBiaya',
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data RencanaAnggaranBiaya',
      data: [],
    };
  }
}

export async function saveRencanaAnggaranBiayaBatchAction(input: BatchRencanaAnggaranBiayaSchemaType): Promise<ActionResponse> {
  try {
    const validation = batchRencanaAnggaranBiayaSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        message: 'Validasi gagal, silakan periksa kelengkapan input.',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const activeUserId = await getActiveUserId();

    await RencanaAnggaranBiayaService.saveBatch(
      validation.data.rab_master_dokumen_id,
      validation.data.items,
      activeUserId
    );

    revalidatePath('/RencanaAnggaranBiaya');

    return {
      success: true,
      message: 'Berhasil menyimpan data RencanaAnggaranBiaya!',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal menyimpan data RencanaAnggaranBiaya',
    };
  }
}

export async function getRencanaAnggaranBiayaListAction(search = '', page = 1, limit = 10): Promise<ActionResponse> {
  try {
    const result = await RencanaAnggaranBiayaService.getList(search, page, limit);
    return {
      success: true,
      message: 'Berhasil mengambil data RencanaAnggaranBiaya',
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data RencanaAnggaranBiaya',
    };
  }
}

export async function deleteRencanaAnggaranBiayaAction(rab_id: number): Promise<ActionResponse> {
  try {
    if (!rab_id || rab_id <= 0) {
      return {
        success: false,
        message: 'ID RencanaAnggaranBiaya tidak valid.',
      };
    }

    const activeUserId = await getActiveUserId();
    await RencanaAnggaranBiayaService.delete(rab_id, activeUserId);
    revalidatePath('/RencanaAnggaranBiaya');

    return {
      success: true,
      message: 'Berhasil menghapus RencanaAnggaranBiaya.',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal menghapus RencanaAnggaranBiaya',
    };
  }
}
