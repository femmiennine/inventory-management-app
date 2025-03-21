import express from 'express';
import { registerUser, verifyUser } from '../controllers/user.controller';
import {
  registerUserValidator,
  validate,
} from '../validations/user.validation';
const router = express.Router();

router.post('/register', registerUserValidator, validate, registerUser);
router.post('/verify/:token', verifyUser);

export default router;
