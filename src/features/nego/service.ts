import { NegoRepository } from './repository';
import { Nego, CreateNegoInput, UpdateNegoInput, NegoListResult } from './types';

export class NegoService {
  static async getList(search = '', page = 1, limit = 10): Promise<NegoListResult> {
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit));
    const offset = (validPage - 1) * validLimit;

    const { data, total } = await NegoRepository.findMany(search, validLimit, offset);
    const totalPages = Math.ceil(total / validLimit) || 1;

    return {
      data,
      total,
      page: validPage,
      limit: validLimit,
      totalPages,
    };
  }

  static async getByMasterDokumenId(mdk_id: number): Promise<Nego[]> {
    if (!mdk_id || mdk_id <= 0) return [];
    return await NegoRepository.findByMasterDokumenId(mdk_id);
  }

  static async saveBatch(
    mdk_id: number,
    items: { nego_uraian_kegiatan: string; nego_volume: string; nego_waktu: string; nego_hps_harga_satuan: number; nego_hps_jumlah_harga: number; nego_pnw_harga_satuan: number; nego_pnw_jumlah_harga: number; nego_negosiasi_harga_satuan: number; nego_negosiasi_jumlah_harga: number }[],
    userId?: number | null
  ): Promise<boolean> {
    if (!mdk_id || mdk_id <= 0) {
      throw new Error('Master Dokumen ID tidak valid.');
    }
    return await NegoRepository.saveBatch(mdk_id, items, userId);
  }

  static async getById(nego_id: number): Promise<Nego> {
    const Nego = await NegoRepository.findById(nego_id);
    if (!Nego) {
      throw new Error('Data Nego tidak ditemukan.');
    }
    return Nego;
  }

  static async create(input: CreateNegoInput): Promise<number> {
    return await NegoRepository.insert(input);
  }

  static async update(input: UpdateNegoInput): Promise<boolean> {
    const existing = await NegoRepository.findById(input.nego_id);
    if (!existing) {
      throw new Error('Data Nego tidak ditemukan.');
    }

    return await NegoRepository.update(input);
  }

  static async delete(nego_id: number, deletedBy?: number | null): Promise<boolean> {
    const existing = await NegoRepository.findById(nego_id);
    if (!existing) {
      throw new Error('Data Nego tidak ditemukan.');
    }
    return await NegoRepository.softDelete(nego_id, deletedBy);
  }
}
