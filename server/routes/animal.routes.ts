import { Router } from 'express';
import { prisma } from '../db';
import { sendError, sanitizeData } from '../utils';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const animals = await prisma.animal.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(animals);
  } catch (error) {
    sendError(res, error, 'Failed to fetch animals');
  }
});

router.post('/', async (req, res) => {
  try {
    const animal = await prisma.animal.create({ data: sanitizeData(req.body) });
    res.status(201).json(animal);
  } catch (error) {
    sendError(res, error, 'Failed to create animal');
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const animal = await prisma.animal.update({
      where: { id: req.params.id },
      data: sanitizeData(req.body)
    });
    res.json(animal);
  } catch (error) {
    sendError(res, error, 'Failed to update animal');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.animal.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    sendError(res, error, 'Failed to delete animal');
  }
});

export default router;
