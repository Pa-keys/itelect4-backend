import mongoose from 'mongoose';

let connection: Promise<typeof mongoose> | null = null;

export function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri?.trim()) throw new Error('MONGODB_URI must be configured');
  if (connection === null) {
    connection = mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 }).catch((error: unknown) => {
      connection = null;
      throw error;
    });
  }
  return connection;
}
