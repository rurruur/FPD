import express from 'express';
import { showHome } from '../controllers/postControllers';
import { showJoin, showLogin, postJoin, postLogin, updateEmailAuth, logout } from '../controllers/userController';
import { checkEmailAuth, checkLoggedIn, publicOnly } from '../modules/middlewares';

export const path = '/';
export const router = express.Router();

router.get('/', checkLoggedIn, checkEmailAuth, showHome);
router.route('/join').all(publicOnly).get(showJoin).post(postJoin);
router.route('/login').all(publicOnly).get(showLogin).post(postLogin);
router.get('/logout', checkLoggedIn, logout);
router.get('/auth/:email', updateEmailAuth);