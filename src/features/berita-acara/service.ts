import { BeritaAcaraRepository } from './repository';
import { BeritaAcara, BeritaAcaraHeader, BeritaAcaraFullData, CreateBeritaAcaraInput, UpdateBeritaAcaraInput, BeritaAcaraListResult } from './types';

export class BeritaAcaraService {
  static async getList(search = '', page = 1, limit = 10): Promise<BeritaAcaraListResult> {
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit));
    const offset = (validPage - 1) * validLimit;

    const { data, total } = await BeritaAcaraRepository.findMany(search, validLimit, offset);
    const totalPages = Math.ceil(total / validLimit) || 1;

    return {
      data,
      total,
      page: validPage,
      limit: validLimit,
      totalPages,
    };
  }

  static async getHeaderByMasterDokumenId(mdk_id: number): Promise<BeritaAcaraHeader | null> {
    if (!mdk_id || mdk_id <= 0) return null;
    return await BeritaAcaraRepository.findHeaderByMasterDokumenId(mdk_id);
  }

  static async getByMasterDokumenId(mdk_id: number): Promise<BeritaAcara[]> {
    if (!mdk_id || mdk_id <= 0) return [];
    return await BeritaAcaraRepository.findByMasterDokumenId(mdk_id);
  }

  static async getFullDataByMasterDokumenId(mdk_id: number): Promise<BeritaAcaraFullData> {
    if (!mdk_id || mdk_id <= 0) return { header: null, items: [] };
    const [header, items] = await Promise.all([
      BeritaAcaraRepository.findHeaderByMasterDokumenId(mdk_id),
      BeritaAcaraRepository.findByMasterDokumenId(mdk_id),
    ]);
    return { header, items };
  }

  static async saveBatch(
    mdk_id: number,
    header: { bac_nomor_surat: string; bac_paragraf_pertama: string; bac_paragraf_kedua: string; bac_hasil_pemeriksaan: string; bac_tanggal: Date | string },
    items: { dba_uraian: string; dba_volume: string; dba_satuan: string; dba_status_pemeriksaan: string }[],
    userId?: number | null
  ): Promise<boolean> {
    if (!mdk_id || mdk_id <= 0) {
      throw new Error('Master Dokumen ID tidak valid.');
    }
    return await BeritaAcaraRepository.saveBatch(mdk_id, header, items, userId);
  }

  static async getById(dba_id: number): Promise<BeritaAcara> {
    const item = await BeritaAcaraRepository.findById(dba_id);
    if (!item) {
      throw new Error('Data Berita Acara tidak ditemukan.');
    }
    return item;
  }

  static async create(input: CreateBeritaAcaraInput): Promise<number> {
    return await BeritaAcaraRepository.insert(input);
  }

  static async update(input: UpdateBeritaAcaraInput): Promise<boolean> {
    const existing = await BeritaAcaraRepository.findById(input.dba_id);
    if (!existing) {
      throw new Error('Data Berita Acara tidak ditemukan.');
    }

    return await BeritaAcaraRepository.update(input);
  }

  static async delete(dba_id: number, deletedBy?: number | null): Promise<boolean> {
    const existing = await BeritaAcaraRepository.findById(dba_id);
    if (!existing) {
      throw new Error('Data Berita Acara tidak ditemukan.');
    }
    return await BeritaAcaraRepository.softDelete(dba_id, deletedBy);
  }
}
