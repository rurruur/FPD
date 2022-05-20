import express from 'express';
import { showHome } from '../controllers/homeController';

export const path = '/';
export const router = express.Router();

router.get('/', showHome);