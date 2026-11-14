import { KerangkaAcuanKerjaRepository } from './repository';
import { KerangkaAcuanKerja, KerangkaAcuanKerjaWithDetails, SaveKakPayload, KakOptionItem } from './types';

export class KerangkaAcuanKerjaService {
  static async getManualKakList(): Promise<KerangkaAcuanKerja[]> {
    return await KerangkaAcuanKerjaRepository.getManualKakList();
  }

  static async getAllKakForSelection(): Promise<KakOptionItem[]> {
    return await KerangkaAcuanKerjaRepository.getAllKakForSelection();
  }

  static async getByMasterDokumenId(mdkId: number): Promise<KerangkaAcuanKerjaWithDetails> {
    const kak = await KerangkaAcuanKerjaRepository.findByMasterDokumenId(mdkId);
    if (!kak) {
      return {
        kak: null,
        perkiraanBiayaList: [],
        spesifikasiTeknisList: [],
      };
    }

    const [perkiraanBiayaList, spesifikasiTeknisList] = await Promise.all([
      KerangkaAcuanKerjaRepository.getPerkiraanBiayaByKakId(kak.kak_id),
      KerangkaAcuanKerjaRepository.getSpesifikasiTeknisByKakId(kak.kak_id),
    ]);

    return {
      kak,
      perkiraanBiayaList,
      spesifikasiTeknisList,
    };
  }

  static async getById(kakId: number): Promise<KerangkaAcuanKerjaWithDetails> {
    const kak = await KerangkaAcuanKerjaRepository.findById(kakId);
    if (!kak) {
      return {
        kak: null,
        perkiraanBiayaList: [],
        spesifikasiTeknisList: [],
      };
    }

    const [perkiraanBiayaList, spesifikasiTeknisList] = await Promise.all([
      KerangkaAcuanKerjaRepository.getPerkiraanBiayaByKakId(kak.kak_id),
      KerangkaAcuanKerjaRepository.getSpesifikasiTeknisByKakId(kak.kak_id),
    ]);

    return {
      kak,
      perkiraanBiayaList,
      spesifikasiTeknisList,
    };
  }

  static async saveAll(payload: SaveKakPayload, userId?: number | null): Promise<number> {
    return await KerangkaAcuanKerjaRepository.saveAll(payload, userId);
  }

  static async delete(kakId: number, userId?: number | null): Promise<boolean> {
    return await KerangkaAcuanKerjaRepository.delete(kakId, userId);
  }
}

