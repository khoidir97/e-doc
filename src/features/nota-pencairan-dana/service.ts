import { NotaPencairanDanaRepository } from './repository';
import { NotaPencairanDana, CreateNotaPencairanDanaInput, UpdateNotaPencairanDanaInput, NotaPencairanDanaListResult } from './types';

export class NotaPencairanDanaService {
  static async getList(search = '', page = 1, limit = 10): Promise<NotaPencairanDanaListResult> {
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit));
    const offset = (validPage - 1) * validLimit;

    const { data, total } = await NotaPencairanDanaRepository.findMany(search, validLimit, offset);
    const totalPages = Math.ceil(total / validLimit) || 1;

    return {
      data,
      total,
      page: validPage,
      limit: validLimit,
      totalPages,
    };
  }

  static async getByMasterDokumenId(mdk_id: number): Promise<NotaPencairanDana[]> {
    if (!mdk_id || mdk_id <= 0) return [];
    return await NotaPencairanDanaRepository.findByMasterDokumenId(mdk_id);
  }

  static async saveBatch(
    mdk_id: number,
    items: { dpd_uraian: string; dpd_dpa_volume: string; dpd_dpa_satuan: string; dpd_dpa_nilai: number; dpd_belum_volume: string | null; dpd_belum_nilai: number | null; dpd_saatini_volume: string | null; dpd_saatini_nilai: number | null; dpd_saatini_ppn: number | null; dpd_saatini_pph23: number | null; dpd_saatini_total_pajak: number | null; dpd_saatini_pembayaran: number | null; dpd_sisa_volume: string | null; dpd_sisa_nilai: number | null }[],
    userId?: number | null
  ): Promise<boolean> {
    if (!mdk_id || mdk_id <= 0) {
      throw new Error('Master Dokumen ID tidak valid.');
    }
    return await NotaPencairanDanaRepository.saveBatch(mdk_id, items, userId);
  }

  static async getById(dpd_id: number): Promise<NotaPencairanDana> {
    const NotaPencairanDana = await NotaPencairanDanaRepository.findById(dpd_id);
    if (!NotaPencairanDana) {
      throw new Error('Data NotaPencairanDana tidak ditemukan.');
    }
    return NotaPencairanDana;
  }

  static async create(input: CreateNotaPencairanDanaInput): Promise<number> {
    return await NotaPencairanDanaRepository.insert(input);
  }

  static async update(input: UpdateNotaPencairanDanaInput): Promise<boolean> {
    const existing = await NotaPencairanDanaRepository.findById(input.dpd_id);
    if (!existing) {
      throw new Error('Data NotaPencairanDana tidak ditemukan.');
    }

    return await NotaPencairanDanaRepository.update(input);
  }

  static async delete(dpd_id: number, deletedBy?: number | null): Promise<boolean> {
    const existing = await NotaPencairanDanaRepository.findById(dpd_id);
    if (!existing) {
      throw new Error('Data NotaPencairanDana tidak ditemukan.');
    }
    return await NotaPencairanDanaRepository.softDelete(dpd_id, deletedBy);
  }
}
