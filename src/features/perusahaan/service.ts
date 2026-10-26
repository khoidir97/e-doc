import { PerusahaanRepository } from './repository';
import { Perusahaan, CreatePerusahaanInput, UpdatePerusahaanInput, PerusahaanListResult } from './types';

export class PerusahaanService {
  static async getList(search = '', page = 1, limit = 10): Promise<PerusahaanListResult> {
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit));
    const offset = (validPage - 1) * validLimit;

    const { data, total } = await PerusahaanRepository.findMany(search, validLimit, offset);
    const totalPages = Math.ceil(total / validLimit) || 1;

    return {
      data,
      total,
      page: validPage,
      limit: validLimit,
      totalPages,
    };
  }

  static async getById(psh_id: number): Promise<Perusahaan> {
    const perusahaan = await PerusahaanRepository.findById(psh_id);
    if (!perusahaan) {
      throw new Error('Data Perusahaan tidak ditemukan.');
    }
    return perusahaan;
  }

  static async create(input: CreatePerusahaanInput): Promise<number> {
    // Check duplicate name
    const existing = await PerusahaanRepository.findByName(input.psh_nama);
    if (existing) {
      throw new Error(`Perusahaan dengan nama "${input.psh_nama}" sudah terdaftar.`);
    }

    return await PerusahaanRepository.insert(input);
  }

  static async update(input: UpdatePerusahaanInput): Promise<boolean> {
    const existing = await PerusahaanRepository.findById(input.psh_id);
    if (!existing) {
      throw new Error('Data Perusahaan tidak ditemukan.');
    }

    // Check duplicate name if changed
    if (input.psh_nama !== existing.psh_nama) {
      const nameCheck = await PerusahaanRepository.findByName(input.psh_nama);
      if (nameCheck && nameCheck.psh_id !== input.psh_id) {
        throw new Error(`Nama "${input.psh_nama}" sudah digunakan oleh Perusahaan lain.`);
      }
    }

    return await PerusahaanRepository.update(input);
  }

  static async delete(psh_id: number, deletedBy?: number | null): Promise<boolean> {
    const existing = await PerusahaanRepository.findById(psh_id);
    if (!existing) {
      throw new Error('Data Perusahaan tidak ditemukan.');
    }
    return await PerusahaanRepository.softDelete(psh_id, deletedBy);
  }
}

