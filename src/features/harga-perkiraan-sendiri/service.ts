import { HargaPerkiraanSendiriRepository } from './repository';
import { HargaPerkiraanSendiri, CreateHargaPerkiraanSendiriInput, UpdateHargaPerkiraanSendiriInput, HargaPerkiraanSendiriListResult } from './types';

export class HargaPerkiraanSendiriService {
  static async getList(search = '', page = 1, limit = 10): Promise<HargaPerkiraanSendiriListResult> {
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit));
    const offset = (validPage - 1) * validLimit;

    const { data, total } = await HargaPerkiraanSendiriRepository.findMany(search, validLimit, offset);
    const totalPages = Math.ceil(total / validLimit) || 1;

    return {
      data,
      total,
      page: validPage,
      limit: validLimit,
      totalPages,
    };
  }

  static async getByMasterDokumenId(mdk_id: number): Promise<HargaPerkiraanSendiri[]> {
    if (!mdk_id || mdk_id <= 0) return [];
    return await HargaPerkiraanSendiriRepository.findByMasterDokumenId(mdk_id);
  }

  static async saveBatch(
    mdk_id: number,
    items: { hps_uraian_pekerjaan: string; hps_volume: string; hps_waktu: string; hps_harga_satuan: number; hps_harga_perkiraan_sendiri: number }[],
    userId?: number | null
  ): Promise<boolean> {
    if (!mdk_id || mdk_id <= 0) {
      throw new Error('Master Dokumen ID tidak valid.');
    }
    return await HargaPerkiraanSendiriRepository.saveBatch(mdk_id, items, userId);
  }

  static async getById(hps_id: number): Promise<HargaPerkiraanSendiri> {
    const HargaPerkiraanSendiri = await HargaPerkiraanSendiriRepository.findById(hps_id);
    if (!HargaPerkiraanSendiri) {
      throw new Error('Data HargaPerkiraanSendiri tidak ditemukan.');
    }
    return HargaPerkiraanSendiri;
  }

  static async create(input: CreateHargaPerkiraanSendiriInput): Promise<number> {
    return await HargaPerkiraanSendiriRepository.insert(input);
  }

  static async update(input: UpdateHargaPerkiraanSendiriInput): Promise<boolean> {
    const existing = await HargaPerkiraanSendiriRepository.findById(input.hps_id);
    if (!existing) {
      throw new Error('Data HargaPerkiraanSendiri tidak ditemukan.');
    }

    return await HargaPerkiraanSendiriRepository.update(input);
  }

  static async delete(hps_id: number, deletedBy?: number | null): Promise<boolean> {
    const existing = await HargaPerkiraanSendiriRepository.findById(hps_id);
    if (!existing) {
      throw new Error('Data HargaPerkiraanSendiri tidak ditemukan.');
    }
    return await HargaPerkiraanSendiriRepository.softDelete(hps_id, deletedBy);
  }
}
