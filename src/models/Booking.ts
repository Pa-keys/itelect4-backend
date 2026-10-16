import { Schema, model } from 'mongoose';
import { BookingStatus, type BookingDoc } from '../types/index.js';

const bookingSchema = new Schema<BookingDoc>({
  tuteeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sessionId: { type: String, required: true, trim: true },
  status: { type: String, enum: Object.values(BookingStatus), required: true, default: BookingStatus.Pending },
  note: { type: String, trim: true, minlength: 10, maxlength: 160,
    validate: { validator: (value: string | null | undefined) => value === undefined ||
      (typeof value === 'string' && value.length >= 10 && value.length <= 160),
    message: 'Note must contain 10–160 characters when provided.' } },
  createdAt: { type: Date, default: Date.now, required: true, immutable: true },
});
bookingSchema.set('toJSON', {
  transform(_doc, ret: Record<string, unknown>) {
    ret.id = String(ret._id);
    ret.tuteeId = String(ret.tuteeId);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
export const Booking = model<BookingDoc>('Booking', bookingSchema);
