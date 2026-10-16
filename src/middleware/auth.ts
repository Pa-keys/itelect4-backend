import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { isObjectIdOrHexString } from 'mongoose';

export function jwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret?.trim()) throw new Error('JWT_SECRET must be configured');
  return secret;
}
export const requireAuth: RequestHandler = (req, res, next) => {
  const match = /^Bearer ([^\s]+)$/.exec(req.headers.authorization ?? '');
  if (!match) {
    res.status(401).json({ message: 'Send Authorization: Bearer <token>' });
    return;
  }
  const secret = jwtSecret();
  try {
    const payload = jwt.verify(match[1], secret, { algorithms: ['HS256'] });
    if (typeof payload === 'string' || typeof payload.userId !== 'string' ||
        !isObjectIdOrHexString(payload.userId) || typeof payload.exp !== 'number') {
      throw new Error('Invalid identity');
    }
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
