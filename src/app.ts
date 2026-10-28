import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { authRouter } from './routes/auth.js';
import { bookingRouter } from './routes/bookings.js';
import { tutoringSessionRouter } from './routes/sessions.js';
import { tutorRouter } from './routes/tutors.js';
import { aiRouter } from './routes/ai.js';
import { errorHandler } from './middleware/errors.js';

export const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) { callback(null, true); return; }
    callback(new Error('Origin is not allowed by CORS'));
  },
}));
app.use(express.json());
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  try { await connectDB(); next(); } catch (error: unknown) { next(error); }
});
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 });
});
app.use('/api/auth', authRouter);
app.use('/api/tutors', tutorRouter);
app.use('/api/sessions', tutoringSessionRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/ai', aiRouter);
app.use((_req, res) => { res.status(404).json({ message: 'Route not found' }); });
app.use(errorHandler);

export default app;
