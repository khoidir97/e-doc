import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

// Connection pool configuration optimized for high performance
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'e-doc',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export default pool;

// Guard flag to prevent redundant table checks on every request
let isInitialized = false;

export async function initDatabase(): Promise<void> {
  if (isInitialized) return;

  try {
    const connection = await pool.getConnection();

    try {
      // Ensure pegawai table schema exists
      await connection.query(`
        CREATE TABLE IF NOT EXISTS pegawai (
          pgw_id INT AUTO_INCREMENT PRIMARY KEY,
          pgw_nip VARCHAR(50) NOT NULL UNIQUE,
          pgw_nama VARCHAR(255) NOT NULL,
          pgw_jabatan VARCHAR(255) NOT NULL,
          pgw_password VARCHAR(255) NOT NULL,
          pgw_role TINYINT DEFAULT 1,
          pgw_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          pgw_created_by INT NULL,
          pgw_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          pgw_updated_by INT NULL,
          pgw_deleted_at TIMESTAMP NULL,
          pgw_deleted_by INT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // Ensure master_dokumen table schema exists
      await connection.query(`
        CREATE TABLE IF NOT EXISTS master_dokumen (
          mdk_id INT AUTO_INCREMENT PRIMARY KEY,
          mdk_nama_pejabat_id INT NOT NULL DEFAULT 0,
          mdk_bagian VARCHAR(255) NOT NULL DEFAULT '',
          mdk_pagu_anggaran DECIMAL(18,2) NOT NULL DEFAULT 0,
          mdk_nama_pejabat_pengadaan VARCHAR(255) NOT NULL DEFAULT '',
          mdk_nip_pejabat_pengadaan VARCHAR(50) NOT NULL DEFAULT '',
          mdk_nama_pptk_id INT NOT NULL DEFAULT 0,
          mdk_nama_bendahara_id INT NOT NULL DEFAULT 0,
          mdk_nama_perusahaan_id INT NOT NULL DEFAULT 0,
          mdk_direktur_perusahaan VARCHAR(255) NOT NULL DEFAULT '',
          mdk_alamat TEXT NULL,
          mdk_program VARCHAR(255) NOT NULL DEFAULT '',
          mdk_kode_program VARCHAR(100) NOT NULL DEFAULT '',
          mdk_kegiatan VARCHAR(255) NOT NULL DEFAULT '',
          mdk_kode_kegiatan VARCHAR(100) NOT NULL DEFAULT '',
          mdk_sub_kegiatan VARCHAR(255) NOT NULL DEFAULT '',
          mdk_kode_sub_kegiatan VARCHAR(100) NOT NULL DEFAULT '',
          mdk_uraian_belanja TEXT NULL,
          mdk_rekening_belanja VARCHAR(100) NOT NULL DEFAULT '',
          mdk_kode_level1 VARCHAR(100) NOT NULL DEFAULT '',
          mdk_nama_level1 VARCHAR(255) NOT NULL DEFAULT '',
          mdk_kode_level2 VARCHAR(100) NOT NULL DEFAULT '',
          mdk_nama_level2 VARCHAR(255) NOT NULL DEFAULT '',
          mdk_kode_level3 VARCHAR(100) NOT NULL DEFAULT '',
          mdk_nama_level3 VARCHAR(255) NOT NULL DEFAULT '',
          mdk_kode_level4 VARCHAR(100) NOT NULL DEFAULT '',
          mdk_nama_level4 VARCHAR(255) NOT NULL DEFAULT '',
          mdk_kode_level5 VARCHAR(100) NOT NULL DEFAULT '',
          mdk_nama_level5 VARCHAR(255) NOT NULL DEFAULT '',
          mdk_keterangan TEXT NULL,
          mdk_apbd VARCHAR(100) NOT NULL DEFAULT '',
          mdk_no_dpa VARCHAR(100) NOT NULL DEFAULT '',
          mdk_volume VARCHAR(255) NOT NULL DEFAULT '',
          mdk_satuan VARCHAR(255) NOT NULL DEFAULT '',
          mdk_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          mdk_created_by INT NULL,
          mdk_updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
          mdk_updated_by INT NULL,
          mdk_deleted_at TIMESTAMP NULL,
          mdk_deleted_by INT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // Ensure survey table schema exists
      await connection.query(`
        CREATE TABLE IF NOT EXISTS survey (
          srv_id INT AUTO_INCREMENT PRIMARY KEY,
          srv_master_dokumen_id INT NOT NULL,
          srv_nomor VARCHAR(255) NULL,
          srv_nama_kegiatan TEXT NULL,
          srv_paket_pekerjaan TEXT NULL,
          srv_tanggal_mulai DATE NULL,
          srv_tanggal_selesai DATE NULL,
          srv_nama_perusahaan VARCHAR(255) NULL,
          srv_alamat_perusahaan TEXT NULL,
          srv_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          srv_created_by INT NULL,
          srv_updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
          srv_updated_by INT NULL,
          srv_deleted_at TIMESTAMP NULL,
          srv_deleted_by INT NULL,
          KEY idx_survey_mdk_deleted (srv_master_dokumen_id, srv_deleted_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // Ensure detail_survey table schema exists
      await connection.query(`
        CREATE TABLE IF NOT EXISTS detail_survey (
          dsrv_id INT AUTO_INCREMENT PRIMARY KEY,
          dsrv_survey_id INT NULL,
          dsrv_master_dokumen_id INT NULL,
          dsrv_jenis_spesifikasi VARCHAR(255) NOT NULL,
          dsrv_harga_survey DECIMAL(18,2) NOT NULL DEFAULT 0,
          dsrv_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          dsrv_created_by INT NULL,
          dsrv_updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
          dsrv_updated_by INT NULL,
          dsrv_deleted_at TIMESTAMP NULL,
          dsrv_deleted_by INT NULL,
          KEY idx_dsrv_survey_deleted (dsrv_survey_id, dsrv_deleted_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // Ensure detail_harga_perkiraan_sendiri table schema exists
      await connection.query(`
        CREATE TABLE IF NOT EXISTS detail_harga_perkiraan_sendiri (
          hps_id INT AUTO_INCREMENT PRIMARY KEY,
          hps_master_dokumen_id INT NOT NULL,
          hps_uraian_pekerjaan VARCHAR(255) NOT NULL,
          hps_volume VARCHAR(100) NOT NULL DEFAULT '',
          hps_waktu VARCHAR(100) NOT NULL DEFAULT '',
          hps_harga_satuan DECIMAL(18,2) NOT NULL DEFAULT 0,
          hps_harga_perkiraan_sendiri DECIMAL(18,2) NOT NULL DEFAULT 0,
          hps_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          hps_created_by INT NULL,
          hps_updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
          hps_updated_by INT NULL,
          hps_deleted_at TIMESTAMP NULL,
          hps_deleted_by INT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // Ensure detail_rencana_anggaran_biaya table schema exists
      await connection.query(`
        CREATE TABLE IF NOT EXISTS detail_rencana_anggaran_biaya (
          rab_id INT AUTO_INCREMENT PRIMARY KEY,
          rab_master_dokumen_id INT NOT NULL,
          rab_uraian_pekerjaan VARCHAR(255) NOT NULL,
          rab_volume VARCHAR(100) NOT NULL DEFAULT '',
          rab_waktu VARCHAR(100) NOT NULL DEFAULT '',
          rab_harga_satuan DECIMAL(18,2) NOT NULL DEFAULT 0,
          rab_harga_perkiraan_sendiri DECIMAL(18,2) NOT NULL DEFAULT 0,
          rab_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          rab_created_by INT NULL,
          rab_updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
          rab_updated_by INT NULL,
          rab_deleted_at TIMESTAMP NULL,
          rab_deleted_by INT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // Ensure penawaran table schema exists
      await connection.query(`
        CREATE TABLE IF NOT EXISTS penawaran (
          pnw_id INT AUTO_INCREMENT PRIMARY KEY,
          pnw_master_dokumen_id INT NOT NULL,
          pnw_uraian_pekerjaan VARCHAR(255) NOT NULL,
          pnw_volume VARCHAR(100) NOT NULL DEFAULT '',
          pnw_waktu VARCHAR(100) NOT NULL DEFAULT '',
          pnw_harga_satuan DECIMAL(18,2) NOT NULL DEFAULT 0,
          pnw_harga_perkiraan_sendiri DECIMAL(18,2) NOT NULL DEFAULT 0,
          pnw_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          pnw_updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
          pnw_updated_by INT NULL,
          pnw_deleted_at TIMESTAMP NULL,
          pnw_deleted_by INT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // Ensure kwitansi table schema exists with high-performance composite index
      await connection.query(`
        CREATE TABLE IF NOT EXISTS kwitansi (
          kwt_id INT AUTO_INCREMENT PRIMARY KEY,
          kwt_master_dokumen_id INT NOT NULL,
          kwt_buku_kas_umum_no VARCHAR(255) NOT NULL DEFAULT '',
          kwt_uang_sejumlah VARCHAR(255) NOT NULL DEFAULT '0',
          kwt_sudah_terima_dari TEXT NULL,
          kwt_tanggal_lunas_dibayar DATE NULL,
          kwt_tanggal_terima_uang DATE NULL,
          kwt_no_sp2d VARCHAR(255) NOT NULL DEFAULT '',
          kwt_status_lunas TINYINT NOT NULL DEFAULT 0,
          kwt_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          kwt_created_by INT NULL,
          kwt_updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
          kwt_updated_by INT NULL,
          kwt_deleted_at TIMESTAMP NULL,
          kwt_deleted_by INT NULL,
          KEY idx_kwitansi_mdk_deleted (kwt_master_dokumen_id, kwt_deleted_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // Migration check: Ensure kwitansi columns exist if table was created previously
      const addKwitansiColumnIfNotExists = async (columnName: string, columnDef: string) => {
        const [cols] = await connection.query<any[]>(
          `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
           WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'kwitansi' AND COLUMN_NAME = ?`,
          [columnName]
        );
        if (!cols || cols.length === 0) {
          await connection.query(`ALTER TABLE kwitansi ADD COLUMN ${columnName} ${columnDef}`);
        }
      };
      await addKwitansiColumnIfNotExists('kwt_buku_kas_umum_no', "VARCHAR(255) NOT NULL DEFAULT ''");
      await addKwitansiColumnIfNotExists('kwt_uang_sejumlah', "INT NOT NULL DEFAULT 0");
      await addKwitansiColumnIfNotExists('kwt_sudah_terima_dari', 'TEXT NULL');
      await addKwitansiColumnIfNotExists('kwt_tanggal_lunas_dibayar', 'DATE NULL');
      await addKwitansiColumnIfNotExists('kwt_tanggal_terima_uang', 'DATE NULL');
      await addKwitansiColumnIfNotExists('kwt_no_sp2d', "VARCHAR(255) NOT NULL DEFAULT ''");
      await addKwitansiColumnIfNotExists('kwt_status_lunas', "TINYINT NOT NULL DEFAULT 0");

      // Migration check: Ensure missing columns exist in existing master_dokumen table
      const addMasterDokumenColumnIfNotExists = async (columnName: string, columnDef: string) => {
        const [cols] = await connection.query<any[]>(
          `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
           WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'master_dokumen' AND COLUMN_NAME = ?`,
          [columnName]
        );
        if (!cols || cols.length === 0) {
          await connection.query(`ALTER TABLE master_dokumen ADD COLUMN ${columnName} ${columnDef}`);
        }
      };
      await addMasterDokumenColumnIfNotExists('mdk_kode_level1', "VARCHAR(100) NOT NULL DEFAULT ''");
      await addMasterDokumenColumnIfNotExists('mdk_nama_level1', "VARCHAR(255) NOT NULL DEFAULT ''");
      await addMasterDokumenColumnIfNotExists('mdk_kode_level2', "VARCHAR(100) NOT NULL DEFAULT ''");
      await addMasterDokumenColumnIfNotExists('mdk_nama_level2', "VARCHAR(255) NOT NULL DEFAULT ''");
      await addMasterDokumenColumnIfNotExists('mdk_kode_level3', "VARCHAR(100) NOT NULL DEFAULT ''");
      await addMasterDokumenColumnIfNotExists('mdk_nama_level3', "VARCHAR(255) NOT NULL DEFAULT ''");
      await addMasterDokumenColumnIfNotExists('mdk_kode_level4', "VARCHAR(100) NOT NULL DEFAULT ''");
      await addMasterDokumenColumnIfNotExists('mdk_nama_level4', "VARCHAR(255) NOT NULL DEFAULT ''");
      await addMasterDokumenColumnIfNotExists('mdk_kode_level5', "VARCHAR(100) NOT NULL DEFAULT ''");
      await addMasterDokumenColumnIfNotExists('mdk_nama_level5', "VARCHAR(255) NOT NULL DEFAULT ''");
      await addMasterDokumenColumnIfNotExists('mdk_is_lock', 'TINYINT NOT NULL DEFAULT 0');

      // Migration check: Ensure missing columns exist in existing survey table
      const addSurveyColumnIfNotExists = async (columnName: string, columnDef: string) => {
        const [cols] = await connection.query<any[]>(
          `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
           WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'survey' AND COLUMN_NAME = ?`,
          [columnName]
        );
        if (!cols || cols.length === 0) {
          try {
            await connection.query(`ALTER TABLE survey ADD COLUMN ${columnName} ${columnDef}`);
          } catch (e) {
            console.error(`[Migration] Failed to add column ${columnName} to survey table:`, e);
          }
        }
      };

      await addSurveyColumnIfNotExists('srv_master_dokumen_id', 'INT NOT NULL DEFAULT 0');
      await addSurveyColumnIfNotExists('srv_master_dokument_id', 'INT NOT NULL DEFAULT 0');
      await addSurveyColumnIfNotExists('srv_nomor', 'VARCHAR(255) NULL');
      await addSurveyColumnIfNotExists('srv_nama_kegiatan', 'TEXT NULL');
      await addSurveyColumnIfNotExists('srv_paket_pekerjaan', 'TEXT NULL');
      await addSurveyColumnIfNotExists('srv_tanggal_mulai', 'DATE NULL');
      await addSurveyColumnIfNotExists('srv_tanggal_selesai', 'DATE NULL');
      await addSurveyColumnIfNotExists('srv_nama_perusahaan', 'VARCHAR(255) NULL');
      await addSurveyColumnIfNotExists('srv_alamat_perusahaan', 'TEXT NULL');
      await addSurveyColumnIfNotExists('srv_created_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
      await addSurveyColumnIfNotExists('srv_created_by', 'INT NULL');
      await addSurveyColumnIfNotExists('srv_updated_at', 'TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP');
      await addSurveyColumnIfNotExists('srv_updated_by', 'INT NULL');
      await addSurveyColumnIfNotExists('srv_deleted_at', 'TIMESTAMP NULL');
      await addSurveyColumnIfNotExists('srv_deleted_by', 'INT NULL');

      // Ensure detail_survey table column check
      const addDetailSurveyColumnIfNotExists = async (columnName: string, columnDef: string) => {
        const [cols] = await connection.query<any[]>(
          `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
           WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'detail_survey' AND COLUMN_NAME = ?`,
          [columnName]
        );
        if (!cols || cols.length === 0) {
          await connection.query(`ALTER TABLE detail_survey ADD COLUMN ${columnName} ${columnDef}`);
        }
      };
      await addDetailSurveyColumnIfNotExists('dsrv_survey_id', 'INT NULL');

      // Ensure faktur (header) table schema exists
      await connection.query(`
        CREATE TABLE IF NOT EXISTS faktur (
          fak_id INT AUTO_INCREMENT PRIMARY KEY,
          fak_master_dokumen_id INT NOT NULL,
          fak_nomor_faktur VARCHAR(255) NULL,
          fak_tanggal_faktur DATE NULL,
          fak_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          fak_created_by INT NULL,
          fak_updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
          fak_updated_by INT NULL,
          fak_deleted_at TIMESTAMP NULL,
          fak_deleted_by INT NULL,
          KEY idx_faktur_mdk_deleted (fak_master_dokumen_id, fak_deleted_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // Ensure detail_faktur table schema exists
      await connection.query(`
        CREATE TABLE IF NOT EXISTS detail_faktur (
          fkt_id INT AUTO_INCREMENT PRIMARY KEY,
          fkt_faktur_id INT NULL,
          fkt_master_dokumen_id INT NOT NULL,
          fkt_jenis_spesifikasi VARCHAR(255) NOT NULL,
          fkt_unit DOUBLE NOT NULL DEFAULT 0,
          fkt_hari DOUBLE NOT NULL DEFAULT 0,
          fkt_harga_satuan DECIMAL(18,2) NOT NULL DEFAULT 0,
          fkt_total DECIMAL(18,2) NOT NULL DEFAULT 0,
          fkt_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          fkt_created_by INT NULL,
          fkt_updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
          fkt_updated_by INT NULL,
          fkt_deleted_at TIMESTAMP NULL,
          fkt_deleted_by INT NULL,
          KEY idx_detail_faktur_mdk_deleted (fkt_master_dokumen_id, fkt_deleted_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // Migration check: Ensure fkt_faktur_id exists in detail_faktur
      const addDetailFakturColumnIfNotExists = async (columnName: string, columnDef: string) => {
        const [cols] = await connection.query<any[]>(
          `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
           WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'detail_faktur' AND COLUMN_NAME = ?`,
          [columnName]
        );
        if (!cols || cols.length === 0) {
          try {
            await connection.query(`ALTER TABLE detail_faktur ADD COLUMN ${columnName} ${columnDef}`);
          } catch (e) { }
        }
      };
      await addDetailFakturColumnIfNotExists('fkt_faktur_id', 'INT NULL');

      // Ensure berita_acara (header) table schema exists
      await connection.query(`
        CREATE TABLE IF NOT EXISTS berita_acara (
          bac_id INT AUTO_INCREMENT PRIMARY KEY,
          bac_master_dokumen_id INT NOT NULL,
          bac_nomor_surat VARCHAR(255) NULL,
          bac_paragraf_pertama TEXT NULL,
          bac_paragraf_kedua TEXT NULL,
          bac_hasil_pemeriksaan TEXT NULL,
          bac_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          bac_created_by INT NULL,
          bac_updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
          bac_updated_by INT NULL,
          bac_deleted_at TIMESTAMP NULL,
          bac_deleted_by INT NULL,
          KEY idx_berita_acara_mdk_deleted (bac_master_dokumen_id, bac_deleted_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // Ensure detail_berita_acara table schema exists
      await connection.query(`
        CREATE TABLE IF NOT EXISTS detail_berita_acara (
          dba_id INT AUTO_INCREMENT PRIMARY KEY,
          dba_berita_acara_id INT NULL,
          dba_master_dokumen_id INT NOT NULL,
          dba_uraian VARCHAR(255) NOT NULL,
          dba_volume VARCHAR(100) NOT NULL DEFAULT '',
          dba_satuan VARCHAR(100) NOT NULL DEFAULT '',
          dba_status_pemeriksaan VARCHAR(255) NOT NULL DEFAULT '',
          dba_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          dba_created_by INT NULL,
          dba_updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
          dba_updated_by INT NULL,
          dba_deleted_at TIMESTAMP NULL,
          dba_deleted_by INT NULL,
          KEY idx_dba_mdk_deleted (dba_master_dokumen_id, dba_deleted_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // Ensure nota_pencairan_dana table schema exists
      await connection.query(`
        CREATE TABLE IF NOT EXISTS nota_pencairan_dana (
          dpd_id INT AUTO_INCREMENT PRIMARY KEY,
          dpd_master_dokumen_id INT NOT NULL,
          dpd_uraian TEXT NOT NULL,
          dpd_dpa_volume VARCHAR(100) NOT NULL DEFAULT '',
          dpd_dpa_satuan VARCHAR(100) NOT NULL DEFAULT '',
          dpd_dpa_nilai DECIMAL(15,2) NOT NULL DEFAULT 0.00,
          dpd_belum_volume VARCHAR(100) NOT NULL DEFAULT '',
          dpd_belum_nilai DECIMAL(15,2) NOT NULL DEFAULT 0.00,
          dpd_saatini_volume VARCHAR(100) NOT NULL DEFAULT '',
          dpd_saatini_nilai DECIMAL(15,2) NOT NULL DEFAULT 0.00,
          dpd_saatini_ppn DECIMAL(15,2) NOT NULL DEFAULT 0.00,
          dpd_saatini_pph23 DECIMAL(15,2) NOT NULL DEFAULT 0.00,
          dpd_saatini_total_pajak DECIMAL(15,2) NOT NULL DEFAULT 0.00,
          dpd_saatini_pembayaran DECIMAL(15,2) NOT NULL DEFAULT 0.00,
          dpd_sisa_volume VARCHAR(100) NOT NULL DEFAULT '',
          dpd_sisa_nilai DECIMAL(15,2) NOT NULL DEFAULT 0.00,
          dpd_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          dpd_created_by INT NULL,
          dpd_updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
          dpd_updated_by INT NULL,
          dpd_deleted_at TIMESTAMP NULL,
          dpd_deleted_by INT NULL,
          KEY idx_dpd_mdk_deleted (dpd_master_dokumen_id, dpd_deleted_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      const addDetailBeritaAcaraColumnIfNotExists = async (columnName: string, columnDef: string) => {
        const [cols] = await connection.query<any[]>(
          `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
           WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'detail_berita_acara' AND COLUMN_NAME = ?`,
          [columnName]
        );
        if (!cols || cols.length === 0) {
          try {
            await connection.query(`ALTER TABLE detail_berita_acara ADD COLUMN ${columnName} ${columnDef}`);
          } catch (e) { }
        }
      };
      await addDetailBeritaAcaraColumnIfNotExists('dba_berita_acara_id', 'INT NULL');

      // Migration check: Ensure missing audit columns exist in existing table
      const addColumnIfNotExists = async (columnName: string, columnDef: string) => {
        const [cols] = await connection.query<any[]>(
          `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
           WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'pegawai' AND COLUMN_NAME = ?`,
          [columnName]
        );
        if (!cols || cols.length === 0) {
          await connection.query(`ALTER TABLE pegawai ADD COLUMN ${columnName} ${columnDef}`);
        }
      };

      await addColumnIfNotExists('pgw_created_by', 'INT NULL');
      await addColumnIfNotExists('pgw_updated_by', 'INT NULL');
      await addColumnIfNotExists('pgw_deleted_at', 'TIMESTAMP NULL');
      await addColumnIfNotExists('pgw_deleted_by', 'INT NULL');
      await addColumnIfNotExists('pgw_bdg_id', 'INT NULL');

      // Migration check: Ensure performance composite indexes exist
      const addIndexIfNotExists = async (tableName: string, indexName: string, columnsDef: string) => {
        try {
          const [idxs] = await connection.query<any[]>(
            `SELECT INDEX_NAME FROM INFORMATION_SCHEMA.STATISTICS 
             WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ?`,
            [tableName, indexName]
          );
          if (!idxs || idxs.length === 0) {
            await connection.query(`ALTER TABLE ${tableName} ADD INDEX ${indexName} (${columnsDef})`);
          }
        } catch (e) { }
      };

      await addIndexIfNotExists('master_dokumen', 'idx_mdk_deleted_bdg', 'mdk_deleted_at, mdk_bidang_id, mdk_pagu_anggaran');
      await addIndexIfNotExists('master_dokumen', 'idx_mdk_created_deleted', 'mdk_deleted_at, mdk_created_at, mdk_id');
      await addIndexIfNotExists('nota_pencairan_dana', 'idx_dpd_deleted_pembayaran', 'dpd_deleted_at, dpd_saatini_pembayaran');
      await addIndexIfNotExists('kwitansi', 'idx_kwt_deleted', 'kwt_deleted_at');


      // Seed initial admin pegawai if table is empty
      const [rows] = await connection.query<any[]>(
        'SELECT COUNT(*) as count FROM pegawai WHERE pgw_deleted_at IS NULL'
      );
      const count = rows[0]?.count || 0;

      if (count === 0) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await connection.query(
          'INSERT INTO pegawai (pgw_nip, pgw_nama, pgw_jabatan, pgw_password, pgw_role) VALUES (?, ?, ?, ?, ?)',
          ['123456', 'Admin Pegawai', 'Administrator', hashedPassword, 1]
        );
        console.log('[Database] Auto-seeded default pegawai (NIP: 123456 / Password: admin123)');
      }

      isInitialized = true;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('[Database Error] Failed to initialize pegawai schema:', error);
  }
}
