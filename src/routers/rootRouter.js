import express from 'express';
import { showHome } from '../controllers/homeController';
import { showJoin, showLogin, postJoin, postLogin } from '../controllers/userController';
import { sendAuthMail } from '../modules/middlewares';

export const path = '/';
export const router = express.Router();

router.get('/', showHome);
router.route('/join').get(showJoin).post(sendAuthMail, postJoin);
router.route('/login').get(showLogin).post(postLogin);