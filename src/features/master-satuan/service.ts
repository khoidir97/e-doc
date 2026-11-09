
import { MasterSatuanRepository } from '@/features/master-satuan/repository';
import { MasterSatuan, MasterSatuanListResult } from '@/features/master-satuan/types';

export class MasterSatuanService {
    static async getList(search = '', page = 1, limit = 10): Promise<MasterSatuanListResult> {
        const validPage = Math.max(1, page);
        const validLimit = Math.max(1, Math.min(1000, limit));
        const offset = (validPage - 1) * validLimit;

        const { data, total } = await MasterSatuanRepository.findMany(search, validLimit, offset);
        const totalPages = Math.ceil(total / validLimit) || 1;

        return {
            data,
            total,
            page: validPage,
            limit: validLimit,
            totalPages,
        };
    }

    static async getById(st_id: number): Promise<MasterSatuan> {
        const satuan = await MasterSatuanRepository.findById(st_id);
        if (!satuan) {
            throw new Error('Data Master Satuan tidak ditemukan.');
        }
        return satuan;
    }
}
