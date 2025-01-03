-- CreateTable
CREATE TABLE `DataPenerimaBantuan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaProgram` VARCHAR(50) NOT NULL,
    `jumlahPenerima` INTEGER NOT NULL,
    `tanggalPenyaluran` DATE NOT NULL,
    `provinsiId` VARCHAR(10) NOT NULL,
    `kecamatanId` VARCHAR(10) NOT NULL,
    `kabupatenId` VARCHAR(10) NOT NULL,
    `catatanTambahan` TEXT NULL,
    `urlBuktiPenyaluran` VARCHAR(191) NOT NULL,
    `status` ENUM('Pending', 'Disetujui', 'Ditolak') NOT NULL DEFAULT 'Pending',
    `email` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kecamatan` (
    `id` VARCHAR(10) NOT NULL,
    `namaKecamatan` VARCHAR(50) NOT NULL,
    `kabupatenId` VARCHAR(10) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kabupaten` (
    `id` VARCHAR(10) NOT NULL,
    `namaKabupaten` VARCHAR(50) NOT NULL,
    `provinsiId` VARCHAR(10) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Provinsi` (
    `id` VARCHAR(10) NOT NULL,
    `namaProvinsi` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DataPenerimaBantuan` ADD CONSTRAINT `DataPenerimaBantuan_kecamatanId_fkey` FOREIGN KEY (`kecamatanId`) REFERENCES `kecamatan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataPenerimaBantuan` ADD CONSTRAINT `DataPenerimaBantuan_kabupatenId_fkey` FOREIGN KEY (`kabupatenId`) REFERENCES `Kabupaten`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DataPenerimaBantuan` ADD CONSTRAINT `DataPenerimaBantuan_provinsiId_fkey` FOREIGN KEY (`provinsiId`) REFERENCES `Provinsi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kecamatan` ADD CONSTRAINT `kecamatan_kabupatenId_fkey` FOREIGN KEY (`kabupatenId`) REFERENCES `Kabupaten`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kabupaten` ADD CONSTRAINT `Kabupaten_provinsiId_fkey` FOREIGN KEY (`provinsiId`) REFERENCES `Provinsi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
