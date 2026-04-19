import { Router } from 'express';
import { prisma } from '../db';
import { sendError, sanitizeData } from '../utils';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const staff = await prisma.staffMember.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(staff);
  } catch (error) {
    sendError(res, error, 'Failed to fetch staff');
  }
});

router.post('/', async (req, res) => {
  try {
    const staff = await prisma.staffMember.create({ data: sanitizeData(req.body) });
    res.status(201).json(staff);
  } catch (error) {
    sendError(res, error, 'Failed to create staff member');
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const staff = await prisma.staffMember.update({
      where: { id: req.params.id },
      data: sanitizeData(req.body)
    });
    res.json(staff);
  } catch (error) {
    sendError(res, error, 'Failed to update staff member');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.staffMember.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    sendError(res, error, 'Failed to delete staff member');
  }
});

export default router;
