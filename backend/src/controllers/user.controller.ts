import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import mongoose from 'mongoose';
import User from '../models/user.model';
import { errorRes, successRes } from '../middleware/errorhandler';
import { sendVerificationEmail } from '../utils/verification.email';
import { sendResetPasswordEmail } from '../utils/reset.password';
import { hashedPassword, comparePassword } from '../helpers/hash.password';
import randomString from 'randomstring';
import jwt from 'jsonwebtoken';
import { ICustomRequest, TokenInterface } from '../middleware/auth';
import { dev } from '../config/dev';

// Define expected body shape
interface UserRegistrationBody {
  name: string;
  email: string;
  password: string;
  token: string;
  isAdmin: boolean;
  isVerified: boolean;
  isBanned: boolean;
}

// POST register user http://localhost:8000/api/user/register
export const registerUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password }: UserRegistrationBody = req.body;

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
      return;
    } else {
      next(error);
    }
  }
};

// POST verify user http://localhost:8000/api/user/verify/:token
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
      return;
    } else {
      next(error);
    }
  }
};

// POST login user http://localhost:8000/api/user/login
export const loginUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password }: UserRegistrationBody = req.body;
    // input should not be empty
    if (!(email && password)) {
      errorRes(res, 400, `Please provide both email and password`);
      return;
    }

    // check if user exist
    const user = await User.findOne({ email: email });
    if (!user) {
      errorRes(res, 404, `No user exist with this email and password`);
      return; // early return if user doesn't exist
    }
    if (user.isVerified === false) {
      errorRes(res, 400, `Please verify your email address before login`);
      return; // check account status
    }
    if (user.isBanned === true) {
      errorRes(
        res,
        400,
        `Your account is temporarily blocked. Please try again later.`
      );
      return; // check account status
    }

    // verify password
    const isPasswordMatched = await comparePassword(password, user.password);
    if (!isPasswordMatched) {
      errorRes(res, 406, `Invalid Credentials`);
      return;
    }

    // generate JWT token
    const token = jwt.sign({ id: user._id }, String(dev.app.private_key), {
      algorithm: 'HS256',
      expiresIn: '1d',
    });
    console.log(token);

    // set cookie
    res.cookie(String(user._id), token, {
      path: '/',
      expires: new Date(Date.now() + 1000 * 30 * 30),
      httpOnly: true,
      sameSite: 'lax',
    });

    successRes(res, 200, `User successfully login`, token);
    return;
  } catch (error) {
    if (error instanceof Error) {
      errorRes(res, 500, `Error: ${error.message}`);
      return;
    } else {
      next(error);
    }
  }
};

// POST logout user http://localhost:8000/api/user/logout
export const logoutUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // check if cookie exists
    if (!req.headers.cookie) {
      errorRes(res, 404, `Cookie not found`);
      return;
    }

    // get token from cookie
    const token = req.headers.cookie.split('=')[1];
    if (!token) {
      errorRes(res, 404, `No token found`);
      return;
    }
    jwt.verify(token, String(dev.app.private_key), function (error, decoded) {
      if (error) {
        console.log(error);
      }
      console.log(decoded);
      res.clearCookie(`${(decoded as TokenInterface).id}`);
    });

    successRes(res, 200, `User logged out successfully`, '');
    return;
  } catch (error) {
    if (error instanceof Error) {
      errorRes(res, 500, `Error: ${error.message}`);
      return;
    } else {
      next(error);
    }
  }
};

// POST forget password http://localhost:8000/api/user/forget-password
export const forgetPassword: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email }: UserRegistrationBody = req.body;
    if (!email) {
      errorRes(res, 400, `Please provide an email address`);
      return;
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      errorRes(res, 404, `User does not exist`);
      return;
    }

    if (!user.isVerified) {
      errorRes(res, 400, 'Please verify your email address first');
      return;
    }

    const token = jwt.sign({ id: user?._id }, String(dev.app.private_key), {
      algorithm: 'HS256',
      expiresIn: '45s',
    });

    await User.updateOne({ email }, { $set: { token } });

    await sendResetPasswordEmail(user.name, user.email);
    successRes(res, 201, 'Check your email to reset password');
    return;
  } catch (error) {
    if (error instanceof Error) {
      errorRes(res, 500, `Error: ${error.message}`);
      return;
    } else {
      next(error);
    }
  }
};

// POST reset password http://localhost:8000/api/user/reset-password
export const resetPassword: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, email }: UserRegistrationBody = req.body;
    const hashPassword = await hashedPassword(password);
    const user = await User.findOneAndUpdate(
      { email: email },
      {
        $set: {
          password: hashPassword,
          token: '',
        },
      }
    );

    console.log(user);
    // check if user exists
    if (!user) {
      errorRes(res, 404, `User does not exist`);
      return;
    }

    successRes(res, 201, `Password changed successfully`, '');
    return;
  } catch (error) {
    if (error instanceof Error) {
      errorRes(res, 500, `Error: ${error.message}`);
      return;
    } else {
      next(error);
    }
  }
};

// GET user profile http://localhost:8000/api/user/profile
export const userProfile: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get user data
    const user = await User.findOne(
      { _id: (req as ICustomRequest).id },
      { password: 0 }
    );

    // check if user exists
    if (!user) {
      errorRes(res, 404, `No user exist with this id`);
      return;
    }

    successRes(res, 200, `User info returned successfully`, user);
    return;
  } catch (error) {
    if (error instanceof Error) {
      errorRes(res, 500, `Error: ${error.message}`);
      return;
    } else {
      next(error);
    }
  }
};

// GET users http://localhost:8000/api/user/profile
export const getUsers: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get user data
    const users = await User.find({}, { password: 0 });

    // check if users exists
    if (!users) {
      errorRes(res, 404, `No users exist`);
      return;
    }

    successRes(res, 200, `Users info returned successfully`, users);
    return;
  } catch (error) {
    if (error instanceof Error) {
      errorRes(res, 500, `Error: ${error.message}`);
      return;
    } else {
      next(error);
    }
  }
};

// DELETE user http://localhost:8000/api/user/delete/:_id
export const deleteUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    console.log(id);

    // check if user exists
    const user = await User.findById(id);
    if (!user) {
      errorRes(res, 404, `No user exist with this id`);
      return;
    }

    // delete user
    await User.findByIdAndDelete(id);
    successRes(res, 200, `User deleted successfully`, '');
    return;
  } catch (error) {
    if (error instanceof Error) {
      errorRes(res, 500, `Error: ${error.message}`);
      return;
    } else {
      next(error);
    }
  }
};

// PUT update user http://localhost:8000/api/user/update/:id
export const updateUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, email, isAdmin, isBanned }: UserRegistrationBody = req.body;

    // check if user exists
    const user = await User.findById(id);
    if (!user) {
      errorRes(res, 404, `No user exist with this id`);
      return;
    }

    // update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          name: name,
          email: email,
          isAdmin: isAdmin,
          isBanned: isBanned,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      errorRes(res, 400, `User unsuccessfully updated!`);
      return;
    }

    successRes(res, 200, `User updated successfully`, updatedUser);
    return;
  } catch (error) {
    if (error instanceof Error) {
      errorRes(res, 500, `Error: ${error.message}`);
      return;
    } else {
      next(error);
    }
  }
};
