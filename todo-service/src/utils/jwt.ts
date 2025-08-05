import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types/todo.types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
};