import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/error';

interface JwtPayload {
  id: string;
  universityId: string;
  role: string; // Added role to payload
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in.', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError('Invalid token or session expired', 401));
  }
};

// ROLE PROTECTOR: Blocks users who don't have the right clearance
export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};