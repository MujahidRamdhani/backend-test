
import { get } from 'http';
import prismaClient from '../applications/database.js'
import exportCsv from '../utils/exportCsv.js';
import formatDateToIndonesian from '../utils/formatDate.js';
import sendNotificationEmail from '../utils/sendNotificationEmail.js';
import fs from 'fs';
import path from 'path';


import axios from 'axios';


const API_BASE_URL = 'https://alamat.thecloudalert.com/api';

const create = async (request, file) => {
    try {
       

        const [provinsiResponse, kabupatenResponse, kecamatanResponse] = await Promise.all([
            axios.get(`${API_BASE_URL}/provinsi/get/?id=${request.provinsiId}`),
            axios.get(`${API_BASE_URL}/kabkota/get/?d_provinsi_id=${request.provinsiId}`),
            axios.get(`${API_BASE_URL}/kecamatan/get/?d_kabkota_id=${request.kabupatenId}`),
        ]);

       
        
const namaProvinsi = provinsiResponse.data.result.find(p => p.id === request.provinsiId?.toString())?.text || 'Unknown';
const namaKabupaten = kabupatenResponse.data.result.find(k => k.id === request.kabupatenId?.toString())?.text || 'Unknown';
const namaKecamatan = kecamatanResponse.data.result.find(k => k.id === request.kecamatanId?.toString())?.text || 'Unknown';

     
        const saveRegionData = await Promise.all([
            prismaClient.provinsi.upsert({
                where: { id: request.provinsiId },
                update: { namaProvinsi },
                create: { id: request.provinsiId, namaProvinsi },
            }),
            prismaClient.kabupaten.upsert({
                where: { id: request.kabupatenId },
                update: { namaKabupaten },
                create: { id: request.kabupatenId, namaKabupaten, provinsiId: request.provinsiId },
            }),
            prismaClient.kecamatan.upsert({
                where: { id: request.kecamatanId },
                update: { namaKecamatan },
                create: { id: request.kecamatanId, namaKecamatan, kabupatenId: request.kabupatenId },
            }),
        ]);

        
        if (saveRegionData) {
            const result = await prismaClient.dataPenerimaBantuan.create({
                data: {
                    namaProgram: request.namaProgram,
                    provinsiId: request.provinsiId,
                    kabupatenId: request.kabupatenId,
                    kecamatanId: request.kecamatanId,
                    catatanTambahan: request.catatanTambahan,
                    jumlahPenerima: parseInt(request.jumlahPenerima, 10),
                    email: request.email,
                    tanggalPenyaluran: new Date(request.tanggalPenyaluran),
                    urlBuktiPenyaluran: file.filename, 
                    // urlBuktiPenyaluran: "file.filename",
                },
            });
            return result;
        }
    } catch (error) {
        console.error('Error creating data:', error);
        throw error;
    }
};


const update = async (id, request) => {
    try {
        const saveRegionData = await Promise.all([
            prismaClient.provinsi.upsert({
                where: { id: request.provinsiId },
                update: { namaProvinsi: request.namaProvinsi,},
                create: { id: request.provinsiId, namaProvinsi: request.namaProvinsi, }
            }),
            prismaClient.kabupaten.upsert({
                where: { id: request.kabupatenId },
                update: { namaKabupaten: request.namaKabupaten },
                create: { id: request.kabupatenId, namaKabupaten: request.namaKabupaten, provinsiId: request.provinsiId }
            }),
            prismaClient.kecamatan.upsert({
                where: { id: request.kecamatanId },
                update: { namaKecamatan: request.namaKecamatan },
                create: { id: request.kecamatanId, namaKecamatan: request.namaKecamatan, kabupatenId : request.kabupatenId}
            })
        ]);

       
            
        const existingData = await prismaClient.dataPenerimaBantuan.findFirst({
            where: { id: id },
        });

        if (!existingData) {
            throw new Error('Data tidak ditemukan.');
        }

        if (existingData.status !== 'Pending') {
            throw new Error('Data hanya dapat diubah jika statusnya Pending.');
        }

        let result;
        if (saveRegionData){
        result = await prismaClient.dataPenerimaBantuan.update({
            where: { id: id },
            data: {
                namaProgram: request.namaProgram,
                provinsiId: request.provinsiId,
                kabupatenId: request.kabupatenId,
                kecamatanId: request.kecamatanId,
                catatanTambahan: request.catatanTambahan,
                jumlahPenerima: parseInt(request.jumlahPenerima),
                email: request.email,
                tanggalPenyaluran: new Date(request.tanggalPenyaluran),
                jumlahPenerima: parseInt(request.jumlahPenerima),
                urlBuktiPenyaluran: 'tes'
            }
        });
        }
        return result
    } catch (error) {
        throw error;
    }
};

const Verikasi = async (id, request) => {
    try {
        const existingData = await prismaClient.dataPenerimaBantuan.findFirst({
            where: { id: id },
        });

        if (!existingData) {
            throw new Error('Data tidak ditemukan.');
        }


        if (existingData.status !== 'Pending') {
            throw new Error('Data hanya dapat diubah jika statusnya Pending.');
        }
    
       const result = await prismaClient.dataPenerimaBantuan.update({
            where: {
                id: id
            },
            data: {
                status: request.status,
                
            }
        });
      await sendNotificationEmail(existingData.email, request.status)
       return result[0];
    } catch (error) {
        throw error;
    }
};



const getAll = async () => {
    try {
        const data = await prismaClient.dataPenerimaBantuan.findMany({
            include: {
                provinsi: true,
                kabupaten: true,
                kecamatan: true,
            }
        });

        const result = data.map(item => ({
            id: item.id,
            namaProgram: item.namaProgram,
            jumlahPenerima: item.jumlahPenerima,
            tanggalPenyaluran:  formatDateToIndonesian(item.tanggalPenyaluran),
            provinsiId: item.provinsiId,
            kecamatanId: item.kecamatanId,
            kabupatenId: item.kabupatenId,
            catatanTambahan: item.catatanTambahan,
            urlBuktiPenyaluran: item.urlBuktiPenyaluran,
            status: item.status,
            email: item.email,
            namaProvinsi: item.provinsi?.namaProvinsi || "N/A",
            namaKabupaten: item.kabupaten?.namaKabupaten || "N/A",
            namaKecamatan: item.kecamatan?.namaKecamatan || "N/A"
          }));

        return result;
    } catch (error) {
        throw error;
    }
};

const getById = async (id) => {
    try {
        const result = await prismaClient.dataPenerimaBantuan.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        return result;
    } catch (error) {
        throw error;
    }
}

const deleteById= async (id) => {
    try {
        return await prismaClient.dataPenerimaBantuan.delete({
            where: {
                id: id
            }
        });
    } catch (error) {
        throw error;
    }
};

const getTotalLaporan = async () => {
    try {
        const totalLaporan = await prismaClient.dataPenerimaBantuan.count();
        return { totalLaporan };
    } catch (error) {
        console.error('Error in getTotalLaporan:', error);
        throw new Error('Failed to fetch total laporan.');
    }
};

const getPenerimaPerProgram = async () => {
    try {
        const penerimaPerProgram = await prismaClient.dataPenerimaBantuan.groupBy({
            by: ['namaProgram'],
            _sum: {
                jumlahPenerima: true,
            }
        });

        const result = penerimaPerProgram.map(item => ({
            namaProgram: item.namaProgram,
            totalPenerima: item._sum.jumlahPenerima || 0,
        }));

        return result;
    } catch (error) {
        console.error('Error in getPenerimaPerProgram:', error);
        throw new Error('Failed to fetch penerima per program.');
    }
};

const getGrafikPenyaluran = async () => {
    try {
        const penyaluranPerWilayah = await prismaClient.dataPenerimaBantuan.groupBy({
            by: ['provinsiId', 'kabupatenId'],
            _sum: {
                jumlahPenerima: true,
            }
        });

        const result = await Promise.all(
            penyaluranPerWilayah.map(async item => {
                const provinsi = await prismaClient.provinsi.findUnique({
                    where: { id: item.provinsiId },
                });
                const kabupaten = await prismaClient.kabupaten.findUnique({
                    where: { id: item.kabupatenId },
                });

                return {
                    provinsiId: item.provinsiId,
                    namaProvinsi: provinsi?.namaProvinsi || "N/A",
                    kabupatenId: item.kabupatenId,
                    namaKabupaten: kabupaten?.namaKabupaten || "N/A",
                    totalPenerima: item._sum.jumlahPenerima || 0,
                };
            })
        );

        return result;
    } catch (error) {
        throw new Error('Gagal mendapatkan grafik penyaluran.');
    }
};

const filter = async (filters) => {
    const {
        provinsiId,
        kabupatenId,
        kecamatanId,
        namaProgram,
        namaProvinsi,
        namaKabupaten,
        namaKecamatan,
    } = filters;

    try {
        const data = await prismaClient.dataPenerimaBantuan.findMany({
            where: {
                ...(provinsiId && { provinsiId }),
                ...(kabupatenId && { kabupatenId }),
                ...(kecamatanId && { kecamatanId }),
                ...(namaProgram && {
                    namaProgram
                }),
                ...(namaProvinsi && {
                    provinsi: { 
                        namaProvinsi: { namaProvinsi } 
                    },
                }),
                ...(namaKabupaten && {
                    kabupaten: { 
                        namaKabupaten: { namaKabupaten} 
                    },
                }),
                ...(namaKecamatan && {
                    kecamatan: { 
                        namaKecamatan: {namaKecamatan} 
                    },
                }),
            },
            include: {
                provinsi: true,
                kabupaten: true,
                kecamatan: true,
            },
        });

        const result = data.map((item) => ({
            id: item.id,
            namaProgram: item.namaProgram,
            jumlahPenerima: item.jumlahPenerima,
            tanggalPenyaluran:  formatDateToIndonesian(item.tanggalPenyaluran),
            provinsiId: item.provinsiId,
            kabupatenId: item.kabupatenId,
            kecamatanId: item.kecamatanId,
            catatanTambahan: item.catatanTambahan,
            urlBuktiPenyaluran: item.urlBuktiPenyaluran,
            status: item.status,
            email: item.email,
            namaProvinsi: item.provinsi?.namaProvinsi || "N/A",
            namaKabupaten: item.kabupaten?.namaKabupaten || "N/A",
            namaKecamatan: item.kecamatan?.namaKecamatan || "N/A",
        }));
        return result;
    } catch (error) {
        throw error;
    }
};



const downloadCsvReport = async (tanggalMulai, tanggalSelesai) => {
    try {
        let data = [];
        if (tanggalMulai || tanggalSelesai) {
            data = await prismaClient.dataPenerimaBantuan.findMany({
                where: {
                    tanggalPenyaluran: {
                        gte: new Date(tanggalMulai),
                        lte: new Date(tanggalSelesai),
                    },
                },include: {
                    provinsi: true,
                    kabupaten: true,
                    kecamatan: true,
                },
            });
        } else {
            data = await prismaClient.dataPenerimaBantuan.findMany({ include: {
                provinsi: true,
                kabupaten: true,
                kecamatan: true,
            }});
        }
        const outputDir = path.resolve('./output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        const changeOutputData = data.map((item) => ({
            id: item.id,
            namaProgram: item.namaProgram,
            jumlahPenerima: item.jumlahPenerima,
            tanggalPenyaluran: formatDateToIndonesian(item.tanggalPenyaluran),
            namaProvinsi: item.provinsi?.namaProvinsi || "N/A",
            namaKabupaten: item.kabupaten?.namaKabupaten || "N/A",
            namaKecamatan: item.kecamatan?.namaKecamatan || "N/A",
            catatanTambahan: item.catatanTambahan,
            urlBuktiPenyaluran: item.urlBuktiPenyaluran,
            status: item.status,
            email: item.email,
        }));

        const filePath =  path.resolve('./output/data-penerima-bantuan.csv');
        await exportCsv(changeOutputData, filePath);
        return filePath;
    } catch (error) {
        throw error;
    }
};


const laporanBantuanServices = {
    create,
    update,
    getAll,
    deleteById,
    Verikasi,
    filter,
    getById,
    downloadCsvReport,
    getTotalLaporan,
    getPenerimaPerProgram,
    getGrafikPenyaluran
};

export default laporanBantuanServices;