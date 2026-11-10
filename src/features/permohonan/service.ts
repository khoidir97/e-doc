import { PermohonanRepository } from './repository';
import { KerangkaAcuanKerjaRepository } from '../kerangka-acuan-kerja/repository';
import { MasterDokumenRepository } from '../master-dokumen/repository';
import { HargaPerkiraanSendiriRepository } from '../harga-perkiraan-sendiri/repository';
import {
  Permohonan,
  SavePermohonanPayload,
  PermohonanWithDetails,
  KakOptionItem,
} from './types';

export class PermohonanService {
  static async getByKakId(kakId: number): Promise<PermohonanWithDetails> {
    const permohonan = await PermohonanRepository.findByKakId(kakId);
    const kak = await KerangkaAcuanKerjaRepository.findById(kakId);

    let masterDokumen = null;
    let totalHps = 0;

    if (kak?.kak_master_dokumen_id) {
      masterDokumen = await MasterDokumenRepository.findById(kak.kak_master_dokumen_id);
      const hpsList = await HargaPerkiraanSendiriRepository.findByMasterDokumenId(kak.kak_master_dokumen_id);
      totalHps = hpsList.reduce((acc, curr) => acc + (Number(curr.hps_harga_perkiraan_sendiri) || 0), 0);
    }

    const perkiraanBiayaList = await KerangkaAcuanKerjaRepository.getPerkiraanBiayaByKakId(kakId);
    const totalBiayaKak = perkiraanBiayaList.reduce((acc, curr) => acc + (Number(curr.kpb_jumlah) || 0), 0);

    return {
      permohonan,
      kak,
      masterDokumen,
      totalBiayaKak,
      totalHps,
    };
  }

  static async getById(pmhId: number): Promise<PermohonanWithDetails> {
    const permohonan = await PermohonanRepository.findById(pmhId);
    if (!permohonan) {
      return {
        permohonan: null,
        kak: null,
        masterDokumen: null,
        totalBiayaKak: 0,
        totalHps: 0,
      };
    }

    return await this.getByKakId(permohonan.pmh_kak_id);
  }

  static async getKakOptions(): Promise<KakOptionItem[]> {
    return await PermohonanRepository.getKakOptions();
  }

  static async save(payload: SavePermohonanPayload, userId?: number | null): Promise<number> {
    return await PermohonanRepository.save(payload, userId);
  }

  static async delete(pmhId: number, userId?: number | null): Promise<boolean> {
    return await PermohonanRepository.delete(pmhId, userId);
  }
}
