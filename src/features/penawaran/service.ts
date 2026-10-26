import { PenawaranRepository } from './repository';
import { Penawaran, CreatePenawaranInput, UpdatePenawaranInput, PenawaranListResult } from './types';

export class PenawaranService {
  static async getList(search = '', page = 1, limit = 10): Promise<PenawaranListResult> {
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit));
    const offset = (validPage - 1) * validLimit;

    const { data, total } = await PenawaranRepository.findMany(search, validLimit, offset);
    const totalPages = Math.ceil(total / validLimit) || 1;

    return {
      data,
      total,
      page: validPage,
      limit: validLimit,
      totalPages,
    };
  }

  static async getByMasterDokumenId(mdk_id: number): Promise<Penawaran[]> {
    if (!mdk_id || mdk_id <= 0) return [];
    return await PenawaranRepository.findByMasterDokumenId(mdk_id);
  }

  static async saveBatch(
    mdk_id: number,
    items: { pnw_uraian_pekerjaan: string; pnw_volume: string; pnw_waktu: string; pnw_harga_satuan: number; pnw_harga_perkiraan_sendiri: number }[],
    userId?: number | null
  ): Promise<boolean> {
    if (!mdk_id || mdk_id <= 0) {
      throw new Error('Master Dokumen ID tidak valid.');
    }
    return await PenawaranRepository.saveBatch(mdk_id, items, userId);
  }

  static async getById(pnw_id: number): Promise<Penawaran> {
    const Penawaran = await PenawaranRepository.findById(pnw_id);
    if (!Penawaran) {
      throw new Error('Data Penawaran tidak ditemukan.');
    }
    return Penawaran;
  }

  static async create(input: CreatePenawaranInput): Promise<number> {
    return await PenawaranRepository.insert(input);
  }

  static async update(input: UpdatePenawaranInput): Promise<boolean> {
    const existing = await PenawaranRepository.findById(input.pnw_id);
    if (!existing) {
      throw new Error('Data Penawaran tidak ditemukan.');
    }

    return await PenawaranRepository.update(input);
  }

  static async delete(pnw_id: number, deletedBy?: number | null): Promise<boolean> {
    const existing = await PenawaranRepository.findById(pnw_id);
    if (!existing) {
      throw new Error('Data Penawaran tidak ditemukan.');
    }
    return await PenawaranRepository.softDelete(pnw_id, deletedBy);
  }
}
