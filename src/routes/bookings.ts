import { Router } from 'express';
import { Booking } from '../models/Booking.js';
import { requireAuth } from '../middleware/auth.js';
import { requireJsonObject } from '../middleware/errors.js';
import type { BookingInput } from '../types/index.js';

export const bookingRouter = Router();
bookingRouter.use(requireAuth);

function mutableFields(body: Record<string, unknown>): Partial<Record<keyof BookingInput, unknown>> {
  const fields: Partial<Record<keyof BookingInput, unknown>> = {};
  for (const key of ['sessionId', 'status', 'note'] as const) {
    if (Object.hasOwn(body, key)) fields[key] = body[key];
  }
  return fields;
}
bookingRouter.get('/', async (req, res) => {
  res.json(await Booking.find({ tuteeId: req.userId }).sort({ createdAt: -1, _id: -1 }));
});
bookingRouter.get('/:id', async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.id, tuteeId: req.userId });
  if (!booking) { res.status(404).json({ message: 'Booking not found' }); return; }
  res.json(booking);
});
bookingRouter.post('/', requireJsonObject, async (req, res) => {
  const fields = mutableFields(req.body as Record<string, unknown>);
  const booking = new Booking({ tuteeId: req.userId });
  booking.set(fields);
  await booking.save();
  res.status(201).json(booking);
});
bookingRouter.patch('/:id', requireJsonObject, async (req, res) => {
  const fields = mutableFields(req.body as Record<string, unknown>);
  const booking = await Booking.findOneAndUpdate(
    { _id: req.params.id, tuteeId: req.userId },
    { $set: fields }, { new: true, runValidators: true },
  );
  if (!booking) { res.status(404).json({ message: 'Booking not found' }); return; }
  res.json(booking);
});
bookingRouter.delete('/:id', async (req, res) => {
  const booking = await Booking.findOneAndDelete({ _id: req.params.id, tuteeId: req.userId });
  if (!booking) { res.status(404).json({ message: 'Booking not found' }); return; }
  res.status(204).send();
});
