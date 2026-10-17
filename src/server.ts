import 'dotenv/config';
import mongoose from 'mongoose';
import { app } from './app.js';
import { connectDB } from './config/db.js';
import { jwtSecret } from './middleware/auth.js';

async function start(): Promise<void> {
  jwtSecret();
  const port = Number(process.env.PORT ?? 4000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid PORT');
  void connectDB().catch(() => console.error('Could not connect to MongoDB. Check MONGODB_URI and database access.'));
  const server = app.listen(port, () => console.log(`API listening on port ${port}`));
  server.on('error', (error: Error) => {
    console.error(`HTTP startup failed: ${error.message}`);
    void mongoose.disconnect().finally(() => process.exit(1));
  });
}
start().catch(async () => {
  console.error('Startup failed. Check MONGODB_URI, JWT_SECRET, PORT and database access.');
  await mongoose.disconnect();
  process.exit(1);
});
