import express from 'express';
import * as rootRouter from './rootRouter';
import * as userRouter from './userRouter';

export const path = '';
export const router = express.Router();

router.use(rootRouter.path, rootRouter.router);
router.use(userRouter.path, userRouter.router);