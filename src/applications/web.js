import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import errorMiddleware from '../middlewares/error-middleware.js';
import path from 'path';
import { fileURLToPath } from 'url';
import laporanRoute from '../routes/laporan-bantuan-routes.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();


const FRONTEND_APP_URLS = process.env.FRONTEND_APP_URLS || 'http://localhost:5173';
const CORS_ALLOWED_ORIGINS = FRONTEND_APP_URLS.split(',');
const web = express();

web.use(
  cors({
    credentials: true,
    origin: CORS_ALLOWED_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'DELETE',],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);

web.options('*', cors());

web.use(express.json());
web.use(express.urlencoded({ extended: true }));


const uploadsPath = path.join(__dirname, '../../uploads');

web.use('/uploads', express.static(uploadsPath));
web.use(laporanRoute);
web.use(errorMiddleware);


export default web;
