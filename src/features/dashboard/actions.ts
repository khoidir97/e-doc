'use server';

import { DashboardRepository } from './repository';
import { ActionResponse, DashboardData } from './types';

export async function getDashboardDataAction(): Promise<ActionResponse<DashboardData>> {
  try {
    const data = await DashboardRepository.getDashboardData();
    return {
      success: true,
      message: 'Data dashboard berhasil dimuat',
      data,
    };
  } catch (error: any) {
    console.error('[getDashboardDataAction] Error:', error);
    return {
      success: false,
      message: error.message || 'Gagal memuat data dashboard',
    };
  }
}

export async function getDokumenByBidangAction(bdg_id: number): Promise<ActionResponse<any[]>> {
  try {
    const data = await DashboardRepository.getDokumenByBidang(bdg_id);
    return {
      success: true,
      message: 'Berhasil memuat rincian dokumen',
      data,
    };
  } catch (error: any) {
    console.error('[getDokumenByBidangAction] Error:', error);
    return {
      success: false,
      message: error.message || 'Gagal memuat rincian dokumen',
    };
  }
}
