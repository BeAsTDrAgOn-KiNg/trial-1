import { Router } from 'express';
import { prisma } from '../db';
import { sendError, sanitizeData } from '../utils';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const decls = await prisma.declaration.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(decls);
  } catch (error) {
    sendError(res, error, 'Failed to fetch declarations');
  }
});

router.post('/', async (req, res) => {
  try {
    const declarationCount = await prisma.declaration.count();
    const formNo = `FORM-${new Date().getFullYear()}-${String(declarationCount + 1).padStart(3, '0')}`;
    const { formNo: _clientFormNo, ...data } = sanitizeData(req.body);
    const decl = await prisma.declaration.create({ data: { ...data, formNo } });
    res.status(201).json(decl);
  } catch (error) {
    sendError(res, error, 'Failed to create declaration');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.declaration.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    sendError(res, error, 'Failed to delete declaration');
  }
});

export default router;
