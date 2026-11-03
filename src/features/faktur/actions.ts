"use server";

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { verifyToken } from '@/services/authService';
import { FakturService } from './service';
import { MasterDokumenService } from '../master-dokumen/service';
import { RencanaAnggaranBiayaService } from '../rencana-anggaran-biaya/service';
import { batchFakturSchema, BatchFakturSchemaType } from './schema';
import { ActionResponse, Faktur, FakturWithDetails } from './types';

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

export async function getFakturByMasterDokumenAction(mdk_id: number): Promise<ActionResponse<Faktur[]>> {
  try {
    const data = await FakturService.getByMasterDokumenId(mdk_id);
    return {
      success: true,
      message: 'Berhasil mengambil data Faktur',
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data Faktur',
      data: [],
    };
  }
}

export async function getFakturWithDetailsAction(mdk_id: number): Promise<ActionResponse<FakturWithDetails>> {
  try {
    const data = await FakturService.getFakturWithDetailsByMasterDokumenId(mdk_id);
    return {
      success: true,
      message: 'Berhasil mengambil data Faktur beserta rincian.',
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data Faktur',
      data: { header: null, details: [] },
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

export async function saveFakturBatchAction(input: BatchFakturSchemaType): Promise<ActionResponse> {
  try {
    const validation = batchFakturSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        message: 'Validasi gagal, silakan periksa kelengkapan input.',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const activeUserId = await getActiveUserId();

    await FakturService.saveBatch(
      {
        fkt_master_dokumen_id: validation.data.fkt_master_dokumen_id,
        fak_nomor_faktur: validation.data.fak_nomor_faktur,
        fak_tanggal_faktur: validation.data.fak_tanggal_faktur,
        items: validation.data.items,
      },
      activeUserId
    );

    revalidatePath('/faktur');
    revalidatePath(`/master-dokumen/${validation.data.fkt_master_dokumen_id}`);

    return {
      success: true,
      message: 'Berhasil menyimpan data Faktur!',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal menyimpan data Faktur',
    };
  }
}

export async function getFakturListAction(search = '', page = 1, limit = 10): Promise<ActionResponse> {
  try {
    const result = await FakturService.getList(search, page, limit);
    return {
      success: true,
      message: 'Berhasil mengambil data Faktur',
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data Faktur',
    };
  }
}

export async function deleteFakturAction(fkt_id: number): Promise<ActionResponse> {
  try {
    if (!fkt_id || fkt_id <= 0) {
      return {
        success: false,
        message: 'ID Faktur tidak valid.',
      };
    }

    const activeUserId = await getActiveUserId();
    await FakturService.delete(fkt_id, activeUserId);
    revalidatePath('/faktur');

    return {
      success: true,
      message: 'Berhasil menghapus Faktur.',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal menghapus Faktur',
    };
  }
}
