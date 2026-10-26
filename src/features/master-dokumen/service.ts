import { MasterDokumenRepository } from './repository';
import { MasterDokumen, CreateMasterDokumenInput, UpdateMasterDokumenInput, MasterDokumenListResult } from './types';

export class MasterDokumenService {
  static async getList(search = '', page = 1, limit = 10): Promise<MasterDokumenListResult> {
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit));
    const offset = (validPage - 1) * validLimit;

    const { data, total } = await MasterDokumenRepository.findMany(search, validLimit, offset);
    const totalPages = Math.ceil(total / validLimit) || 1;

    return {
      data,
      total,
      page: validPage,
      limit: validLimit,
      totalPages,
    };
  }

  static async getById(mdk_id: number): Promise<MasterDokumen> {
    const masterDokumen = await MasterDokumenRepository.findById(mdk_id);
    if (!masterDokumen) {
      throw new Error('Data Master Dokumen tidak ditemukan.');
    }
    return masterDokumen;
  }

  static async create(input: CreateMasterDokumenInput): Promise<number> {
    return await MasterDokumenRepository.insert(input);
  }

  static async update(input: UpdateMasterDokumenInput): Promise<boolean> {
    const existing = await MasterDokumenRepository.findById(input.mdk_id);
    if (!existing) {
      throw new Error('Data Master Dokumen tidak ditemukan.');
    }

    return await MasterDokumenRepository.update(input);
  }

  static async delete(mdk_id: number, deletedBy?: number | null): Promise<boolean> {
    const existing = await MasterDokumenRepository.findById(mdk_id);
    if (!existing) {
      throw new Error('Data Master Dokumen tidak ditemukan.');
    }
    return await MasterDokumenRepository.softDelete(mdk_id, deletedBy);
  }
}
