import { Request, Response, NextFunction } from 'express';
import jwt, {
  JwtPayload,
  JsonWebTokenError,
  TokenExpiredError,
  NotBeforeError,
} from 'jsonwebtoken';
import { errorRes } from './apiErrorHandler';
import { dev } from '../config/dev';

export interface ICustomRequest extends Request {
  id: string | JwtPayload;
}

export interface IJWTToken {
  id: string;
}

export const isAuthorized = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.cookie) {
      return errorRes(res, 401, 'Authentication required');
    }

    const token = req.headers.cookie.split('=')[1];

    if (!token) {
      return errorRes(res, 401, 'Authentication token missing');
    }

    jwt.verify(
      token,
      String(dev.app.private_key),
      (error: Error | null, decoded: any) => {
        if (error) {
          if (error instanceof TokenExpiredError) {
            return errorRes(res, 401, 'Token has expired');
          }
          if (error instanceof JsonWebTokenError) {
            return errorRes(res, 401, 'Invalid token');
          }
          if (error instanceof NotBeforeError) {
            return errorRes(res, 401, 'Token not yet active');
          }
          return errorRes(res, 401, 'Token verification failed');
        }

        if (!decoded) {
          return errorRes(res, 401, 'Invalid token payload');
        }

        (req as ICustomRequest).id = (decoded as IJWTToken).id;
        next();
      }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return errorRes(res, 500, `Authentication error: ${error.message}`);
    }
    return errorRes(res, 500, 'An unknown authentication error occurred');
  }
};
