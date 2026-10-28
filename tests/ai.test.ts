import 'dotenv/config';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

vi.mock('../src/config/db.js', () => ({
  connectDB: vi.fn().mockResolvedValue(undefined),
}));

import { app } from '../src/app.js';

const previousGeminiApiKey = process.env.GEMINI_API_KEY;
const previousMongoDbUri = process.env.MONGODB_URI;

beforeAll(() => {
  delete process.env.GEMINI_API_KEY;
  delete process.env.MONGODB_URI;
});

afterAll(() => {
  if (previousGeminiApiKey === undefined) delete process.env.GEMINI_API_KEY;
  else process.env.GEMINI_API_KEY = previousGeminiApiKey;
  if (previousMongoDbUri === undefined) delete process.env.MONGODB_URI;
  else process.env.MONGODB_URI = previousMongoDbUri;
});

describe('POST /api/ai', () => {
  it('rejects a request without an Authorization token', async () => {
    const response = await request(app)
      .post('/api/ai')
      .send({ prompt: 'I need help preparing for a tutoring session.' });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Send Authorization: Bearer <token>' });
  });

  it('validates the prompt after accepting a valid JWT', async () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is required for this test');
    const token = jwt.sign(
      { userId: '507f1f77bcf86cd799439011' },
      secret,
      { algorithm: 'HS256', expiresIn: '5m' },
    );

    const response = await request(app)
      .post('/api/ai')
      .set('Authorization', `Bearer ${token}`)
      .send({ prompt: 'short' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Describe your tutoring needs in at least 20 characters.',
    });
  });
});
