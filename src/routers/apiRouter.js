import express from 'express';
import { acceptRegister } from '../controllers/adminControllers';
import { registerComment, deleteComment } from '../controllers/postControllers';

export const path = '/api';
export const router = express.Router();


router.get('/users/:id([0-9a-f]{24})', acceptRegister);
router.post('/posts/:id([0-9a-f]{24})/comment', registerComment);
router.delete('/posts/:id([0-9a-f]{24})/comment/:commentId([0-9a-f]{24})', deleteComment);