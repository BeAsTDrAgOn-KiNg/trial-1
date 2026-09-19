import { Router } from 'express';
import { prisma } from '../db';
import { sendError, sanitizeData } from '../utils';

const router = Router();
// --- Cases with Pagination & Filtering ---
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, parseInt(req.query.limit as string) || 20);
    const skip = (page - 1) * limit;

    const search = String(req.query.search || '').trim();
    const status = String(req.query.status || 'All').trim();
    const year = String(req.query.year || 'All').trim();
    const month = String(req.query.month || 'All').trim();

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status !== 'All') {
      where.status = status;
    }

    if (year !== 'All' || month !== 'All') {
      const filterYear = year !== 'All' ? parseInt(year) : new Date().getFullYear();
      const filterMonth = month !== 'All' ? parseInt(month) - 1 : 0;
      
      const startDate = new Date(filterYear, month !== 'All' ? filterMonth : 0, 1);
      const endDate = new Date(filterYear, month !== 'All' ? filterMonth + 1 : 12, 0, 23, 59, 59);
      
      where.createdAt = {
        gte: startDate,
        lte: endDate
      };
    }

    const [data, total] = await Promise.all([
      prisma.case.findMany({
        where,
        include: { reporter: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.case.count({ where }),
    ]);

    res.json({
      data,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    sendError(res, error, 'Failed to fetch cases');
  }
});

router.get('/export', async (req, res) => {

  // if (!isAdmin(req)) {
  //   return res.status(403).json({
  //     error: 'Access denied. Admins only.'
  //   });
  // }


  try {
    const cases = await prisma.case.findMany({
      include: { reporter: true, clinicalEntries: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(cases);
  } catch (error) {
    sendError(res, error, 'Failed to export cases');
  }
});

router.get('/:id', async (req, res) => {

  // if (!isAdmin(req)) {
  //   return res.status(403).json({
  //     error: 'Access denied. Admins only.'
  //   });
  // }
  try {
    const caseItem = await prisma.case.findUnique({
      where: { id: req.params.id },
      include: { clinicalEntries: true, reporter: true }
    });
    if (caseItem) {
      res.json(caseItem);
    } else {
      res.status(404).json({ error: 'Case not found' });
    }
  } catch (error) {
    sendError(res, error, 'Failed to fetch case');
  }
});

router.post('/', async (req, res) => {
  try {

    console.log("BODY:", req.body);

    const newCase = await prisma.case.create({
      data: sanitizeData(req.body)
    });

    res.status(201).json(newCase);

  } catch (error) {
    console.error(error);
    sendError(res, error, 'Failed to create case');
  }
});

router.patch('/:id', async (req, res) => {

  // if (!isAdmin(req)) {
  //   return res.status(403).json({
  //     error: 'Access denied. Admins only.'
  //   });
  // }

  try {
    const updatedCase = await prisma.case.update({
      where: { id: req.params.id },
      data: sanitizeData(req.body)
    });
    res.json(updatedCase);
  } catch (error) {
    sendError(res, error, 'Failed to update case');
  }
});

router.delete('/:id', async (req, res) => {

  // if (!isAdmin(req)) {
  //   return res.status(403).json({
  //     error: 'Access denied. Admins only.'
  //   });
  // }

  try {
    await prisma.case.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    sendError(res, error, 'Failed to delete case');
  }
});

export default router;
