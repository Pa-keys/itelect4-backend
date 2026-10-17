import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { TUTORS, TUTORING_SESSIONS } from './data/referenceData.js';
import { Tutor } from './models/Tutor.js';
import { TutoringSession } from './models/TutoringSession.js';

async function seed(): Promise<void> {
  await connectDB();
  for (const tutor of TUTORS) {
    await Tutor.updateOne({ email: tutor.email }, tutor, { upsert: true, runValidators: true });
  }
  for (const session of TUTORING_SESSIONS) {
    const tutor = await Tutor.findOne({ email: session.tutorEmail });
    if (!tutor) throw new Error(`Tutor seed missing for ${session.tutorEmail}`);
    await TutoringSession.updateOne(
      { tutorId: tutor._id, subject: session.subject, scheduledAt: new Date(session.scheduledAt) },
      { tutorId: tutor._id, subject: session.subject, scheduledAt: new Date(session.scheduledAt), durationMinutes: session.durationMinutes },
      { upsert: true, runValidators: true },
    );
  }
  console.log(`${TUTORS.length} tutors and ${TUTORING_SESSIONS.length} tutoring sessions in ${mongoose.connection.name}`);
}

seed().catch((error: unknown) => {
  console.error('Seed failed:', error instanceof Error ? error.message : 'Unknown error');
  process.exitCode = 1;
}).finally(async () => {
  await mongoose.disconnect();
});
