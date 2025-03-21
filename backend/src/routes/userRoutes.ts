import express from 'express';
import { registerUser } from '../controllers/UserController';
import { registerUserValidator, validate } from '../validations/userValidation';
const router = express.Router();

router.post('/register', registerUserValidator, validate, registerUser);

export default router;
