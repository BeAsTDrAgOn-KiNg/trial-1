import { Router } from 'express';
import { prisma } from '../db';
import { sendError, sanitizeData } from '../utils';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const cases = await prisma.wildlifeCase.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(cases);
  } catch (error) {
    sendError(res, error, 'Failed to fetch wildlife cases');
  }
});

router.post('/', async (req, res) => {
  try {
    const newCase = await prisma.wildlifeCase.create({ data: sanitizeData(req.body) });
    res.status(201).json(newCase);
  } catch (error) {
    sendError(res, error, 'Failed to create wildlife case');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.wildlifeCase.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    sendError(res, error, 'Failed to delete wildlife case');
  }
});

export default router;
