import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { authRouter } from './routes/auth.js';
import { bookingRouter } from './routes/bookings.js';
import { errorHandler } from './middleware/errors.js';

export const app = express();
app.use(cors());
app.use(express.json());
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 });
});
app.use('/api/auth', authRouter);
app.use('/api/bookings', bookingRouter);
app.use((_req, res) => { res.status(404).json({ message: 'Route not found' }); });
app.use(errorHandler);
