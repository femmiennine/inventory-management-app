import express, { Request, Response } from 'express';
import User, { UserInterface } from '../models/UserModel';
import { errorRes, successRes } from '../middleware/apiErrorHandler';
import { sendVerificationEmail } from '../utils/sendVerficationEmail';
import { hashedPassword } from '../helpers/hashPassword';

type UserRegistrationBody = Pick<UserInterface, 'name' | 'email' | 'password'>;

// registerUser (POST)
export const registerUser = async (
  req: Request<{}, {}, UserRegistrationBody>,
  res: Response
) => {
  try {
    const { name, email, password }: UserRegistrationBody = req.body;

    // Validate input
    if (!name || !email || !password) {
      return errorRes(
        res,
        400,
        `Please provide a name, email, phone, and password.`
      );
    }
    if (password.length < 8) {
      return errorRes(res, 400, `Password must be at least 8 characters long.`);
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return errorRes(res, 400, `User already exists. Please login.`);
    }
    // const tokenString = randomString({
    //   length: 64,
    //   numeric: true,
    //   letters: true,
    // });
    const hashPassword = await hashedPassword(password);
    const newUser = new User({
      name,
      email,
      password: hashPassword,
      isAdmin: 0,
      isVerified: 0,
      isBanned: false,
      // image: req.file?.path,
      // token: tokenString,
    });

    const userData = await newUser.save();
    if (!userData) {
      return errorRes(res, 400, 'User unsucessfully registered!');
    }
    if (userData) {
      sendVerificationEmail(userData.email, userData.name, userData.token);
      return successRes(
        res,
        201,
        'Registration successful! Please verify your email address before login',
        ''
      );
    } else {
      return errorRes(res, 400, 'Route not found!');
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return errorRes(res, 500, `Error: ${error.message}`);
    }
    return errorRes(res, 500, 'An unknown error occurred.');
  }
};
