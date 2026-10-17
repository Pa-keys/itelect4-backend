import { Schema, model } from 'mongoose';
import type { TutoringSessionDoc } from '../types/index.js';

const tutoringSessionSchema = new Schema<TutoringSessionDoc>({
  tutorId: { type: Schema.Types.ObjectId, ref: 'Tutor', required: true },
  subject: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
  scheduledAt: { type: Date, required: true },
  durationMinutes: { type: Number, required: true, min: 15, max: 240 },
});

tutoringSessionSchema.index({ tutorId: 1, subject: 1, scheduledAt: 1 }, { unique: true });
tutoringSessionSchema.set('toJSON', {
  transform(_doc, ret: Record<string, unknown>) {
    ret.id = String(ret._id);
    ret.tutorId = String(ret.tutorId);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const TutoringSession = model<TutoringSessionDoc>('TutoringSession', tutoringSessionSchema);
