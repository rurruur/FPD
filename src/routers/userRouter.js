import express from 'express';
import { authMail } from '../controllers/userController';

export const path = '/users';
export const router = express.Router();

router.get('/auth/:email', authMail);