"use server";

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { verifyToken } from '@/services/authService';
import { BeritaAcaraService } from './service';
import { MasterDokumenService } from '../master-dokumen/service';
import { RencanaAnggaranBiayaService } from '../rencana-anggaran-biaya/service';
import { MasterDokumenRepository } from '../master-dokumen/repository';
import { MasterDokumen } from '../master-dokumen/types';
import { HargaPerkiraanSendiriService } from '../harga-perkiraan-sendiri/service';
import { batchBeritaAcaraSchema, BatchBeritaAcaraInputType, BatchBeritaAcaraSchemaType } from './schema';
import { ActionResponse, BeritaAcara, BeritaAcaraFullData } from './types';

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

export async function getBeritaAcaraWithDetailsAction(mdkId: number, jenis_ba_kode?: string): Promise<ActionResponse<{
  fullData: BeritaAcaraFullData;
  masterDokumen: MasterDokumen | null;
  hpsItems: any[];
}>> {
  try {
    const fullData = await BeritaAcaraService.getFullDataByMasterDokumenId(mdkId, jenis_ba_kode);
    const masterDokumen = await MasterDokumenRepository.findById(mdkId);
    let hpsItems: any[] = [];
    try {
      hpsItems = await HargaPerkiraanSendiriService.getByMasterDokumenId(mdkId);
    } catch {
      hpsItems = [];
    }
    return {
      success: true,
      message: 'Berhasil mengambil data Berita Acara',
      data: { fullData, masterDokumen, hpsItems },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data Berita Acara',
      data: { fullData: { header: null, items: [] }, masterDokumen: null, hpsItems: [] },
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

export async function getMasterJenisBeritaAcaraAction(): Promise<ActionResponse<{ mba_id: number; mba_kode: string; mba_nama: string }[]>> {
  try {
    const data = await BeritaAcaraService.getMasterJenisBeritaAcara();
    return {
      success: true,
      message: 'Berhasil mengambil Master Jenis Berita Acara',
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil Master Jenis Berita Acara',
      data: [],
    };
  }
}

export async function getMasterBaBuktiPerikatanAction(): Promise<ActionResponse<{ mbk_id: number; mbk_kode: string; mbk_nama: string }[]>> {
  try {
    const data = await BeritaAcaraService.getMasterBaBuktiPerikatan();
    return {
      success: true,
      message: 'Berhasil mengambil Master Bukti Perikatan',
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil Master Bukti Perikatan',
      data: [],
    };
  }
}

export async function getBeritaAcaraByMasterDokumenAction(mdk_id: number, jenis_ba_kode?: string): Promise<ActionResponse<BeritaAcaraFullData>> {
  try {
    const fullData = await BeritaAcaraService.getFullDataByMasterDokumenId(mdk_id, jenis_ba_kode);
    return {
      success: true,
      message: 'Berhasil mengambil data Berita Acara',
      data: fullData,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data Berita Acara',
      data: { header: null, items: [] },
    };
  }
}

export async function getRencanaAnggaranBiayaByMasterDokumenAction(mdk_id: number): Promise<ActionResponse<any[]>> {
  try {
    const data = await RencanaAnggaranBiayaService.getByMasterDokumenId(mdk_id);
    return {
      success: true,
      message: 'Berhasil mengambil data RAB',
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data RAB',
      data: [],
    };
  }
}

export async function saveBeritaAcaraBatchAction(input: BatchBeritaAcaraInputType): Promise<ActionResponse> {
  try {
    const validation = batchBeritaAcaraSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        message: 'Validasi gagal, silakan periksa kelengkapan input.',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const activeUserId = await getActiveUserId();

    await BeritaAcaraService.saveBatch(
      validation.data.bac_master_dokumen_id,
      {
        bac_master_jenis_ba_id: validation.data.bac_master_jenis_ba_id,
        bac_bukti_perikatan: validation.data.bac_bukti_perikatan,
        bac_nomor_bukti_perikatan: validation.data.bac_nomor_bukti_perikatan,
        bac_nomor_surat_pemeriksaan: validation.data.bac_nomor_surat_pemeriksaan,
        bac_nomor_surat_serah_terima: validation.data.bac_nomor_surat_serah_terima,
        bac_nomor_surat: validation.data.bac_nomor_surat || '',
        bac_paragraf_pertama: validation.data.bac_paragraf_pertama || '',
        bac_paragraf_kedua: validation.data.bac_paragraf_kedua || '',
        bac_hasil_pemeriksaan: validation.data.bac_hasil_pemeriksaan || '',
        bac_tanggal: validation.data.bac_tanggal,
      },
      validation.data.items,
      activeUserId
    );

    revalidatePath('/berita-acara');

    return {
      success: true,
      message: 'Berhasil menyimpan data Berita Acara!',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal menyimpan data Berita Acara',
    };
  }
}

export async function getBeritaAcaraListAction(search = '', page = 1, limit = 10): Promise<ActionResponse> {
  try {
    const result = await BeritaAcaraService.getList(search, page, limit);
    return {
      success: true,
      message: 'Berhasil mengambil data Berita Acara',
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data Berita Acara',
    };
  }
}

export async function deleteBeritaAcaraAction(dba_id: number): Promise<ActionResponse> {
  try {
    if (!dba_id || dba_id <= 0) {
      return {
        success: false,
        message: 'ID Berita Acara tidak valid.',
      };
    }

    const activeUserId = await getActiveUserId();
    await BeritaAcaraService.delete(dba_id, activeUserId);
    revalidatePath('/berita-acara');

    return {
      success: true,
      message: 'Berhasil menghapus Berita Acara.',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal menghapus Berita Acara',
    };
  }
}
