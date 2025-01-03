import express from 'express';
import laporanBantuanController from '../controllers/laporan-bantuan-controller.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); 

router.get('/api/laporan-bantuan', laporanBantuanController.getAll);
router.get('/api/laporan-bantuan/getById/:id', laporanBantuanController.getById);
router.post('/api/laporan-bantuan/downloadCsvReport', laporanBantuanController.downloadCsvReport);
router.post('/api/laporan-bantuan', upload.single('urlBuktiPenyaluran'), laporanBantuanController.create);
router.put('/api/laporan-bantuan/:id', upload.single('urlBuktiPenyaluran'), laporanBantuanController.update);
router.put('/api/laporan-bantuan-perbarui-status/:id', laporanBantuanController.Verikasi);
router.post('/api/laporan-bantuan/filterLaporan', laporanBantuanController.filter);
router.delete('/api/laporan-bantuan/:id', laporanBantuanController.deleteById);
router.get('/api/laporan-bantuan/getTotalLaporan', laporanBantuanController.getTotalLaporan);
router.get('/api/laporan-bantuan/getPenerimaPerProgram', laporanBantuanController.getPenerimaPerProgram);
router.get('/api/laporan-bantuan/getGrafikPenyaluran', laporanBantuanController.getGrafikPenyaluran);

export default router;