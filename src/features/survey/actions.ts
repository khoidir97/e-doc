"use server";

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { verifyToken } from '@/services/authService';
import { SurveyService } from './service';
import { MasterDokumenService } from '../master-dokumen/service';
import { batchSurveySchema, BatchSurveySchemaType } from './schema';
import { ActionResponse, DetailSurvey, SurveyWithDetails } from './types';

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

export async function getSurveyByMasterDokumenAction(mdk_id: number): Promise<ActionResponse<DetailSurvey[]>> {
  try {
    const data = await SurveyService.getByMasterDokumenId(mdk_id);
    return {
      success: true,
      message: 'Berhasil mengambil data Survey',
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data Survey',
      data: [],
    };
  }
}

export async function getSurveyWithDetailsAction(mdk_id: number): Promise<ActionResponse<SurveyWithDetails>> {
  try {
    const data = await SurveyService.getSurveyWithDetailsByMasterDokumenId(mdk_id);
    return {
      success: true,
      message: 'Berhasil mengambil data survey beserta rincian.',
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data survey',
      data: { header: null, details: [] },
    };
  }
}

export async function saveSurveyBatchAction(input: BatchSurveySchemaType): Promise<ActionResponse> {
  try {
    const validation = batchSurveySchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        message: 'Validasi gagal, silakan periksa kelengkapan input.',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const activeUserId = await getActiveUserId();

    await SurveyService.saveBatch(validation.data, activeUserId);

    revalidatePath('/survey');
    revalidatePath(`/master-dokumen/${validation.data.srv_master_dokumen_id}`);

    return {
      success: true,
      message: 'Berhasil menyimpan data Survey!',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal menyimpan data Survey',
    };
  }
}

export async function getSurveyListAction(search = '', page = 1, limit = 10): Promise<ActionResponse> {
  try {
    const result = await SurveyService.getList(search, page, limit);
    return {
      success: true,
      message: 'Berhasil mengambil data Survey',
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data Survey',
    };
  }
}

export async function deleteSurveyAction(dsrv_id: number): Promise<ActionResponse> {
  try {
    if (!dsrv_id || dsrv_id <= 0) {
      return {
        success: false,
        message: 'ID Survey tidak valid.',
      };
    }

    const activeUserId = await getActiveUserId();
    await SurveyService.delete(dsrv_id, activeUserId);
    revalidatePath('/survey');

    return {
      success: true,
      message: 'Berhasil menghapus Survey.',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal menghapus Survey',
    };
  }
}

