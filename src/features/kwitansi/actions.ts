"use server";

import { cookies } from 'next/headers';
import { verifyToken } from '@/services/authService';
import { KwitansiRepository } from './repository';
import { ActionResponse, Kwitansi } from './types';

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

export async function getKwitansiByMasterDokumenIdAction(
  mdk_id: number
): Promise<ActionResponse<{ kwitansi: Kwitansi | null; kwitansiList: Kwitansi[]; pak_dibayar: number | null; pkt_no_spk_kwitansi: string | null; nego_jumlah: number | null }>> {
  try {
    if (!mdk_id) {
      return { success: false, message: 'ID Master Dokumen tidak valid.' };
    }

    const kwitansiList = await KwitansiRepository.findAllByMasterDokumenId(mdk_id);
    const kwitansi = kwitansiList.length > 0 ? kwitansiList[0] : null;
    const { pak_dibayar, pkt_no_spk_kwitansi, nego_jumlah } = await KwitansiRepository.findPakDibayarByMasterDokumenId(mdk_id);

    return {
      success: true,
      message: 'Data Kwitansi berhasil dimuat.',
      data: {
        kwitansi,
        kwitansiList,
        pak_dibayar,
        pkt_no_spk_kwitansi,
        nego_jumlah,
      },
    };
  } catch (error: any) {
    console.error('Error fetching kwitansi:', error);
    return {
      success: false,
      message: error.message || 'Gagal memuat data Kwitansi.',
    };
  }
}

export async function saveKwitansiAction(
  mdk_id: number,
  bukuKasNo: string,
  uangSejumlah: number | string,
  sudahTerimaDari: string,
  tanggalLunasDibayar?: string | null,
  tanggalTerimaUang?: string | null,
  noSp2d?: string | null,
  statusLunas?: number | null
): Promise<ActionResponse<boolean>> {
  try {
    if (!mdk_id) {
      return { success: false, message: 'ID Master Dokumen tidak valid.' };
    }

    const userId = await getActiveUserId();
    const success = await KwitansiRepository.upsert(
      mdk_id,
      bukuKasNo,
      uangSejumlah,
      sudahTerimaDari,
      tanggalLunasDibayar,
      tanggalTerimaUang,
      noSp2d,
      statusLunas,
      userId
    );

    return {
      success,
      message: success ? 'Data Kwitansi berhasil disimpan.' : 'Gagal menyimpan data Kwitansi.',
      data: success,
    };
  } catch (error: any) {
    console.error('Error saving kwitansi:', error);
    return {
      success: false,
      message: error.message || 'Gagal menyimpan data Kwitansi.',
    };
  }
}

export async function saveKwitansiItemAction(
  mdk_id: number,
  kwt_id: number | null | undefined,
  bukuKasNo: string,
  uangSejumlah: number | string,
  sudahTerimaDari: string,
  tanggalLunasDibayar?: string | null,
  tanggalTerimaUang?: string | null,
  noSp2d?: string | null,
  statusLunas?: number | null
): Promise<ActionResponse<Kwitansi | boolean>> {
  try {
    if (!mdk_id) {
      return { success: false, message: 'ID Master Dokumen tidak valid.' };
    }

    const userId = await getActiveUserId();

    if (kwt_id && kwt_id > 0) {
      const updated = await KwitansiRepository.update(
        kwt_id,
        bukuKasNo,
        uangSejumlah,
        sudahTerimaDari,
        tanggalLunasDibayar,
        tanggalTerimaUang,
        noSp2d,
        statusLunas,
        userId
      );
      return {
        success: updated,
        message: updated ? 'Kwitansi berhasil diperbarui.' : 'Gagal memperbarui Kwitansi.',
      };
    } else {
      const created = await KwitansiRepository.create(
        mdk_id,
        bukuKasNo,
        uangSejumlah,
        sudahTerimaDari,
        tanggalLunasDibayar,
        tanggalTerimaUang,
        noSp2d,
        statusLunas,
        userId
      );
      return {
        success: created !== null,
        message: created ? 'Kwitansi baru berhasil ditambahkan.' : 'Gagal menambahkan Kwitansi.',
        data: created || undefined,
      };
    }
  } catch (error: any) {
    console.error('Error saving kwitansi item:', error);
    return {
      success: false,
      message: error.message || 'Gagal menyimpan Kwitansi.',
    };
  }
}

export async function saveAllKwitansiAction(
  mdk_id: number,
  items: Array<{
    kwt_id?: number;
    kwt_buku_kas_umum_no: string;
    kwt_uang_sejumlah: number | string;
    kwt_sudah_terima_dari: string;
    kwt_tanggal_lunas_dibayar?: string | null;
    kwt_tanggal_terima_uang?: string | null;
    kwt_no_sp2d?: string | null;
    kwt_status_lunas?: number | null;
  }>
): Promise<ActionResponse<boolean>> {
  try {
    if (!mdk_id) {
      return { success: false, message: 'ID Master Dokumen tidak valid.' };
    }

    const userId = await getActiveUserId();

    for (const item of items) {
      if (item.kwt_id && item.kwt_id > 0) {
        await KwitansiRepository.update(
          item.kwt_id,
          item.kwt_buku_kas_umum_no,
          item.kwt_uang_sejumlah,
          item.kwt_sudah_terima_dari,
          item.kwt_tanggal_lunas_dibayar,
          item.kwt_tanggal_terima_uang,
          item.kwt_no_sp2d,
          item.kwt_status_lunas,
          userId
        );
      } else {
        await KwitansiRepository.create(
          mdk_id,
          item.kwt_buku_kas_umum_no,
          item.kwt_uang_sejumlah,
          item.kwt_sudah_terima_dari,
          item.kwt_tanggal_lunas_dibayar,
          item.kwt_tanggal_terima_uang,
          item.kwt_no_sp2d,
          item.kwt_status_lunas,
          userId
        );
      }
    }

    return {
      success: true,
      message: 'Seluruh data Kwitansi berhasil disimpan.',
      data: true,
    };
  } catch (error: any) {
    console.error('Error saving all kwitansi:', error);
    return {
      success: false,
      message: error.message || 'Gagal menyimpan seluruh Kwitansi.',
    };
  }
}

export async function deleteKwitansiAction(
  kwt_id: number
): Promise<ActionResponse<boolean>> {
  try {
    if (!kwt_id) {
      return { success: false, message: 'ID Kwitansi tidak valid.' };
    }

    const userId = await getActiveUserId();
    const success = await KwitansiRepository.delete(kwt_id, userId);
    return {
      success,
      message: success ? 'Kwitansi berhasil dihapus.' : 'Gagal menghapus Kwitansi.',
      data: success,
    };
  } catch (error: any) {
    console.error('Error deleting kwitansi:', error);
    return {
      success: false,
      message: error.message || 'Gagal menghapus Kwitansi.',
    };
  }
}
