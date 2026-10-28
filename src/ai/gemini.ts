import { GoogleGenAI } from '@google/genai';
import { sessionPrepExamples, sessionPrepSystemInstruction, tagLearningNeeds } from './prompt.js';
import { sessionPrepJsonSchema, sessionPrepSchema, type SessionPrep } from '../schemas/ai.js';

export class AiReplyError extends Error {}

let client: GoogleGenAI | undefined;

function geminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) throw new Error('GEMINI_API_KEY must be configured');
  client ??= new GoogleGenAI({ apiKey });
  return client;
}

export async function generateSessionPrep(prompt: string): Promise<SessionPrep> {
  const response = await geminiClient().models.generateContent({
    model: 'gemini-flash-latest',
    contents: [...sessionPrepExamples, { role: 'user', parts: [{ text: tagLearningNeeds(prompt) }] }],
    config: {
      systemInstruction: sessionPrepSystemInstruction,
      responseMimeType: 'application/json',
      responseJsonSchema: sessionPrepJsonSchema,
    },
  });
  const text = response.text?.trim();
  if (!text) throw new AiReplyError('Gemini returned no text');
  let payload: unknown;
  try { payload = JSON.parse(text) as unknown; } catch { throw new AiReplyError('Gemini returned invalid JSON'); }
  const parsed = sessionPrepSchema.safeParse(payload);
  if (!parsed.success) throw new AiReplyError('Gemini returned an invalid session prep reply');
  return parsed.data;
}
