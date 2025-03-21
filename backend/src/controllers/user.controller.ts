import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import User from '../models/user.model';
import { errorRes, successRes } from '../middleware/errorhandler';
import { sendVerificationEmail } from '../utils/verification.email';
import { hashedPassword } from '../helpers/hash.password';
import randomString from 'randomstring';

// Define expected body shape
interface UserRegistrationBody {
  name: string;
  email: string;
  password: string;
}

// registerUser (POST)
export const registerUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

    // save user to database
    const userData = await newUser.save();
    if (!userData) {
      errorRes(res, 400, 'User unsuccessfully registered!');
      return;
    }
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
  } catch (error) {
    if (error instanceof Error) {
      errorRes(res, 500, `Error: ${error.message}`);
    } else {
      next(error);
    }
  }
};

// verify-user (POST)
export const verifyUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ token: token });
    if (!user) {
      errorRes(res, 400, `Invalid link!`);
      return;
    } else {
      const updatedUser = await User.updateOne(
        { token: token },
        {
          $set: {
            isVerified: true,
            token: '',
          },
        }
      );
      successRes(res, 200, `User verification successful!`, updatedUser);
      return;
    }
  } catch (error) {
    if (error instanceof Error) {
      errorRes(res, 500, `Error: ${error.message}`);
    } else {
      next(error);
    }
  }
};
