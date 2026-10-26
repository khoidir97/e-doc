import { PerhitunganPaketRepository } from './repository';
import { PerhitunganPaket, CreatePerhitunganPaketInput, UpdatePerhitunganPaketInput, PerhitunganPaketListResult } from './types';

export class PerhitunganPaketService {
  static async getList(search = '', page = 1, limit = 10): Promise<PerhitunganPaketListResult> {
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit));
    const offset = (validPage - 1) * validLimit;

    const { data, total } = await PerhitunganPaketRepository.findMany(search, validLimit, offset);
    const totalPages = Math.ceil(total / validLimit) || 1;

    return {
      data,
      total,
      page: validPage,
      limit: validLimit,
      totalPages,
    };
  }

  static async getByMasterDokumenId(mdk_id: number): Promise<PerhitunganPaket[]> {
    if (!mdk_id || mdk_id <= 0) return [];
    return await PerhitunganPaketRepository.findByMasterDokumenId(mdk_id);
  }

  static async saveBatch(
    mdk_id: number,
    items: { pak_nilai_invoice: number; pak_dpp: number; pak_ppn: number; pak_pph23: number; pak_dibayar: number }[],
    userId?: number | null
  ): Promise<boolean> {
    if (!mdk_id || mdk_id <= 0) {
      throw new Error('Master Dokumen ID tidak valid.');
    }
    return await PerhitunganPaketRepository.saveBatch(mdk_id, items, userId);
  }

  static async getById(pak_id: number): Promise<PerhitunganPaket> {
    const PerhitunganPaket = await PerhitunganPaketRepository.findById(pak_id);
    if (!PerhitunganPaket) {
      throw new Error('Data Perhitungan Paket tidak ditemukan.');
    }
    return PerhitunganPaket;
  }

  static async create(input: CreatePerhitunganPaketInput): Promise<number> {
    return await PerhitunganPaketRepository.insert(input);
  }

  static async update(input: UpdatePerhitunganPaketInput): Promise<boolean> {
    const existing = await PerhitunganPaketRepository.findById(input.pak_id);
    if (!existing) {
      throw new Error('Data Perhitungan Paket tidak ditemukan.');
    }

    return await PerhitunganPaketRepository.update(input);
  }

  static async delete(pak_id: number, deletedBy?: number | null): Promise<boolean> {
    const existing = await PerhitunganPaketRepository.findById(pak_id);
    if (!existing) {
      throw new Error('Data Perhitungan Paket tidak ditemukan.');
    }
    return await PerhitunganPaketRepository.softDelete(pak_id, deletedBy);
  }
}
