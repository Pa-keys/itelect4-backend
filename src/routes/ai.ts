import { ApiError } from '@google/genai';
import { rateLimit } from 'express-rate-limit';
import { Router } from 'express';
import { AiReplyError, generateSessionPrep } from '../ai/gemini.js';
import { requireAuth } from '../middleware/auth.js';
import { learningNeedsSchema } from '../schemas/ai.js';

export const aiRouter = Router();

const aiRateLimit = rateLimit({
  windowMs: 60_000,
  limit: 5,
  keyGenerator: (req) => req.userId ?? 'unauthenticated',
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (_req, res) => res.status(429).json({ message: 'AI Session Prep is limited to five requests per minute. Please try again shortly.' }),
});

aiRouter.post('/', requireAuth, aiRateLimit, async (req, res, next) => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    res.status(400).json({ message: 'Send an AI Session Prep JSON object with your learning needs.' });
    return;
  }
  const parsed = learningNeedsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0]?.message ?? 'Invalid AI Session Prep request.' });
    return;
  }
  try {
    res.json(await generateSessionPrep(parsed.data.prompt));
  } catch (error: unknown) {
    if (error instanceof ApiError && error.status === 429) {
      console.warn('Gemini quota limit reached for AI Session Prep');
      res.status(429).json({ message: 'Gemini is temporarily at quota. Please try again later.' });
      return;
    }
    if (error instanceof ApiError || error instanceof AiReplyError) {
      console.error('AI Session Prep generation failed', error instanceof Error ? error.message : 'Unknown error');
      res.status(502).json({ message: 'AI Session Prep could not generate a safe reply. Please try again.' });
      return;
    }
    next(error);
  }
});
