import { RencanaAnggaranBiayaRepository } from './repository';
import { RencanaAnggaranBiaya, CreateRencanaAnggaranBiayaInput, UpdateRencanaAnggaranBiayaInput, RencanaAnggaranBiayaListResult } from './types';

export class RencanaAnggaranBiayaService {
  static async getList(search = '', page = 1, limit = 10): Promise<RencanaAnggaranBiayaListResult> {
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit));
    const offset = (validPage - 1) * validLimit;

    const { data, total } = await RencanaAnggaranBiayaRepository.findMany(search, validLimit, offset);
    const totalPages = Math.ceil(total / validLimit) || 1;

    return {
      data,
      total,
      page: validPage,
      limit: validLimit,
      totalPages,
    };
  }

  static async getByMasterDokumenId(mdk_id: number): Promise<RencanaAnggaranBiaya[]> {
    if (!mdk_id || mdk_id <= 0) return [];
    return await RencanaAnggaranBiayaRepository.findByMasterDokumenId(mdk_id);
  }

  static async saveBatch(
    mdk_id: number,
    items: { rab_uraian_pekerjaan: string; rab_volume: string; rab_waktu: string; rab_harga_satuan: number; rab_harga_perkiraan_sendiri: number }[],
    userId?: number | null
  ): Promise<boolean> {
    if (!mdk_id || mdk_id <= 0) {
      throw new Error('Master Dokumen ID tidak valid.');
    }
    return await RencanaAnggaranBiayaRepository.saveBatch(mdk_id, items, userId);
  }

  static async getById(rab_id: number): Promise<RencanaAnggaranBiaya> {
    const RencanaAnggaranBiaya = await RencanaAnggaranBiayaRepository.findById(rab_id);
    if (!RencanaAnggaranBiaya) {
      throw new Error('Data RencanaAnggaranBiaya tidak ditemukan.');
    }
    return RencanaAnggaranBiaya;
  }

  static async create(input: CreateRencanaAnggaranBiayaInput): Promise<number> {
    return await RencanaAnggaranBiayaRepository.insert(input);
  }

  static async update(input: UpdateRencanaAnggaranBiayaInput): Promise<boolean> {
    const existing = await RencanaAnggaranBiayaRepository.findById(input.rab_id);
    if (!existing) {
      throw new Error('Data RencanaAnggaranBiaya tidak ditemukan.');
    }

    return await RencanaAnggaranBiayaRepository.update(input);
  }

  static async delete(rab_id: number, deletedBy?: number | null): Promise<boolean> {
    const existing = await RencanaAnggaranBiayaRepository.findById(rab_id);
    if (!existing) {
      throw new Error('Data RencanaAnggaranBiaya tidak ditemukan.');
    }
    return await RencanaAnggaranBiayaRepository.softDelete(rab_id, deletedBy);
  }
}
