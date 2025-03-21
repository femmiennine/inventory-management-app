import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import User from '../models/UserModel';
import { errorRes, successRes } from '../middleware/apiErrorHandler';
import { sendVerificationEmail } from '../utils/sendVerficationEmail';
import { hashedPassword } from '../helpers/hashPassword';
import randomString from 'randomstring';

// Define expected body shape
interface UserRegistrationBody {
  name: string;
  email: string;
  password: string;
}

// registerUser (POST)
export const registerUser: RequestHandler<
  {},
  {},
  UserRegistrationBody
> = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // input should not be empty
    if (!name || !email || !password) {
      errorRes(res, 400, 'Please provide a name, email, and password.');
      return;
    }

    // check if email is used
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      errorRes(res, 400, 'User already exists. Please login.');
      return;
    }

    // password should be at least 8 characters long
    if (password.length < 8) {
      errorRes(res, 400, 'Password must be at least 8 characters long.');
      return;
    }

    const hashPassword = await hashedPassword(password);
    const tokenString = randomString.generate({ length: 64 });

    // create new user
    const newUser = new User({
      name,
      email,
      password: hashPassword,
      isAdmin: 0,
      isVerified: 0,
      isBanned: false,
      token: tokenString,
    });

    const userData = await newUser.save();

    if (!userData) {
      errorRes(res, 400, 'User unsuccessfully registered!');
      return;
    }

    console.log(sendVerificationEmail);
    console.log('Auth Email:', process.env.SMTP_AUTH_EMAIL);
    console.log(
      'Auth Password Length:',
      process.env.SMTP_AUTH_PASSWORD?.length
    );
    // send verification email
    if (userData.name && userData.email && typeof userData.token === 'string') {
      sendVerificationEmail(userData.name, userData.email, userData.token);
    } else {
      errorRes(res, 400, 'User data is incomplete.');
      return;
    }

    successRes(
      res,
      201,
      'Registration successful! Please verify your email address before login.'
    );
    return;
  } catch (error: unknown) {
    if (error instanceof Error) {
      errorRes(res, 500, `Error: ${error.message}`);
    } else {
      next(error);
    }
  }
};
