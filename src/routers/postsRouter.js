import express from 'express';
import { showUpload, postUpload, showPost } from '../controllers/postControllers';

export const path = '/posts';
export const router = express.Router();

router.route('/upload').get(showUpload).post(postUpload);
router.get('/:id', showPost);