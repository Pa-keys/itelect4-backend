import { Router } from 'express';
import { Tutor } from '../models/Tutor.js';

export const tutorRouter = Router();

tutorRouter.get('/', async (_req, res) => {
  res.json(await Tutor.find().sort({ name: 1 }));
});
tutorRouter.get('/:id', async (req, res) => {
  const tutor = await Tutor.findById(req.params.id);
  if (!tutor) { res.status(404).json({ message: 'Tutor not found' }); return; }
  res.json(tutor);
});
