import laporanBantuanServices from "../services/laporan-bantuan-services.js";

const create = async (req, res) => {
    try {
        console.log(req)
        const { body: request } = req;
        const result = await laporanBantuanServices.create(request, req.file);
        res.status(200).json({
            message: "Berhasil menambah data bantuan",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Gagal menambah data bantuan",
            error: error.message
        });
    }
};

const update = async (req, res) => {
    try {

        const { body: request } = req;
        const id = req.params.id
        const result = await laporanBantuanServices.update(parseInt(id), request);
        res.status(200).json({
            message: "Berhasil Memperbarui data bantuan",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Gagal Memperbarui data bantuan",
            error: error.message
        });
    }
};
const Verikasi = async (req, res) => {
    try {

        const { body: request } = req;
        const id = req.params.id
        const result = await laporanBantuanServices.Verikasi(parseInt(id), request);
        res.status(200).json({
            message: "Berhasil verifikasi data bantuan",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Gagal verifikasi data bantuan",
            error: error.message
        });
    }
};

const getAll = async (req, res) => {
    try {
        const result = await laporanBantuanServices.getAll();
        res.status(200).json({
            message: "Berhasil Mendapatkan data bantuan",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Gagal Mendapatkan data bantuan",
            error: error.message
        });
    }
};

const filter = async (req, res) => {
    try {
        const { body: request } = req;
        const filter = request
        const result = await laporanBantuanServices.filter(filter);
        res.status(200).json({
            message: "Berhasil filter data bantuan",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Gagal filter data bantuan",
            error: error.message
        });
    }
};




const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await laporanBantuanServices.getById(id);
        res.status(200).json({
            message: "Berhasil Mendapatkan data bantuan",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Gagal Mendapatkan data bantuan",
            error: error.message
        });
    }
}

const deleteById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await laporanBantuanServices.deleteById(id);
        res.status(200).json({
            message: "Berhasil menghapus data bantuan",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Gagal menghapus data bantuan",
            error: error.message
        });
    }
};


const getTotalLaporan = async (req, res) => {
    try {
        const result = await laporanBantuanServices.getTotalLaporan();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPenerimaPerProgram = async (req, res) => {
    try {
        const result = await laporanBantuanServices.getPenerimaPerProgram();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getGrafikPenyaluran = async (req, res) => {
    try {
        const result = await laporanBantuanServices.getGrafikPenyaluran();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const downloadCsvReport = async (req, res) => {
    try {
        const { body: request } = req;
        const {tanggalMulai, tanggalSelesai} = request
        const result = await laporanBantuanServices.downloadCsvReport(tanggalMulai, tanggalSelesai);
        res.status(200).json({
            message: "Berhasil export ke csv data bantuan",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Gagal export ke csv data bantuan",
            error: error.message
        });
    }
};


export default { create, update, Verikasi, getAll, deleteById, filter, getById, downloadCsvReport, getTotalLaporan, getPenerimaPerProgram, getGrafikPenyaluran };
