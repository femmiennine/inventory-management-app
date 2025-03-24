import express from 'express';
import {
  registerUser,
  verifyUser,
  loginUser,
  logoutUser,
  forgetPassword,
  resetPassword,
  userProfile,
} from '../controllers/user.controller';
import {
  registerUserValidator,
  loginUserValidator,
  validate,
} from '../validations/user.validation';
import { isAuthorized } from '../middleware/auth';
const router = express.Router();

router.post('/register', registerUserValidator, validate, registerUser);
router.post('/verify/:token', verifyUser);
router.post('/login', loginUserValidator, validate, loginUser);
router.get('/profile', isAuthorized, userProfile);
router.post('/logout', isAuthorized, logoutUser);
router.post('/forget-password', forgetPassword);
router.post('/reset-password', resetPassword);

export default router;
