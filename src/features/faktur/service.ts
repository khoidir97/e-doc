import { FakturRepository } from './repository';
import { Faktur, CreateFakturInput, UpdateFakturInput, FakturListResult, FakturWithDetails } from './types';

export class FakturService {
  static async getList(search = '', page = 1, limit = 10): Promise<FakturListResult> {
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit));
    const offset = (validPage - 1) * validLimit;

    const { data, total } = await FakturRepository.findMany(search, validLimit, offset);
    const totalPages = Math.ceil(total / validLimit) || 1;

    return {
      data,
      total,
      page: validPage,
      limit: validLimit,
      totalPages,
    };
  }

  static async getByMasterDokumenId(mdk_id: number): Promise<Faktur[]> {
    if (!mdk_id || mdk_id <= 0) return [];
    return await FakturRepository.findByMasterDokumenId(mdk_id);
  }

  static async getFakturWithDetailsByMasterDokumenId(mdk_id: number): Promise<FakturWithDetails> {
    if (!mdk_id || mdk_id <= 0) {
      return { header: null, details: [] };
    }
    return await FakturRepository.findFakturWithDetailsByMasterDokumenId(mdk_id);
  }

  static async saveBatch(
    data: {
      fkt_master_dokumen_id: number;
      fak_nomor_faktur?: string | null;
      fak_tanggal_faktur?: string | Date | null;
      items: { fkt_id?: number; fkt_jenis_spesifikasi: string; fkt_unit: number; fkt_hari: string; fkt_harga_satuan: number; fkt_total: number }[];
    },
    userId?: number | null
  ): Promise<boolean> {
    if (!data.fkt_master_dokumen_id || data.fkt_master_dokumen_id <= 0) {
      throw new Error('Master Dokumen ID tidak valid.');
    }
    return await FakturRepository.saveBatch(data, userId);
  }

  static async getById(fkt_id: number): Promise<Faktur> {
    const Faktur = await FakturRepository.findById(fkt_id);
    if (!Faktur) {
      throw new Error('Data Faktur tidak ditemukan.');
    }
    return Faktur;
  }

  static async create(input: CreateFakturInput): Promise<number> {
    return await FakturRepository.insert(input);
  }

  static async update(input: UpdateFakturInput): Promise<boolean> {
    const existing = await FakturRepository.findById(input.fkt_id);
    if (!existing) {
      throw new Error('Data Faktur tidak ditemukan.');
    }

    return await FakturRepository.update(input);
  }

  static async delete(fkt_id: number, deletedBy?: number | null): Promise<boolean> {
    const existing = await FakturRepository.findById(fkt_id);
    if (!existing) {
      throw new Error('Data Faktur tidak ditemukan.');
    }
    return await FakturRepository.softDelete(fkt_id, deletedBy);
  }
}
