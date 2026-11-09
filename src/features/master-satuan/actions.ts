"use server";

import { ActionResponse, MasterSatuanListResult } from '@/features/master-satuan/types';
import { MasterSatuanService } from '@/features/master-satuan/service';

export async function getMasterSatuanListAction(
    search = '',
    page = 1,
    limit = 10
): Promise<ActionResponse<MasterSatuanListResult>> {
    try {
        const result = await MasterSatuanService.getList(search, page, limit);
        return {
            success: true,
            message: 'Berhasil mengambil data Master Satuan',
            data: result,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || 'Gagal mengambil data Master Satuan',
        };
    }

}
