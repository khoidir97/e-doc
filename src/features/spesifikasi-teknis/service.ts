import { SpesifikasiTeknisRepository } from './repository';
import { KerangkaAcuanKerjaRepository } from '@/features/kerangka-acuan-kerja/repository';
import { MasterDokumenRepository } from '@/features/master-dokumen/repository';
import { PegawaiRepository } from '@/features/pegawai/repository';
import {
  SpesifikasiTeknisWithDetails,
  SaveSpesifikasiTeknisPayload,
  KakOptionItemForSpt,
} from './types';

export class SpesifikasiTeknisService {
  static async getByKakId(kakId: number): Promise<SpesifikasiTeknisWithDetails> {
    const { spesifikasiTeknis, detailTeknis, detailJumlah, detailPelakuUsaha } =
      await SpesifikasiTeknisRepository.findByKakId(kakId);

    const kak = await KerangkaAcuanKerjaRepository.findById(kakId);

    let masterDokumen = null;
    if (kak?.kak_master_dokumen_id) {
      masterDokumen = await MasterDokumenRepository.findById(kak.kak_master_dokumen_id);
    }

    let ppkPegawai = null;
    const ppkId = spesifikasiTeknis?.spt_spt_ppk_pgw_id || masterDokumen?.mdk_nama_pejabat_id;
    if (ppkId) {
      ppkPegawai = await PegawaiRepository.findById(ppkId);
    }

    // Default initial items if spesifikasi teknis does not exist yet
    let finalDetailTeknis = detailTeknis;
    let finalDetailJumlah = detailJumlah;

    if (!spesifikasiTeknis || (detailTeknis.length === 0 && detailJumlah.length === 0)) {
      const kakTeknisList = await KerangkaAcuanKerjaRepository.getSpesifikasiTeknisByKakId(kakId);
      const kakBiayaList = await KerangkaAcuanKerjaRepository.getPerkiraanBiayaByKakId(kakId);

      // 1. Check if KAK has detail spesifikasi teknis
      if (finalDetailTeknis.length === 0 && kakTeknisList && kakTeknisList.length > 0) {
        finalDetailTeknis = kakTeknisList.map((k) => ({
          dspt_item_barang_jasa: k.kst_uraian || '',
          dspt_spesifikasi: k.kst_spesifikasi || '',
        }));
      }

      // 2. Check if KAK has detail perkiraan biaya
      if (finalDetailJumlah.length === 0 && kakBiayaList && kakBiayaList.length > 0) {
        finalDetailJumlah = kakBiayaList.map((k) => ({
          dspj_item_barang_jasa: k.kpb_uraian || '',
          dspj_jumlah: k.kpb_volume || 1,
          dspj_satuan_id: null,
          st_nama: String(masterDokumen?.st_nama || masterDokumen?.mdk_satuan || 'Unit'),
        }));
      }

      // 3. Fallback to mdk_item_barang if both are still empty
      if (finalDetailTeknis.length === 0 && masterDokumen?.mdk_item_barang) {
        try {
          const items = typeof masterDokumen.mdk_item_barang === 'string'
            ? JSON.parse(masterDokumen.mdk_item_barang)
            : masterDokumen.mdk_item_barang;
          if (Array.isArray(items) && items.length > 0) {
            finalDetailTeknis = items.map((it: any) => ({
              dspt_item_barang_jasa: it.NAMA_STANDAR_HARGA || it.nama_standar_harga || '',
              dspt_spesifikasi: it.SPESIFIKASI || it.spesifikasi || '',
            }));
            if (finalDetailJumlah.length === 0) {
              finalDetailJumlah = items.map((it: any) => ({
                dspj_item_barang_jasa: it.NAMA_STANDAR_HARGA || it.nama_standar_harga || '',
                dspj_jumlah: Number(it.KOOFISIEN || it.koefisien) || 1,
                dspj_satuan_id: null,
                st_nama: it.SATUAN || it.satuan || 'Unit',
              }));
            }
          }
        } catch {
          // Ignore json parse error
        }
      }
    }

    return {
      spesifikasiTeknis,
      detailTeknis: finalDetailTeknis,
      detailJumlah: finalDetailJumlah,
      detailPelakuUsaha,
      kak,
      masterDokumen,
      ppkPegawai,
    };
  }

  static async getById(sptId: number): Promise<SpesifikasiTeknisWithDetails> {
    const { spesifikasiTeknis } = await SpesifikasiTeknisRepository.findById(sptId);
    if (!spesifikasiTeknis) {
      return {
        spesifikasiTeknis: null,
        detailTeknis: [],
        detailJumlah: [],
        detailPelakuUsaha: [],
        kak: null,
        masterDokumen: null,
        ppkPegawai: null,
      };
    }
    return await this.getByKakId(spesifikasiTeknis.spt_kak_id);
  }

  static async getKakOptions(): Promise<KakOptionItemForSpt[]> {
    return await SpesifikasiTeknisRepository.getKakOptions();
  }

  static async getSatuanList(): Promise<{ st_id: number; st_nama: string }[]> {
    return await SpesifikasiTeknisRepository.getSatuanList();
  }

  static async getPegawaiList(): Promise<{ pgw_id: number; pgw_nama: string; pgw_nip: string; pgw_jabatan: string }[]> {
    return await SpesifikasiTeknisRepository.getPegawaiList();
  }

  static async save(
    payload: SaveSpesifikasiTeknisPayload,
    userId?: number | null
  ): Promise<number> {
    return await SpesifikasiTeknisRepository.save(payload, userId);
  }

  static async delete(sptId: number, userId?: number | null): Promise<boolean> {
    return await SpesifikasiTeknisRepository.delete(sptId, userId);
  }
}
