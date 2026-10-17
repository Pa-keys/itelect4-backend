import type { TutorDoc } from '../types/index.js';

export const TUTORS: TutorDoc[] = [
  {
    name: 'Maria Santos',
    email: 'maria@example.com',
    isActive: true,
    bio: 'Patient programming tutor who loves practical examples.',
    subjects: ['TypeScript', 'React', 'JavaScript'],
  },
  {
    name: 'Alex Rivera',
    email: 'alex@example.com',
    isActive: true,
    bio: 'Computer science tutor focused on clear fundamentals.',
    subjects: ['Python', 'Data Structures', 'Algorithms'],
  },
];

export const TUTORING_SESSIONS = [
  { tutorEmail: 'maria@example.com', subject: 'TypeScript Fundamentals', scheduledAt: '2026-08-01T10:00:00+08:00', durationMinutes: 60 },
  { tutorEmail: 'maria@example.com', subject: 'React Components', scheduledAt: '2026-08-02T14:00:00+08:00', durationMinutes: 60 },
  { tutorEmail: 'alex@example.com', subject: 'Data Structures', scheduledAt: '2026-08-03T09:00:00+08:00', durationMinutes: 90 },
  { tutorEmail: 'alex@example.com', subject: 'Algorithm Problem Solving', scheduledAt: '2026-08-04T15:30:00+08:00', durationMinutes: 60 },
] as const;
