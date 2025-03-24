import express from 'express';
import {
  registerUser,
  verifyUser,
  loginUser,
  logoutUser,
  forgetPassword,
  resetPassword,
} from '../controllers/user.controller';
import {
  registerUserValidator,
  loginUserValidator,
  validate,
} from '../validations/user.validation';
const router = express.Router();

router.post('/register', registerUserValidator, validate, registerUser);
router.post('/verify/:token', verifyUser);
router.post('/login', loginUserValidator, validate, loginUser);
router.post('/logout', logoutUser);
router.post('/forget-password', forgetPassword);
router.post('/reset-password', resetPassword);

export default router;
