import express from 'express';
import * as rootRouter from './rootRouter';

export const path = '';
export const router = express.Router();

router.use(rootRouter.path, rootRouter.router);