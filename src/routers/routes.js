import express from 'express';
import { checkAdmin, checkEmailAuth, checkLoggedIn } from '../modules/middlewares';
import * as rootRouter from './rootRouter';
import * as userRouter from './userRouter';
import * as postRouter from './postsRouter';
import * as apiRouter from './apiRouter';
import * as adminRouter from './adminRouter';
import * as supportRouter from './supportRouter';

export const path = '';
export const router = express.Router();

router.use(rootRouter.path, rootRouter.router);
router.use(apiRouter.path, apiRouter.router);
router.use(userRouter.path, checkLoggedIn, userRouter.router);
router.use(postRouter.path, checkLoggedIn, checkEmailAuth, postRouter.router);
router.use(adminRouter.path, checkLoggedIn, checkAdmin, adminRouter.router);
router.use(supportRouter.path, checkLoggedIn, checkEmailAuth, supportRouter.router);