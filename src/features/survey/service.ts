import { SurveyRepository } from './repository';
import { DetailSurvey, CreateSurveyInput, UpdateSurveyInput, SurveyListResult, SurveyWithDetails } from './types';

export class SurveyService {
  static async getList(search = '', page = 1, limit = 10): Promise<SurveyListResult> {
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit));
    const offset = (validPage - 1) * validLimit;

    const { data, total } = await SurveyRepository.findMany(search, validLimit, offset);
    const totalPages = Math.ceil(total / validLimit) || 1;

    return {
      data,
      total,
      page: validPage,
      limit: validLimit,
      totalPages,
    };
  }

  static async getSurveyWithDetailsByMasterDokumenId(mdk_id: number): Promise<SurveyWithDetails> {
    if (!mdk_id || mdk_id <= 0) {
      return { header: null, details: [] };
    }
    return await SurveyRepository.findSurveyWithDetailsByMasterDokumenId(mdk_id);
  }

  static async getByMasterDokumenId(mdk_id: number): Promise<DetailSurvey[]> {
    if (!mdk_id || mdk_id <= 0) return [];
    return await SurveyRepository.findByMasterDokumenId(mdk_id);
  }

  static async saveBatch(
    data: {
      srv_master_dokumen_id: number;
      srv_nama_kegiatan?: string;
      srv_paket_pekerjaan?: string;
      srv_tanggal_mulai?: string | null;
      srv_tanggal_selesai?: string | null;
      srv_nama_perusahaan?: string;
      srv_alamat_perusahaan?: string;
      items: { dsrv_id?: number; dsrv_jenis_spesifikasi: string; dsrv_harga_survey: number }[];
    },
    userId?: number | null
  ): Promise<boolean> {
    if (!data.srv_master_dokumen_id || data.srv_master_dokumen_id <= 0) {
      throw new Error('Master Dokumen ID tidak valid.');
    }
    return await SurveyRepository.saveBatch(data, userId);
  }

  static async getById(dsrv_id: number): Promise<DetailSurvey> {
    const survey = await SurveyRepository.findById(dsrv_id);
    if (!survey) {
      throw new Error('Data Survey tidak ditemukan.');
    }
    return survey;
  }

  static async create(input: CreateSurveyInput): Promise<number> {
    return await SurveyRepository.insert(input);
  }

  static async update(input: UpdateSurveyInput): Promise<boolean> {
    const existing = await SurveyRepository.findById(input.dsrv_id);
    if (!existing) {
      throw new Error('Data Survey tidak ditemukan.');
    }

    return await SurveyRepository.update(input);
  }

  static async delete(dsrv_id: number, deletedBy?: number | null): Promise<boolean> {
    const existing = await SurveyRepository.findById(dsrv_id);
    if (!existing) {
      throw new Error('Data Survey tidak ditemukan.');
    }
    return await SurveyRepository.softDelete(dsrv_id, deletedBy);
  }
}

