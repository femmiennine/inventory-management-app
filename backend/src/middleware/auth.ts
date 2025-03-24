import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt, {
  JwtPayload,
  JsonWebTokenError,
  TokenExpiredError,
  NotBeforeError,
} from 'jsonwebtoken';
import { errorRes } from './errorhandler';
import { dev } from '../config/dev';

export interface ICustomRequest extends Request {
  id: string | JwtPayload;
}

export interface TokenInterface {
  id: string;
  iat: number;
  exp: number;
}

export const isAuthorized: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // check if cookie exists
    if (!req.headers.cookie) {
      errorRes(res, 401, 'Authentication required');
      return;
    }

    // get token from cookie
    const token = req.headers.cookie.split('=')[1];
    if (!token) {
      errorRes(res, 401, 'Authentication token missing');
      return;
    }

    // verify the token
    jwt.verify(
      token,
      String(dev.app.private_key),
      (error: Error | null, decoded: any) => {
        if (error) {
          if (error instanceof TokenExpiredError) {
            errorRes(res, 401, 'Token has expired');
            return;
          }
          if (error instanceof JsonWebTokenError) {
            errorRes(res, 401, 'Invalid token');
            return;
          }
          if (error instanceof NotBeforeError) {
            errorRes(res, 401, 'Token not yet active');
            return;
          }
          errorRes(res, 401, 'Token verification failed');
        }

        if (!decoded) {
          errorRes(res, 401, 'Invalid token payload');
          return;
        }

        (req as ICustomRequest).id = (decoded as TokenInterface).id;
        next();
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      errorRes(res, 500, `Authentication error: ${error.message}`);
      return;
    } else {
      next(error);
    }
  }
};
