import { Router } from 'express';
import { prisma } from '../db';
import { sendError } from '../utils';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({ orderBy: { fullName: 'asc' } });
    res.json(users);
  } catch (error) {
    sendError(res, error, 'Failed to fetch users');
  }
});

export default router;
