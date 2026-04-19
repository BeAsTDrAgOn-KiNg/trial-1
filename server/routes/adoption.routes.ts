import { Router } from 'express';
import { prisma } from '../db';
import { sendError, sanitizeData } from '../utils';

const router = Router();

// --- Applications ---
router.get('/applications', async (req, res) => {
  try {
    const apps = await prisma.adoptionApplication.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(apps);
  } catch (error) {
    sendError(res, error, 'Failed to fetch applications');
  }
});

router.post('/applications', async (req, res) => {
  try {
    const appRecord = await prisma.adoptionApplication.create({ data: sanitizeData(req.body) });
    res.status(201).json(appRecord);
  } catch (error) {
    sendError(res, error, 'Failed to create adoption application');
  }
});

// --- Adoptions ---
router.get('/', async (req, res) => {
  try {
    const adoptions = await prisma.adoption.findMany({
      include: { animal: true, user: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(adoptions);
  } catch (error) {
    sendError(res, error, 'Failed to fetch adoptions');
  }
});

router.post('/', async (req, res) => {
  try {
    const adoption = await prisma.adoption.create({ data: sanitizeData(req.body) });
    res.status(201).json(adoption);
  } catch (error) {
    sendError(res, error, 'Failed to create adoption');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.adoption.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    sendError(res, error, 'Failed to delete adoption');
  }
});

export default router;
