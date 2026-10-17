import { Schema, model } from 'mongoose';
import type { TutorDoc } from '../types/index.js';

const tutorSchema = new Schema<TutorDoc>({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  isActive: { type: Boolean, required: true, default: true },
  bio: { type: String, trim: true, maxlength: 300 },
  subjects: { type: [String], default: [], validate: {
    validator: (subjects: string[]) => subjects.length > 0 && subjects.every((subject) => subject.trim().length > 0),
    message: 'A tutor needs at least one subject.',
  } },
});

tutorSchema.set('toJSON', {
  transform(_doc, ret: Record<string, unknown>) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Tutor = model<TutorDoc>('Tutor', tutorSchema);
