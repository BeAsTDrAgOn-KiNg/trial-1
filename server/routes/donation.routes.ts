import { Router } from 'express';
import { prisma } from '../db';
import { sendError, sanitizeData } from '../utils';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const donations = await prisma.donation.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(donations);
  } catch (error) {
    sendError(res, error, 'Failed to fetch donations');
  }
});

router.post('/', async (req, res) => {
  try {
    const donation = await prisma.donation.create({ data: sanitizeData(req.body) });
    res.status(201).json(donation);
  } catch (error) {
    sendError(res, error, 'Failed to create donation');
  }
});

export default router;
