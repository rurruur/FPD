import express from 'express';
import { showProfile, showEditProfile, sendAuthMail, showCheckEmail, saveUserChange } from '../controllers/userController';

export const path = '/users';
export const router = express.Router();

// id - a string of 12 bytes or a string of 24 hex characters or an integer
router.get('/auth', sendAuthMail);
router.get('/check-email', showCheckEmail);
router.route('/:id/edit').get(showEditProfile).post(saveUserChange);
router.get('/:id', showProfile);