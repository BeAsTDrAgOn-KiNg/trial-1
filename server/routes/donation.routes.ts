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
    const amount = Number(req.body.amount);
    if (!Number.isFinite(amount) || amount < 1 || amount > 10_000_000) {
      return res.status(400).json({ error: 'Donation amount must be between ₹1 and ₹1,00,00,000' });
    }

    const donation = await prisma.donation.create({
      data: { ...sanitizeData(req.body), amount },
    });
    res.status(201).json(donation);
  } catch (error) {
    sendError(res, error, 'Failed to create donation');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.donation.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    sendError(res, error, 'Failed to delete donation');
  }
});

export default router;
