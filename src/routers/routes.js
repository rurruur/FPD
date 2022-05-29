import express from 'express';
import { checkEmailAuth, checkLoggedIn } from '../modules/middlewares';
import * as rootRouter from './rootRouter';
import * as userRouter from './userRouter';

export const path = '';
export const router = express.Router();

router.use(rootRouter.path, rootRouter.router);
router.use(userRouter.path, checkLoggedIn, checkEmailAuth, userRouter.router);