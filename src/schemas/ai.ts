import { z } from 'zod';

export const learningNeedsSchema = z.object({
  prompt: z.string().trim()
    .min(20, 'Describe your tutoring needs in at least 20 characters.')
    .max(2000, 'Keep your tutoring needs to 2,000 characters or fewer.'),
});

export const sessionPrepSchema = z.object({
  learningGoal: z.string().trim().min(1).describe('The student\'s stated learning target.'),
  focusAreas: z.array(z.string().trim().min(1)).min(1).max(3).describe('One to three concepts or questions for the tutoring session.'),
  prepSteps: z.array(z.string().trim().min(1)).min(1).max(3).describe('One to three practical actions for the student or tutor.'),
  supportLevel: z.enum(['light-guidance', 'focused-help', 'foundational-help'])
    .describe('light-guidance: small clarification; focused-help: targeted help with partial basics; foundational-help: rebuild core understanding.'),
}).strict();

export type SessionPrep = z.infer<typeof sessionPrepSchema>;
export const sessionPrepJsonSchema = z.toJSONSchema(sessionPrepSchema);
