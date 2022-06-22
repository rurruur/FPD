import express from 'express';
import { showProfile, showEditProfile, shwoConfirm, sendAuthMail, showCheckEmail, saveUserChange, deleteUser } from '../controllers/userController';

export const path = '/users';
export const router = express.Router();

// id - a string of 12 bytes or a string of 24 hex characters or an integer
router.get('/auth', sendAuthMail);
router.get('/check-email', showCheckEmail);
router.get('/confirm', shwoConfirm);
router.route('/:id([0-9a-f]{24})/edit').get(showEditProfile).post(saveUserChange);
router.route('/:id([0-9a-f]{24})').get(showProfile).delete(deleteUser);