import type { ErrorRequestHandler, RequestHandler } from 'express';
import mongoose from 'mongoose';

export const requireJsonObject: RequestHandler = (req, res, next) => {
  const body: unknown = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    res.status(400).json({ message: 'Send a JSON object body' });
    return;
  }
  next();
};
export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
  if (error instanceof mongoose.Error.ValidationError) {
    res.status(400).json({ message: 'Validation failed', errors:
      Object.values(error.errors).map((item) => ({ field: item.path, message: item.message })) });
  } else if (error instanceof mongoose.Error.CastError) {
    res.status(400).json({ message: 'Invalid field value or resource id' });
  } else if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
    res.status(409).json({ message: 'That email is already registered' });
  } else if (error instanceof SyntaxError && 'status' in error && error.status === 400) {
    res.status(400).json({ message: 'Invalid JSON body' });
  } else {
    res.status(500).json({ message: 'Internal server error' });
  }
};
