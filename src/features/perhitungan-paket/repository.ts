import pool, { initDatabase } from '@/lib/db';
import { PerhitunganPaket, CreatePerhitunganPaketInput, UpdatePerhitunganPaketInput, Paket, UpsertPaketInput } from './types';

export class PaketRepository {
  static async findByMasterDokumenId(mdk_id: number): Promise<Paket | null> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT * FROM perhitungan_paket WHERE pkt_master_dokumen_id = ? AND pkt_deleted_at IS NULL LIMIT 1`,
      [mdk_id]
    );
    return rows.length > 0 ? (rows[0] as Paket) : null;
  }

  static async upsert(input: UpsertPaketInput, userId?: number | null): Promise<number> {
    await initDatabase();
    const existing = await this.findByMasterDokumenId(input.pkt_master_dokumen_id);
    const sanitizeDate = (val?: string | null) => (val && val.trim() !== '' ? val.trim() : null);
    const sanitizeStr = (val?: string | null) => (val && val.trim() !== '' ? val.trim() : null);

    const tglSpk = sanitizeDate(input.pkt_tanggal_spk_kwitansi);
    const tglBap = sanitizeDate(input.pkt_tanggal);
    const noSpk = sanitizeStr(input.pkt_no_spk_kwitansi);
    const bapp = sanitizeStr(input.pkt_bapp);
    const bast = sanitizeStr(input.pkt_bast);
    const bap = sanitizeStr(input.pkt_bap);
    const npwp = sanitizeStr(input.pkt_npwp);
    const noRek = sanitizeStr(input.pkt_no_rekening);
    const namaRek = sanitizeStr(input.pkt_nama_rekening);
    const namaBank = sanitizeStr(input.pkt_nama_bank);
    const jenisPph = sanitizeStr(input.pkt_jenis_pph) || '23';
    const spkKwitansi = input.pkt_spk_kwitansi !== undefined && input.pkt_spk_kwitansi !== null ? Number(input.pkt_spk_kwitansi) : null;

    if (existing) {
      await pool.query(
        `UPDATE perhitungan_paket SET
          pkt_spk_kwitansi = ?, pkt_no_spk_kwitansi = ?, pkt_tanggal_spk_kwitansi = ?,
          pkt_bapp = ?, pkt_bast = ?, pkt_bap = ?, pkt_tanggal = ?,
          pkt_npwp = ?, pkt_no_rekening = ?, pkt_nama_rekening = ?, pkt_nama_bank = ?, pkt_jenis_pph = ?,
          pkt_updated_by = ?, pkt_updated_at = NOW()
         WHERE pkt_id = ?`,
        [
          spkKwitansi, noSpk, tglSpk,
          bapp, bast, bap, tglBap,
          npwp, noRek, namaRek, namaBank, jenisPph,
          userId ?? null, existing.pkt_id,
        ]
      );
      return existing.pkt_id;
    } else {
      const [result]: any = await pool.query(
        `INSERT INTO perhitungan_paket
          (pkt_master_dokumen_id, pkt_spk_kwitansi, pkt_no_spk_kwitansi, pkt_tanggal_spk_kwitansi,
           pkt_bapp, pkt_bast, pkt_bap, pkt_tanggal,
           pkt_npwp, pkt_no_rekening, pkt_nama_rekening, pkt_nama_bank, pkt_jenis_pph, pkt_created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          input.pkt_master_dokumen_id,
          spkKwitansi, noSpk, tglSpk,
          bapp, bast, bap, tglBap,
          npwp, noRek, namaRek, namaBank, jenisPph,
          userId ?? null,
        ]
      );
      return result.insertId;
    }
  }
}


export class PerhitunganPaketRepository {
  static async findMany(search = '', limit = 10, offset = 0): Promise<{ data: any[]; total: number }> {
    await initDatabase();

    let whereClause = 'WHERE s.pak_deleted_at IS NULL';
    const params: any[] = [];

    if (search.trim()) {
      whereClause += ' AND (s.pak_nilai_invoice LIKE ? OR m.mdk_uraian_belanja LIKE ? OR m.mdk_no_dpa LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    const [countRows] = await pool.query<any[]>(
      `SELECT COUNT(*) as total 
       FROM detail_perhitungan_paket s
       LEFT JOIN master_dokumen m ON s.pak_master_dokumen_id = m.mdk_id 
       ${whereClause}`,
      params
    );
    const total = countRows[0]?.total || 0;

    const dataParams = [...params, Number(limit), Number(offset)];
    const [rows] = await pool.query<any[]>(
      `SELECT s.pak_id, s.pak_master_dokumen_id, s.pak_nilai_invoice, s.pak_dpp, s.pak_ppn, s.pak_pph23, s.pak_dibayar, s.pak_created_at,
              m.mdk_uraian_belanja, m.mdk_no_dpa, b.bdg_nama AS mdk_bagian, b.bdg_nama, m.mdk_pagu_anggaran
       FROM detail_perhitungan_paket s
       LEFT JOIN master_dokumen m ON s.pak_master_dokumen_id = m.mdk_id
       LEFT JOIN bidang b ON m.mdk_bidang_id = b.bdg_id
       ${whereClause} 
       ORDER BY s.pak_id DESC 
       LIMIT ? OFFSET ?`,
      dataParams
    );

    return {
      data: rows,
      total,
    };
  }

  static async findByMasterDokumenId(mdk_id: number): Promise<PerhitunganPaket[]> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT pak_id, pak_master_dokumen_id, pak_nilai_invoice, pak_dpp, pak_ppn, pak_pph23, pak_jenis_pph, pak_dibayar, pak_created_at 
       FROM detail_perhitungan_paket 
       WHERE pak_master_dokumen_id = ? AND pak_deleted_at IS NULL 
       ORDER BY pak_id ASC`,
      [mdk_id]
    );
    return rows as PerhitunganPaket[];
  }

  static async findById(pak_id: number): Promise<PerhitunganPaket | null> {
    await initDatabase();
    const [rows] = await pool.query<any[]>(
      `SELECT pak_id, pak_master_dokumen_id, pak_nilai_invoice, pak_dpp, pak_ppn, pak_pph23, pak_jenis_pph, pak_dibayar, pak_created_at 
       FROM detail_perhitungan_paket 
       WHERE pak_id = ? AND pak_deleted_at IS NULL 
       LIMIT 1`,
      [pak_id]
    );
    if (!rows || rows.length === 0) return null;
    return rows[0] as PerhitunganPaket;
  }

  static async saveBatch(
    mdk_id: number,
    items: { pak_nilai_invoice: number; pak_dpp: number; pak_ppn: number; pak_pph23: number; pak_jenis_pph?: string | null; pak_dibayar: number }[],
    userId?: number | null,
    paketId?: number | null
  ): Promise<boolean> {
    await initDatabase();

    // Jika paketId belum disediakan, coba cari dari perhitungan_paket berdasarkan mdk_id
    let effectivePaketId = paketId;
    if (!effectivePaketId) {
      const paket = await PaketRepository.findByMasterDokumenId(mdk_id);
      if (paket) {
        effectivePaketId = paket.pkt_id;
      }
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Soft delete current PerhitunganPaket items for this mdk_id
      await connection.query(
        `UPDATE detail_perhitungan_paket 
         SET pak_deleted_at = NOW(), pak_deleted_by = ? 
         WHERE pak_master_dokumen_id = ? AND pak_deleted_at IS NULL`,
        [userId ?? null, mdk_id]
      );

      // Insert new items
      for (const item of items) {
        if (item.pak_nilai_invoice) {
          await connection.query(
            `INSERT INTO detail_perhitungan_paket (pak_paket_id, pak_master_dokumen_id, pak_nilai_invoice, pak_dpp, pak_ppn, pak_pph23, pak_jenis_pph, pak_dibayar, pak_created_by) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [effectivePaketId ?? null, mdk_id, item.pak_nilai_invoice, item.pak_dpp, item.pak_ppn, item.pak_pph23, item.pak_jenis_pph || '23', item.pak_dibayar, userId ?? null]
          );
        }
      }

      await connection.commit();
      return true;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  static async insert(input: CreatePerhitunganPaketInput): Promise<number> {
    await initDatabase();
    const [result]: any = await pool.query(
      `INSERT INTO detail_perhitungan_paket (pak_nilai_invoice, pak_dpp, pak_ppn, pak_pph23, pak_jenis_pph, pak_dibayar, pak_created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [input.pak_nilai_invoice, input.pak_dpp, input.pak_ppn, input.pak_pph23, input.pak_jenis_pph || '23', input.pak_dibayar, input.pak_created_by ?? null]
    );
    return result.insertId;
  }

  static async update(input: UpdatePerhitunganPaketInput): Promise<boolean> {
    await initDatabase();
    const [result]: any = await pool.query(
      `UPDATE detail_perhitungan_paket 
       SET pak_nilai_invoice = ?, pak_dpp = ?, pak_ppn = ?, pak_pph23 = ?, pak_jenis_pph = ?, pak_dibayar = ?, pak_updated_by = ?, pak_updated_at = NOW() 
       WHERE pak_id = ? AND pak_deleted_at IS NULL`,
      [input.pak_nilai_invoice, input.pak_dpp, input.pak_ppn, input.pak_pph23, input.pak_jenis_pph || '23', input.pak_dibayar, input.pak_updated_by ?? null, input.pak_id]
    );
    return result.affectedRows > 0;
  }

  static async softDelete(pak_id: number, deletedBy?: number | null): Promise<boolean> {
    await initDatabase();
    const [result]: any = await pool.query(
      `UPDATE detail_perhitungan_paket 
       SET pak_deleted_at = NOW(), pak_deleted_by = ?
       WHERE pak_id = ? AND pak_deleted_at IS NULL`,
      [deletedBy ?? null, pak_id]
    );
    return result.affectedRows > 0;
  }
}
