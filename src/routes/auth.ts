import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { jwtSecret } from '../middleware/auth.js';
import { requireJsonObject } from '../middleware/errors.js';

export const authRouter = Router();
authRouter.post('/register', requireJsonObject, async (req, res) => {
  const body = req.body as Record<string, unknown>;
  if (typeof body.name !== 'string' || typeof body.email !== 'string' || typeof body.password !== 'string') {
    res.status(400).json({ message: 'Name, email and password are required strings' });
    return;
  }
  const email = body.email.trim().toLowerCase();
  if (await User.exists({ email })) {
    res.status(409).json({ message: 'That email is already registered' });
    return;
  }
  const user = await User.create({ name: body.name, email, password: body.password });
  res.status(201).json(user.toJSON());
});
authRouter.post('/login', requireJsonObject, async (req, res) => {
  const body = req.body as Record<string, unknown>;
  if (typeof body.email !== 'string' || typeof body.password !== 'string') {
    res.status(400).json({ message: 'Email and password are required strings' });
    return;
  }
  const user = await User.findOne({ email: body.email.trim().toLowerCase() }).select('+password');
  if (!user || !user.isActive || !(await bcrypt.compare(body.password, user.password))) {
    res.status(401).json({ message: 'Email or password is incorrect' });
    return;
  }
  const token = jwt.sign({ userId: String(user._id) }, jwtSecret(), { expiresIn: '2h' });
  res.json({ token, user: user.toJSON() });
});
