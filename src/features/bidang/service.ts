import { BidangRepository } from './repository';
import { Bidang, CreateBidangInput, UpdateBidangInput, BidangListResult } from './types';

export class BidangService {
  static async getList(search = '', page = 1, limit = 10): Promise<BidangListResult> {
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit));
    const offset = (validPage - 1) * validLimit;

    const { data, total } = await BidangRepository.findMany(search, validLimit, offset);
    const totalPages = Math.ceil(total / validLimit) || 1;

    return {
      data,
      total,
      page: validPage,
      limit: validLimit,
      totalPages,
    };
  }

  static async getById(bdg_id: number): Promise<Bidang> {
    const Bidang = await BidangRepository.findById(bdg_id);
    if (!Bidang) {
      throw new Error('Data Bidang tidak ditemukan.');
    }
    return Bidang;
  }

  static async create(input: CreateBidangInput): Promise<number> {
    // Check duplicate name
    const existing = await BidangRepository.findByName(input.bdg_nama);
    if (existing) {
      throw new Error(`Bidang dengan nama "${input.bdg_nama}" sudah terdaftar.`);
    }

    return await BidangRepository.insert(input);
  }

  static async update(input: UpdateBidangInput): Promise<boolean> {
    const existing = await BidangRepository.findById(input.bdg_id);
    if (!existing) {
      throw new Error('Data Bidang tidak ditemukan.');
    }

    // Check duplicate name if changed
    if (input.bdg_nama !== existing.bdg_nama) {
      const nameCheck = await BidangRepository.findByName(input.bdg_nama);
      if (nameCheck && nameCheck.bdg_id !== input.bdg_id) {
        throw new Error(`Nama "${input.bdg_nama}" sudah digunakan oleh Bidang lain.`);
      }
    }

    return await BidangRepository.update(input);
  }

  static async delete(bdg_id: number, deletedBy?: number | null): Promise<boolean> {
    const existing = await BidangRepository.findById(bdg_id);
    if (!existing) {
      throw new Error('Data Bidang tidak ditemukan.');
    }
    return await BidangRepository.softDelete(bdg_id, deletedBy);
  }
}

