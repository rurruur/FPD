import express from 'express';
import { showHome } from '../controllers/homeController';
import { showJoin, showLogin, postJoin, kakaoCallback, getAuthCode } from '../controllers/userController';
import { sendAuthMail } from '../middlewares';

export const path = '/';
export const router = express.Router();

router.get('/', showHome);
router.route('/join').get(showJoin).post(sendAuthMail, postJoin);
router.get('/login', showLogin);
router.get('/login/kakao', getAuthCode);
router.get('/login/kakao/callback', kakaoCallback);