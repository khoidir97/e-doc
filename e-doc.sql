/*
 Navicat Premium Data Transfer

 Source Server         : e-perbend
 Source Server Type    : MySQL
 Source Server Version : 110809
 Source Host           : 151.158.239.234:3306
 Source Schema         : e-doc

 Target Server Type    : MySQL
 Target Server Version : 110809
 File Encoding         : 65001

 Date: 19/11/2026 09:21:48
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for berita_acara
-- ----------------------------
DROP TABLE IF EXISTS `berita_acara`;
CREATE TABLE `berita_acara`  (
  `bac_id` int NOT NULL AUTO_INCREMENT,
  `bac_master_dokumen_id` int NULL DEFAULT NULL,
  `bac_master_jenis_ba_id` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `bac_bukti_perikatan` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `bac_nomor_bukti_perikatan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `bac_paragraf_pertama` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `bac_paragraf_kedua` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `bac_nomor_surat_pemeriksaan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `bac_nomor_surat_serah_terima` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `bac_hasil_pemeriksaan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `bac_tanggal` date NULL DEFAULT NULL,
  `bac_created_at` timestamp NULL DEFAULT NULL,
  `bac_created_by` int NULL DEFAULT NULL,
  `bac_updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `bac_updated_by` int NULL DEFAULT NULL,
  `bac_deleted_at` timestamp NULL DEFAULT NULL,
  `bac_deleted_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`bac_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of berita_acara
-- ----------------------------
INSERT INTO `berita_acara` VALUES (1, 1, '001', '002', 'nomorspkkuitansi', 'Pada hari ini Senin Tanggal Sembilan bulan November Tahun Dua Ribu Dua Puluh Enam, bertempat di Kantor Badan Pengelola Keuangan dan Aset Kota Pekanbaru yang bertanda tangan dibawah ini :', 'Dengan ini menyatakan dengan sebenarnya PIHAK PERTAMA telah melakukan Pemeriksaan terhadap Pekerjaan Pengadaan Router Board, PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA, Administrasi Umum Perangkat Daerah, Dukungan Pelaksanaan Sistem Pemerintahan Berbasis Elektronik pada SKPD pada Badan Pengelola Keuangan dan Aset Kota Pekanbaru Tahun Anggaran 2026 di Pekanbaru berdasarkan Surat Perintah Kerja (SPK) Pengadaan Router Board Nomor : nomorspkkuitansi tanggal 9 November 2026 dengan kesimpulan sebagai berikut :', 'nomorBAPP', 'nomorBAST', '\"Barang/Jasa tersebut telah sesuai dengan spesifikasi, jumlah, dalam kondisi baik, lengkap dan dapat digunakan dengan sebagaimana mestinya serta disertai dengan kelengkapan-kelengkapannya\"', '2026-11-09', NULL, 1, '2026-11-09 10:56:10', 1, NULL, NULL);
INSERT INTO `berita_acara` VALUES (2, 9, '001', '002', 'NOMORSPK', 'Pada hari ini Minggu Tanggal Lima Belas bulan November Tahun Dua Ribu Dua Puluh Enam, bertempat di Kantor Badan Pengelola Keuangan dan Aset Kota Pekanbaru yang bertanda tangan dibawah ini :', 'Dengan ini menyatakan dengan sebenarnya PIHAK PERTAMA telah melakukan Pemeriksaan terhadap Pekerjaan Sapu Dan Sikat- Sikat Lantai A, Sapu Dan Sikat- Sikat WC, PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA, Administrasi Umum Perangkat Daerah, Penyediaan Peralatan Rumah Tangga pada Badan Pengelola Keuangan dan Aset Kota Pekanbaru Tahun Anggaran 2026 di Pekanbaru berdasarkan Surat Perintah Kerja (SPK) Sapu Dan Sikat- Sikat Lantai A, Sapu Dan Sikat- Sikat WC Nomor : NOMORSPK tanggal 15 November 2026 dengan kesimpulan sebagai berikut :', 'NPMPRBAPP', 'NOMORBAST', '\"Barang/Jasa tersebut telah sesuai dengan spesifikasi, jumlah, dalam kondisi baik, lengkap dan dapat digunakan dengan sebagaimana mestinya serta disertai dengan kelengkapan-kelengkapannya\"', '2026-11-15', NULL, 1, '2026-11-15 21:22:13', 1, NULL, NULL);
INSERT INTO `berita_acara` VALUES (3, 9, '002', '002', 'NOMORSPK', 'Pada hari ini Minggu Tanggal Lima Belas bulan November Tahun Dua Ribu Dua Puluh Enam, bertempat di Kantor Badan Pengelola Keuangan dan Aset Kota Pekanbaru yang bertanda tangan dibawah ini :', 'Dengan ini menyatakan dengan sebenarnya telah melakukan Serah Terima Hasil Pekerjaan berupa Pengadaan alat kebersihan PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA, Administrasi Umum Perangkat Daerah, Penyediaan Peralatan Rumah Tangga berdasarkan Berita Acara Hasil Pemeriksaan Nomor : NOMORSPK tanggal 15 November 2026, dari PIHAK KEDUA kepada PIHAK PERTAMA dan PIHAK PERTAMA menerima dengan baik pelaksanaan pengadaan tersebut dengan uraian sebagai berikut :', 'NPMPRBAPP', 'NOMORBAST', '\"Pekerjaan/Barang telah diserahterimakan dalam keadaan baik dan lengkap serta dapat dipergunakan sebagaimana mestinya\"', '2026-11-15', NULL, 1, '2026-11-15 21:26:18', 1, NULL, NULL);

-- ----------------------------
-- Table structure for bidang
-- ----------------------------
DROP TABLE IF EXISTS `bidang`;
CREATE TABLE `bidang`  (
  `bdg_id` int NOT NULL AUTO_INCREMENT,
  `bdg_nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `bdg_keterangan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `bdg_created_at` timestamp NULL DEFAULT NULL,
  `bdg_created_by` int NULL DEFAULT NULL,
  `bdg_updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `bdg_updated_by` int NULL DEFAULT NULL,
  `bdg_deleted_at` timestamp NULL DEFAULT NULL,
  `bdg_deleted_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`bdg_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of bidang
-- ----------------------------
INSERT INTO `bidang` VALUES (1, 'ASET', '', NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `bidang` VALUES (2, 'AKUNTANSI', '-', NULL, 1, '2026-08-19 07:50:21', 1, NULL, NULL);
INSERT INTO `bidang` VALUES (3, 'SEKRETARIAT', '', NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `bidang` VALUES (4, 'PERBENDAHARAAN', '', NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `bidang` VALUES (5, 'ANGGARAN', '', NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `bidang` VALUES (6, 'choi', '', NULL, 1, '2026-09-02 13:40:39', NULL, '2026-09-02 13:40:39', 1);

-- ----------------------------
-- Table structure for detail_berita_acara
-- ----------------------------
DROP TABLE IF EXISTS `detail_berita_acara`;
CREATE TABLE `detail_berita_acara`  (
  `dba_id` int NOT NULL AUTO_INCREMENT,
  `dba_berita_acara_id` int NULL DEFAULT NULL,
  `dba_master_dokumen_id` int NULL DEFAULT NULL,
  `dba_uraian` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `dba_volume` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `dba_satuan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `dba_status_pemeriksaan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `dba_created_at` timestamp NULL DEFAULT NULL,
  `dba_created_by` int NULL DEFAULT NULL,
  `dba_updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `dba_updated_by` int NULL DEFAULT NULL,
  `dba_deleted_at` timestamp NULL DEFAULT NULL,
  `dba_deleted_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`dba_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of detail_berita_acara
-- ----------------------------
INSERT INTO `detail_berita_acara` VALUES (1, 1, 1, 'Routerboard CCR2004-16G-2S+ Spesifikasi : Product code CCR2004-16G-2S+, Architecture ARM 64bit, CPU AL32400, CPU core count 4, CPU nominal frequency 1700 MHz, Switch chip model 88E6191X, Dimensions 443 x 210 x 44 mm, RouterOS license 6, Operating System', '1', 'Unit', '100% Selesai', NULL, 1, '2026-11-09 10:56:10', NULL, '2026-11-09 10:56:10', 1);
INSERT INTO `detail_berita_acara` VALUES (2, 1, 1, 'Routerboard CCR2004-16G-2S+ Spesifikasi : Product code: RB450Gx4, Architecture: ARM 32bit, CPU: IPQ-4019, CPU core Count: 4, CPU nominal frequency: 716 MHz, RouterOS license: 5, Operating System: RouterOS, Size of RAM: 1 GB, Storage size: 512 MB.', '1', 'Unit', '100% Selesai', NULL, 1, '2026-11-09 10:56:10', NULL, '2026-11-09 10:56:10', 1);
INSERT INTO `detail_berita_acara` VALUES (3, 1, 1, 'Routerboard CCR2116-12G-4S+ Spesifikasi : Product code CCR2116-12G-4S+,Architecture ARM 64bit, CPU AL73400, CPU core count 16, CPU nominal frequency 2000 MHz, RouterOS license 6, Operating System RouterOS (v7 only), Size of RAM 16 GB, torage size 128 MB.', '1', 'Unit', '100% Selesai', NULL, 1, '2026-11-09 10:56:10', NULL, '2026-11-09 10:56:10', 1);
INSERT INTO `detail_berita_acara` VALUES (4, 1, 1, 'Routerboard CCR2004-16G-2S+ Spesifikasi : Product code CCR2004-16G-2S+, Architecture ARM 64bit, CPU AL32400, CPU core count 4, CPU nominal frequency 1700 MHz, Switch chip model 88E6191X, Dimensions 443 x 210 x 44 mm, RouterOS license 6, Operating System', '1', 'Unit', '100% Selesai', NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_berita_acara` VALUES (5, 1, 1, 'Routerboard CCR2004-16G-2S+ Spesifikasi : Product code: RB450Gx4, Architecture: ARM 32bit, CPU: IPQ-4019, CPU core Count: 4, CPU nominal frequency: 716 MHz, RouterOS license: 5, Operating System: RouterOS, Size of RAM: 1 GB, Storage size: 512 MB.', '1', 'Unit', '100% Selesai', NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_berita_acara` VALUES (6, 1, 1, 'Routerboard CCR2116-12G-4S+ Spesifikasi : Product code CCR2116-12G-4S+,Architecture ARM 64bit, CPU AL73400, CPU core count 16, CPU nominal frequency 2000 MHz, RouterOS license 6, Operating System RouterOS (v7 only), Size of RAM 16 GB, torage size 128 MB.', '1', 'Unit', '100% Selesai', NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_berita_acara` VALUES (7, 2, 9, 'Sapu Dan Sikat- Sikat Lantai A\nSpesifikasi : Minimal atau Setara dengan Sikat Lantai', '55', 'Unit', '100% Selesai', NULL, 1, '2026-11-15 21:22:13', NULL, '2026-11-15 21:22:13', 1);
INSERT INTO `detail_berita_acara` VALUES (8, 2, 9, 'Sapu Dan Sikat- Sikat WC\nSpesifikasi : Minimal atau Setara dengan Sikat WC', '135', 'Unit', '100% Selesai', NULL, 1, '2026-11-15 21:22:13', NULL, '2026-11-15 21:22:13', 1);
INSERT INTO `detail_berita_acara` VALUES (9, 2, 9, 'Sapu Dan Sikat- Sikat Lantai A\nSpesifikasi : Minimal atau Setara dengan Sikat Lantai', '55', 'Unit', '100% Selesai', NULL, 1, '2026-11-15 21:22:59', NULL, '2026-11-15 21:22:59', 1);
INSERT INTO `detail_berita_acara` VALUES (10, 2, 9, 'Sapu Dan Sikat- Sikat WC\nSpesifikasi : Minimal atau Setara dengan Sikat WC', '135', 'Unit', '100% Selesai', NULL, 1, '2026-11-15 21:22:59', NULL, '2026-11-15 21:22:59', 1);
INSERT INTO `detail_berita_acara` VALUES (11, 3, 9, 'Sapu Dan Sikat- Sikat Lantai A\nSpesifikasi : Minimal atau Setara dengan Sikat Lantai', '55', 'Unit', '100% Selesai', NULL, 1, '2026-11-15 21:23:00', NULL, '2026-11-15 21:23:00', 1);
INSERT INTO `detail_berita_acara` VALUES (12, 3, 9, 'Sapu Dan Sikat- Sikat WC\nSpesifikasi : Minimal atau Setara dengan Sikat WC', '135', 'Unit', '100% Selesai', NULL, 1, '2026-11-15 21:23:00', NULL, '2026-11-15 21:23:00', 1);
INSERT INTO `detail_berita_acara` VALUES (13, 3, 9, 'Sapu Dan Sikat- Sikat Lantai A\nSpesifikasi : Minimal atau Setara dengan Sikat Lantai', '55', 'Unit', '100% Selesai', NULL, 1, '2026-11-15 21:26:16', NULL, '2026-11-15 21:26:16', 1);
INSERT INTO `detail_berita_acara` VALUES (14, 3, 9, 'Sapu Dan Sikat- Sikat WC\nSpesifikasi : Minimal atau Setara dengan Sikat WC', '135', 'Unit', '100% Selesai', NULL, 1, '2026-11-15 21:26:16', NULL, '2026-11-15 21:26:16', 1);
INSERT INTO `detail_berita_acara` VALUES (15, 3, 9, 'Sapu Dan Sikat- Sikat Lantai A\nSpesifikasi : Minimal atau Setara dengan Sikat Lantai', '55', 'Unit', '100% Selesai', NULL, 1, '2026-11-15 21:26:18', NULL, '2026-11-15 21:26:18', 1);
INSERT INTO `detail_berita_acara` VALUES (16, 3, 9, 'Sapu Dan Sikat- Sikat WC\nSpesifikasi : Minimal atau Setara dengan Sikat WC', '135', 'Unit', '100% Selesai', NULL, 1, '2026-11-15 21:26:18', NULL, '2026-11-15 21:26:18', 1);
INSERT INTO `detail_berita_acara` VALUES (17, 3, 9, 'Sapu Dan Sikat- Sikat Lantai A\nSpesifikasi : Minimal atau Setara dengan Sikat Lantai', '55', 'Unit', '100% Selesai', NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_berita_acara` VALUES (18, 3, 9, 'Sapu Dan Sikat- Sikat WC\nSpesifikasi : Minimal atau Setara dengan Sikat WC', '135', 'Unit', '100% Selesai', NULL, 1, NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for detail_daftar_pelaku_usaha
-- ----------------------------
DROP TABLE IF EXISTS `detail_daftar_pelaku_usaha`;
CREATE TABLE `detail_daftar_pelaku_usaha`  (
  `dpu_id` int NOT NULL AUTO_INCREMENT,
  `dpu_spt_id` int NULL DEFAULT NULL,
  `dpu_item` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `dpu_nama_pelaku_usaha_potensial` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `dpu_link_katalog` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `dpu_harga` bigint NULL DEFAULT NULL,
  `dpu_evaluasi_berdasarkan_parameter` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `dpu_created_at` timestamp NULL DEFAULT NULL,
  `dpu_created_by` int NULL DEFAULT NULL,
  `dpu_updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `dpu_updated_by` int NULL DEFAULT NULL,
  `dpu_deleted_at` timestamp NULL DEFAULT NULL,
  `dpu_deleted_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`dpu_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of detail_daftar_pelaku_usaha
-- ----------------------------
INSERT INTO `detail_daftar_pelaku_usaha` VALUES (1, 1, 'Routerboard CCR2004-16G-2S+ Spesifikasi : Product code CCR2004-16G-2S+, Architecture ARM 64bit, CPU AL32400, CPU core count 4, CPU nominal frequency 1700 MHz, Switch chip model 88E6191X, Dimensions 443 x 210 x 44 mm, RouterOS license 6, Operating System', 'SAMRTHA', 'HTTPS:///SDFSDFD', 200000, 'Lulus/Gugur\nSeluruh parameter Spesifikasi terpenuhi\nLokasi : Pekanbaru', '2026-11-14 11:49:20', 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_daftar_pelaku_usaha` VALUES (2, 2, 'Sapu Dan Sikat- Sikat Lantai A', 'SAMRTHA NUSA UTAMA', 'HTPPS:/DGDG', 400000, 'Lulus/Gugur\nSeluruh parameter Spesifikasi terpenuhi\nLokasi : Pekanbaru', '2026-11-15 21:03:01', 1, '2026-11-15 21:04:45', NULL, '2026-11-15 21:04:45', 1);
INSERT INTO `detail_daftar_pelaku_usaha` VALUES (3, 2, 'Sapu Dan Sikat- Sikat Lantai A', 'TEST', 'HTPPS:/DGDGKSHDFKJSH', 60000, 'Lulus/Gugur\nSeluruh parameter Spesifikasi terpenuhi\nLokasi : Pekanbaru', '2026-11-15 21:03:01', 1, '2026-11-15 21:04:45', NULL, '2026-11-15 21:04:45', 1);
INSERT INTO `detail_daftar_pelaku_usaha` VALUES (4, 2, 'Sapu Dan Sikat- Sikat Lantai A', 'SAMRTHA NUSA UTAMA', 'HTPPS:/DGDG', 400000, 'Lulus/Gugur\nSeluruh parameter Spesifikasi terpenuhi\nLokasi : Pekanbaru', '2026-11-15 21:04:45', 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_daftar_pelaku_usaha` VALUES (5, 2, 'Sapu Dan Sikat- Sikat Lantai A', 'TEST', 'HTPPS:/DGDGKSHDFKJSH', 60000, 'LulusGugur\nSeluruh parameter Spesifikasi terpenuhi\nLokasi : Pekanbaru', '2026-11-15 21:04:45', 1, NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for detail_faktur
-- ----------------------------
DROP TABLE IF EXISTS `detail_faktur`;
CREATE TABLE `detail_faktur`  (
  `fkt_id` int NOT NULL AUTO_INCREMENT,
  `fkt_faktur_id` int NULL DEFAULT NULL,
  `fkt_master_dokumen_id` int NULL DEFAULT NULL,
  `fkt_jenis_spesifikasi` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `fkt_unit` int NULL DEFAULT NULL,
  `fkt_hari` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `fkt_harga_satuan` int NULL DEFAULT NULL,
  `fkt_total` int NULL DEFAULT NULL,
  `fkt_created_at` timestamp NULL DEFAULT NULL,
  `fkt_created_by` int NULL DEFAULT NULL,
  `fkt_updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `fkt_updated_by` int NULL DEFAULT NULL,
  `fkt_deleted_at` timestamp NULL DEFAULT NULL,
  `fkt_deleted_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`fkt_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of detail_faktur
-- ----------------------------
INSERT INTO `detail_faktur` VALUES (1, 1, 1, 'Routerboard CCR2004-16G-2S+ Spesifikasi : Product code CCR2004-16G-2S+, Architecture ARM 64bit, CPU AL32400, CPU core count 4, CPU nominal frequency 1700 MHz, Switch chip model 88E6191X, Dimensions 443 x 210 x 44 mm, RouterOS license 6, Operating System', 1, 'Unit', 8108000, 8108000, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_faktur` VALUES (2, 1, 1, 'Routerboard CCR2004-16G-2S+ Spesifikasi : Product code: RB450Gx4, Architecture: ARM 32bit, CPU: IPQ-4019, CPU core Count: 4, CPU nominal frequency: 716 MHz, RouterOS license: 5, Operating System: RouterOS, Size of RAM: 1 GB, Storage size: 512 MB.', 1, 'Unit', 2252000, 2252000, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_faktur` VALUES (3, 1, 1, 'Routerboard CCR2116-12G-4S+ Spesifikasi : Product code CCR2116-12G-4S+,Architecture ARM 64bit, CPU AL73400, CPU core count 16, CPU nominal frequency 2000 MHz, RouterOS license 6, Operating System RouterOS (v7 only), Size of RAM 16 GB, torage size 128 MB.', 1, 'Unit', 18243000, 18243000, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_faktur` VALUES (4, 2, 2, 'Wireless Access Point\nSpesifikasi : Next-generation performance with Wi-Fi 7, delivering\nextra-high wireless speeds, Superior streaming with Wi-Fi 7\'s\nexclusive MLO feature, Compact design and easy installation,\nEnhanced data transmission with 4K-QAM', 6, 'Unit', 5700000, 34200000, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_faktur` VALUES (5, 3, 3, 'Wireless Bluetooth Barcode Scanner\nSpesifikasi : Spesifikasi :\n• Distance Bluetooth/2,4G/Wired: 50m/100m/1,8m\n• Memory: 100.000 barcodes\n• Battery: 5V-2000mAh\n• Working Time: 3 to 10 days\n• Resolution: 4mil\n• Drop test: 2mil', 2, 'Unit', 925000, 1850000, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_faktur` VALUES (13, 4, 9, 'Sapu Dan Sikat- Sikat Lantai A\nSpesifikasi : Minimal atau Setara dengan Sikat Lantai', 55, 'Unit', 10000, 550000, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_faktur` VALUES (14, 4, 9, 'Sapu Dan Sikat- Sikat WC\nSpesifikasi : Minimal atau Setara dengan Sikat WC', 135, 'Unit', 25000, 3375000, NULL, 1, NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for detail_harga_perkiraan_sendiri
-- ----------------------------
DROP TABLE IF EXISTS `detail_harga_perkiraan_sendiri`;
CREATE TABLE `detail_harga_perkiraan_sendiri`  (
  `hps_id` int NOT NULL AUTO_INCREMENT,
  `hps_master_dokumen_id` int NULL DEFAULT NULL,
  `hps_uraian_pekerjaan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `hps_volume` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `hps_waktu` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `hps_harga_satuan` int NULL DEFAULT NULL,
  `hps_harga_perkiraan_sendiri` int NULL DEFAULT NULL,
  `hps_created_at` timestamp NULL DEFAULT NULL,
  `hps_created_by` int NULL DEFAULT NULL,
  `hps_updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `hps_updated_by` int NULL DEFAULT NULL,
  `hps_deleted_at` timestamp NULL DEFAULT NULL,
  `hps_deleted_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`hps_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 23 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of detail_harga_perkiraan_sendiri
-- ----------------------------
INSERT INTO `detail_harga_perkiraan_sendiri` VALUES (1, 1, 'Routerboard CCR2004-16G-2S+ Spesifikasi : Product code CCR2004-16G-2S+, Architecture ARM 64bit, CPU AL32400, CPU core count 4, CPU nominal frequency 1700 MHz, Switch chip model 88E6191X, Dimensions 443 x 210 x 44 mm, RouterOS license 6, Operating System', '1', 'Unit', 8108000, 8108000, NULL, 1, '2026-11-09 11:26:01', NULL, '2026-11-09 11:26:01', 1);
INSERT INTO `detail_harga_perkiraan_sendiri` VALUES (2, 1, 'Routerboard CCR2004-16G-2S+ Spesifikasi : Product code: RB450Gx4, Architecture: ARM 32bit, CPU: IPQ-4019, CPU core Count: 4, CPU nominal frequency: 716 MHz, RouterOS license: 5, Operating System: RouterOS, Size of RAM: 1 GB, Storage size: 512 MB.', '1', 'Unit', 2252000, 2252000, NULL, 1, '2026-11-09 11:26:01', NULL, '2026-11-09 11:26:01', 1);
INSERT INTO `detail_harga_perkiraan_sendiri` VALUES (3, 1, 'Routerboard CCR2116-12G-4S+ Spesifikasi : Product code CCR2116-12G-4S+,Architecture ARM 64bit, CPU AL73400, CPU core count 16, CPU nominal frequency 2000 MHz, RouterOS license 6, Operating System RouterOS (v7 only), Size of RAM 16 GB, torage size 128 MB.', '1', 'Unit', 18900000, 18900000, NULL, 1, '2026-11-09 11:26:01', NULL, '2026-11-09 11:26:01', 1);
INSERT INTO `detail_harga_perkiraan_sendiri` VALUES (4, 1, 'Routerboard CCR2004-16G-2S+ Spesifikasi : Product code CCR2004-16G-2S+, Architecture ARM 64bit, CPU AL32400, CPU core count 4, CPU nominal frequency 1700 MHz, Switch chip model 88E6191X, Dimensions 443 x 210 x 44 mm, RouterOS license 6, Operating System', '1', 'Unit', 8108000, 8108000, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_harga_perkiraan_sendiri` VALUES (5, 1, 'Routerboard CCR2004-16G-2S+ Spesifikasi : Product code: RB450Gx4, Architecture: ARM 32bit, CPU: IPQ-4019, CPU core Count: 4, CPU nominal frequency: 716 MHz, RouterOS license: 5, Operating System: RouterOS, Size of RAM: 1 GB, Storage size: 512 MB.', '1', 'Unit', 2252000, 2252000, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_harga_perkiraan_sendiri` VALUES (6, 1, 'Routerboard CCR2116-12G-4S+ Spesifikasi : Product code CCR2116-12G-4S+,Architecture ARM 64bit, CPU AL73400, CPU core count 16, CPU nominal frequency 2000 MHz, RouterOS license 6, Operating System RouterOS (v7 only), Size of RAM 16 GB, torage size 128 MB.', '1', 'Unit', 18900000, 18900000, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_harga_perkiraan_sendiri` VALUES (7, 2, 'Wireless Access Point\nSpesifikasi : Next-generation performance with Wi-Fi 7, delivering\nextra-high wireless speeds, Superior streaming with Wi-Fi 7\'s\nexclusive MLO feature, Compact design and easy installation,\nEnhanced data transmission with 4K-QAM', '6', 'Unit', 5800000, 34800000, NULL, 1, '2026-11-09 15:04:39', NULL, '2026-11-09 15:04:39', 1);
INSERT INTO `detail_harga_perkiraan_sendiri` VALUES (8, 2, 'Wireless Access Point\nSpesifikasi : Next-generation performance with Wi-Fi 7, delivering\nextra-high wireless speeds, Superior streaming with Wi-Fi 7\'s\nexclusive MLO feature, Compact design and easy installation,\nEnhanced data transmission with 4K-QAM', '6', 'Unit', 5800000, 34800000, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_harga_perkiraan_sendiri` VALUES (9, 3, 'Wireless Bluetooth Barcode Scanner\nSpesifikasi : Spesifikasi :\n• Distance Bluetooth/2,4G/Wired: 50m/100m/1,8m\n• Memory: 100.000 barcodes\n• Battery: 5V-2000mAh\n• Working Time: 3 to 10 days\n• Resolution: 4mil\n• Drop test: 2mil', '2', 'Unit', 1000000, 2000000, NULL, 1, '2026-11-09 16:00:40', NULL, '2026-11-09 16:00:40', 1);
INSERT INTO `detail_harga_perkiraan_sendiri` VALUES (10, 3, 'Wireless Bluetooth Barcode Scanner\nSpesifikasi : Spesifikasi :\n• Distance Bluetooth/2,4G/Wired: 50m/100m/1,8m\n• Memory: 100.000 barcodes\n• Battery: 5V-2000mAh\n• Working Time: 3 to 10 days\n• Resolution: 4mil\n• Drop test: 2mil', '2', 'Unit', 1000000, 2000000, NULL, 1, '2026-11-14 11:11:45', NULL, '2026-11-14 11:11:45', 1);
INSERT INTO `detail_harga_perkiraan_sendiri` VALUES (11, 3, 'Wireless Bluetooth Barcode Scanner\nSpesifikasi : Spesifikasi :\n• Distance Bluetooth/2,4G/Wired: 50m/100m/1,8m\n• Memory: 100.000 barcodes\n• Battery: 5V-2000mAh\n• Working Time: 3 to 10 days\n• Resolution: 4mil\n• Drop test: 2mil', '2', 'Unit', 1000000, 2000000, NULL, 1, '2026-11-15 21:05:45', NULL, '2026-11-15 21:05:45', 1);
INSERT INTO `detail_harga_perkiraan_sendiri` VALUES (12, 3, 'Wireless Bluetooth Barcode Scanner\nSpesifikasi : Spesifikasi :\n• Distance Bluetooth/2,4G/Wired: 50m/100m/1,8m\n• Memory: 100.000 barcodes\n• Battery: 5V-2000mAh\n• Working Time: 3 to 10 days\n• Resolution: 4mil\n• Drop test: 2mil', '2', 'Unit', 1000000, 2000000, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_harga_perkiraan_sendiri` VALUES (13, 9, 'Sapu Dan Sikat- Sikat Lantai A\nSpesifikasi : Minimal atau Setara dengan Sikat Lantai', '55', 'Unit', 11420, 628100, NULL, 1, '2026-11-15 21:08:37', NULL, '2026-11-15 21:08:37', 1);
INSERT INTO `detail_harga_perkiraan_sendiri` VALUES (14, 9, 'Sapu Dan Sikat- Sikat WC\nSpesifikasi : Minimal atau Setara dengan Sikat WC', '135', 'Unit', 28560, 3855600, NULL, 1, '2026-11-15 21:08:37', NULL, '2026-11-15 21:08:37', 1);
INSERT INTO `detail_harga_perkiraan_sendiri` VALUES (15, 9, 'Sapu Dan Sikat- Sikat Lantai A\nSpesifikasi : Minimal atau Setara dengan Sikat Lantai', '55', 'Unit', 11420, 628100, NULL, 1, '2026-11-15 21:09:12', NULL, '2026-11-15 21:09:12', 1);
INSERT INTO `detail_harga_perkiraan_sendiri` VALUES (16, 9, 'Sapu Dan Sikat- Sikat WC\nSpesifikasi : Minimal atau Setara dengan Sikat WC', '135', 'Unit', 28560, 3855600, NULL, 1, '2026-11-15 21:09:12', NULL, '2026-11-15 21:09:12', 1);
INSERT INTO `detail_harga_perkiraan_sendiri` VALUES (17, 9, 'Sapu Dan Sikat- Sikat Lantai A\nSpesifikasi : Minimal atau Setara dengan Sikat Lantai', '55', 'Unit', 9000, 495000, NULL, 1, '2026-11-15 21:09:13', NULL, '2026-11-15 21:09:13', 1);
INSERT INTO `detail_harga_perkiraan_sendiri` VALUES (18, 9, 'Sapu Dan Sikat- Sikat WC\nSpesifikasi : Minimal atau Setara dengan Sikat WC', '135', 'Unit', 27560, 3720600, NULL, 1, '2026-11-15 21:09:13', NULL, '2026-11-15 21:09:13', 1);
INSERT INTO `detail_harga_perkiraan_sendiri` VALUES (19, 9, 'Sapu Dan Sikat- Sikat Lantai A\nSpesifikasi : Minimal atau Setara dengan Sikat Lantai', '55', 'Unit', 9000, 495000, NULL, 1, '2026-11-15 21:49:44', NULL, '2026-11-15 21:49:44', 1);
INSERT INTO `detail_harga_perkiraan_sendiri` VALUES (20, 9, 'Sapu Dan Sikat- Sikat WC\nSpesifikasi : Minimal atau Setara dengan Sikat WC', '135', 'Unit', 27560, 3720600, NULL, 1, '2026-11-15 21:49:44', NULL, '2026-11-15 21:49:44', 1);
INSERT INTO `detail_harga_perkiraan_sendiri` VALUES (21, 9, 'Sapu Dan Sikat- Sikat Lantai A\nSpesifikasi : Minimal atau Setara dengan Sikat Lantai', '55', 'Unit', 9000, 495000, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_harga_perkiraan_sendiri` VALUES (22, 9, 'Sapu Dan Sikat- Sikat WC\nSpesifikasi : Minimal atau Setara dengan Sikat WC', '135', 'Unit', 27560, 3720600, NULL, 1, NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for detail_kak_perkiraan_biaya
-- ----------------------------
DROP TABLE IF EXISTS `detail_kak_perkiraan_biaya`;
CREATE TABLE `detail_kak_perkiraan_biaya`  (
  `kpb_id` int NOT NULL AUTO_INCREMENT,
  `kpb_kak_id` int NULL DEFAULT NULL,
  `kpb_uraian` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `kpb_volume` int NULL DEFAULT NULL,
  `kpb_harga` int NULL DEFAULT NULL,
  `kpb_jumlah` int NULL DEFAULT NULL,
  `kpb_created_at` timestamp NULL DEFAULT NULL,
  `kpb_created_by` int NULL DEFAULT NULL,
  `kpb_updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `kpb_updated_by` int NULL DEFAULT NULL,
  `kpb_deleted_at` timestamp NULL DEFAULT NULL,
  `kpb_deleted_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`kpb_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 46 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of detail_kak_perkiraan_biaya
-- ----------------------------
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (1, 1, 'Routerboard CCR2004-16G-2S+ Spesifikasi : Product code CCR2004-16G-2S+, Architecture ARM 64bit, CPU AL32400, CPU core count 4, CPU nominal frequency 1700 MHz, Switch chip model 88E6191X, Dimensions 443 x 210 x 44 mm, RouterOS license 6, Operating System', 1, 8108000, 8108000, NULL, 1, '2026-11-09 13:23:13', NULL, '2026-11-09 13:23:13', 1);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (2, 1, 'Routerboard CCR2004-16G-2S+ Spesifikasi : Product code: RB450Gx4, Architecture: ARM 32bit, CPU: IPQ-4019, CPU core Count: 4, CPU nominal frequency: 716 MHz, RouterOS license: 5, Operating System: RouterOS, Size of RAM: 1 GB, Storage size: 512 MB.', 1, 2252000, 2252000, NULL, 1, '2026-11-09 13:23:13', NULL, '2026-11-09 13:23:13', 1);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (3, 1, 'Routerboard CCR2116-12G-4S+ Spesifikasi : Product code CCR2116-12G-4S+,Architecture ARM 64bit, CPU AL73400, CPU core count 16, CPU nominal frequency 2000 MHz, RouterOS license 6, Operating System RouterOS (v7 only), Size of RAM 16 GB, torage size 128 MB.', 1, 18900000, 18900000, NULL, 1, '2026-11-09 13:23:13', NULL, '2026-11-09 13:23:13', 1);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (4, 1, 'Routerboard CCR2004-16G-2S+ Spesifikasi : Product code CCR2004-16G-2S+, Architecture ARM 64bit, CPU AL32400, CPU core count 4, CPU nominal frequency 1700 MHz, Switch chip model 88E6191X, Dimensions 443 x 210 x 44 mm, RouterOS license 6, Operating System', 1, 8108000, 8108000, NULL, 1, '2026-11-09 13:28:03', NULL, '2026-11-09 13:28:03', 1);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (5, 1, 'Routerboard CCR2004-16G-2S+ Spesifikasi : Product code: RB450Gx4, Architecture: ARM 32bit, CPU: IPQ-4019, CPU core Count: 4, CPU nominal frequency: 716 MHz, RouterOS license: 5, Operating System: RouterOS, Size of RAM: 1 GB, Storage size: 512 MB.', 1, 2252000, 2252000, NULL, 1, '2026-11-09 13:28:03', NULL, '2026-11-09 13:28:03', 1);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (6, 1, 'Routerboard CCR2116-12G-4S+ Spesifikasi : Product code CCR2116-12G-4S+,Architecture ARM 64bit, CPU AL73400, CPU core count 16, CPU nominal frequency 2000 MHz, RouterOS license 6, Operating System RouterOS (v7 only), Size of RAM 16 GB, torage size 128 MB.', 1, 18900000, 18900000, NULL, 1, '2026-11-09 13:28:03', NULL, '2026-11-09 13:28:03', 1);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (7, 1, 'Routerboard CCR2004-16G-2S+ Spesifikasi : Product code CCR2004-16G-2S+, Architecture ARM 64bit, CPU AL32400, CPU core count 4, CPU nominal frequency 1700 MHz, Switch chip model 88E6191X, Dimensions 443 x 210 x 44 mm, RouterOS license 6, Operating System', 1, 8108000, 8108000, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (8, 1, 'Routerboard CCR2004-16G-2S+ Spesifikasi : Product code: RB450Gx4, Architecture: ARM 32bit, CPU: IPQ-4019, CPU core Count: 4, CPU nominal frequency: 716 MHz, RouterOS license: 5, Operating System: RouterOS, Size of RAM: 1 GB, Storage size: 512 MB.', 1, 2252000, 2252000, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (9, 1, 'Routerboard CCR2116-12G-4S+ Spesifikasi : Product code CCR2116-12G-4S+,Architecture ARM 64bit, CPU AL73400, CPU core count 16, CPU nominal frequency 2000 MHz, RouterOS license 6, Operating System RouterOS (v7 only), Size of RAM 16 GB, torage size 128 MB.', 1, 18900000, 18900000, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (10, 2, 'Wireless Access Point\nSpesifikasi : Next-generation performance with Wi-Fi 7, delivering\nextra-high wireless speeds, Superior streaming with Wi-Fi 7\'s\nexclusive MLO feature, Compact design and easy installation,\nEnhanced data transmission with 4K-QAM', 6, 5800000, 34800000, NULL, 1, '2026-11-16 14:55:41', NULL, '2026-11-16 14:55:41', 1);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (11, 3, 'Wireless Bluetooth Barcode Scanner\nSpesifikasi : Spesifikasi :\n• Distance Bluetooth/2,4G/Wired: 50m/100m/1,8m\n• Memory: 100.000 barcodes\n• Battery: 5V-2000mAh\n• Working Time: 3 to 10 days\n• Resolution: 4mil\n• Drop test: 2mil', 2, 1000000, 2000000, NULL, 1, '2026-11-15 20:52:48', NULL, '2026-11-15 20:52:48', 1);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (12, 5, 'Mesin Printer Thermal Mobile', 2, 3500000, 7000000, NULL, 1, '2026-11-15 18:54:05', NULL, '2026-11-15 18:54:05', 1);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (13, 5, 'Mesin Printer Thermal Mobile', 2, 3500000, 7000000, NULL, 1, '2026-11-15 20:42:42', NULL, '2026-11-15 20:42:42', 1);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (14, 5, 'Mesin Printer Thermal Mobile', 2, 3500000, 7000000, NULL, 1, '2026-11-15 20:46:13', NULL, '2026-11-15 20:46:13', 1);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (15, 5, 'Sapu Dan Sikat- Sikat Lantai A', 55, 11420, 628100, NULL, 1, '2026-11-15 20:46:35', NULL, '2026-11-15 20:46:35', 1);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (16, 5, 'Sapu Dan Sikat- Sikat WC', 135, 28560, 3855600, NULL, 1, '2026-11-15 20:46:35', NULL, '2026-11-15 20:46:35', 1);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (17, 5, 'Sapu Dan Sikat- Sikat Lantai A', 55, 11420, 628100, NULL, 1, '2026-11-15 21:51:25', NULL, '2026-11-15 21:51:25', 1);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (18, 5, 'Sapu Dan Sikat- Sikat WC', 135, 28560, 3855600, NULL, 1, '2026-11-15 21:51:25', NULL, '2026-11-15 21:51:25', 1);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (19, 3, 'Wireless Bluetooth Barcode Scanner\nSpesifikasi : Spesifikasi :\n• Distance Bluetooth/2,4G/Wired: 50m/100m/1,8m\n• Memory: 100.000 barcodes\n• Battery: 5V-2000mAh\n• Working Time: 3 to 10 days\n• Resolution: 4mil\n• Drop test: 2mil', 2, 1000000, 2000000, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (20, 5, 'Sapu Dan Sikat- Sikat Lantai A', 55, 11420, 628100, NULL, 1, '2026-11-16 15:13:20', NULL, '2026-11-16 15:13:20', 1);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (21, 5, 'Sapu Dan Sikat- Sikat WC', 135, 28560, 3855600, NULL, 1, '2026-11-16 15:13:20', NULL, '2026-11-16 15:13:20', 1);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (22, 2, 'Wireless Access Point\nSpesifikasi : Next-generation performance with Wi-Fi 7, delivering\nextra-high wireless speeds, Superior streaming with Wi-Fi 7\'s\nexclusive MLO feature, Compact design and easy installation,\nEnhanced data transmission with 4K-QAM', 6, 5800000, 34800000, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (23, 5, 'Sapu Dan Sikat- Sikat Lantai A', 55, 11420, 628100, NULL, 1, '2026-11-16 15:13:21', NULL, '2026-11-16 15:13:21', 1);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (24, 5, 'Sapu Dan Sikat- Sikat WC', 135, 28560, 3855600, NULL, 1, '2026-11-16 15:13:21', NULL, '2026-11-16 15:13:21', 1);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (25, 5, 'Sapu Dan Sikat- Sikat Lantai A', 55, 11420, 628100, NULL, 1, '2026-11-16 15:13:38', NULL, '2026-11-16 15:13:38', 1);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (26, 5, 'Sapu Dan Sikat- Sikat WC', 135, 28560, 3855600, NULL, 1, '2026-11-16 15:13:38', NULL, '2026-11-16 15:13:38', 1);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (27, 5, 'Sapu Dan Sikat- Sikat Lantai A', 55, 11420, 628100, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (28, 5, 'Sapu Dan Sikat- Sikat WC', 135, 28560, 3855600, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (29, 6, 'Laptop', 2, 45000000, 90000000, NULL, 1, '2026-11-17 08:25:48', NULL, '2026-11-17 08:25:48', 1);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (30, 6, 'Laptop', 5, 38500000, 192500000, NULL, 1, '2026-11-17 08:25:48', NULL, '2026-11-17 08:25:48', 1);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (31, 6, 'Laptop', 2, 45000000, 90000000, NULL, 1, '2026-11-17 08:25:57', NULL, '2026-11-17 08:25:57', 1);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (32, 6, 'Laptop', 5, 38500000, 192500000, NULL, 1, '2026-11-17 08:25:57', NULL, '2026-11-17 08:25:57', 1);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (33, 6, 'Laptop', 2, 45000000, 90000000, NULL, 1, '2026-11-17 10:37:23', NULL, '2026-11-17 10:37:23', 1);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (34, 6, 'Laptop', 5, 38500000, 192500000, NULL, 1, '2026-11-17 10:37:23', NULL, '2026-11-17 10:37:23', 1);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (35, 7, 'Laptop', 2, 45000000, 90000000, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (36, 7, 'Laptop', 5, 38500000, 192500000, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (37, 6, 'Laptop', 2, 45000000, 90000000, NULL, 1, '2026-11-17 11:06:48', NULL, '2026-11-17 11:06:48', 1);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (38, 6, 'Laptop', 5, 38500000, 192500000, NULL, 1, '2026-11-17 11:06:48', NULL, '2026-11-17 11:06:48', 1);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (39, 6, 'Laptop', 2, 45000000, 90000000, NULL, 1, '2026-11-17 11:55:17', NULL, '2026-11-17 11:55:17', 3);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (40, 6, 'Laptop', 5, 38500000, 192500000, NULL, 1, '2026-11-17 11:55:17', NULL, '2026-11-17 11:55:17', 3);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (41, 6, 'Laptop', 5, 38500000, 192500000, NULL, 3, '2026-11-17 11:55:22', NULL, '2026-11-17 11:55:22', 3);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (42, 6, 'Laptop', 5, 38500000, 192500000, NULL, 3, '2026-11-18 12:05:13', NULL, '2026-11-18 12:05:13', 1);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (43, 6, 'Laptop', 5, 38500000, 192500000, NULL, 1, '2026-11-18 12:15:31', NULL, '2026-11-18 12:15:31', 1);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (44, 6, 'Laptop', 5, 38500000, 192500000, NULL, 1, '2026-11-18 14:08:37', NULL, '2026-11-18 14:08:37', 1);
INSERT INTO `detail_kak_perkiraan_biaya` VALUES (45, 6, 'Laptop', 5, 38500000, 192500000, NULL, 1, NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for detail_kak_spesifikasi_teknis
-- ----------------------------
DROP TABLE IF EXISTS `detail_kak_spesifikasi_teknis`;
CREATE TABLE `detail_kak_spesifikasi_teknis`  (
  `kst_id` int NOT NULL AUTO_INCREMENT,
  `kst_kak_id` int NULL DEFAULT NULL,
  `kst_uraian` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `kst_spesifikasi` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `kst_created_at` timestamp NULL DEFAULT NULL,
  `kst_created_by` int NULL DEFAULT NULL,
  `kst_updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `kst_updated_by` int NULL DEFAULT NULL,
  `kst_deleted_at` timestamp NULL DEFAULT NULL,
  `kst_deleted_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`kst_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 46 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of detail_kak_spesifikasi_teknis
-- ----------------------------
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (1, 1, 'Routerboard CCR2004-16G-2S+ Spesifikasi : Product code CCR2004-16G-2S+, Architecture ARM 64bit, CPU AL32400, CPU core count 4, CPU nominal frequency 1700 MHz, Switch chip model 88E6191X, Dimensions 443 x 210 x 44 mm, RouterOS license 6, Operating System', '', NULL, 1, '2026-11-09 13:23:13', NULL, '2026-11-09 13:23:13', 1);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (2, 1, 'Routerboard CCR2004-16G-2S+ Spesifikasi : Product code: RB450Gx4, Architecture: ARM 32bit, CPU: IPQ-4019, CPU core Count: 4, CPU nominal frequency: 716 MHz, RouterOS license: 5, Operating System: RouterOS, Size of RAM: 1 GB, Storage size: 512 MB.', '', NULL, 1, '2026-11-09 13:23:13', NULL, '2026-11-09 13:23:13', 1);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (3, 1, 'Routerboard CCR2116-12G-4S+ Spesifikasi : Product code CCR2116-12G-4S+,Architecture ARM 64bit, CPU AL73400, CPU core count 16, CPU nominal frequency 2000 MHz, RouterOS license 6, Operating System RouterOS (v7 only), Size of RAM 16 GB, torage size 128 MB.', '', NULL, 1, '2026-11-09 13:23:13', NULL, '2026-11-09 13:23:13', 1);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (4, 1, 'Routerboard CCR2004-16G-2S+ Spesifikasi : Product code CCR2004-16G-2S+, Architecture ARM 64bit, CPU AL32400, CPU core count 4, CPU nominal frequency 1700 MHz, Switch chip model 88E6191X, Dimensions 443 x 210 x 44 mm, RouterOS license 6, Operating System', '', NULL, 1, '2026-11-09 13:28:03', NULL, '2026-11-09 13:28:03', 1);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (5, 1, 'Routerboard CCR2004-16G-2S+ Spesifikasi : Product code: RB450Gx4, Architecture: ARM 32bit, CPU: IPQ-4019, CPU core Count: 4, CPU nominal frequency: 716 MHz, RouterOS license: 5, Operating System: RouterOS, Size of RAM: 1 GB, Storage size: 512 MB.', '', NULL, 1, '2026-11-09 13:28:03', NULL, '2026-11-09 13:28:03', 1);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (6, 1, 'Routerboard CCR2116-12G-4S+ Spesifikasi : Product code CCR2116-12G-4S+,Architecture ARM 64bit, CPU AL73400, CPU core count 16, CPU nominal frequency 2000 MHz, RouterOS license 6, Operating System RouterOS (v7 only), Size of RAM 16 GB, torage size 128 MB.', '', NULL, 1, '2026-11-09 13:28:03', NULL, '2026-11-09 13:28:03', 1);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (7, 1, 'Routerboard CCR2004-16G-2S+ Spesifikasi : Product code CCR2004-16G-2S+, Architecture ARM 64bit, CPU AL32400, CPU core count 4, CPU nominal frequency 1700 MHz, Switch chip model 88E6191X, Dimensions 443 x 210 x 44 mm, RouterOS license 6, Operating System', '', NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (8, 1, 'Routerboard CCR2004-16G-2S+ Spesifikasi : Product code: RB450Gx4, Architecture: ARM 32bit, CPU: IPQ-4019, CPU core Count: 4, CPU nominal frequency: 716 MHz, RouterOS license: 5, Operating System: RouterOS, Size of RAM: 1 GB, Storage size: 512 MB.', '', NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (9, 1, 'Routerboard CCR2116-12G-4S+ Spesifikasi : Product code CCR2116-12G-4S+,Architecture ARM 64bit, CPU AL73400, CPU core count 16, CPU nominal frequency 2000 MHz, RouterOS license 6, Operating System RouterOS (v7 only), Size of RAM 16 GB, torage size 128 MB.', '', NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (10, 2, 'Wireless Access Point\nSpesifikasi : Next-generation performance with Wi-Fi 7, delivering\nextra-high wireless speeds, Superior streaming with Wi-Fi 7\'s\nexclusive MLO feature, Compact design and easy installation,\nEnhanced data transmission with 4K-QAM', '', NULL, 1, '2026-11-16 14:55:41', NULL, '2026-11-16 14:55:41', 1);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (11, 3, 'Wireless Bluetooth Barcode Scanner\nSpesifikasi : Spesifikasi :\n• Distance Bluetooth/2,4G/Wired: 50m/100m/1,8m\n• Memory: 100.000 barcodes\n• Battery: 5V-2000mAh\n• Working Time: 3 to 10 days\n• Resolution: 4mil\n• Drop test: 2mil', '', NULL, 1, '2026-11-15 20:52:48', NULL, '2026-11-15 20:52:48', 1);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (12, 5, 'Mesin Printer Thermal Mobile', 'Spesifikasi : Spesifikasi :\nModel : BP – mPOS332\nCPU : 2.3GHz, 8 Core\nSistem Operasi : Android 14\nPenyimpanan : 3GB RAM, 32GB ROM, DDR4\nLayar : 5,5 inch HD +, 1440x720, IPS\nMetode Print : DIRECT THERMAL\nLebar Print : 58mm\nKecepatan Cetak : 75mm/s\nLebar Kertas : 58mm x', NULL, 1, '2026-11-15 18:54:05', NULL, '2026-11-15 18:54:05', 1);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (13, 5, 'Mesin Printer Thermal Mobile', 'Spesifikasi : Spesifikasi :\nModel : BP – mPOS332\nCPU : 2.3GHz, 8 Core\nSistem Operasi : Android 14\nPenyimpanan : 3GB RAM, 32GB ROM, DDR4\nLayar : 5,5 inch HD +, 1440x720, IPS\nMetode Print : DIRECT THERMAL\nLebar Print : 58mm\nKecepatan Cetak : 75mm/s\nLebar Kertas : 58mm x', NULL, 1, '2026-11-15 20:42:42', NULL, '2026-11-15 20:42:42', 1);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (14, 5, 'Mesin Printer Thermal Mobile', 'Spesifikasi : Spesifikasi :\nModel : BP – mPOS332\nCPU : 2.3GHz, 8 Core\nSistem Operasi : Android 14\nPenyimpanan : 3GB RAM, 32GB ROM, DDR4\nLayar : 5,5 inch HD +, 1440x720, IPS\nMetode Print : DIRECT THERMAL\nLebar Print : 58mm\nKecepatan Cetak : 75mm/s\nLebar Kertas : 58mm x', NULL, 1, '2026-11-15 20:46:13', NULL, '2026-11-15 20:46:13', 1);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (15, 5, 'Sapu Dan Sikat- Sikat Lantai A', 'Spesifikasi : Minimal atau Setara dengan Sikat Lantai', NULL, 1, '2026-11-15 20:46:35', NULL, '2026-11-15 20:46:35', 1);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (16, 5, 'Sapu Dan Sikat- Sikat WC', 'Spesifikasi : Minimal atau Setara dengan Sikat WC', NULL, 1, '2026-11-15 20:46:35', NULL, '2026-11-15 20:46:35', 1);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (17, 5, 'Sapu Dan Sikat- Sikat Lantai A', 'Spesifikasi : Minimal atau Setara dengan Sikat Lantai', NULL, 1, '2026-11-15 21:51:25', NULL, '2026-11-15 21:51:25', 1);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (18, 5, 'Sapu Dan Sikat- Sikat WC', 'Spesifikasi : Minimal atau Setara dengan Sikat WC', NULL, 1, '2026-11-15 21:51:25', NULL, '2026-11-15 21:51:25', 1);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (19, 3, 'Wireless Bluetooth Barcode Scanner\nSpesifikasi : Spesifikasi :\n• Distance Bluetooth/2,4G/Wired: 50m/100m/1,8m\n• Memory: 100.000 barcodes\n• Battery: 5V-2000mAh\n• Working Time: 3 to 10 days\n• Resolution: 4mil\n• Drop test: 2mil', '', NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (20, 5, 'Sapu Dan Sikat- Sikat Lantai A', 'Spesifikasi : Minimal atau Setara dengan Sikat Lantai', NULL, 1, '2026-11-16 15:13:20', NULL, '2026-11-16 15:13:20', 1);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (21, 5, 'Sapu Dan Sikat- Sikat WC', 'Spesifikasi : Minimal atau Setara dengan Sikat WC', NULL, 1, '2026-11-16 15:13:20', NULL, '2026-11-16 15:13:20', 1);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (22, 2, 'Wireless Access Point\nSpesifikasi : Next-generation performance with Wi-Fi 7, delivering\nextra-high wireless speeds, Superior streaming with Wi-Fi 7\'s\nexclusive MLO feature, Compact design and easy installation,\nEnhanced data transmission with 4K-QAM', '', NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (23, 5, 'Sapu Dan Sikat- Sikat Lantai A', 'Spesifikasi : Minimal atau Setara dengan Sikat Lantai', NULL, 1, '2026-11-16 15:13:21', NULL, '2026-11-16 15:13:21', 1);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (24, 5, 'Sapu Dan Sikat- Sikat WC', 'Spesifikasi : Minimal atau Setara dengan Sikat WC', NULL, 1, '2026-11-16 15:13:21', NULL, '2026-11-16 15:13:21', 1);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (25, 5, 'Sapu Dan Sikat- Sikat Lantai A', 'Spesifikasi : Minimal atau Setara dengan Sikat Lantai', NULL, 1, '2026-11-16 15:13:38', NULL, '2026-11-16 15:13:38', 1);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (26, 5, 'Sapu Dan Sikat- Sikat WC', 'Spesifikasi : Minimal atau Setara dengan Sikat WC', NULL, 1, '2026-11-16 15:13:38', NULL, '2026-11-16 15:13:38', 1);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (27, 5, 'Sapu Dan Sikat- Sikat Lantai A', 'Spesifikasi : Minimal atau Setara dengan Sikat Lantai', NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (28, 5, 'Sapu Dan Sikat- Sikat WC', 'Spesifikasi : Minimal atau Setara dengan Sikat WC', NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (29, 6, 'Laptop', 'Spesifikasi : Minimal atau setara dengan layar 13 inci, Core Ultra 7 atau Ryzen AI 9, RAM 32 GB, SSD 1 TB, NVMe Gen 4', NULL, 1, '2026-11-17 08:25:48', NULL, '2026-11-17 08:25:48', 1);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (30, 6, 'Laptop', 'Spesifikasi : Minimal atau setara dengan layar 13 inci, Core i7 atau Ryzen 7, RAM 16 GB, SSD 512 GB', NULL, 1, '2026-11-17 08:25:48', NULL, '2026-11-17 08:25:48', 1);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (31, 6, 'Laptop', 'Spesifikasi : Minimal atau setara dengan layar 13 inci, Core Ultra 7 atau Ryzen AI 9, RAM 32 GB, SSD 1 TB, NVMe Gen 4', NULL, 1, '2026-11-17 08:25:57', NULL, '2026-11-17 08:25:57', 1);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (32, 6, 'Laptop', 'Spesifikasi : Minimal atau setara dengan layar 13 inci, Core i7 atau Ryzen 7, RAM 16 GB, SSD 512 GB', NULL, 1, '2026-11-17 08:25:57', NULL, '2026-11-17 08:25:57', 1);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (33, 6, 'Laptop', 'Spesifikasi : Minimal atau setara dengan layar 13 inci, Core Ultra 7 atau Ryzen AI 9, RAM 32 GB, SSD 1 TB, NVMe Gen 4', NULL, 1, '2026-11-17 10:37:23', NULL, '2026-11-17 10:37:23', 1);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (34, 6, 'Laptop', 'Spesifikasi : Minimal atau setara dengan layar 13 inci, Core i7 atau Ryzen 7, RAM 16 GB, SSD 512 GB', NULL, 1, '2026-11-17 10:37:23', NULL, '2026-11-17 10:37:23', 1);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (35, 7, 'Laptop', 'Spesifikasi : Minimal atau setara dengan layar 13 inci, Core Ultra 7 atau Ryzen AI 9, RAM 32 GB, SSD 1 TB, NVMe Gen 4', NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (36, 7, 'Laptop', 'Spesifikasi : Minimal atau setara dengan layar 13 inci, Core i7 atau Ryzen 7, RAM 16 GB, SSD 512 GB', NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (37, 6, 'Laptop', 'Spesifikasi : Minimal atau setara dengan layar 13 inci, Core Ultra 7 atau Ryzen AI 9, RAM 32 GB, SSD 1 TB, NVMe Gen 4', NULL, 1, '2026-11-17 11:06:48', NULL, '2026-11-17 11:06:48', 1);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (38, 6, 'Laptop', 'Spesifikasi : Minimal atau setara dengan layar 13 inci, Core i7 atau Ryzen 7, RAM 16 GB, SSD 512 GB', NULL, 1, '2026-11-17 11:06:48', NULL, '2026-11-17 11:06:48', 1);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (39, 6, 'Laptop', 'Spesifikasi : Minimal atau setara dengan layar 13 inci, Core Ultra 7 atau Ryzen AI 9, RAM 32 GB, SSD 1 TB, NVMe Gen 4', NULL, 1, '2026-11-17 11:55:17', NULL, '2026-11-17 11:55:17', 3);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (40, 6, 'Laptop', 'Spesifikasi : Minimal atau setara dengan layar 13 inci, Core i7 atau Ryzen 7, RAM 16 GB, SSD 512 GB', NULL, 1, '2026-11-17 11:55:17', NULL, '2026-11-17 11:55:17', 3);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (41, 6, 'Laptop', 'Spesifikasi : Minimal atau setara dengan layar 13 inci, Core i7 atau Ryzen 7, RAM 16 GB, SSD 512 GB', NULL, 3, '2026-11-17 11:55:22', NULL, '2026-11-17 11:55:22', 3);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (42, 6, 'Laptop', 'Spesifikasi : Minimal atau setara dengan layar 13 inci, Core i7 atau Ryzen 7, RAM 16 GB, SSD 512 GB', NULL, 3, '2026-11-18 12:05:13', NULL, '2026-11-18 12:05:13', 1);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (43, 6, 'Laptop', 'Spesifikasi : Minimal atau setara dengan layar 13 inci, Core i7 atau Ryzen 7, RAM 16 GB, SSD 512 GB', NULL, 1, '2026-11-18 12:15:31', NULL, '2026-11-18 12:15:31', 1);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (44, 6, 'Laptop', 'Spesifikasi : Minimal atau setara dengan layar 13 inci, Core i7 atau Ryzen 7, RAM 16 GB, SSD 512 GB', NULL, 1, '2026-11-18 14:08:37', NULL, '2026-11-18 14:08:37', 1);
INSERT INTO `detail_kak_spesifikasi_teknis` VALUES (45, 6, 'Laptop', 'Spesifikasi : Minimal atau setara dengan layar 13 inci, Core i7 atau Ryzen 7, RAM 16 GB, SSD 512 GB', NULL, 1, NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for detail_nota_pencairan_dana
-- ----------------------------
DROP TABLE IF EXISTS `detail_nota_pencairan_dana`;
CREATE TABLE `detail_nota_pencairan_dana`  (
  `dpd_id` int NOT NULL AUTO_INCREMENT,
  `dpd_master_dokumen_id` int NULL DEFAULT NULL,
  `dpd_uraian` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `dpd_dpa_volume` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `dpd_dpa_satuan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `dpd_dpa_nilai` int NULL DEFAULT NULL,
  `dpd_belum_volume` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `dpd_belum_nilai` int NULL DEFAULT NULL,
  `dpd_saatini_volume` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `dpd_saatini_nilai` int NULL DEFAULT NULL,
  `dpd_saatini_ppn` int NULL DEFAULT NULL,
  `dpd_saatini_pph23` int NULL DEFAULT NULL,
  `dpd_saatini_total_pajak` int NULL DEFAULT NULL,
  `dpd_saatini_pembayaran` int NULL DEFAULT NULL,
  `dpd_sisa_volume` int NULL DEFAULT NULL,
  `dpd_sisa_nilai` int NULL DEFAULT NULL,
  `dpd_created_at` timestamp NULL DEFAULT NULL,
  `dpd_created_by` int NULL DEFAULT NULL,
  `dpd_updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `dpd_updated_by` int NULL DEFAULT NULL,
  `dpd_deleted_at` timestamp NULL DEFAULT NULL,
  `dpd_deleted_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`dpd_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of detail_nota_pencairan_dana
-- ----------------------------

-- ----------------------------
-- Table structure for detail_perhitungan_paket
-- ----------------------------
DROP TABLE IF EXISTS `detail_perhitungan_paket`;
CREATE TABLE `detail_perhitungan_paket`  (
  `pak_id` int NOT NULL AUTO_INCREMENT,
  `pak_paket_id` int NULL DEFAULT NULL COMMENT 'tabel perhitungan paket',
  `pak_master_dokumen_id` int NULL DEFAULT NULL,
  `pak_nilai_invoice` int NULL DEFAULT NULL,
  `pak_dpp` int NULL DEFAULT NULL,
  `pak_ppn` int NULL DEFAULT NULL,
  `pak_pph23` int NULL DEFAULT NULL,
  `pak_dibayar` int NULL DEFAULT NULL,
  `pak_created_at` timestamp NULL DEFAULT NULL,
  `pak_created_by` int NULL DEFAULT NULL,
  `pak_updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `pak_updated_by` int NULL DEFAULT NULL,
  `pak_deleted_at` timestamp NULL DEFAULT NULL,
  `pak_deleted_by` int NULL DEFAULT NULL,
  `pak_jenis_pph` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '23',
  PRIMARY KEY (`pak_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of detail_perhitungan_paket
-- ----------------------------
INSERT INTO `detail_perhitungan_paket` VALUES (1, 1, 1, 31749330, 28603000, 3146330, 572060, 28030940, NULL, 1, '2026-11-09 11:14:08', NULL, '2026-11-09 11:14:08', 1, '23');
INSERT INTO `detail_perhitungan_paket` VALUES (2, 1, 1, 31749330, 28603000, 3146330, 429045, 28173955, NULL, 1, NULL, NULL, NULL, NULL, '22');
INSERT INTO `detail_perhitungan_paket` VALUES (3, 2, 2, 37962000, 34200000, 3762000, 513000, 33687000, NULL, 1, NULL, NULL, NULL, NULL, '22');
INSERT INTO `detail_perhitungan_paket` VALUES (6, 4, 3, 1850000, 1850000, 0, 0, 1850000, NULL, 1, '2026-11-09 16:26:11', NULL, '2026-11-09 16:26:11', 1, '23');
INSERT INTO `detail_perhitungan_paket` VALUES (7, 4, 3, 1850000, 1850000, 0, 0, 1850000, NULL, 1, NULL, NULL, NULL, NULL, '22');
INSERT INTO `detail_perhitungan_paket` VALUES (8, 5, 9, 4356750, 3925000, 431750, 58875, 3866125, NULL, 1, NULL, NULL, NULL, NULL, '22');

-- ----------------------------
-- Table structure for detail_rencana_anggaran_biaya
-- ----------------------------
DROP TABLE IF EXISTS `detail_rencana_anggaran_biaya`;
CREATE TABLE `detail_rencana_anggaran_biaya`  (
  `rab_id` int NOT NULL AUTO_INCREMENT,
  `rab_master_dokumen_id` int NULL DEFAULT NULL,
  `rab_uraian_pekerjaan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `rab_volume` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `rab_waktu` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `rab_harga_satuan` int NULL DEFAULT NULL,
  `rab_harga_perkiraan_sendiri` int NULL DEFAULT NULL,
  `rab_created_at` timestamp NULL DEFAULT NULL,
  `rab_created_by` int NULL DEFAULT NULL,
  `rab_updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `rab_updated_by` int NULL DEFAULT NULL,
  `rab_deleted_at` timestamp NULL DEFAULT NULL,
  `rab_deleted_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`rab_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of detail_rencana_anggaran_biaya
-- ----------------------------
INSERT INTO `detail_rencana_anggaran_biaya` VALUES (1, 1, 'Routerboard CCR2004-16G-2S+ Spesifikasi : Product code CCR2004-16G-2S+, Architecture ARM 64bit, CPU AL32400, CPU core count 4, CPU nominal frequency 1700 MHz, Switch chip model 88E6191X, Dimensions 443 x 210 x 44 mm, RouterOS license 6, Operating System', '1', 'Unit', 9000000, 9000000, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_rencana_anggaran_biaya` VALUES (2, 1, 'Routerboard CCR2004-16G-2S+ Spesifikasi : Product code: RB450Gx4, Architecture: ARM 32bit, CPU: IPQ-4019, CPU core Count: 4, CPU nominal frequency: 716 MHz, RouterOS license: 5, Operating System: RouterOS, Size of RAM: 1 GB, Storage size: 512 MB.', '1', 'Unit', 2500000, 2500000, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_rencana_anggaran_biaya` VALUES (3, 1, 'Routerboard CCR2116-12G-4S+ Spesifikasi : Product code CCR2116-12G-4S+,Architecture ARM 64bit, CPU AL73400, CPU core count 16, CPU nominal frequency 2000 MHz, RouterOS license 6, Operating System RouterOS (v7 only), Size of RAM 16 GB, torage size 128 MB.', '1', 'Unit', 21000000, 21000000, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_rencana_anggaran_biaya` VALUES (4, 2, 'Wireless Access Point\nSpesifikasi : Next-generation performance with Wi-Fi 7, delivering\nextra-high wireless speeds, Superior streaming with Wi-Fi 7\'s\nexclusive MLO feature, Compact design and easy installation,\nEnhanced data transmission with 4K-QAM', '6', 'Unit', 6500000, 39000000, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_rencana_anggaran_biaya` VALUES (5, 3, 'Wireless Bluetooth Barcode Scanner\nSpesifikasi : Spesifikasi :\n• Distance Bluetooth/2,4G/Wired: 50m/100m/1,8m\n• Memory: 100.000 barcodes\n• Battery: 5V-2000mAh\n• Working Time: 3 to 10 days\n• Resolution: 4mil\n• Drop test: 2mil', '2', 'Unit', 1000000, 2000000, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_rencana_anggaran_biaya` VALUES (8, 9, 'Sapu Dan Sikat- Sikat Lantai A\nSpesifikasi : Minimal atau Setara dengan Sikat Lantai', '55', 'Unit', 11420, 628100, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_rencana_anggaran_biaya` VALUES (9, 9, 'Sapu Dan Sikat- Sikat WC\nSpesifikasi : Minimal atau Setara dengan Sikat WC', '135', 'Unit', 28560, 3855600, NULL, 1, NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for detail_spesifikasi_jumlah
-- ----------------------------
DROP TABLE IF EXISTS `detail_spesifikasi_jumlah`;
CREATE TABLE `detail_spesifikasi_jumlah`  (
  `dspj_id` int NOT NULL AUTO_INCREMENT,
  `dpsj_spt_id` int NULL DEFAULT NULL,
  `dspj_item_barang_jasa` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `dspj_jumlah` int NULL DEFAULT NULL,
  `dspj_satuan_id` int NULL DEFAULT NULL,
  `dspj_created_at` timestamp NULL DEFAULT NULL,
  `dspj_created_by` int NULL DEFAULT NULL,
  `dspj_updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `dspj_updated_by` int NULL DEFAULT NULL,
  `dspj_deleted_at` timestamp NULL DEFAULT NULL,
  `dspj_deleted_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`dspj_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of detail_spesifikasi_jumlah
-- ----------------------------
INSERT INTO `detail_spesifikasi_jumlah` VALUES (1, 1, 'Routerboard CCR2004-16G-2S+ Spesifikasi : Product code CCR2004-16G-2S+, Architecture ARM 64bit, CPU AL32400, CPU core count 4, CPU nominal frequency 1700 MHz, Switch chip model 88E6191X, Dimensions 443 x 210 x 44 mm, RouterOS license 6, Operating System', 1, 1, '2026-11-14 11:49:20', 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_spesifikasi_jumlah` VALUES (2, 1, 'Routerboard CCR2004-16G-2S+ Spesifikasi : Product code: RB450Gx4, Architecture: ARM 32bit, CPU: IPQ-4019, CPU core Count: 4, CPU nominal frequency: 716 MHz, RouterOS license: 5, Operating System: RouterOS, Size of RAM: 1 GB, Storage size: 512 MB.', 1, 1, '2026-11-14 11:49:20', 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_spesifikasi_jumlah` VALUES (3, 1, 'Routerboard CCR2116-12G-4S+ Spesifikasi : Product code CCR2116-12G-4S+,Architecture ARM 64bit, CPU AL73400, CPU core count 16, CPU nominal frequency 2000 MHz, RouterOS license 6, Operating System RouterOS (v7 only), Size of RAM 16 GB, torage size 128 MB.', 1, 1, '2026-11-14 11:49:20', 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_spesifikasi_jumlah` VALUES (4, 2, 'Sapu Dan Sikat- Sikat Lantai A', 55, NULL, '2026-11-15 20:57:32', 1, '2026-11-15 21:03:01', NULL, '2026-11-15 21:03:01', 1);
INSERT INTO `detail_spesifikasi_jumlah` VALUES (5, 2, 'Sapu Dan Sikat- Sikat WC', 135, NULL, '2026-11-15 20:57:32', 1, '2026-11-15 21:03:01', NULL, '2026-11-15 21:03:01', 1);
INSERT INTO `detail_spesifikasi_jumlah` VALUES (6, 2, 'Sapu Dan Sikat- Sikat Lantai A', 55, 1, '2026-11-15 21:03:01', 1, '2026-11-15 21:04:45', NULL, '2026-11-15 21:04:45', 1);
INSERT INTO `detail_spesifikasi_jumlah` VALUES (7, 2, 'Sapu Dan Sikat- Sikat WC', 135, 1, '2026-11-15 21:03:01', 1, '2026-11-15 21:04:45', NULL, '2026-11-15 21:04:45', 1);
INSERT INTO `detail_spesifikasi_jumlah` VALUES (8, 2, 'Sapu Dan Sikat- Sikat Lantai A', 55, 1, '2026-11-15 21:04:45', 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_spesifikasi_jumlah` VALUES (9, 2, 'Sapu Dan Sikat- Sikat WC', 135, 1, '2026-11-15 21:04:45', 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_spesifikasi_jumlah` VALUES (10, 3, 'Laptop', 5, NULL, '2026-11-18 12:09:25', 1, NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for detail_spesifikasi_teknis
-- ----------------------------
DROP TABLE IF EXISTS `detail_spesifikasi_teknis`;
CREATE TABLE `detail_spesifikasi_teknis`  (
  `dpst_id` int NOT NULL AUTO_INCREMENT,
  `dspt_spt_id` int NULL DEFAULT NULL,
  `dspt_item_barang_jasa` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `dspt_spesifikasi` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `dpst_created_at` timestamp NULL DEFAULT NULL,
  `dspt_created_by` int NULL DEFAULT NULL,
  `dspt_updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `dspt_updated_by` int NULL DEFAULT NULL,
  `dspt_deleted_at` timestamp NULL DEFAULT NULL,
  `dspt_deleted_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`dpst_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of detail_spesifikasi_teknis
-- ----------------------------
INSERT INTO `detail_spesifikasi_teknis` VALUES (1, 1, 'Routerboard CCR2004-16G-2S+ Spesifikasi : Product code CCR2004-16G-2S+, Architecture ARM 64bit, CPU AL32400, CPU core count 4, CPU nominal frequency 1700 MHz, Switch chip model 88E6191X, Dimensions 443 x 210 x 44 mm, RouterOS license 6, Operating System', 'conbtoh spek', '2026-11-14 11:49:20', 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_spesifikasi_teknis` VALUES (2, 1, 'Routerboard CCR2004-16G-2S+ Spesifikasi : Product code: RB450Gx4, Architecture: ARM 32bit, CPU: IPQ-4019, CPU core Count: 4, CPU nominal frequency: 716 MHz, RouterOS license: 5, Operating System: RouterOS, Size of RAM: 1 GB, Storage size: 512 MB.', '', '2026-11-14 11:49:20', 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_spesifikasi_teknis` VALUES (3, 1, 'Routerboard CCR2116-12G-4S+ Spesifikasi : Product code CCR2116-12G-4S+,Architecture ARM 64bit, CPU AL73400, CPU core count 16, CPU nominal frequency 2000 MHz, RouterOS license 6, Operating System RouterOS (v7 only), Size of RAM 16 GB, torage size 128 MB.', '', '2026-11-14 11:49:20', 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_spesifikasi_teknis` VALUES (4, 2, 'Sapu Dan Sikat- Sikat Lantai A', 'Spesifikasi : Minimal atau Setara dengan Sikat Lantai', '2026-11-15 20:57:31', 1, '2026-11-15 21:03:01', NULL, '2026-11-15 21:03:01', 1);
INSERT INTO `detail_spesifikasi_teknis` VALUES (5, 2, 'Sapu Dan Sikat- Sikat WC', 'Spesifikasi : Minimal atau Setara dengan Sikat WC', '2026-11-15 20:57:31', 1, '2026-11-15 21:03:01', NULL, '2026-11-15 21:03:01', 1);
INSERT INTO `detail_spesifikasi_teknis` VALUES (6, 2, 'Sapu Dan Sikat- Sikat Lantai A', 'Spesifikasi : Minimal atau Setara dengan Sikat Lantai', '2026-11-15 21:03:01', 1, '2026-11-15 21:04:45', NULL, '2026-11-15 21:04:45', 1);
INSERT INTO `detail_spesifikasi_teknis` VALUES (7, 2, 'Sapu Dan Sikat- Sikat WC', 'Spesifikasi : Minimal atau Setara dengan Sikat WC', '2026-11-15 21:03:01', 1, '2026-11-15 21:04:45', NULL, '2026-11-15 21:04:45', 1);
INSERT INTO `detail_spesifikasi_teknis` VALUES (8, 2, 'Sapu Dan Sikat- Sikat Lantai A', 'Spesifikasi : Minimal atau Setara dengan Sikat Lantai', '2026-11-15 21:04:45', 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_spesifikasi_teknis` VALUES (9, 2, 'Sapu Dan Sikat- Sikat WC', 'Spesifikasi : Minimal atau Setara dengan Sikat WC', '2026-11-15 21:04:45', 1, NULL, NULL, NULL, NULL);
INSERT INTO `detail_spesifikasi_teknis` VALUES (10, 3, 'Laptop', 'Spesifikasi : Minimal atau setara dengan layar 13 inci, Core i7 atau Ryzen 7, RAM 16 GB, SSD 512 GB', '2026-11-18 12:09:24', 1, NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for detail_survey
-- ----------------------------
DROP TABLE IF EXISTS `detail_survey`;
CREATE TABLE `detail_survey`  (
  `dsrv_id` int NOT NULL AUTO_INCREMENT,
  `dsrv_survey_id` int NULL DEFAULT NULL,
  `dsrv_master_dokumen_id` int NULL DEFAULT NULL,
  `dsrv_jenis_spesifikasi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `dsrv_harga_survey` int NULL DEFAULT NULL,
  `dsrv_created_at` timestamp NULL DEFAULT NULL,
  `dsrv_created_by` int NULL DEFAULT NULL,
  `dsrv_updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `dsrv_updated_by` int NULL DEFAULT NULL,
  `dsrv_deleted_at` timestamp NULL DEFAULT NULL,
  `dsrv_deleted_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`dsrv_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of detail_survey
-- ----------------------------

-- ----------------------------
-- Table structure for faktur
-- ----------------------------
DROP TABLE IF EXISTS `faktur`;
CREATE TABLE `faktur`  (
  `fak_id` int NOT NULL AUTO_INCREMENT,
  `fak_master_dokumen_id` int NULL DEFAULT NULL,
  `fak_nomor_faktur` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `fak_tanggal_faktur` date NULL DEFAULT NULL,
  `fak_created_at` timestamp NULL DEFAULT NULL,
  `fak_created_by` int NULL DEFAULT NULL,
  `fak_updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `fak_updated_by` int NULL DEFAULT NULL,
  `fak_deleted_at` timestamp NULL DEFAULT NULL,
  `fak_deleted_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`fak_id`) USING BTREE,
  INDEX `idx_fak_master_dokumen_id`(`fak_master_dokumen_id` ASC) USING BTREE,
  INDEX `idx_fak_deleted_at`(`fak_deleted_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of faktur
-- ----------------------------
INSERT INTO `faktur` VALUES (1, 1, 'nomorfaktur', '2026-11-09', NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `faktur` VALUES (2, 2, 'NOMORFAKTUR', '2026-11-09', NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `faktur` VALUES (3, 3, '', '2026-11-09', NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `faktur` VALUES (4, 9, 'NOMORFAKTUR', '2026-11-15', NULL, 1, NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for kerangka_acuan_kerja
-- ----------------------------
DROP TABLE IF EXISTS `kerangka_acuan_kerja`;
CREATE TABLE `kerangka_acuan_kerja`  (
  `kak_id` int NOT NULL AUTO_INCREMENT,
  `kak_master_dokumen_id` int NULL DEFAULT NULL,
  `kak_ppk_pgw_id` int NULL DEFAULT NULL,
  `kak_program` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `kak_kode_program` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `kak_kegiatan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `kak_kode_kegiatan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `kak_sub_kegiatan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `kak_kode_sub_kegiatan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `kak_rekening` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `kak_kode_rekening` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `kak_pagu_anggaran` bigint NULL DEFAULT NULL,
  `kak_item_belanja` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL,
  `kak_pekerjaan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `kak_tahun_anggaran` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `kak_latar_belakang` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `kak_maksud_dan_tujuan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `kak_referensi_hukum` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `kak_target_sasaran` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `kak_nama_organisasi_dan_pengadaan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `kak_sumber_dana_perkiraan_biaya` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `kak_perkiraan_biaya_id` int NULL DEFAULT NULL,
  `kak_ruang_lingkup_lokasi_pekerjaan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `kak_jangka_waktu_pelaksanaan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `kak_metode_pemilihan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `kak_spesifikasi_teknis_id` int NULL DEFAULT NULL,
  `kak_persyaratan_kualifikasi_penyedia` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `kak_penutup` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `kak_created_at` timestamp NULL DEFAULT NULL,
  `kak_created_by` int NULL DEFAULT NULL,
  `kak_updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `kak_updated_by` int NULL DEFAULT NULL,
  `kak_deleted_at` timestamp NULL DEFAULT NULL,
  `kak_deleted_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`kak_id`) USING BTREE,
  INDEX `idx_kak_master_dokumen_id`(`kak_master_dokumen_id` ASC) USING BTREE,
  INDEX `idx_kak_deleted_at`(`kak_deleted_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of kerangka_acuan_kerja
-- ----------------------------
INSERT INTO `kerangka_acuan_kerja` VALUES (1, 1, NULL, NULL, NULL, NULL, NULL, NULL, '5.02.01.2.06.0011', NULL, NULL, NULL, NULL, NULL, NULL, '<p style=\"text-align: justify;\">Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru merupakan perangkat daerah yang mempunyai tugas melaksanakan sebagian urusan pemerintahan daerah di bidang pengelolaan keuangan daerah dan pengelolaan aset daerah. Dalam pelaksanaan tugas dan fungsinya, BPKAD Kota Pekanbaru melaksanakan antara lain pengelolaan anggaran, perbendaharaan, aset daerah, akuntansi, serta fasilitasi penyusunan, penetapan, perubahan dan pertanggungjawaban pelaksanaan Anggaran Pendapatan dan Belanja Daerah (APBD).</p><p style=\"text-align: justify;\">Sejalan dengan meningkatnya kebutuhan akses sistem informasi, aplikasi berbasis Cloud, dan pertukaran data di lingkungan BPKAD Kota Pekanbaru, diperlukan infrastruktur dan sarana prasarana yang andal dan aman guna mendukung percepatan kinerja dan pelayanan.</p><p style=\"text-align: justify;\">Untuk memenuhi kebutuhan tersebut, pada Tahun Anggaran 2026 BPKAD Kota Pekanbaru melaksanakan kegiatan Pengadaan Router Board sebagai bagian dari upaya pemenuhan sarana dan prasarana kerja guna menunjang pelaksanaan tugas dan fungsi organisasi.</p>', '<p><strong>a. Maksud</strong></p><p>Melakukan Pengadaan Router Board di lingkungan Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru.</p><p><strong>b. Tujuan</strong></p><ul><li>Mengoptimalkan sarana dan prasarana kerja aparatur dalam menunjang pelaksanaan tugas secara efisien dan akuntabel.</li><li>Meningkatkan keandalan operasional sistem informasi dan pertukaran data internal SKPD.</li><li>Memastikan ketersediaan sarana pendukung yang terstandarisasi dan bergaransi resmi.</li></ul>', '<ul><li>Undang-Undang Nomor 23 Tahun 2014 tentang Pemerintahan Daerah sebagaimana telah diubah beberapa kali terakhir dengan Undang-Undang Nomor 11 tahun 2020 tentang Cipta Kerja;</li><li>Peraturan Pemerintah Nomor 27 Tahun 2014 tentang Pengelolaan Barang Milik Negara/Daerah sebagaimana telah diubah dengan Peraturan Pemerintah Nomor 28 Tahun 2020;</li><li>Peraturan Pemerintah Nomor 12 Tahun 2019 tentang Pengelolaan Keuangan Daerah;</li><li>Peraturan Presiden Nomor 16 Tahun 2018 tentang Pengadaan Barang/Jasa Pemerintah sebagaimana telah diubah dengan Peraturan Presiden Nomor 12 Tahun 2021;</li><li>Peraturan Menteri Dalam Negeri Nomor 77 Tahun 2020 tentang Pedoman Teknis Pengelolaan Keuangan Daerah;</li><li>Peraturan Daerah Kota Pekanbaru Nomor 01 Tahun 2023 tentang Pengelolaan Keuangan Daerah;</li><li>Peraturan Wali Kota Pekanbaru Nomor 7 Tahun 2022 tentang Sistem dan Prosedur Pengelolaan Keuangan Daerah.</li></ul>', '<p>Terpasangnya dan beroperasinya Pengadaan Router Board yang memenuhi standar spesifikasi teknis yang dipersyaratkan guna mendukung kelancaran operasional di Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru.</p>', '<p>Nama organisasi yang menyelenggarakan/melaksanakan pengadaan barang/jasa:</p><p>a. K/L/PD : Pemerintah Kota Pekanbaru</p><p>b. PD : Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru</p><p>c. PPK : DANIEL PERDANA, S.E</p>', '<p><strong>a. Sumber Dana :</strong><br>Anggaran Pendapatan dan Belanja Daerah (APBD) Tahun Anggaran 2026 Pemerintah Kota Pekanbaru Badan Pengelola Keuangan dan Aset Daerah (No. DPA SKPD : DPPA/A.1/5.02.0.00.0.00.00.00/001/2026)</p><p><strong>b. Total perkiraan biaya yang diperlukan :</strong></p>', NULL, '<p>a) Penyediaan Pengadaan Router Board;<br>b) Penyediaan garansi dan layanan purna jual sesuai ketentuan;<br>c) Serah terima barang setelah seluruh persyaratan jumlah, spesifikasi, kualitas dan fungsi terpenuhi;<br>d) Lokasi pekerjaan : Pekanbaru / BPKAD Kota Pekanbaru.</p>', '<p>14 (empat belas) Hari Kalender</p>', 'Penunjukan Langsung', NULL, '<ol><li>Memiliki SIUP / NIB yang masih berlaku sesuai bidang pekerjaan;</li><li>Memiliki Nomor Pokok Wajib Pajak (NPWP) dan telah memenuhi kewajiban perpajakan tahun terakhir (SPT Tahunan);</li><li>Memperoleh paling sedikit 1 (satu) pekerjaan sejenis dalam kurun waktu 1 (satu) sampai 3 (tiga) tahun terakhir;</li><li>Tidak dalam pengawasan pengadilan, tidak pailit, kegiatan usahanya tidak sedang dihentikan dan/atau direksi yang bertindak untuk dan atas nama perusahaan tidak sedang dalam menjalani sanksi pidana;</li><li>Memiliki kemampuan untuk menyediakan fasilitas/peralatan/perlengkapan yang dipersyaratkan.</li></ol>', '<p>1. Apabila terdapat hal yang bertentangan dengan ketentuan, peraturan, pedoman dan kebijakan pemerintah yang berlaku maka segala sesuatu yang termaksud di dalam Kerangka Acuan Kerja (KAK) ini akan diteliti dan ditinjau kembali;<br>2. Hal-hal yang belum diatur dalam KAK ini akan ditetapkan lebih lanjut.</p><p><br></p><p>Demikian Kerangka Acuan Kerja ini dibuat. Untuk dapat digunakan dengan sebaik-baiknya.</p>', NULL, 1, '2026-11-15 20:05:22', 1, NULL, NULL);
INSERT INTO `kerangka_acuan_kerja` VALUES (2, 2, NULL, 'PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA', '5.02.01', 'Administrasi Umum Perangkat Daerah', '5.02.01.2.06', 'Dukungan Pelaksanaan Sistem Pemerintahan Berbasis Elektronik pada SKPD', '5.02.01.2.06.0011', 'Belanja Modal Peralatan Jaringan', '5.2.02.10.002.00004', NULL, NULL, 'Pengadaan Wireless Access Point', '2026', '<p>Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru merupakan perangkat daerah yang mempunyai tugas melaksanakan sebagian urusan pemerintahan daerah di bidang pengelolaan keuangan daerah dan pengelolaan aset daerah. Dalam pelaksanaan tugas dan fungsinya, BPKAD Kota Pekanbaru melaksanakan antara lain pengelolaan anggaran, perbendaharaan, aset daerah, akuntansi, serta fasilitasi penyusunan, penetapan, perubahan dan pertanggungjawaban pelaksanaan Anggaran Pendapatan dan Belanja Daerah (APBD).</p><p>Sejalan dengan meningkatnya kebutuhan akses sistem informasi, aplikasi berbasis Cloud, dan pertukaran data di lingkungan BPKAD Kota Pekanbaru, diperlukan infrastruktur dan sarana prasarana yang andal dan aman guna mendukung percepatan kinerja dan pelayanan.</p><p>Untuk memenuhi kebutuhan tersebut, pada Tahun Anggaran 2026 BPKAD Kota Pekanbaru melaksanakan kegiatan Pengadaan Wireless Access Point sebagai bagian dari upaya pemenuhan sarana dan prasarana kerja guna menunjang pelaksanaan tugas dan fungsi organisasi.</p>', '<p><strong>a. Maksud</strong></p><p>Melakukan Pengadaan Wireless Access Point di lingkungan Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru.</p><p><strong>b. Tujuan</strong></p><ul><li>Mengoptimalkan sarana dan prasarana kerja aparatur dalam menunjang pelaksanaan tugas secara efisien dan akuntabel.</li><li>Meningkatkan keandalan operasional sistem informasi dan pertukaran data internal SKPD.</li><li>Memastikan ketersediaan sarana pendukung yang terstandarisasi dan bergaransi resmi.</li></ul>', '<ul><li>Undang-Undang Nomor 23 Tahun 2014 tentang Pemerintahan Daerah sebagaimana telah diubah beberapa kali terakhir dengan Undang-Undang Nomor 11 tahun 2020 tentang Cipta Kerja;</li><li>Peraturan Pemerintah Nomor 27 Tahun 2014 tentang Pengelolaan Barang Milik Negara/Daerah sebagaimana telah diubah dengan Peraturan Pemerintah Nomor 28 Tahun 2020;</li><li>Peraturan Pemerintah Nomor 12 Tahun 2019 tentang Pengelolaan Keuangan Daerah;</li><li>Peraturan Presiden Nomor 16 Tahun 2018 tentang Pengadaan Barang/Jasa Pemerintah sebagaimana telah diubah dengan Peraturan Presiden Nomor 12 Tahun 2021;</li><li>Peraturan Menteri Dalam Negeri Nomor 77 Tahun 2020 tentang Pedoman Teknis Pengelolaan Keuangan Daerah;</li><li>Peraturan Daerah Kota Pekanbaru Nomor 01 Tahun 2023 tentang Pengelolaan Keuangan Daerah;</li><li>Peraturan Wali Kota Pekanbaru Nomor 7 Tahun 2022 tentang Sistem dan Prosedur Pengelolaan Keuangan Daerah.</li></ul>', '<p>Terpasangnya dan beroperasinya Pengadaan Wireless Access Point yang memenuhi standar spesifikasi teknis yang dipersyaratkan guna mendukung kelancaran operasional di Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru.</p>', '<p>Nama organisasi yang menyelenggarakan/melaksanakan pengadaan barang/jasa:</p><p>a. K/L/PD : Pemerintah Kota Pekanbaru</p><p>b. PD : Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru</p><p>c. PPK : DANIEL PERDANA, S.E</p>', '<p><strong>a. Sumber Dana :</strong><br>Anggaran Pendapatan dan Belanja Daerah (APBD) Tahun Anggaran 2026 Pemerintah Kota Pekanbaru Badan Pengelola Keuangan dan Aset Daerah (No. DPA SKPD : DPPA/A.1/5.02.0.00.0.00.00.00/001/2026)</p><p><strong>b. Total perkiraan biaya yang diperlukan :</strong></p>', NULL, '<p>a) Penyediaan Pengadaan Wireless Access Point;<br>b) Penyediaan garansi dan layanan purna jual sesuai ketentuan;<br>c) Serah terima barang setelah seluruh persyaratan jumlah, spesifikasi, kualitas dan fungsi terpenuhi;<br>d) Lokasi pekerjaan : Pekanbaru / BPKAD Kota Pekanbaru.</p>', '<p>14 (empat belas) Hari Kalender</p>', 'e-Purchasing', NULL, '<ol><li>Memiliki SIUP / NIB yang masih berlaku sesuai bidang pekerjaan;</li><li>Memiliki Nomor Pokok Wajib Pajak (NPWP) dan telah memenuhi kewajiban perpajakan tahun terakhir (SPT Tahunan);</li><li>Memperoleh paling sedikit 1 (satu) pekerjaan sejenis dalam kurun waktu 1 (satu) sampai 3 (tiga) tahun terakhir;</li><li>Tidak dalam pengawasan pengadilan, tidak pailit, kegiatan usahanya tidak sedang dihentikan dan/atau direksi yang bertindak untuk dan atas nama perusahaan tidak sedang dalam menjalani sanksi pidana;</li><li>Memiliki kemampuan untuk menyediakan fasilitas/peralatan/perlengkapan yang dipersyaratkan.</li></ol>', '<p>1. Apabila terdapat hal yang bertentangan dengan ketentuan, peraturan, pedoman dan kebijakan pemerintah yang berlaku maka segala sesuatu yang termaksud di dalam Kerangka Acuan Kerja (KAK) ini akan diteliti dan ditinjau kembali;<br>2. Hal-hal yang belum diatur dalam KAK ini akan ditetapkan lebih lanjut.</p><p><br></p><p>Demikian Kerangka Acuan Kerja ini dibuat. Untuk dapat digunakan dengan sebaik-baiknya.</p>', NULL, 1, '2026-11-16 14:55:41', 1, NULL, NULL);
INSERT INTO `kerangka_acuan_kerja` VALUES (3, 3, NULL, 'PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA', '5.02.01', 'Administrasi Umum Perangkat Daerah', '5.02.01.2.06', 'Penyediaan Peralatan dan Perlengkapan Kantor', '5.02.01.2.06.0002', 'Belanja Modal Peralatan Personal Computer', '5.2.02.10.002.00003', NULL, NULL, 'Pengadaan Barcode Scaner', '2026', '<p>Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru merupakan perangkat daerah yang mempunyai tugas melaksanakan sebagian urusan pemerintahan daerah di bidang pengelolaan keuangan daerah dan pengelolaan aset daerah. Dalam pelaksanaan tugas dan fungsinya, BPKAD Kota Pekanbaru melaksanakan antara lain pengelolaan anggaran, perbendaharaan, aset daerah, akuntansi, serta fasilitasi penyusunan, penetapan, perubahan dan pertanggungjawaban pelaksanaan Anggaran Pendapatan dan Belanja Daerah (APBD).</p><p>Sejalan dengan meningkatnya kebutuhan akses sistem informasi, aplikasi berbasis Cloud, dan pertukaran data di lingkungan BPKAD Kota Pekanbaru, diperlukan infrastruktur dan sarana prasarana yang andal dan aman guna mendukung percepatan kinerja dan pelayanan.</p><p>Untuk memenuhi kebutuhan tersebut, pada Tahun Anggaran 2026 BPKAD Kota Pekanbaru melaksanakan kegiatan Pengadaan Barcode Scaner sebagai bagian dari upaya pemenuhan sarana dan prasarana kerja guna menunjang pelaksanaan tugas dan fungsi organisasi.</p>', '<p><strong>a. Maksud</strong></p><p>Melakukan Pengadaan Barcode Scaner di lingkungan Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru.</p><p><strong>b. Tujuan</strong></p><ul><li>Mengoptimalkan sarana dan prasarana kerja aparatur dalam menunjang pelaksanaan tugas secara efisien dan akuntabel.</li><li>Meningkatkan keandalan operasional sistem informasi dan pertukaran data internal SKPD.</li><li>Memastikan ketersediaan sarana pendukung yang terstandarisasi dan bergaransi resmi.</li></ul>', '<ul><li>Undang-Undang Nomor 23 Tahun 2014 tentang Pemerintahan Daerah sebagaimana telah diubah beberapa kali terakhir dengan Undang-Undang Nomor 11 tahun 2020 tentang Cipta Kerja;</li><li>Peraturan Pemerintah Nomor 27 Tahun 2014 tentang Pengelolaan Barang Milik Negara/Daerah sebagaimana telah diubah dengan Peraturan Pemerintah Nomor 28 Tahun 2020;</li><li>Peraturan Pemerintah Nomor 12 Tahun 2019 tentang Pengelolaan Keuangan Daerah;</li><li>Peraturan Presiden Nomor 16 Tahun 2018 tentang Pengadaan Barang/Jasa Pemerintah sebagaimana telah diubah dengan Peraturan Presiden Nomor 12 Tahun 2021;</li><li>Peraturan Menteri Dalam Negeri Nomor 77 Tahun 2020 tentang Pedoman Teknis Pengelolaan Keuangan Daerah;</li><li>Peraturan Daerah Kota Pekanbaru Nomor 01 Tahun 2023 tentang Pengelolaan Keuangan Daerah;</li><li>Peraturan Wali Kota Pekanbaru Nomor 7 Tahun 2022 tentang Sistem dan Prosedur Pengelolaan Keuangan Daerah.</li></ul>', '<p>Terpasangnya dan beroperasinya Pengadaan Barcode Scaner yang memenuhi standar spesifikasi teknis yang dipersyaratkan guna mendukung kelancaran operasional di Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru.</p>', '<p>Nama organisasi yang menyelenggarakan/melaksanakan pengadaan barang/jasa:</p><p>a. K/L/PD : Pemerintah Kota Pekanbaru</p><p>b. PD : Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru</p><p>c. PPK : DANIEL PERDANA, S.E</p>', '<p><strong>a. Sumber Dana :</strong><br>Anggaran Pendapatan dan Belanja Daerah (APBD) Tahun Anggaran 2026 Pemerintah Kota Pekanbaru Badan Pengelola Keuangan dan Aset Daerah (No. DPA SKPD : DPPA/A.1/5.02.0.00.0.00.00.00/001/2026)</p><p><strong>b. Total perkiraan biaya yang diperlukan :</strong></p>', NULL, '<p>a) Penyediaan Pengadaan Barcode Scaner;<br>b) Penyediaan garansi dan layanan purna jual sesuai ketentuan;<br>c) Serah terima barang setelah seluruh persyaratan jumlah, spesifikasi, kualitas dan fungsi terpenuhi;<br>d) Lokasi pekerjaan : Pekanbaru / BPKAD Kota Pekanbaru.</p>', '<p>14 (empat belas) Hari Kalender</p>', 'e-Purchasing', NULL, '<ol><li>Memiliki SIUP / NIB yang masih berlaku sesuai bidang pekerjaan;</li><li>Memiliki Nomor Pokok Wajib Pajak (NPWP) dan telah memenuhi kewajiban perpajakan tahun terakhir (SPT Tahunan);</li><li>Memperoleh paling sedikit 1 (satu) pekerjaan sejenis dalam kurun waktu 1 (satu) sampai 3 (tiga) tahun terakhir;</li><li>Tidak dalam pengawasan pengadilan, tidak pailit, kegiatan usahanya tidak sedang dihentikan dan/atau direksi yang bertindak untuk dan atas nama perusahaan tidak sedang dalam menjalani sanksi pidana;</li><li>Memiliki kemampuan untuk menyediakan fasilitas/peralatan/perlengkapan yang dipersyaratkan.</li></ol>', '<p>1. Apabila terdapat hal yang bertentangan dengan ketentuan, peraturan, pedoman dan kebijakan pemerintah yang berlaku maka segala sesuatu yang termaksud di dalam Kerangka Acuan Kerja (KAK) ini akan diteliti dan ditinjau kembali;<br>2. Hal-hal yang belum diatur dalam KAK ini akan ditetapkan lebih lanjut.</p><p><br></p><p>Demikian Kerangka Acuan Kerja ini dibuat. Untuk dapat digunakan dengan sebaik-baiknya.</p>', NULL, 1, '2026-11-15 20:52:48', 1, NULL, NULL);
INSERT INTO `kerangka_acuan_kerja` VALUES (5, 9, 4, 'PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA', '5.02.01', 'Administrasi Umum Perangkat Daerah', '5.02.01.2.06', 'Penyediaan Peralatan Rumah Tangga', '5.02.01.2.06.0003', 'Belanja Alat/Bahan untuk Kegiatan Kantor-Perabot Kantor', '5.1.02.01.001.00030', NULL, NULL, 'Sapu Dan Sikat- Sikat Lantai A, Sapu Dan Sikat- Sikat WC', '2026', '<p>Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru merupakan perangkat daerah yang mempunyai tugas melaksanakan sebagian urusan pemerintahan daerah di bidang pengelolaan keuangan daerah dan pengelolaan aset daerah. Dalam pelaksanaan tugas dan fungsinya, BPKAD Kota Pekanbaru melaksanakan antara lain pengelolaan anggaran, perbendaharaan, aset daerah, akuntansi, serta fasilitasi penyusunan, penetapan, perubahan dan pertanggungjawaban pelaksanaan Anggaran Pendapatan dan Belanja Daerah (APBD).</p><p>Sejalan dengan meningkatnya kebutuhan akses sistem informasi, aplikasi berbasis Cloud, dan pertukaran data di lingkungan BPKAD Kota Pekanbaru, diperlukan infrastruktur dan sarana prasarana yang andal dan aman guna mendukung percepatan kinerja dan pelayanan.</p><p>Untuk memenuhi kebutuhan tersebut, pada Tahun Anggaran 2026 BPKAD Kota Pekanbaru melaksanakan kegiatan Sapu Dan Sikat- Sikat Lantai A, Sapu Dan Sikat- Sikat WC sebagai bagian dari upaya pemenuhan sarana dan prasarana kerja guna menunjang pelaksanaan tugas dan fungsi organisasi.</p>', '<p><strong>a. Maksud</strong></p><p>Melakukan&nbsp; di lingkungan Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru.</p><p><strong>b. Tujuan</strong></p><ul><li>Mengoptimalkan sarana dan prasarana kerja aparatur dalam menunjang pelaksanaan tugas secara efisien dan akuntabel.</li><li>Meningkatkan keandalan operasional sistem informasi dan pertukaran data internal SKPD.</li><li>Memastikan ketersediaan sarana pendukung yang terstandarisasi dan bergaransi resmi.</li></ul>', '<ul><li>Undang-Undang Nomor 23 Tahun 2014 tentang Pemerintahan Daerah sebagaimana telah diubah beberapa kali terakhir dengan Undang-Undang Nomor 11 tahun 2020 tentang Cipta Kerja;</li><li>Peraturan Pemerintah Nomor 27 Tahun 2014 tentang Pengelolaan Barang Milik Negara/Daerah sebagaimana telah diubah dengan Peraturan Pemerintah Nomor 28 Tahun 2020;</li><li>Peraturan Pemerintah Nomor 12 Tahun 2019 tentang Pengelolaan Keuangan Daerah;</li><li>Peraturan Presiden Nomor 16 Tahun 2018 tentang Pengadaan Barang/Jasa Pemerintah sebagaimana telah diubah dengan Peraturan Presiden Nomor 12 Tahun 2021;</li><li>Peraturan Menteri Dalam Negeri Nomor 77 Tahun 2020 tentang Pedoman Teknis Pengelolaan Keuangan Daerah;</li><li>Peraturan Daerah Kota Pekanbaru Nomor 01 Tahun 2023 tentang Pengelolaan Keuangan Daerah;</li><li>Peraturan Wali Kota Pekanbaru Nomor 7 Tahun 2022 tentang Sistem dan Prosedur Pengelolaan Keuangan Daerah.</li></ul>', '<p>Terpasangnya dan beroperasinya Sapu Dan Sikat- Sikat Lantai A, Sapu Dan Sikat- Sikat WC yang memenuhi standar spesifikasi teknis yang dipersyaratkan guna mendukung kelancaran operasional di Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru.</p>', '<p>Nama organisasi yang menyelenggarakan/melaksanakan pengadaan barang/jasa:</p><p>a. K/L/PD : Pemerintah Kota Pekanbaru</p><p>b. PD : Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru</p><p>c. PPK : DANIEL PERDANA, S.E</p>', '<p><strong>a. Sumber Dana :</strong><br>Anggaran Pendapatan dan Belanja Daerah (APBD) Tahun Anggaran 2026 Pemerintah Kota Pekanbaru Badan Pengelola Keuangan dan Aset Daerah</p><p><strong>b. Total perkiraan biaya yang diperlukan :</strong></p>', NULL, '<p>a) Penyediaan Sapu Dan Sikat- Sikat Lantai A, Sapu Dan Sikat- Sikat WC;<br>b) Penyediaan garansi dan layanan purna jual sesuai ketentuan;<br>c) Serah terima barang setelah seluruh persyaratan jumlah, spesifikasi, kualitas dan fungsi terpenuhi;<br>d) Lokasi pekerjaan : Pekanbaru / BPKAD Kota Pekanbaru.</p>', '<p>14 (empat belas) Hari Kalender</p>', 'e-Purchasing', NULL, '<ol><li>Memiliki SIUP / NIB yang masih berlaku sesuai bidang pekerjaan;</li><li>Memiliki Nomor Pokok Wajib Pajak (NPWP) dan telah memenuhi kewajiban perpajakan tahun terakhir (SPT Tahunan);</li><li>Memperoleh paling sedikit 1 (satu) pekerjaan sejenis dalam kurun waktu 1 (satu) sampai 3 (tiga) tahun terakhir;</li><li>Tidak dalam pengawasan pengadilan, tidak pailit, kegiatan usahanya tidak sedang dihentikan dan/atau direksi yang bertindak untuk dan atas nama perusahaan tidak sedang dalam menjalani sanksi pidana;</li><li>Memiliki kemampuan untuk menyediakan fasilitas/peralatan/perlengkapan yang dipersyaratkan</li></ol>', '<p>1. Apabila terdapat hal yang bertentangan dengan ketentuan, peraturan, pedoman dan kebijakan pemerintah yang berlaku maka segala sesuatu yang termaksud di dalam Kerangka Acuan Kerja (KAK) ini akan diteliti dan ditinjau kembali;<br>2. Hal-hal yang belum diatur dalam KAK ini akan ditetapkan lebih lanjut.</p><p><br></p><p>Demikian Kerangka Acuan Kerja ini dibuat. Untuk dapat digunakan dengan sebaik-baiknya.</p>', '2026-11-15 18:54:03', 1, '2026-11-16 15:13:38', 1, NULL, NULL);
INSERT INTO `kerangka_acuan_kerja` VALUES (6, NULL, 4, 'PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA', '5.02.01', 'Administrasi Umum Perangkat Daerah', '5.02.01.2.06', 'Penyediaan Peralatan dan Perlengkapan Kantor', '5.02.01.2.06.0002', 'Belanja Modal Personal Computer', '5.2.02.10.001.00002', 192500000, '[{\"KODE_STANDAR_HARGA\":\"1.3.02.10.01.0002.00063\",\"NAMA_STANDAR_HARGA\":\"Laptop\",\"SPESIFIKASI\":\"Spesifikasi : Minimal atau setara dengan layar 13 inci, Core i7 atau Ryzen 7, RAM 16 GB, SSD 512 GB\",\"KOOFISIEN\":\"5\",\"SATUAN\":\"Unit\",\"HARGA_SATUAN\":\"38500000\",\"PAGU_TOTAL\":\"192500000\"}]', 'Pengadaan Laptop', '2026', '<p>Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru merupakan perangkat daerah yang mempunyai tugas melaksanakan sebagian urusan pemerintahan daerah di bidang pengelolaan keuangan daerah dan pengelolaan aset daerah. Dalam pelaksanaan tugas dan fungsinya, BPKAD Kota Pekanbaru melaksanakan antara lain pengelolaan anggaran, perbendaharaan, aset daerah, akuntansi, serta fasilitasi penyusunan, penetapan, perubahan dan pertanggungjawaban pelaksanaan Anggaran Pendapatan dan Belanja Daerah (APBD).</p><p>Sejalan dengan meningkatnya beban kerja pengelolaan keuangan dan aset daerah berbasis digital, penggunaan berbagai aplikasi sistem informasi pemerintahan, serta kebutuhan pengolahan data dan penyusunan laporan secara cepat dan akurat di lingkungan BPKAD Kota Pekanbaru, diperlukan dukungan perangkat kerja komputasi portabel (laptop) yang memadai dan andal. Perangkat kerja eksisting saat ini sebagian telah mengalami penurunan performa akibat spesifikasi yang usang serta jumlahnya belum mencukupi untuk mendukung mobilitas aparatur. Untuk mengoptimalkan kinerja pegawai, mempercepat proses administrasi dan pelaporan, serta mendukung kelancaran operasional di unit kerja, diperlukan pengadaan perangkat Laptop baru dengan spesifikasi yang mumpuni.</p><p>Untuk memenuhi kebutuhan tersebut, pada Tahun Anggaran 2026 BPKAD Kota Pekanbaru melaksanakan kegiatan Pengadaan Laptop sebagai bagian dari upaya pemenuhan sarana dan prasarana kerja guna menunjang pelaksanaan tugas dan fungsi organisasi.</p>', '<p><strong>a. Maksud</strong></p><p>Melakukan Pengadaan Laptop di lingkungan Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru.</p><p><strong>b. Tujuan</strong></p><ul><li>Mengoptimalkan sarana dan prasarana kerja aparatur dalam menunjang pelaksanaan tugas secara efisien dan akuntabel.</li><li>Meningkatkan keandalan operasional sistem informasi dan pertukaran data internal SKPD.</li><li>Memastikan ketersediaan sarana pendukung yang terstandarisasi dan bergaransi resmi.</li></ul>', '<ul><li>Undang-Undang Nomor 23 Tahun 2014 tentang Pemerintahan Daerah sebagaimana telah diubah beberapa kali terakhir dengan Undang-Undang Nomor 11 tahun 2020 tentang Cipta Kerja;</li><li>Peraturan Pemerintah Nomor 27 Tahun 2014 tentang Pengelolaan Barang Milik Negara/Daerah sebagaimana telah diubah dengan Peraturan Pemerintah Nomor 28 Tahun 2020;</li><li>Peraturan Pemerintah Nomor 12 Tahun 2019 tentang Pengelolaan Keuangan Daerah;</li><li>Peraturan Presiden Nomor 16 Tahun 2018 tentang Pengadaan Barang/Jasa Pemerintah sebagaimana telah diubah dengan Peraturan Presiden Nomor 12 Tahun 2021;</li><li>Peraturan Menteri Dalam Negeri Nomor 77 Tahun 2020 tentang Pedoman Teknis Pengelolaan Keuangan Daerah;</li><li>Peraturan Daerah Kota Pekanbaru Nomor 01 Tahun 2023 tentang Pengelolaan Keuangan Daerah;</li><li>Peraturan Wali Kota Pekanbaru Nomor 7 Tahun 2022 tentang Sistem dan Prosedur Pengelolaan Keuangan Daerah.</li></ul>', '<p>Terpasangnya dan beroperasinya Pengadaan Laptop yang memenuhi standar spesifikasi teknis yang dipersyaratkan guna mendukung kelancaran operasional di Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru.</p>', '<p>Nama organisasi yang menyelenggarakan/melaksanakan pengadaan barang/jasa:</p><p>a. K/L/PD : Pemerintah Kota Pekanbaru</p><p>b. PD : Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru</p><p>c. PPK : DANIEL PERDANA, S.E</p>', '<p><strong>a. Sumber Dana :</strong><br>Anggaran Pendapatan dan Belanja Daerah (APBD) Perubahan Tahun Anggaran 2026 Pemerintah Kota Pekanbaru Badan Pengelola Keuangan dan Aset Daerah</p><p><strong>b. Total perkiraan biaya yang diperlukan :</strong></p>', NULL, '<p>a) Penyediaan Pengadaan Laptop;<br>b) Penyediaan garansi dan layanan purna jual sesuai ketentuan;<br>c) Serah terima barang setelah seluruh persyaratan jumlah, spesifikasi, kualitas dan fungsi terpenuhi;<br>d) Lokasi pekerjaan : Pekanbaru / BPKAD Kota Pekanbaru.</p>', '<p>30 (tiga puluh) Hari Kalender</p>', 'e-Purchasing', NULL, '<ol><li>Memiliki SIUP / NIB yang masih berlaku sesuai bidang pekerjaan;</li><li>Memiliki Nomor Pokok Wajib Pajak (NPWP) dan telah memenuhi kewajiban perpajakan tahun terakhir (SPT Tahunan);</li><li>Memperoleh paling sedikit 1 (satu) pekerjaan sejenis dalam kurun waktu 1 (satu) sampai 3 (tiga) tahun terakhir;</li><li>Tidak dalam pengawasan pengadilan, tidak pailit, kegiatan usahanya tidak sedang dihentikan dan/atau direksi yang bertindak untuk dan atas nama perusahaan tidak sedang dalam menjalani sanksi pidana;</li><li>Memiliki kemampuan untuk menyediakan fasilitas/peralatan/perlengkapan yang dipersyaratkan.</li></ol>', '<p>1. Apabila terdapat hal yang bertentangan dengan ketentuan, peraturan, pedoman dan kebijakan pemerintah yang berlaku maka segala sesuatu yang termaksud di dalam Kerangka Acuan Kerja (KAK) ini akan diteliti dan ditinjau kembali;<br>2. Hal-hal yang belum diatur dalam KAK ini akan ditetapkan lebih lanjut.</p><p><br></p><p>Demikian Kerangka Acuan Kerja ini dibuat. Untuk dapat digunakan dengan sebaik-baiknya.</p>', '2026-11-17 08:25:44', 1, '2026-11-18 14:08:37', 1, NULL, NULL);

-- ----------------------------
-- Table structure for kwitansi
-- ----------------------------
DROP TABLE IF EXISTS `kwitansi`;
CREATE TABLE `kwitansi`  (
  `kwt_id` int NOT NULL AUTO_INCREMENT,
  `kwt_master_dokumen_id` int NULL DEFAULT NULL,
  `kwt_buku_kas_umum_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `kwt_uang_sejumlah` double NULL DEFAULT NULL,
  `kwt_sudah_terima_dari` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `kwt_tanggal_lunas_dibayar` date NULL DEFAULT NULL,
  `kwt_tanggal_terima_uang` date NULL DEFAULT NULL,
  `kwt_yaitu` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `kwt_no_sp2d` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `kwt_status_lunas` tinyint NULL DEFAULT 0,
  `kwt_created_at` timestamp NULL DEFAULT NULL,
  `kwt_created_by` int NULL DEFAULT NULL,
  `kwt_updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `kwt_updated_by` int NULL DEFAULT NULL,
  `kwt_deleted_at` timestamp NULL DEFAULT NULL,
  `kwt_deleted_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`kwt_id`) USING BTREE,
  INDEX `idx_kwt_deleted`(`kwt_deleted_at` ASC) USING BTREE,
  INDEX `idx_kwt_master_dokumen_id`(`kwt_master_dokumen_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of kwitansi
-- ----------------------------
INSERT INTO `kwitansi` VALUES (1, 1, '', 31749330, '', '2026-11-09', '2026-11-09', '', '', 0, '2026-11-09 10:53:44', 1, '2026-11-09 11:02:22', 1, NULL, NULL);
INSERT INTO `kwitansi` VALUES (2, 2, '', 37962000, '', '2026-11-09', '2026-11-09', '', '', 0, '2026-11-09 13:38:39', 1, NULL, NULL, NULL, NULL);
INSERT INTO `kwitansi` VALUES (3, 9, '', 4356750, '', '2026-11-15', '2026-11-16', '', '', 0, '2026-11-15 21:14:48', 1, NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for master_ba_bukti_perikatan
-- ----------------------------
DROP TABLE IF EXISTS `master_ba_bukti_perikatan`;
CREATE TABLE `master_ba_bukti_perikatan`  (
  `mbk_id` int NOT NULL AUTO_INCREMENT,
  `mbk_kode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `mbk_nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `mbk_created_at` timestamp NULL DEFAULT NULL,
  `mbk_created_by` int NULL DEFAULT NULL,
  `mbk_updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `mbk_updated_by` int NULL DEFAULT NULL,
  `mbk_deleted_at` timestamp NULL DEFAULT NULL,
  `mbk_deleted_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`mbk_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of master_ba_bukti_perikatan
-- ----------------------------
INSERT INTO `master_ba_bukti_perikatan` VALUES (1, '001', 'FAKTUR', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `master_ba_bukti_perikatan` VALUES (2, '002', 'SPK', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `master_ba_bukti_perikatan` VALUES (3, '003', 'SURAT PESANAN', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `master_ba_bukti_perikatan` VALUES (4, '004', 'SURAT PERJANJIAN/KONTRAK', NULL, NULL, NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for master_dokumen
-- ----------------------------
DROP TABLE IF EXISTS `master_dokumen`;
CREATE TABLE `master_dokumen`  (
  `mdk_id` int NOT NULL AUTO_INCREMENT,
  `mdk_kak_id` int NULL DEFAULT NULL,
  `mdk_nama_pejabat_id` int NULL DEFAULT NULL,
  `mdk_bidang_id` int NULL DEFAULT NULL,
  `mdk_pagu_anggaran` int NULL DEFAULT NULL,
  `mdk_nama_pejabat_pengadaan_id` int NULL DEFAULT NULL,
  `mdk_nama_pptk_id` int NULL DEFAULT NULL,
  `mdk_nama_bendahara_id` int NULL DEFAULT NULL,
  `mdk_nama_perusahaan_id` int NULL DEFAULT NULL,
  `mdk_nama_pimpinan_perusahaan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `mdk_jabatan_pimpinan_perusahaan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `mdk_pekerjaan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `mdk_alamat` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `mdk_program` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `mdk_kode_program` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `mdk_kegiatan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `mdk_kode_kegiatan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `mdk_sub_kegiatan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `mdk_kode_sub_kegiatan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `mdk_uraian_belanja` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `mdk_rekening_belanja` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `mdk_item_barang` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL,
  `mdk_kode_level1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `mdk_nama_level1` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `mdk_kode_level2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `mdk_nama_level2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `mdk_kode_level3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `mdk_nama_level3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `mdk_kode_level4` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `mdk_nama_level4` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `mdk_kode_level5` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `mdk_nama_level5` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `mdk_keterangan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `mdk_apbd` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `mdk_no_dpa` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `mdk_volume` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `mdk_satuan` int NULL DEFAULT NULL,
  `mdk_is_lock` tinyint NOT NULL DEFAULT 0,
  `mdk_created_at` timestamp NULL DEFAULT NULL,
  `mdk_created_by` int NULL DEFAULT NULL,
  `mdk_updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `mdk_updated_by` int NULL DEFAULT NULL,
  `mdk_deleted_at` timestamp NULL DEFAULT NULL,
  `mdk_deleted_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`mdk_id`) USING BTREE,
  INDEX `idx_mdk_bidang_id`(`mdk_bidang_id` ASC) USING BTREE,
  INDEX `idx_mdk_pegawai_id`(`mdk_nama_pejabat_id` ASC) USING BTREE,
  INDEX `idx_mdk_deleted_bdg`(`mdk_deleted_at` ASC, `mdk_bidang_id` ASC, `mdk_pagu_anggaran` ASC) USING BTREE,
  INDEX `idx_mdk_created_deleted`(`mdk_deleted_at` ASC, `mdk_created_at` ASC, `mdk_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of master_dokumen
-- ----------------------------
INSERT INTO `master_dokumen` VALUES (1, NULL, 4, 3, 81000000, 7, 3, 9, 5, 'I MADE GERY INGGRAYANA', 'DIREKTUR', 'Pengadaan Router Board', 'Perkantoran Grand Sudirman - Pekanbaru - Riau', 'PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA', '5.02.01', 'Administrasi Umum Perangkat Daerah', '5.02.01.2.06', 'Dukungan Pelaksanaan Sistem Pemerintahan Berbasis Elektronik pada SKPD', '5.02.01.2.06.0011', 'Belanja Modal Peralatan Jaringan', '5.2.02.10.002.00004', NULL, '5.', 'BELANJA DAERAH', '5.2.', 'BELANJA MODAL', '5.2.02.', 'Belanja Modal Peralatan dan Mesin', '5.2.02.10.', 'Belanja Modal Komputer', '5.2.02.10.02.', 'Belanja Modal Peralatan Komputer', '', 'APBD Kota Pekanbaru Tahun 2026', 'DPPA/A.1/5.02.0.00.0.00.00.00/001/2026', '3', 1, 0, NULL, 1, '2026-11-09 10:40:03', 1, NULL, NULL);
INSERT INTO `master_dokumen` VALUES (2, NULL, 4, 3, 81000000, 7, 3, 9, 4, 'SUYONO, S.T', 'Direktur', 'Pengadaan Wireless Access Point', 'JL. Diponegoro XI No. 12, Desa/Kelurahan Sukamaju, Kec. Sail, Kota Pekanbaru, Provinsi Riau', 'PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA', '5.02.01', 'Administrasi Umum Perangkat Daerah', '5.02.01.2.06', 'Dukungan Pelaksanaan Sistem Pemerintahan Berbasis Elektronik pada SKPD', '5.02.01.2.06.0011', 'Belanja Modal Peralatan Jaringan', '5.2.02.10.002.00004', '[{\"SATUAN\": \"Unit\", \"KOOFISIEN\": \"1\", \"PAGU_TOTAL\": \"21000000\", \"SPESIFIKASI\": \"Spesifikasi : Product code CCR2116-12G-4S+,Architecture ARM 64bit, CPU AL73400, CPU core count 16, CPU nominal frequency 2000 MHz, RouterOS license 6, Operating System RouterOS (v7 only), Size of RAM 16 GB, torage size 128 MB, Storage type NAND, MTBF, Approximately 200\", \"HARGA_SATUAN\": \"21000000\", \"KODE_STANDAR_HARGA\": \"1.3.02.10.02.0004.00064\", \"NAMA_STANDAR_HARGA\": \"Routerboard CCR2116-12G-4S+\"}, {\"SATUAN\": \"Unit\", \"KOOFISIEN\": \"1\", \"PAGU_TOTAL\": \"9000000\", \"SPESIFIKASI\": \"Spesifikasi : Product code CCR2004-16G-2S+, Architecture ARM 64bit, CPU AL32400, CPU core count 4, CPU nominal frequency 1700 MHz, Switch chip model 88E6191X, Dimensions 443 x 210 x 44 mm, RouterOS license 6, Operating System, RouterOS v7\\nSize of RAM 4 GB\\nStorage size \", \"HARGA_SATUAN\": \"9000000\", \"KODE_STANDAR_HARGA\": \"1.3.02.10.02.0004.00065\", \"NAMA_STANDAR_HARGA\": \"Routerboard CCR2004-16G-2S+\"}, {\"SATUAN\": \"Unit\", \"KOOFISIEN\": \"1\", \"PAGU_TOTAL\": \"2500000\", \"SPESIFIKASI\": \"Spesifikasi : Product code: RB450Gx4, Architecture: ARM 32bit, CPU: IPQ-4019, CPU core Count: 4, CPU nominal frequency: 716 MHz, RouterOS license: 5, Operating System: RouterOS, Size of RAM: 1 GB, Storage size: 512 MB, Storage type: NAND\\nMTBF: Approximately 100\'000 hou\", \"HARGA_SATUAN\": \"2500000\", \"KODE_STANDAR_HARGA\": \"1.3.02.10.02.0004.00066\", \"NAMA_STANDAR_HARGA\": \"Routerboard CCR2004-16G-2S+\"}, {\"SATUAN\": \"Unit\", \"KOOFISIEN\": \"6\", \"PAGU_TOTAL\": \"39000000\", \"SPESIFIKASI\": \"Spesifikasi : Next-generation performance with Wi-Fi 7, delivering extra-high wireless speeds, Superior streaming with Wi-Fi 7\'s exclusive MLO feature, Compact design and easy installation, Enhanced data transmission with 4K-QAM for faster speeds, Ideal for integrating\", \"HARGA_SATUAN\": \"6500000\", \"KODE_STANDAR_HARGA\": \"1.3.02.10.02.0004.00069\", \"NAMA_STANDAR_HARGA\": \"Wireless Access Point\"}]', '5.', 'BELANJA DAERAH', '5.2.', 'BELANJA MODAL', '5.2.02.', 'Belanja Modal Peralatan dan Mesin', '5.2.02.10.', 'Belanja Modal Komputer', '5.2.02.10.02.', 'Belanja Modal Peralatan Komputer', '', 'APBD Kota Pekanbaru Tahun 2026', 'DPPA/A.1/5.02.0.00.0.00.00.00/001/2026', '6', 1, 0, NULL, 1, '2026-11-09 15:10:36', 1, NULL, NULL);
INSERT INTO `master_dokumen` VALUES (3, NULL, 4, 3, 2000000, 7, 3, 9, 4, 'SUYONO, S.T', 'Direktur', 'Pengadaan Barcode Scaner', 'JL. Diponegoro XI No. 12, Desa/Kelurahan Sukamaju, Kec. Sail, Kota Pekanbaru, Provinsi Riau', 'PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA', '5.02.01', 'Administrasi Umum Perangkat Daerah', '5.02.01.2.06', 'Penyediaan Peralatan dan Perlengkapan Kantor', '5.02.01.2.06.0002', 'Belanja Modal Peralatan Personal Computer', '5.2.02.10.002.00003', '[{\"SATUAN\": \"Unit\", \"KOOFISIEN\": \"2\", \"PAGU_TOTAL\": \"2000000\", \"SPESIFIKASI\": \"Spesifikasi : Spesifikasi :\\n• Distance Bluetooth/2,4G/Wired: 50m/100m/1,8m\\n• Memory: 100.000 barcodes\\n• Battery: 5V-2000mAh\\n• Working Time: 3 to 10 days\\n• Resolution: 4mil\\n• Drop test: 2mil\", \"HARGA_SATUAN\": \"1000000\", \"KODE_STANDAR_HARGA\": \"1.3.02.10.02.0003.00057\", \"NAMA_STANDAR_HARGA\": \"Wireless Bluetooth Barcode Scanner\"}]', '5.', 'BELANJA DAERAH', '5.2.', 'BELANJA MODAL', '5.2.02.', 'Belanja Modal Peralatan dan Mesin', '5.2.02.10.', 'Belanja Modal Komputer', '5.2.02.10.02.', 'Belanja Modal Peralatan Komputer', '', 'APBD Kota Pekanbaru Tahun 2026', 'DPPA/A.1/5.02.0.00.0.00.00.00/001/2026', '2', 1, 0, NULL, 1, '2026-11-09 15:36:42', 1, NULL, NULL);
INSERT INTO `master_dokumen` VALUES (9, 5, 4, 3, 4483700, 7, 3, 9, 4, 'SUYONO, S.T', 'Direktur', 'Pengadaan alat kebersihan', 'JL. Diponegoro XI No. 12, Desa/Kelurahan Sukamaju, Kec. Sail, Kota Pekanbaru, Provinsi Riau', 'PROGRAM PENUNJANG URUSAN PEMERINTAHAN DAERAH KABUPATEN/KOTA', '5.02.01', 'Administrasi Umum Perangkat Daerah', '5.02.01.2.06', 'Penyediaan Peralatan Rumah Tangga', '5.02.01.2.06.0003', 'Belanja Alat/Bahan untuk Kegiatan Kantor-Perabot Kantor', '5.1.02.01.001.00030', '[{\"SATUAN\": \"Unit\", \"KOOFISIEN\": \"55\", \"PAGU_TOTAL\": \"628100\", \"SPESIFIKASI\": \"Spesifikasi : Minimal atau Setara dengan Sikat Lantai\", \"HARGA_SATUAN\": \"11420\", \"KODE_STANDAR_HARGA\": \"1.1.12.01.03.0007.00293\", \"NAMA_STANDAR_HARGA\": \"Sapu Dan Sikat- Sikat Lantai A\"}, {\"SATUAN\": \"Unit\", \"KOOFISIEN\": \"135\", \"PAGU_TOTAL\": \"3855600\", \"SPESIFIKASI\": \"Spesifikasi : Minimal atau Setara dengan Sikat WC\", \"HARGA_SATUAN\": \"28560\", \"KODE_STANDAR_HARGA\": \"1.1.12.01.03.0007.00295\", \"NAMA_STANDAR_HARGA\": \"Sapu Dan Sikat- Sikat WC\"}]', '', '', '', '', '', '', '', '', '', '', '', 'APBD Kota Pekanbaru Tahun 2026', '', '190', 1, 0, NULL, 1, '2026-11-15 21:24:45', 1, NULL, NULL);

-- ----------------------------
-- Table structure for master_jenis_berita_acara
-- ----------------------------
DROP TABLE IF EXISTS `master_jenis_berita_acara`;
CREATE TABLE `master_jenis_berita_acara`  (
  `mba_id` int NOT NULL AUTO_INCREMENT,
  `mba_kode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `mba_nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `mba_created_at` timestamp NULL DEFAULT NULL,
  `mba_created_by` int NULL DEFAULT NULL,
  `mba_updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `mba_updated_by` int NULL DEFAULT NULL,
  `mba_deleted_at` timestamp NULL DEFAULT NULL,
  `mba_deleted_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`mba_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of master_jenis_berita_acara
-- ----------------------------
INSERT INTO `master_jenis_berita_acara` VALUES (1, '001', 'PEMERIKSAAN', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `master_jenis_berita_acara` VALUES (2, '002', 'SERAH TERIMA', NULL, NULL, NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for nego
-- ----------------------------
DROP TABLE IF EXISTS `nego`;
CREATE TABLE `nego`  (
  `nego_id` int NOT NULL AUTO_INCREMENT,
  `nego_master_dokumen_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `nego_uraian_kegiatan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `nego_volume` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `nego_waktu` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `nego_hps_harga_satuan` int NULL DEFAULT NULL,
  `nego_hps_jumlah_harga` int NULL DEFAULT NULL,
  `nego_pnw_harga_satuan` int NULL DEFAULT NULL,
  `nego_pnw_jumlah_harga` int NULL DEFAULT NULL,
  `nego_negosiasi_harga_satuan` int NULL DEFAULT NULL,
  `nego_negosiasi_jumlah_harga` int NULL DEFAULT NULL,
  `nego_created_at` timestamp NULL DEFAULT NULL,
  `nego_created_by` int NULL DEFAULT NULL,
  `nego_updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `nego_updated_by` int NULL DEFAULT NULL,
  `nego_deleted_at` timestamp NULL DEFAULT NULL,
  `nego_deleted_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`nego_id`) USING BTREE,
  INDEX `idx_nego_master_dokumen_id`(`nego_master_dokumen_id` ASC) USING BTREE,
  INDEX `idx_nego_deleted_at`(`nego_deleted_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of nego
-- ----------------------------
INSERT INTO `nego` VALUES (1, '1', 'Routerboard CCR2004-16G-2S+ Spesifikasi : Product code CCR2004-16G-2S+, Architecture ARM 64bit, CPU AL32400, CPU core count 4, CPU nominal frequency 1700 MHz, Switch chip model 88E6191X, Dimensions 443 x 210 x 44 mm, RouterOS license 6, Operating System', '1', 'Unit', 8108000, 8108000, 8288288, 8288288, 8108000, 8108000, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `nego` VALUES (2, '1', 'Routerboard CCR2004-16G-2S+ Spesifikasi : Product code: RB450Gx4, Architecture: ARM 32bit, CPU: IPQ-4019, CPU core Count: 4, CPU nominal frequency: 716 MHz, RouterOS license: 5, Operating System: RouterOS, Size of RAM: 1 GB, Storage size: 512 MB.', '1', 'Unit', 2252000, 2252000, 2614414, 2614414, 2252000, 2252000, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `nego` VALUES (3, '1', 'Routerboard CCR2116-12G-4S+ Spesifikasi : Product code CCR2116-12G-4S+,Architecture ARM 64bit, CPU AL73400, CPU core count 16, CPU nominal frequency 2000 MHz, RouterOS license 6, Operating System RouterOS (v7 only), Size of RAM 16 GB, torage size 128 MB.', '1', 'Unit', 18900000, 18900000, 18243243, 18243243, 18243000, 18243000, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `nego` VALUES (4, '2', 'Wireless Access Point\nSpesifikasi : Next-generation performance with Wi-Fi 7, delivering\nextra-high wireless speeds, Superior streaming with Wi-Fi 7\'s\nexclusive MLO feature, Compact design and easy installation,\nEnhanced data transmission with 4K-QAM', '6', 'Unit', 5800000, 34800000, 5765766, 34594596, 5700000, 34200000, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `nego` VALUES (5, '3', 'Wireless Bluetooth Barcode Scanner\nSpesifikasi : Spesifikasi :\n• Distance Bluetooth/2,4G/Wired: 50m/100m/1,8m\n• Memory: 100.000 barcodes\n• Battery: 5V-2000mAh\n• Working Time: 3 to 10 days\n• Resolution: 4mil\n• Drop test: 2mil', '2', 'Unit', 1000000, 2000000, 950000, 1900000, 925000, 1850000, NULL, 1, '2026-11-09 16:07:30', NULL, '2026-11-09 16:07:30', 1);
INSERT INTO `nego` VALUES (6, '3', 'Wireless Bluetooth Barcode Scanner\nSpesifikasi : Spesifikasi :\n• Distance Bluetooth/2,4G/Wired: 50m/100m/1,8m\n• Memory: 100.000 barcodes\n• Battery: 5V-2000mAh\n• Working Time: 3 to 10 days\n• Resolution: 4mil\n• Drop test: 2mil', '2', 'Unit', 1000000, 2000000, 950000, 1900000, 925000, 1850000, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `nego` VALUES (7, '9', 'Sapu Dan Sikat- Sikat Lantai A\nSpesifikasi : Minimal atau Setara dengan Sikat Lantai', '55', 'Unit', 9000, 495000, 11420, 628100, 10000, 550000, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `nego` VALUES (8, '9', 'Sapu Dan Sikat- Sikat WC\nSpesifikasi : Minimal atau Setara dengan Sikat WC', '135', 'Unit', 27560, 3720600, 28560, 3855600, 25000, 3375000, NULL, 1, NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for nota_pencairan_dana
-- ----------------------------
DROP TABLE IF EXISTS `nota_pencairan_dana`;
CREATE TABLE `nota_pencairan_dana`  (
  `dpd_id` int NOT NULL AUTO_INCREMENT,
  `dpd_master_dokumen_id` int NOT NULL,
  `dpd_uraian` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `dpd_dpa_volume` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `dpd_dpa_satuan` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `dpd_dpa_nilai` decimal(15, 2) NOT NULL DEFAULT 0.00,
  `dpd_belum_volume` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `dpd_belum_nilai` decimal(15, 2) NOT NULL DEFAULT 0.00,
  `dpd_saatini_volume` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `dpd_saatini_nilai` decimal(15, 2) NOT NULL DEFAULT 0.00,
  `dpd_saatini_ppn` decimal(15, 2) NOT NULL DEFAULT 0.00,
  `dpd_saatini_pph23` decimal(15, 2) NOT NULL DEFAULT 0.00,
  `dpd_saatini_total_pajak` decimal(15, 2) NOT NULL DEFAULT 0.00,
  `dpd_saatini_pembayaran` decimal(15, 2) NOT NULL DEFAULT 0.00,
  `dpd_sisa_volume` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `dpd_sisa_nilai` decimal(15, 2) NOT NULL DEFAULT 0.00,
  `dpd_created_at` timestamp NULL DEFAULT current_timestamp,
  `dpd_created_by` int NULL DEFAULT NULL,
  `dpd_updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `dpd_updated_by` int NULL DEFAULT NULL,
  `dpd_deleted_at` timestamp NULL DEFAULT NULL,
  `dpd_deleted_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`dpd_id`) USING BTREE,
  INDEX `idx_dpd_mdk_deleted`(`dpd_master_dokumen_id` ASC, `dpd_deleted_at` ASC) USING BTREE,
  INDEX `idx_dpd_deleted_pembayaran`(`dpd_deleted_at` ASC, `dpd_saatini_pembayaran` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of nota_pencairan_dana
-- ----------------------------

-- ----------------------------
-- Table structure for pegawai
-- ----------------------------
DROP TABLE IF EXISTS `pegawai`;
CREATE TABLE `pegawai`  (
  `pgw_id` int NOT NULL AUTO_INCREMENT,
  `pgw_bdg_id` int NULL DEFAULT NULL,
  `pgw_nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pgw_nip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pgw_jabatan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pgw_password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pgw_role` tinyint NULL DEFAULT NULL,
  `pgw_status_pegawai` tinyint NULL DEFAULT NULL,
  `pgw_created_at` timestamp NULL DEFAULT NULL,
  `pgw_created_by` int NULL DEFAULT NULL,
  `pgw_updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `pgw_updated_by` int NULL DEFAULT NULL,
  `pgw_deleted_at` timestamp NULL DEFAULT NULL,
  `pgw_deleted_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`pgw_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of pegawai
-- ----------------------------
INSERT INTO `pegawai` VALUES (1, 3, 'Khoidir Khonofi', '199705082025041001', 'ADMIN', '$2b$10$k4ETlTCJTddvkHkIxtPPLeR0Ibv2.1PDaVm3OaaLvj3L4XFqxf.sq', 0, 0, NULL, NULL, '2026-11-05 09:58:17', 8, NULL, NULL);
INSERT INTO `pegawai` VALUES (2, NULL, 'khoidir', '199705082025041001', 'KABAN', '$2b$10$Qz4YisfQPpCk2aP4I0H2JueeZ8Cm3IHZOZlE4Wr73EJ8UvWf86AoC', 1, 0, NULL, NULL, '2026-09-02 10:09:22', 1, '2026-09-01 14:41:24', 1);
INSERT INTO `pegawai` VALUES (3, NULL, 'Mirza Walad, S.E., M. Ak', '198208012015031001', 'PPTK', '$2b$10$4YV8Gk5CV4PVY1wEEWPnkey3jMwhOZlLNb84hsDI853gB2ZhlEnLO', 0, 0, NULL, 1, '2026-11-06 14:43:16', 1, NULL, NULL);
INSERT INTO `pegawai` VALUES (4, NULL, 'DANIEL PERDANA, S.E', '197507242001121006', 'PA', '$2b$10$60CUZyJtpiujMaV0Wc/a1OME8ALll1t4qvnoHN3ynpjH1/u40uh7S', 0, 0, NULL, 1, '2026-11-06 15:18:00', 1, NULL, NULL);
INSERT INTO `pegawai` VALUES (5, NULL, 'R Airin Susana, S.E', '198003102007012007', 'PPTK', '$2b$10$FfB7UEd.zIFMPOQFJkVxF.tkkKNhBpdvy8bzD5J/VPU2hfpDojXmq', 1, 0, NULL, 2, '2026-10-21 11:16:20', 1, NULL, NULL);
INSERT INTO `pegawai` VALUES (6, NULL, 'Firmansyah Eka Putera', '197201312006051001', 'PA', '$2b$10$gRMhI6rWf1/zCVeK168IReI2FKdvRcukwmSBwSw43vjDb8oaBrlyG', 1, 0, NULL, 2, '2026-10-21 11:16:38', 1, NULL, NULL);
INSERT INTO `pegawai` VALUES (7, NULL, 'RIO MARK H.', '1975003242006041008', 'Pejabat Pengadaan', '$2b$10$3eQXTOzH5.xBDiMA/dt0DOFalwlqDMy/03r8JXBS4XpqpbjA4GVCe', 0, 1, NULL, 1, '2026-10-01 11:04:22', 1, NULL, NULL);
INSERT INTO `pegawai` VALUES (8, NULL, 'Giri Gutriansyah', '200111012025041002', 'Pembantu Bendahara', '$2b$10$QJ/GQxZtAzjkNmlBtYrk5OgDtgCmEPxBaJWeyd2OH1S5glWcHPq6a', 0, 0, NULL, 1, '2026-10-21 11:25:11', 1, NULL, NULL);
INSERT INTO `pegawai` VALUES (9, NULL, 'Rendi Setiawan', '198007242004121005', 'Bendahara Pengeluaran', '$2b$10$4BKcnvkFYShlx4/jSPROku6c.4lTr95WKawzJ1YSOZH287KfEFei2', 0, 0, NULL, 1, '2026-11-08 18:56:35', 1, NULL, NULL);

-- ----------------------------
-- Table structure for penawaran
-- ----------------------------
DROP TABLE IF EXISTS `penawaran`;
CREATE TABLE `penawaran`  (
  `pnw_id` int NOT NULL AUTO_INCREMENT,
  `pnw_master_dokumen_id` int NULL DEFAULT NULL,
  `pnw_uraian_pekerjaan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `pnw_volume` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pnw_waktu` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pnw_harga_satuan` int NULL DEFAULT NULL,
  `pnw_harga_perkiraan_sendiri` int NULL DEFAULT NULL,
  `pnw_created_at` timestamp NULL DEFAULT NULL,
  `pnw_created_by` int NULL DEFAULT NULL,
  `pnw_updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `pnw_updated_by` int NULL DEFAULT NULL,
  `pnw_deleted_at` timestamp NULL DEFAULT NULL,
  `pnw_deleted_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`pnw_id`) USING BTREE,
  INDEX `idx_pnw_master_dokumen_id`(`pnw_master_dokumen_id` ASC) USING BTREE,
  INDEX `idx_pnw_deleted_at`(`pnw_deleted_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of penawaran
-- ----------------------------
INSERT INTO `penawaran` VALUES (1, 1, 'Routerboard CCR2004-16G-2S+ Spesifikasi : Product code CCR2004-16G-2S+, Architecture ARM 64bit, CPU AL32400, CPU core count 4, CPU nominal frequency 1700 MHz, Switch chip model 88E6191X, Dimensions 443 x 210 x 44 mm, RouterOS license 6, Operating System', '1', 'Unit', 8288288, 8288288, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `penawaran` VALUES (2, 1, 'Routerboard CCR2004-16G-2S+ Spesifikasi : Product code: RB450Gx4, Architecture: ARM 32bit, CPU: IPQ-4019, CPU core Count: 4, CPU nominal frequency: 716 MHz, RouterOS license: 5, Operating System: RouterOS, Size of RAM: 1 GB, Storage size: 512 MB.', '1', 'Unit', 2614414, 2614414, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `penawaran` VALUES (3, 1, 'Routerboard CCR2116-12G-4S+ Spesifikasi : Product code CCR2116-12G-4S+,Architecture ARM 64bit, CPU AL73400, CPU core count 16, CPU nominal frequency 2000 MHz, RouterOS license 6, Operating System RouterOS (v7 only), Size of RAM 16 GB, torage size 128 MB.', '1', 'Unit', 18243243, 18243243, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `penawaran` VALUES (4, 2, 'Wireless Access Point\nSpesifikasi : Next-generation performance with Wi-Fi 7, delivering\nextra-high wireless speeds, Superior streaming with Wi-Fi 7\'s\nexclusive MLO feature, Compact design and easy installation,\nEnhanced data transmission with 4K-QAM', '6', 'Unit', 5765766, 34594596, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `penawaran` VALUES (5, 3, 'Wireless Bluetooth Barcode Scanner\nSpesifikasi : Spesifikasi :\n• Distance Bluetooth/2,4G/Wired: 50m/100m/1,8m\n• Memory: 100.000 barcodes\n• Battery: 5V-2000mAh\n• Working Time: 3 to 10 days\n• Resolution: 4mil\n• Drop test: 2mil', '2', 'Unit', 950000, 1900000, NULL, 1, '2026-11-09 16:03:12', NULL, '2026-11-09 16:03:12', 1);
INSERT INTO `penawaran` VALUES (6, 3, 'Wireless Bluetooth Barcode Scanner\nSpesifikasi : Spesifikasi :\n• Distance Bluetooth/2,4G/Wired: 50m/100m/1,8m\n• Memory: 100.000 barcodes\n• Battery: 5V-2000mAh\n• Working Time: 3 to 10 days\n• Resolution: 4mil\n• Drop test: 2mil', '2', 'Unit', 950000, 1900000, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `penawaran` VALUES (7, 9, 'Sapu Dan Sikat- Sikat Lantai A\nSpesifikasi : Minimal atau Setara dengan Sikat Lantai', '55', 'Unit', 11420, 628100, NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `penawaran` VALUES (8, 9, 'Sapu Dan Sikat- Sikat WC\nSpesifikasi : Minimal atau Setara dengan Sikat WC', '135', 'Unit', 28560, 3855600, NULL, 1, NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for perhitungan_paket
-- ----------------------------
DROP TABLE IF EXISTS `perhitungan_paket`;
CREATE TABLE `perhitungan_paket`  (
  `pkt_id` int NOT NULL AUTO_INCREMENT,
  `pkt_master_dokumen_id` int NULL DEFAULT NULL,
  `pkt_spk_kwitansi` int NULL DEFAULT NULL,
  `pkt_no_spk_kwitansi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pkt_tanggal_spk_kwitansi` date NULL DEFAULT NULL,
  `pkt_bapp` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pkt_bast` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pkt_bap` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pkt_tanggal` date NULL DEFAULT NULL,
  `pkt_npwp` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pkt_no_rekening` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pkt_nama_rekening` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pkt_nama_bank` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pkt_created_at` timestamp NULL DEFAULT NULL,
  `pkt_created_by` int NULL DEFAULT NULL,
  `pkt_updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `pkt_updated_by` int NULL DEFAULT NULL,
  `pkt_deleted_at` timestamp NULL DEFAULT NULL,
  `pkt_deleted_by` int NULL DEFAULT NULL,
  `pkt_jenis_pph` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '23',
  PRIMARY KEY (`pkt_id`) USING BTREE,
  INDEX `idx_pkt_master_dokumen_id`(`pkt_master_dokumen_id` ASC) USING BTREE,
  INDEX `idx_pkt_deleted_at`(`pkt_deleted_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of perhitungan_paket
-- ----------------------------
INSERT INTO `perhitungan_paket` VALUES (1, 1, NULL, 'nomorspkkuitansi', '2026-11-09', 'nomorbapp', 'nomorbast', 'nomorbap', '2026-11-09', '012.526.468.9-216.000', '107901001760302', 'PT. SAMARTHA NUSA UTAMA', 'BRI CABANG BINTAN KEPULAUAN RIAU', NULL, 1, '2026-11-09 11:14:08', 1, NULL, NULL, '23');
INSERT INTO `perhitungan_paket` VALUES (2, 2, NULL, 'SPKNOMOR', '2026-11-09', 'nomorBAPP', 'NOMOTBAST', 'NOMORBAP', '2026-11-09', '091.067.698.0-211.000', '93875893259823', 'SYSCOM', 'BTN', NULL, 1, NULL, NULL, NULL, NULL, '23');
INSERT INTO `perhitungan_paket` VALUES (4, 3, NULL, NULL, '2026-11-09', NULL, NULL, NULL, '2026-11-09', '091.067.698.0-211.000', '8200800004', 'SYSCOM', 'BTN', NULL, 1, '2026-11-09 16:26:11', 1, NULL, NULL, '23');
INSERT INTO `perhitungan_paket` VALUES (5, 9, NULL, 'NOMORSPK', '2026-11-15', 'NPMPRBAPP', 'NOMORBAST', 'NOMORBAP', '2026-11-15', '091.067.698.0-211.000', '8200800004', 'SYSCOM', 'BTN', NULL, 1, NULL, NULL, NULL, NULL, '22');

-- ----------------------------
-- Table structure for permohonan
-- ----------------------------
DROP TABLE IF EXISTS `permohonan`;
CREATE TABLE `permohonan`  (
  `pmh_id` int NOT NULL AUTO_INCREMENT,
  `pmh_kak_id` int NULL DEFAULT NULL,
  `pmh_ppk_pgw_id` int NULL DEFAULT NULL,
  `pmh_tanggal` date NULL DEFAULT NULL,
  `pmh_nomor` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pmh_sifat` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pmh_lampiran` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pmh_hal` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pmh_paragraf1` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `pmh_kode_rup` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pmh_nama_paket` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pmh_pagu_anggaran` bigint NULL DEFAULT NULL,
  `pmh_hps` bigint NULL DEFAULT NULL,
  `pmh_metode_pemilihan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pmh_sumber_dana` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `pmh_paragraf2` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `pmh_created_at` timestamp NULL DEFAULT NULL,
  `pmh_created_by` int NULL DEFAULT NULL,
  `pmh_updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `pmh_updated_by` int NULL DEFAULT NULL,
  `pmh_deleted_at` timestamp NULL DEFAULT NULL,
  `pmh_deleted_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`pmh_id`) USING BTREE,
  INDEX `idx_pmh_kak_id`(`pmh_kak_id` ASC) USING BTREE,
  INDEX `idx_pmh_deleted_at`(`pmh_deleted_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of permohonan
-- ----------------------------
INSERT INTO `permohonan` VALUES (2, 1, NULL, '2026-11-10', 'S.000.3.1/ BPKAD-ND/      / 2026', 'Segera', '3 (tiga)', 'Permintaan Proses Pengadaan Barang/Jasa', 'Memperhatikan DPA Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru Tahun Anggaran 2026, bersama ini Pejabat Pengadaan Barang/Jasa pada Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru diminta untuk melaksanakan paket Pengadaan melalui e-purchasing pada Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru dengan rincian sebagai berikut :', NULL, 'Pengadaan Router Board', 81000000, 29260000, 'Penunjukan Langsung', 'APBD Pemerintah Kota Pekanbaru Tahun Anggaran 2026', 'Berkaitan dengan hal tersebut di atas, bersama ini kami lampirkan Dokumen Persiapan Pengadaan (DPP), antara lain:\n1. KAK\n2. Spesifikasi Teknis\n\nDemikian disampaikan untuk diproses lebih lanjut sesuai dengan ketentuan dan peraturan perundang-undangan yang berlaku.', '2026-11-10 21:23:47', 1, NULL, NULL, NULL, NULL);
INSERT INTO `permohonan` VALUES (3, 3, NULL, '2026-11-07', 'S.000.3.1/ BPKAD-ND/      / 2026', 'Segera', '3 (tiga)', 'Permintaan Proses Pengadaan Barang/Jasa', 'Memperhatikan DPA<b> Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru </b>Tahun Anggaran 2026, bersama ini Pejabat Pengadaan Barang/Jasa pada Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru diminta untuk melaksanakan paket Pengadaan melalui e-purchasing pada Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru dengan rincian sebagai berikut :', NULL, 'Pengadaan Barcode Scaner', 2000000, 2000000, 'e-Purchasing', 'APBD Pemerintah Kota Pekanbaru Tahun Anggaran 2026', '<p>Berkaitan dengan hal tersebut di atas, bersama ini kami lampirkan Dokumen Persiapan Pengadaan (DPP), antara lain:</p><ol><li>KAK</li><li>Spesifikasi Teknis</li></ol><p>Demikian disampaikan untuk diproses lebih lanjut sesuai dengan ketentuan dan peraturan perundang-undangan yang berlaku.</p>', '2026-11-10 21:44:07', 1, '2026-11-14 19:12:13', 1, NULL, NULL);
INSERT INTO `permohonan` VALUES (4, 5, NULL, '2026-03-08', 'S.000.3.1/ BPKAD-ND/ 228/ 2026', 'Segera', '3 (tiga)', 'Permintaan Proses Pengadaan Barang/Jasa', 'Memperhatikan DPA Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru Tahun Anggaran 2026, bersama ini Pejabat Pengadaan Barang/Jasa pada Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru diminta untuk melaksanakan paket Pengadaan melalui e-purchasing pada Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru dengan rincian sebagai berikut :', '66437314', 'Mesin Printer Thermal Mobile', 7000000, 4483700, 'e-purchasing melalui e katalog v.6', 'APBD Pemerintah Kota Pekanbaru Tahun Anggaran 2026', '<p>Berkaitan dengan hal tersebut di atas, bersama ini kami lampirkan Dokumen Persiapan Pengadaan (DPP), antara lain:</p><ol><li>KAK</li><li>Spesifikasi Teknis</li></ol><p>Demikian disampaikan untuk diproses lebih lanjut sesuai dengan ketentuan dan peraturan perundang-undangan yang berlaku.</p>', '2026-11-15 19:00:52', 1, '2026-11-15 20:56:46', 1, NULL, NULL);
INSERT INTO `permohonan` VALUES (5, 6, 4, '2026-11-17', 'S.000.3.1/ BPKAD-ND/      / 2026', 'Segera', '3 (tiga)', 'Permintaan Proses Pengadaan Barang/Jasa', 'Memperhatikan DPA Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru Tahun Anggaran 2026, bersama ini Pejabat Pengadaan Barang/Jasa pada Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru diminta untuk melaksanakan paket Pengadaan melalui e-purchasing pada Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru dengan rincian sebagai berikut :', NULL, 'Pengadaan Laptop', 192500000, 192500000, 'e-Purchasing', 'APBD Pemerintah Kota Pekanbaru Tahun Anggaran 2026', '<p>Berkaitan dengan hal tersebut di atas, bersama ini kami lampirkan Dokumen Persiapan Pengadaan (DPP), antara lain:</p><ol><li>KAK</li><li>Spesifikasi Teknis</li></ol><p>Demikian disampaikan untuk diproses lebih lanjut sesuai dengan ketentuan dan peraturan perundang-undangan yang berlaku.</p>', '2026-11-18 12:08:07', 1, '2026-11-18 14:10:51', 1, NULL, NULL);

-- ----------------------------
-- Table structure for perusahaan
-- ----------------------------
DROP TABLE IF EXISTS `perusahaan`;
CREATE TABLE `perusahaan`  (
  `psh_id` int NOT NULL AUTO_INCREMENT,
  `psh_nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `psh_nama_pimpinan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `psh_jabatan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `psh_npwp` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `psh_nomor_rekening` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `psh_nama_rekening` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `psh_nama_bank` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `psh_alamat` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `psh_created_at` timestamp NULL DEFAULT NULL,
  `psh_created_by` int NULL DEFAULT NULL,
  `psh_updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `psh_updated_by` int NULL DEFAULT NULL,
  `psh_deleted_at` timestamp NULL DEFAULT NULL,
  `psh_deleted_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`psh_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of perusahaan
-- ----------------------------
INSERT INTO `perusahaan` VALUES (1, 'PT BARITO PACIFIC', NULL, NULL, NULL, NULL, NULL, NULL, 'Jakarta', NULL, 1, NULL, NULL, NULL, NULL);
INSERT INTO `perusahaan` VALUES (2, 'PT JATIM JAYA PERKASA', NULL, NULL, NULL, NULL, NULL, NULL, 'KUBU', NULL, 1, '2026-10-21 16:36:40', NULL, '2026-10-21 16:36:40', 1);
INSERT INTO `perusahaan` VALUES (3, 'PT SIBAYAK RIAU WISATA', 'ELIAKIM SITEPU, SP', 'DIREKTUR', NULL, NULL, NULL, NULL, 'Jl. Tembusu Blok C. 25 No. 24, Perum Pandau Permai, Kel. Pandau Jaya, Kec. Siak Hulu, Kab Kampar', NULL, 1, '2026-08-27 09:23:58', 2, NULL, NULL);
INSERT INTO `perusahaan` VALUES (4, 'CV. SYSCOM', 'SUYONO, S.T', 'Direktur', '091.067.698.0-211.000', '8200800004', 'SYSCOM', 'BTN', 'JL. Diponegoro XI No. 12, Desa/Kelurahan Sukamaju, Kec. Sail, Kota Pekanbaru, Provinsi Riau', NULL, 1, '2026-11-09 15:39:51', 1, NULL, NULL);
INSERT INTO `perusahaan` VALUES (5, 'PT. SAMARTHA NUSA UTAMA', 'I MADE GERY INGGRAYANA', 'DIREKTUR', '012.526.468.9-216.000', '107901001760302', 'PT. SAMARTHA NUSA UTAMA', 'BRI CABANG BINTAN KEPULAUAN RIAU', 'Perkantoran Grand Sudirman - Pekanbaru - Riau', NULL, 3, '2026-11-06 17:00:23', 1, NULL, NULL);

-- ----------------------------
-- Table structure for satuan
-- ----------------------------
DROP TABLE IF EXISTS `satuan`;
CREATE TABLE `satuan`  (
  `st_id` int NOT NULL AUTO_INCREMENT,
  `st_nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `st_created_at` timestamp NULL DEFAULT NULL,
  `st_created_by` int NULL DEFAULT NULL,
  `st_updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `st_updated_by` int NULL DEFAULT NULL,
  `st_deleted_at` timestamp NULL DEFAULT NULL,
  `st_deleted_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`st_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of satuan
-- ----------------------------
INSERT INTO `satuan` VALUES (1, 'Unit', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `satuan` VALUES (2, 'Buah', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `satuan` VALUES (3, 'Kotak', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `satuan` VALUES (4, 'Lembar', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `satuan` VALUES (5, 'Rim', NULL, NULL, '2026-11-17 11:26:34', NULL, NULL, NULL);
INSERT INTO `satuan` VALUES (6, 'Pcs', NULL, NULL, NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for spesifikasi_teknis
-- ----------------------------
DROP TABLE IF EXISTS `spesifikasi_teknis`;
CREATE TABLE `spesifikasi_teknis`  (
  `spt_id` int NOT NULL AUTO_INCREMENT,
  `spt_kak_id` int NULL DEFAULT NULL,
  `spt_ppk_pgw_id` int NULL DEFAULT NULL,
  `spt_paket_pengadaan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `spt_satuan_kerja` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `spt_spt_ppk_pgw_id` int NULL DEFAULT NULL,
  `spd_id_rup` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `spt_nama_barang_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `spt_identifikasi_tkdn` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `spt_prioritas_penggunaan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `spt_spesifikasi_jumlah` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `spt_spesifikasi_waktu_pelaksanaan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `spt_spesifikasi_waktu_lokasi_kedatangan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `spt_spesifikasi_pelayanan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `spt_spesifikasi_lokasi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `spt_rencana_poin_negosiasi_teknis` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `spt_nama_pelaku_usaha` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `spt_link_katalog` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `spt_created_at` timestamp NULL DEFAULT NULL,
  `spt_created_by` int NULL DEFAULT NULL,
  `spt_updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `spt_updated_by` int NULL DEFAULT NULL,
  `spt_deleted_at` timestamp NULL DEFAULT NULL,
  `spt_deleted_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`spt_id`) USING BTREE,
  INDEX `idx_spt_kak_id`(`spt_kak_id` ASC) USING BTREE,
  INDEX `idx_spd_deleted_at`(`spt_deleted_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of spesifikasi_teknis
-- ----------------------------
INSERT INTO `spesifikasi_teknis` VALUES (1, 1, NULL, 'Pengadaan Router Board', 'Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru', 4, '9874e893', 'Pengadaan Router Board', 'TKDN,PDN', 'Usaha Kecil', 'Harga perolehan atas masing-masing uraian barang di atas harus sudah memperhitungkan komponen harga perolehan di bawah ini :\n- Ongkos Kirim dan pajak', '<p>14 (empat belas) Hari Kalender</p>', 'Kantor Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru', 'Tingkat pelayanan barang/jasa :\n1. Pengiriman : Vendor bertanggung jawab atas pengiriman ke lokasi dan harus memastikan bahwa barang sampai dalam kondisi baik.\n2. Jadwal: Vendor harus menyediakan jadwal pengadaan yang jelas,termasuk tenggat waktu untuk pengiriman.', 'Berdasarkan lokasi pengiriman terdekat dari lokasi tujuan pengiriman.', '1. Sebagaimana tersebut pada spesifikasi mutu\n2. Sebagaimana tersebut pada spesifikasi waktu\n3. Sebagaimana tersebut pada spesifikasi pelayanan\n4. Sebagaimana tersebut pada spesifikasi lokasi', 'PT. SAMARTHA NUSA UTAMA', 'LINK KATALOG\nHTTPS', '2026-11-14 11:49:20', 1, NULL, NULL, NULL, NULL);
INSERT INTO `spesifikasi_teknis` VALUES (2, 5, NULL, 'Sapu Dan Sikat- Sikat Lantai A, Sapu Dan Sikat- Sikat WC', 'Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru', NULL, NULL, 'Sapu Dan Sikat- Sikat Lantai A, Sapu Dan Sikat- Sikat WC', 'TKDN,PDN', 'Usaha Kecil', '<p>Harga perolehan atas masing-masing uraian barang di atas harus sudah memperhitungkan komponen harga perolehan di bawah ini :</p><ul><li>Ongkos Kirim dan pajak</li></ul>', '<p>14 (empat belas) Hari Kalender</p>', 'Kantor Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru', '<p><strong>Tingkat pelayanan barang/jasa :</strong></p><ol><li><strong>Pengiriman</strong> : Vendor bertanggung jawab atas pengiriman ke lokasi dan harus memastikan bahwa barang sampai dalam kondisi baik.</li><li><strong>Jadwal</strong>: Vendor harus menyediakan jadwal pengadaan yang jelas,termasuk tenggat waktu untuk pengiriman.</li></ol>', '<p>Berdasarkan lokasi pengiriman terdekat dari lokasi tujuan pengiriman.</p>', '<ol><li>Sebagaimana tersebut pada spesifikasi mutu</li><li>Sebagaimana tersebut pada spesifikasi waktu</li><li>Sebagaimana tersebut pada spesifikasi pelayanan</li><li>Sebagaimana tersebut pada spesifikasi lokasi</li></ol>', 'TEST', '<p><a href=\"HTPPS:/DGDG\" target=\"_blank\">HTPPS:/DGDG</a></p><br/><a href=\"HTPPS:/DGDGKSHDFKJSH\" target=\"_blank\">HTPPS:/DGDGKSHDFKJSH</a>', '2026-11-15 20:57:31', 1, '2026-11-15 21:04:45', 1, NULL, NULL);
INSERT INTO `spesifikasi_teknis` VALUES (3, 6, NULL, 'Pengadaan Laptop', 'Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru', 4, NULL, 'Pengadaan Laptop', 'TKDN,PDN', 'Usaha Kecil', '<p>Harga perolehan atas masing-masing uraian barang di atas harus sudah memperhitungkan komponen harga perolehan di bawah ini :</p><ul><li>Ongkos Kirim dan pajak</li></ul>', '<p>30 (tiga puluh) Hari Kalender</p>', 'Kantor Badan Pengelola Keuangan dan Aset Daerah Kota Pekanbaru', '<p><strong>Tingkat pelayanan barang/jasa :</strong></p><ol><li><strong>Pengiriman</strong> : Vendor bertanggung jawab atas pengiriman ke lokasi dan harus memastikan bahwa barang sampai dalam kondisi baik.</li><li><strong>Jadwal</strong>: Vendor harus menyediakan jadwal pengadaan yang jelas,termasuk tenggat waktu untuk pengiriman.</li></ol>', '<p>Berdasarkan lokasi pengiriman terdekat dari lokasi tujuan pengiriman.</p>', '<ol><li>Sebagaimana tersebut pada spesifikasi mutu</li><li>Sebagaimana tersebut pada spesifikasi waktu</li><li>Sebagaimana tersebut pada spesifikasi pelayanan</li><li>Sebagaimana tersebut pada spesifikasi lokasi</li></ol>', NULL, NULL, '2026-11-18 12:09:24', 1, NULL, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for survey
-- ----------------------------
DROP TABLE IF EXISTS `survey`;
CREATE TABLE `survey`  (
  `srv_id` int NOT NULL AUTO_INCREMENT,
  `srv_master_dokument_id` int NULL DEFAULT NULL,
  `srv_nomor` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `srv_nama_kegiatan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `srv_paket_pekerjaan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `srv_tanggal_mulai` date NULL DEFAULT NULL,
  `srv_tanggal_selesai` date NULL DEFAULT NULL,
  `srv_nama_perusahaan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `srv_alamat_perusahaan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `srv_created_at` timestamp NULL DEFAULT NULL,
  `srv_created_by` int NULL DEFAULT NULL,
  `srv_updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `srv_updated_by` int NULL DEFAULT NULL,
  `srv_deleted_at` timestamp NULL DEFAULT NULL,
  `srv_deleted_by` int NULL DEFAULT NULL,
  `srv_master_dokumen_id` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`srv_id`) USING BTREE,
  INDEX `idx_srv_master_dokument_id`(`srv_master_dokument_id` ASC) USING BTREE,
  INDEX `idx_srv_deleted_at`(`srv_deleted_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of survey
-- ----------------------------

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `usr_id` int NOT NULL AUTO_INCREMENT,
  `usr_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `usr_password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `usr_role` tinyint NULL DEFAULT 1,
  `usr_created_at` timestamp NULL DEFAULT current_timestamp,
  `usr_created_by` int NULL DEFAULT NULL,
  `usr_updated_at` timestamp NULL DEFAULT current_timestamp ON UPDATE CURRENT_TIMESTAMP,
  `usr_updated_by` int NULL DEFAULT NULL,
  `usr_deleted_at` timestamp NULL DEFAULT NULL,
  `usr_deleted_by` int NULL DEFAULT NULL,
  PRIMARY KEY (`usr_id`) USING BTREE,
  UNIQUE INDEX `usr_name`(`usr_name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'admin', '$2b$10$q4A6NgohbqOO3xXvxA/2y.0qAYplmDsHBGrfI8Yao17DSbmftxB4O', 1, '2026-08-18 09:16:12', NULL, '2026-08-18 09:16:12', NULL, NULL, NULL);

SET FOREIGN_KEY_CHECKS = 1;
