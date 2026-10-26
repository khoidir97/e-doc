import bcrypt from 'bcryptjs';
import { PegawaiRepository } from './repository';
import { Pegawai, CreatePegawaiInput, UpdatePegawaiInput, PegawaiListResult } from './types';

export class PegawaiService {
  static async getList(search = '', page = 1, limit = 10): Promise<PegawaiListResult> {
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit));
    const offset = (validPage - 1) * validLimit;

    const { data, total } = await PegawaiRepository.findMany(search, validLimit, offset);
    const totalPages = Math.ceil(total / validLimit) || 1;

    return {
      data,
      total,
      page: validPage,
      limit: validLimit,
      totalPages,
    };
  }

  static async getById(pgw_id: number): Promise<Pegawai> {
    const pegawai = await PegawaiRepository.findById(pgw_id);
    if (!pegawai) {
      throw new Error('Data pegawai tidak ditemukan.');
    }
    return pegawai;
  }

  static async create(input: CreatePegawaiInput): Promise<number> {
    // Check duplicate NIP
    const existing = await PegawaiRepository.findByNip(input.pgw_nip);
    if (existing) {
      throw new Error(`Pegawai dengan NIP "${input.pgw_nip}" sudah terdaftar.`);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(input.pgw_password, 10);

    return await PegawaiRepository.insert({
      ...input,
      pgw_password: hashedPassword,
    });
  }

  static async update(input: UpdatePegawaiInput): Promise<boolean> {
    const existing = await PegawaiRepository.findById(input.pgw_id);
    if (!existing) {
      throw new Error('Data pegawai tidak ditemukan.');
    }

    // Check duplicate NIP if changed
    if (input.pgw_nip !== existing.pgw_nip) {
      const nipCheck = await PegawaiRepository.findByNip(input.pgw_nip);
      if (nipCheck && nipCheck.pgw_id !== input.pgw_id) {
        throw new Error(`NIP "${input.pgw_nip}" sudah digunakan oleh pegawai lain.`);
      }
    }

    let hashedPassword: string | undefined = undefined;
    if (input.pgw_password && input.pgw_password.trim() !== '') {
      hashedPassword = await bcrypt.hash(input.pgw_password, 10);
    }

    return await PegawaiRepository.update({
      ...input,
      pgw_password: hashedPassword,
    });
  }

  static async delete(pgw_id: number, deletedBy?: number | null): Promise<boolean> {
    const existing = await PegawaiRepository.findById(pgw_id);
    if (!existing) {
      throw new Error('Data pegawai tidak ditemukan.');
    }
    return await PegawaiRepository.softDelete(pgw_id, deletedBy);
  }
}
