"use server";

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { verifyToken } from '@/services/authService';
import { PermohonanService } from './service';
import { savePermohonanSchema } from './schema';
import {
  ActionResponse,
  PermohonanWithDetails,
  KakOptionItem,
  SavePermohonanPayload,
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

export async function getPermohonanByKakIdAction(
  kakId: number
): Promise<ActionResponse<PermohonanWithDetails>> {
  try {
    const data = await PermohonanService.getByKakId(kakId);
    return {
      success: true,
      message: 'Berhasil memuat data Permohonan',
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal memuat data Permohonan',
      data: {
        permohonan: null,
        kak: null,
        masterDokumen: null,
        totalBiayaKak: 0,
        totalHps: 0,
      },
    };
  }
}

export async function getPermohonanByIdAction(
  pmhId: number
): Promise<ActionResponse<PermohonanWithDetails>> {
  try {
    const data = await PermohonanService.getById(pmhId);
    return {
      success: true,
      message: 'Berhasil memuat data Permohonan',
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal memuat data Permohonan',
      data: {
        permohonan: null,
        kak: null,
        masterDokumen: null,
        totalBiayaKak: 0,
        totalHps: 0,
      },
    };
  }
}

export async function getKakOptionsForPermohonanAction(): Promise<ActionResponse<KakOptionItem[]>> {
  try {
    const data = await PermohonanService.getKakOptions();
    return {
      success: true,
      message: 'Berhasil mengambil opsi KAK',
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil opsi KAK',
      data: [],
    };
  }
}

export async function savePermohonanAction(
  payload: SavePermohonanPayload
): Promise<ActionResponse<{ pmhId: number }>> {
  try {
    const validation = savePermohonanSchema.safeParse(payload);
    if (!validation.success) {
      return {
        success: false,
        message: 'Validasi form gagal',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const userId = await getActiveUserId();
    const pmhId = await PermohonanService.save(validation.data as SavePermohonanPayload, userId);

    revalidatePath('/permohonan');
    revalidatePath(`/permohonan/print/${pmhId}`);
    revalidatePath(`/permohonan/print/kak-${payload.pmh_kak_id}`);

    return {
      success: true,
      message: 'Surat Permohonan (Nota Dinas) berhasil disimpan.',
      data: { pmhId },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal menyimpan Surat Permohonan.',
    };
  }
}

export async function deletePermohonanAction(
  pmhId: number
): Promise<ActionResponse<void>> {
  try {
    const userId = await getActiveUserId();
    await PermohonanService.delete(pmhId, userId);

    revalidatePath('/permohonan');

    return {
      success: true,
      message: 'Surat Permohonan berhasil dihapus.',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal menghapus Surat Permohonan.',
    };
  }
}
