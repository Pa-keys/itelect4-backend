import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { userRoles, type UserDoc } from '../types/index.js';

const userSchema = new Schema<UserDoc>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  role: { type: String, enum: userRoles, default: 'tutee', required: true },
  isActive: { type: Boolean, default: true, required: true },
  bio: { type: String, trim: true },
  subjects: { type: [String], default: undefined },
  password: { type: String, required: true, minlength: 8, select: false },
});

userSchema.pre('save', async function () {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 10);
});
userSchema.set('toJSON', {
  transform(_doc, ret: Record<string, unknown>) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});
export const User = model<UserDoc>('User', userSchema);
