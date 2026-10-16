import 'dotenv/config';
import mongoose from 'mongoose';
import { app } from './app.js';
import { connectDB } from './config/db.js';
import { jwtSecret } from './middleware/auth.js';

async function start(): Promise<void> {
  jwtSecret();
  const port = Number(process.env.PORT ?? 4000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid PORT');
  await connectDB();
  const server = app.listen(port, () => console.log(`API listening on port ${port}`));
  server.on('error', () => {
    console.error('HTTP startup failed');
    void mongoose.disconnect().finally(() => process.exit(1));
  });
}
start().catch(async () => {
  console.error('Startup failed. Check MONGODB_URI, JWT_SECRET, PORT and database access.');
  await mongoose.disconnect();
  process.exit(1);
});
