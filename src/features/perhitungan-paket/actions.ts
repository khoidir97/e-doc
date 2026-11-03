"use server";

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { verifyToken } from '@/services/authService';
import { PerhitunganPaketService } from './service';
import { MasterDokumenService } from '../master-dokumen/service';
import { MasterDokumenRepository } from '../master-dokumen/repository';
import { batchPerhitunganPaketSchema, BatchPerhitunganPaketSchemaType } from './schema';
import { ActionResponse, PerhitunganPaket, Paket, UpsertPaketInput } from './types';
import { PaketRepository } from './repository';
import { MasterDokumen } from '../master-dokumen/types';

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

export async function getPaketByMasterDokumenAction(mdk_id: number): Promise<ActionResponse<Paket | null>> {
  try {
    const data = await PaketRepository.findByMasterDokumenId(mdk_id);
    return { success: true, message: 'Berhasil mengambil data Paket', data };
  } catch (error: any) {
    return { success: false, message: error.message || 'Gagal mengambil data Paket', data: null };
  }
}

export async function savePaketAction(input: UpsertPaketInput): Promise<ActionResponse<number>> {
  try {
    const userId = await getActiveUserId();
    const pktId = await PaketRepository.upsert(input, userId);
    revalidatePath('/perhitungan-paket');
    return { success: true, message: 'Berhasil menyimpan data Paket', data: pktId };
  } catch (error: any) {
    return { success: false, message: error.message || 'Gagal menyimpan data Paket' };
  }
}

export async function getPerhitunganPaketWithDetailsAction(mdk_id: number): Promise<ActionResponse<{
  paket: Paket | null;
  items: PerhitunganPaket[];
  masterDokumen: MasterDokumen | null;
}>> {
  try {
    const [paket, items, masterDokumen] = await Promise.all([
      PaketRepository.findByMasterDokumenId(mdk_id),
      PerhitunganPaketService.getByMasterDokumenId(mdk_id),
      MasterDokumenRepository.findById(mdk_id),
    ]);
    return {
      success: true,
      message: 'Berhasil mengambil data',
      data: { paket, items, masterDokumen },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data',
      data: { paket: null, items: [], masterDokumen: null },
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

export async function getPerhitunganPaketByMasterDokumenAction(mdk_id: number): Promise<ActionResponse<PerhitunganPaket[]>> {
  try {
    const data = await PerhitunganPaketService.getByMasterDokumenId(mdk_id);
    return {
      success: true,
      message: 'Berhasil mengambil data Perhitungan Paket',
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data Perhitungan Paket',
      data: [],
    };
  }
}

export async function savePerhitunganPaketBatchAction(input: BatchPerhitunganPaketSchemaType): Promise<ActionResponse> {
  try {
    const validation = batchPerhitunganPaketSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        message: 'Validasi gagal, silakan periksa kelengkapan input.',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const activeUserId = await getActiveUserId();

    await PerhitunganPaketService.saveBatch(
      validation.data.pak_master_dokumen_id,
      validation.data.items,
      activeUserId
    );

    revalidatePath('/perhitungan-paket');

    return {
      success: true,
      message: 'Berhasil menyimpan data Perhitungan Paket!',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal menyimpan data Perhitungan Paket',
    };
  }
}

export async function getPerhitunganPaketListAction(search = '', page = 1, limit = 10): Promise<ActionResponse> {
  try {
    const result = await PerhitunganPaketService.getList(search, page, limit);
    return {
      success: true,
      message: 'Berhasil mengambil data Perhitungan Paket',
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data Perhitungan Paket',
    };
  }
}

export async function deletePerhitunganPaketAction(rab_id: number): Promise<ActionResponse> {
  try {
    if (!rab_id || rab_id <= 0) {
      return {
        success: false,
        message: 'ID Perhitungan Paket tidak valid.',
      };
    }

    const activeUserId = await getActiveUserId();
    await PerhitunganPaketService.delete(rab_id, activeUserId);
    revalidatePath('/perhitungan-paket');

    return {
      success: true,
      message: 'Berhasil menghapus Perhitungan Paket.',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal menghapus Perhitungan Paket',
    };
  }
}
