import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { failResponse } from '../utils/response';
import { JWT_TOKEN_NAME } from '../utils/constants';
const cookieParser = require('cookie-parser');
export interface AuthRequest extends Request {
  user?: string | object;
}

// Middleware to protect routes
export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;
  token = req.cookies[`${JWT_TOKEN_NAME}`];
  if (token) {
    try {
      
      const decoded = await verifyToken(token!);
       console.log('decoded', decoded)
      // Attach user to the request object (you can use this in your protected routes)
      req.user = decoded;
      next();
    } catch (err: any) {
      console.log('err', err)
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return failResponse(res, 'Token expired. Please log in again.', 401);
        }
        return failResponse(res, 'Invalid token.', 401);
      }
    }
  }
  if(!token){
    return failResponse(res, 'Not authorized, no token', 401);
  }


};
