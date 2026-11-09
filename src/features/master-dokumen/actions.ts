"use server";

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { verifyToken } from '@/services/authService';
import { MasterDokumenService } from './service';
import { createMasterDokumenSchema, updateMasterDokumenSchema } from './schema';
import { ActionResponse, CreateMasterDokumenInput, UpdateMasterDokumenInput, MasterDokumenListResult } from './types';

async function getActiveUser(): Promise<{ pgw_id: number; pgw_role: number; pgw_bdg_id?: number | null } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;
    const user = await verifyToken(token);
    return user ? { pgw_id: user.pgw_id, pgw_role: user.pgw_role, pgw_bdg_id: user.pgw_bdg_id } : null;
  } catch {
    return null;
  }
}

async function getActiveUserId(): Promise<number | null> {
  const user = await getActiveUser();
  return user ? user.pgw_id : null;
}

export async function getMasterDokumenByIdAction(
  mdk_id: number
): Promise<ActionResponse<import('./types').MasterDokumen>> {
  try {
    if (!mdk_id || mdk_id <= 0) {
      return {
        success: false,
        message: 'ID Dokumen tidak valid.',
      };
    }
    const result = await MasterDokumenService.getById(mdk_id);
    const activeUser = await getActiveUser();
    if (activeUser && activeUser.pgw_role !== 0) {
      const userBdgId = activeUser.pgw_bdg_id ? Number(activeUser.pgw_bdg_id) : null;
      if (userBdgId !== null && Number(result.mdk_bidang_id) !== userBdgId) {
        return {
          success: false,
          message: 'Anda tidak memiliki hak akses untuk melihat dokumen dari bidang lain.',
        };
      }
    }
    return {
      success: true,
      message: 'Berhasil mengambil data master dokumen',
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data master dokumen',
    };
  }
}

export async function getMasterDokumenListAction(
  search = '',
  page = 1,
  limit = 10
): Promise<ActionResponse<MasterDokumenListResult>> {
  try {
    const activeUser = await getActiveUser();
    let filterBdgId: number | null | undefined = undefined;
    if (activeUser && activeUser.pgw_role !== 0) {
      filterBdgId = activeUser.pgw_bdg_id ? Number(activeUser.pgw_bdg_id) : 0;
    }

    const result = await MasterDokumenService.getList(search, page, limit, filterBdgId);
    return {
      success: true,
      message: 'Berhasil mengambil data master dokumen',
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengambil data master dokumen',
    };
  }
}

export async function createMasterDokumenAction(input: CreateMasterDokumenInput): Promise<ActionResponse> {
  try {
    const validation = createMasterDokumenSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        message: 'Validasi gagal, silakan periksa input Anda.',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const activeUserId = await getActiveUserId();

    await MasterDokumenService.create({
      ...validation.data,
      mdk_created_by: activeUserId,
    });

    revalidatePath('/master-dokumen');

    return {
      success: true,
      message: 'Berhasil menambahkan data master dokumen baru!',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal menambahkan data master dokumen',
    };
  }
}

export async function updateMasterDokumenAction(input: UpdateMasterDokumenInput): Promise<ActionResponse> {
  try {
    const validation = updateMasterDokumenSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        message: 'Validasi gagal, silakan periksa input Anda.',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const activeUserId = await getActiveUserId();

    await MasterDokumenService.update({
      ...validation.data,
      mdk_updated_by: activeUserId,
    });

    revalidatePath('/master-dokumen');

    return {
      success: true,
      message: 'Berhasil memperbarui data master dokumen!',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengedit data master dokumen',
    };
  }
}

export async function deleteMasterDokumenAction(mdk_id: number): Promise<ActionResponse> {
  try {
    if (!mdk_id || mdk_id <= 0) {
      return {
        success: false,
        message: 'ID Dokumen tidak valid.',
      };
    }

    const activeUserId = await getActiveUserId();

    await MasterDokumenService.delete(mdk_id, activeUserId);
    revalidatePath('/master-dokumen');

    return {
      success: true,
      message: 'Berhasil menghapus data master dokumen.',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal menghapus data master dokumen',
    };
  }
}

export async function copyMasterDokumenAction(mdk_id: number): Promise<ActionResponse> {
  try {
    if (!mdk_id || mdk_id <= 0) {
      return {
        success: false,
        message: 'ID Dokumen tidak valid.',
      };
    }

    const existing = await MasterDokumenService.getById(mdk_id);
    if (!existing) {
      return {
        success: false,
        message: 'Data Master Dokumen tidak ditemukan.',
      };
    }

    const activeUserId = await getActiveUserId();

    const inputData: CreateMasterDokumenInput = {
      mdk_nama_pejabat_id: Number(existing.mdk_nama_pejabat_id) || 0,
      mdk_bidang_id: Number(existing.mdk_bidang_id) || 0,
      mdk_pagu_anggaran: Number(existing.mdk_pagu_anggaran) || 0,
      mdk_nama_pejabat_pengadaan_id: Number(existing.mdk_nama_pejabat_pengadaan_id) || 0,
      mdk_nama_pptk_id: Number(existing.mdk_nama_pptk_id) || 0,
      mdk_nama_bendahara_id: Number(existing.mdk_nama_bendahara_id) || 0,
      mdk_nama_perusahaan_id: Number(existing.mdk_nama_perusahaan_id) || 0,
      mdk_nama_pimpinan_perusahaan: existing.mdk_nama_pimpinan_perusahaan || '',
      mdk_jabatan_pimpinan_perusahaan: existing.mdk_jabatan_pimpinan_perusahaan || '',
      mdk_pekerjaan: existing.mdk_pekerjaan || '',
      mdk_alamat: existing.mdk_alamat || '',
      mdk_program: existing.mdk_program || '',
      mdk_kode_program: existing.mdk_kode_program || '',
      mdk_kegiatan: existing.mdk_kegiatan || '',
      mdk_kode_kegiatan: existing.mdk_kode_kegiatan || '',
      mdk_sub_kegiatan: existing.mdk_sub_kegiatan || '',
      mdk_kode_sub_kegiatan: existing.mdk_kode_sub_kegiatan || '',
      mdk_uraian_belanja: existing.mdk_uraian_belanja || '',
      mdk_rekening_belanja: existing.mdk_rekening_belanja || '',
      mdk_kode_level1: existing.mdk_kode_level1 || '',
      mdk_nama_level1: existing.mdk_nama_level1 || '',
      mdk_kode_level2: existing.mdk_kode_level2 || '',
      mdk_nama_level2: existing.mdk_nama_level2 || '',
      mdk_kode_level3: existing.mdk_kode_level3 || '',
      mdk_nama_level3: existing.mdk_nama_level3 || '',
      mdk_kode_level4: existing.mdk_kode_level4 || '',
      mdk_nama_level4: existing.mdk_nama_level4 || '',
      mdk_kode_level5: existing.mdk_kode_level5 || '',
      mdk_nama_level5: existing.mdk_nama_level5 || '',
      mdk_keterangan: existing.mdk_keterangan || '',
      mdk_apbd: existing.mdk_apbd || '',
      mdk_no_dpa: existing.mdk_no_dpa || '',
      mdk_volume: existing.mdk_volume || '',
      mdk_satuan: Number(existing.mdk_satuan) || 0,
      mdk_created_by: activeUserId,
    };

    await MasterDokumenService.create(inputData);

    revalidatePath('/master-dokumen');

    return {
      success: true,
      message: 'Berhasil menduplikat data Master Dokumen!',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal menduplikat data Master Dokumen',
    };
  }
}

export async function toggleLockMasterDokumenAction(mdk_id: number, isLock: number): Promise<ActionResponse> {
  try {
    if (!mdk_id || mdk_id <= 0) {
      return {
        success: false,
        message: 'ID Dokumen tidak valid.',
      };
    }

    const activeUser = await getActiveUser();
    if (!activeUser || activeUser.pgw_role !== 0) {
      return {
        success: false,
        message: 'Akses ditolak. Hanya Administrator (pgw_role = 0) yang dapat mengunci atau membuka kunci dokumen.',
      };
    }

    await MasterDokumenService.setLockStatus(mdk_id, isLock, activeUser.pgw_id);
    revalidatePath('/master-dokumen');
    revalidatePath(`/master-dokumen/${mdk_id}`);

    return {
      success: true,
      message: isLock === 1 ? 'Master Dokumen berhasil dikunci.' : 'Kunci Master Dokumen berhasil dibuka.',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal mengubah status kunci dokumen.',
    };
  }
}
