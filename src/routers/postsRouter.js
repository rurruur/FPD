import express from 'express';
import { showUpload, postUpload, showPost, deletePost } from '../controllers/postControllers';

export const path = '/posts';
export const router = express.Router();

router.route('/upload').get(showUpload).post(postUpload);
router.route('/:id').get(showPost).delete(deletePost);