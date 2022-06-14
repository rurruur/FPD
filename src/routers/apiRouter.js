import express from 'express';
import { registerComment } from '../controllers/postControllers';

export const path = '/api';
export const router = express.Router();

router.post('/posts/:id([0-9a-f]{24})/comment', registerComment);