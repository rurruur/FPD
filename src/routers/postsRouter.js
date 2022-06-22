import express from 'express';
import { showUpload, postUpload, showPost, deletePost } from '../controllers/postControllers';
import uploader from '../modules/uploader';

export const path = '/posts';
export const router = express.Router();

router.route('/upload').get(showUpload).post(uploader.single('img'), postUpload);
router.route('/:id([0-9a-f]{24})').get(showPost).delete(deletePost);