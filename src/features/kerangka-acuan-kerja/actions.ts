"use server";

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { verifyToken } from '@/services/authService';
import { KerangkaAcuanKerjaService } from './service';
import { MasterDokumenService } from '../master-dokumen/service';
import { MasterDokumenRepository } from '../master-dokumen/repository';
import { MasterDokumen } from '../master-dokumen/types';
import { HargaPerkiraanSendiriService } from '../harga-perkiraan-sendiri/service';
import { saveKakSchema } from './schema';
import {
  ActionResponse,
  KerangkaAcuanKerja,
  KerangkaAcuanKerjaWithDetails,
  SaveKakPayload,
  KakOptionItem,
} from './types';

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

export async function getKerangkaAcuanKerjaByMasterDokumenAction(
  mdkId: number
): Promise<ActionResponse<{
  kakDetails: KerangkaAcuanKerjaWithDetails;
  masterDokumen: MasterDokumen | null;
}>> {
  try {
    const kakDetails = await KerangkaAcuanKerjaService.getByMasterDokumenId(mdkId);
    const masterDokumen = await MasterDokumenRepository.findById(mdkId);
    return {
      success: true,
      message: 'Berhasil memuat data Kerangka Acuan Kerja (KAK)',
      data: { kakDetails, masterDokumen },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal memuat data Kerangka Acuan Kerja',
      data: {
        kakDetails: {
          kak: null,
          perkiraanBiayaList: [],
          spesifikasiTeknisList: [],
        },
        masterDokumen: null,
      },
    };
  }
}

export async function getKerangkaAcuanKerjaByIdAction(
  kakId: number
): Promise<ActionResponse<{
  kakDetails: KerangkaAcuanKerjaWithDetails;
  masterDokumen: MasterDokumen | null;
}>> {
  try {
    const kakDetails = await KerangkaAcuanKerjaService.getById(kakId);
    let masterDokumen: MasterDokumen | null = null;
    if (kakDetails.kak?.kak_master_dokumen_id) {
      masterDokumen = await MasterDokumenRepository.findById(kakDetails.kak.kak_master_dokumen_id);
    }
    return {
      success: true,
      message: 'Berhasil memuat data Kerangka Acuan Kerja (KAK)',
      data: { kakDetails, masterDokumen },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal memuat data Kerangka Acuan Kerja',
      data: {
        kakDetails: {
          kak: null,
          perkiraanBiayaList: [],
          spesifikasiTeknisList: [],
        },
        masterDokumen: null,
      },
    };
  }
}

export async function getManualKakListAction(): Promise<ActionResponse<KerangkaAcuanKerja[]>> {
  try {
    const list = await KerangkaAcuanKerjaService.getManualKakList();
    return {
      success: true,
      message: 'Berhasil memuat daftar KAK Manual',
      data: list,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal memuat daftar KAK Manual',
      data: [],
    };
  }
}

export async function getAllKakOptionsAction(): Promise<ActionResponse<KakOptionItem[]>> {
  try {
    const list = await KerangkaAcuanKerjaService.getAllKakForSelection();
    return {
      success: true,
      message: 'Berhasil memuat daftar Kerangka Acuan Kerja (KAK)',
      data: list,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal memuat daftar Kerangka Acuan Kerja',
      data: [],
    };
  }
}

export async function saveKerangkaAcuanKerjaAction(
  payload: SaveKakPayload
): Promise<ActionResponse<{ kakId: number }>> {
  try {
    const validation = saveKakSchema.safeParse(payload);
    if (!validation.success) {
      return {
        success: false,
        message: 'Validasi form gagal',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const userId = await getActiveUserId();
    const kakId = await KerangkaAcuanKerjaService.saveAll(validation.data as SaveKakPayload, userId);

    revalidatePath('/kerangka-acuan-kerja');
    if (payload.kak_master_dokumen_id) {
      revalidatePath(`/kerangka-acuan-kerja/print/${payload.kak_master_dokumen_id}`);
    }
    revalidatePath(`/kerangka-acuan-kerja/print/kak-${kakId}`);

    return {
      success: true,
      message: 'Kerangka Acuan Kerja berhasil disimpan.',
      data: { kakId },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal menyimpan Kerangka Acuan Kerja.',
    };
  }
}

export async function deleteKerangkaAcuanKerjaAction(
  kakId: number
): Promise<ActionResponse<void>> {
  try {
    const userId = await getActiveUserId();
    await KerangkaAcuanKerjaService.delete(kakId, userId);

    revalidatePath('/kerangka-acuan-kerja');

    return {
      success: true,
      message: 'Kerangka Acuan Kerja berhasil dihapus.',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal menghapus Kerangka Acuan Kerja.',
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
      data: result.data || [],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil opsi Master Dokumen',
      data: [],
    };
  }
}

export async function getHpsItemsForKakAction(mdkId: number): Promise<ActionResponse<any[]>> {
  try {
    const hpsItems = await HargaPerkiraanSendiriService.getByMasterDokumenId(mdkId);
    return {
      success: true,
      message: 'Berhasil mengambil data HPS',
      data: hpsItems,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data HPS',
      data: [],
    };
  }
}

