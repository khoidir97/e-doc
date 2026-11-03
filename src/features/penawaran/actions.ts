"use server";

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { verifyToken } from '@/services/authService';
import { PenawaranService } from './service';
import { MasterDokumenService } from '../master-dokumen/service';
import { RencanaAnggaranBiayaService } from '../rencana-anggaran-biaya/service';
import { MasterDokumenRepository } from '../master-dokumen/repository';
import { MasterDokumen } from '../master-dokumen/types';
import { HargaPerkiraanSendiriService } from '../harga-perkiraan-sendiri/service';
import { batchPenawaranSchema, BatchPenawaranSchemaType } from './schema';
import { ActionResponse, Penawaran } from './types';

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

export async function getPenawaranWithDetailsAction(mdkId: number): Promise<ActionResponse<{
  items: Penawaran[];
  masterDokumen: MasterDokumen | null;
  hpsItems: any[];
}>> {
  try {
    const items = await PenawaranService.getByMasterDokumenId(mdkId);
    const masterDokumen = await MasterDokumenRepository.findById(mdkId);
    let hpsItems: any[] = [];
    try {
      hpsItems = await HargaPerkiraanSendiriService.getByMasterDokumenId(mdkId);
    } catch {
      hpsItems = [];
    }
    return {
      success: true,
      message: 'Berhasil mengambil data Penawaran',
      data: { items, masterDokumen, hpsItems },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data Penawaran',
      data: { items: [], masterDokumen: null, hpsItems: [] },
    };
  }
}

export async function getMasterDokumenOptionsAction(): Promise<ActionResponse<any[]>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const user = token ? await verifyToken(token) : null;
    let filterBdgId: number | null | undefined = undefined;
    if (user && user.pgw_role !== 0) {
      filterBdgId = user.pgw_bdg_id ? Number(user.pgw_bdg_id) : 0;
    }

    const result = await MasterDokumenService.getList('', 1, 100, filterBdgId);
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

export async function getPenawaranByMasterDokumenAction(mdk_id: number): Promise<ActionResponse<Penawaran[]>> {
  try {
    const data = await PenawaranService.getByMasterDokumenId(mdk_id);
    return {
      success: true,
      message: 'Berhasil mengambil data Penawaran',
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data Penawaran',
      data: [],
    };
  }
}

export async function getRencanaAnggaranBiayaByMasterDokumenAction(mdk_id: number): Promise<ActionResponse<any[]>> {
  try {
    const data = await RencanaAnggaranBiayaService.getByMasterDokumenId(mdk_id);
    return {
      success: true,
      message: 'Berhasil mengambil data Rencana Anggaran Biaya',
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data Rencana Anggaran Biaya',
      data: [],
    };
  }
}

export async function savePenawaranBatchAction(input: BatchPenawaranSchemaType): Promise<ActionResponse> {
  try {
    const validation = batchPenawaranSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        message: 'Validasi gagal, silakan periksa kelengkapan input.',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const activeUserId = await getActiveUserId();

    await PenawaranService.saveBatch(
      validation.data.pnw_master_dokumen_id,
      validation.data.items,
      activeUserId
    );

    revalidatePath('/Penawaran');

    return {
      success: true,
      message: 'Berhasil menyimpan data Harga Perkiraan Sendiri!',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal menyimpan data Harga Perkiraan Sendiri',
    };
  }
}

export async function getPenawaranListAction(search = '', page = 1, limit = 10): Promise<ActionResponse> {
  try {
    const result = await PenawaranService.getList(search, page, limit);
    return {
      success: true,
      message: 'Berhasil mengambil data Harga Perkiraan Sendiri',
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data Harga Perkiraan Sendiri',
    };
  }
}

export async function deletePenawaranAction(rab_id: number): Promise<ActionResponse> {
  try {
    if (!rab_id || rab_id <= 0) {
      return {
        success: false,
        message: 'ID Penawaran tidak valid.',
      };
    }

    const activeUserId = await getActiveUserId();
    await PenawaranService.delete(rab_id, activeUserId);
    revalidatePath('/Penawaran');

    return {
      success: true,
      message: 'Berhasil menghapus Harga Perkiraan Sendiri.',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal menghapus Harga Perkiraan Sendiri',
    };
  }
}
