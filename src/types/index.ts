import type { Types } from 'mongoose';

export const userRoles = ['tutor', 'tutee', 'admin'] as const;
export type UserRole = typeof userRoles[number];
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  bio?: string;
  subjects?: string[];
}
export interface TutoringSession {
  id: string;
  tutorId: string;
  subject: string;
  scheduledAt: Date;
  durationMinutes: number;
}
export enum BookingStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Completed = 'completed',
  Cancelled = 'cancelled',
}
export interface Booking {
  id: string;
  sessionId: string;
  tuteeId: string;
  status: BookingStatus;
  note?: string;
  createdAt: Date;
}
export type UserDoc = Omit<User, 'id'> & { password: string };
export type BookingDoc = Omit<Booking, 'id' | 'tuteeId'> & { tuteeId: Types.ObjectId };
export type RegisterInput = Pick<UserDoc, 'name' | 'email' | 'password'>;
export type LoginInput = Pick<RegisterInput, 'email' | 'password'>;
export type BookingInput = Pick<Booking, 'sessionId' | 'status' | 'note'>;
export type ApiBooking = Omit<Booking, 'createdAt'> & { createdAt: string };

declare global {
  namespace Express {
    interface Request { userId?: string }
  }
}
