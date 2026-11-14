"use server";

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { verifyToken } from '@/services/authService';
import { SpesifikasiTeknisService } from './service';
import { saveSpesifikasiTeknisSchema } from './schema';
import {
  ActionResponse,
  SpesifikasiTeknisWithDetails,
  KakOptionItemForSpt,
  SaveSpesifikasiTeknisPayload,
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

export async function getSpesifikasiTeknisByKakIdAction(
  kakId: number
): Promise<ActionResponse<SpesifikasiTeknisWithDetails>> {
  try {
    const data = await SpesifikasiTeknisService.getByKakId(kakId);
    return {
      success: true,
      message: 'Berhasil memuat data Spesifikasi Teknis',
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal memuat data Spesifikasi Teknis',
      data: {
        spesifikasiTeknis: null,
        detailTeknis: [],
        detailJumlah: [],
        detailPelakuUsaha: [],
        kak: null,
        masterDokumen: null,
        ppkPegawai: null,
      },
    };
  }
}

export async function getSpesifikasiTeknisByIdAction(
  sptId: number
): Promise<ActionResponse<SpesifikasiTeknisWithDetails>> {
  try {
    const data = await SpesifikasiTeknisService.getById(sptId);
    return {
      success: true,
      message: 'Berhasil memuat data Spesifikasi Teknis',
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal memuat data Spesifikasi Teknis',
      data: {
        spesifikasiTeknis: null,
        detailTeknis: [],
        detailJumlah: [],
        detailPelakuUsaha: [],
        kak: null,
        masterDokumen: null,
        ppkPegawai: null,
      },
    };
  }
}

export async function getKakOptionsForSptAction(): Promise<ActionResponse<KakOptionItemForSpt[]>> {
  try {
    const data = await SpesifikasiTeknisService.getKakOptions();
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

export async function getSatuanListForSptAction(): Promise<ActionResponse<{ st_id: number; st_nama: string }[]>> {
  try {
    const data = await SpesifikasiTeknisService.getSatuanList();
    return {
      success: true,
      message: 'Berhasil mengambil data satuan',
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data satuan',
      data: [],
    };
  }
}

export async function getPegawaiListForSptAction(): Promise<ActionResponse<{ pgw_id: number; pgw_nama: string; pgw_nip: string; pgw_jabatan: string }[]>> {
  try {
    const data = await SpesifikasiTeknisService.getPegawaiList();
    return {
      success: true,
      message: 'Berhasil mengambil data pegawai',
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data pegawai',
      data: [],
    };
  }
}

export async function saveSpesifikasiTeknisAction(
  payload: SaveSpesifikasiTeknisPayload
): Promise<ActionResponse<{ sptId: number }>> {
  try {
    const validation = saveSpesifikasiTeknisSchema.safeParse(payload);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      const firstErrorMsg = Object.values(fieldErrors).flat()[0] || 'Validasi gagal, silakan periksa input Anda.';
      return {
        success: false,
        message: firstErrorMsg,
      };
    }

    const userId = await getActiveUserId();
    const sptId = await SpesifikasiTeknisService.save(payload, userId);

    revalidatePath('/spesifikasi-teknis');
    revalidatePath(`/spesifikasi-teknis/print/${sptId}`);
    revalidatePath(`/spesifikasi-teknis/print/kak-${payload.spt_kak_id}`);

    return {
      success: true,
      message: 'Dokumen Spesifikasi Teknis berhasil disimpan.',
      data: { sptId },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal menyimpan Dokumen Spesifikasi Teknis.',
    };
  }
}

export async function deleteSpesifikasiTeknisAction(
  sptId: number
): Promise<ActionResponse> {
  try {
    const userId = await getActiveUserId();
    await SpesifikasiTeknisService.delete(sptId, userId);

    revalidatePath('/spesifikasi-teknis');

    return {
      success: true,
      message: 'Dokumen Spesifikasi Teknis berhasil dihapus.',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal menghapus Dokumen Spesifikasi Teknis.',
    };
  }
}

