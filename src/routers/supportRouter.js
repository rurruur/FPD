import express from 'express';
import { showContactList, uploadRequest } from '../controllers/supportControllers';

export const path = '/support';
export const router = express.Router();

router.route('/request').get(showContactList).post(uploadRequest);