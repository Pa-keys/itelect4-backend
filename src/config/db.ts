import mongoose from 'mongoose';

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri?.trim()) throw new Error('MONGODB_URI must be configured');
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
}
