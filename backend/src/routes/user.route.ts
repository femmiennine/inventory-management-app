import express from 'express';
import {
  registerUser,
  verifyUser,
  loginUser,
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

export default router;
