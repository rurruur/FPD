import express from 'express';
import { showHome } from '../controllers/homeController';
import { showJoin, showLogin, postJoin } from '../controllers/userController';
import { sendAuthMail } from '../middlewares';

export const path = '/';
export const router = express.Router();

router.get('/', showHome);
router.get('/login', showLogin);
router.route('/join').get(showJoin).post(sendAuthMail, postJoin);