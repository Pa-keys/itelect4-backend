import { Router } from 'express';
import { TutoringSession } from '../models/TutoringSession.js';

export const tutoringSessionRouter = Router();

tutoringSessionRouter.get('/', async (req, res) => {
  const tutorId = typeof req.query.tutorId === 'string' ? req.query.tutorId : undefined;
  const sessions = await TutoringSession.find(tutorId ? { tutorId } : {}).sort({ scheduledAt: 1 });
  res.json(sessions);
});
tutoringSessionRouter.get('/:id', async (req, res) => {
  const session = await TutoringSession.findById(req.params.id);
  if (!session) { res.status(404).json({ message: 'Tutoring session not found' }); return; }
  res.json(session);
});
