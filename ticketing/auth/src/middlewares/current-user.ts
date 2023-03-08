import e, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

const JWT_KEY = process.env.JWT_KEY || '';

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req?.session?.jwt) {
   next();
  }

  try {
    const payload = jwt.verify(req?.session?.jwt, JWT_KEY) as UserPayload;
    req.currentUser = payload;
  } catch ( error ) {
    console.error(error);
  }

  next();
}
