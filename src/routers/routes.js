import express from 'express';
import { checkEmailAuth, checkLoggedIn } from '../modules/middlewares';
import * as rootRouter from './rootRouter';
import * as userRouter from './userRouter';
import * as postRouter from './postsRouter';
import * as apiRouter from './apiRouter';

export const path = '';
export const router = express.Router();

router.use(rootRouter.path, rootRouter.router);
router.use(apiRouter.path, apiRouter.router);
router.use(userRouter.path, checkLoggedIn, userRouter.router);
router.use(postRouter.path, checkLoggedIn, checkEmailAuth, postRouter.router);