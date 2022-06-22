import express from 'express';
import { showAdminPage } from '../controllers/adminControllers';

export const path = '/admin';
export const router = express.Router();

router.get('/', showAdminPage);