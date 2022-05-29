import express from 'express';
import { showProfile, showEditProfile } from '../controllers/userController';

export const path = '/users';
export const router = express.Router();

// id - a string of 12 bytes or a string of 24 hex characters or an integer
router.get('/:id/edit', showEditProfile);
router.get('/:id', showProfile);