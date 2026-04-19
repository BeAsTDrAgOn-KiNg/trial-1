import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import fs from 'fs';
import morgan from 'morgan';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const prisma = new PrismaClient();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(morgan('dev'));
  app.use(express.json());
  app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

  // Configure Multer
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
  const upload = multer({ storage });

  // Error handling helper
  const sendError = (res: any, error: any, defaultMessage: string) => {
    console.error(`[API Error] ${defaultMessage}:`, error);
    const message = error instanceof Error ? error.message : defaultMessage;
    res.status(500).json({ error: message, success: false });
  };

  /**
   * Strips relational fields and immutable fields (id, createdAt) from data
   * to prevent Prisma from throwing validation errors during create/update.
   */
  const sanitizeData = (data: any) => {
    const { id, createdAt, updatedAt, reporter, clinicalEntries, animal, abcRecord, adoptions, cases, usages, medicine, user, ...rest } = data;
    const sanitized: any = {};
    // Only keep primary types (strings, numbers, booleans, null)
    // This prevents accidental nested update objects that weren't intended
    for (const key in rest) {
      if (rest[key] === null || typeof rest[key] !== 'object') {
        sanitized[key] = rest[key];
      }
    }
    return sanitized;
  };

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  });

  // Example API route for animals
  app.get('/api/animals', async (req, res) => {
    try {
      const animals = await prisma.animal.findMany({
        orderBy: { createdAt: 'desc' }
      });
      res.json(animals);
    } catch (error) {
      sendError(res, error, 'Failed to fetch animals');
    }
  });

  app.get('/api/wildlife', async (req, res) => {
    try {
      const cases = await prisma.wildlifeCase.findMany({
        orderBy: { createdAt: 'desc' }
      });
      res.json(cases);
    } catch (error) {
      sendError(res, error, 'Failed to fetch wildlife cases');
    }
  });

  app.get('/api/staff', async (req, res) => {
    try {
      const staff = await prisma.staffMember.findMany({
        orderBy: { name: 'asc' }
      });
      res.json(staff);
    } catch (error) {
      sendError(res, error, 'Failed to fetch staff');
    }
  });

  app.get('/api/inventory/medicines', async (req, res) => {
    try {
      const medicines = await prisma.medicine.findMany({
        orderBy: { name: 'asc' }
      });
      res.json(medicines);
    } catch (error) {
      sendError(res, error, 'Failed to fetch medicines');
    }
  });

  app.get('/api/inventory/housekeeping', async (req, res) => {
    try {
      const items = await prisma.housekeepingSupply.findMany({
        orderBy: { name: 'asc' }
      });
      res.json(items);
    } catch (error) {
      sendError(res, error, 'Failed to fetch housekeeping');
    }
  });

  app.get('/api/donations', async (req, res) => {
    try {
      const donations = await prisma.donation.findMany({
        orderBy: { createdAt: 'desc' }
      });
      res.json(donations);
    } catch (error) {
      sendError(res, error, 'Failed to fetch donations');
    }
  });

  app.get('/api/adoptions/applications', async (req, res) => {
    try {
      const apps = await prisma.adoptionApplication.findMany({
        orderBy: { createdAt: 'desc' }
      });
      res.json(apps);
    } catch (error) {
      sendError(res, error, 'Failed to fetch applications');
    }
  });

  // --- Animals ---
  app.post('/api/animals', async (req, res) => {
    try {
      const animal = await prisma.animal.create({ data: sanitizeData(req.body) });
      res.status(201).json(animal);
    } catch (error) {
      sendError(res, error, 'Failed to create animal');
    }
  });

  app.patch('/api/animals/:id', async (req, res) => {
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

  app.delete('/api/animals/:id', async (req, res) => {
    try {
      await prisma.animal.delete({ where: { id: req.params.id } });
      res.status(204).send();
    } catch (error) {
      sendError(res, error, 'Failed to delete animal');
    }
  });

  // --- Cases ---
  app.post('/api/cases', async (req, res) => {
    try {
      const newCase = await prisma.case.create({ data: sanitizeData(req.body) });
      res.status(201).json(newCase);
    } catch (error) {
      sendError(res, error, 'Failed to create case');
    }
  });

  app.get('/api/cases/:id', async (req, res) => {
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
      res.status(500).json({ error: 'Failed to fetch case' });
    }
  });

  app.patch('/api/cases/:id', async (req, res) => {
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

  app.delete('/api/cases/:id', async (req, res) => {
    try {
      await prisma.case.delete({ where: { id: req.params.id } });
      res.status(204).send();
    } catch (error) {
      sendError(res, error, 'Failed to delete case');
    }
  });

  // --- Wildlife ---
  app.post('/api/wildlife', async (req, res) => {
    try {
      const newCase = await prisma.wildlifeCase.create({ data: sanitizeData(req.body) });
      res.status(201).json(newCase);
    } catch (error) {
      sendError(res, error, 'Failed to create wildlife case');
    }
  });

  app.delete('/api/wildlife/:id', async (req, res) => {
    try {
      await prisma.wildlifeCase.delete({ where: { id: req.params.id } });
      res.status(204).send();
    } catch (error) {
      sendError(res, error, 'Failed to delete wildlife case');
    }
  });

  // --- Staff ---
  app.post('/api/staff', async (req, res) => {
    try {
      const staff = await prisma.staffMember.create({ data: sanitizeData(req.body) });
      res.status(201).json(staff);
    } catch (error) {
      sendError(res, error, 'Failed to create staff member');
    }
  });

  app.patch('/api/staff/:id', async (req, res) => {
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

  app.delete('/api/staff/:id', async (req, res) => {
    try {
      await prisma.staffMember.delete({ where: { id: req.params.id } });
      res.status(204).send();
    } catch (error) {
      sendError(res, error, 'Failed to delete staff member');
    }
  });

  // --- Inventory: Medicines ---
  // --- Auth ---
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { fullName, email, phone, role, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { 
          fullName, 
          email, 
          phone, 
          role,
          password: hashedPassword
        }
      });
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error: any) {
      if (error.code === 'P2002') return res.status(400).json({ error: 'Email already exists', success: false });
      sendError(res, error, 'Registration failed');
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      sendError(res, error, 'Login failed');
    }
  });

  // --- Clinical Entries ---
  app.get('/api/clinical-entries', async (req, res) => {
    try {
      const entries = await prisma.clinicalEntry.findMany({ orderBy: { createdAt: 'desc' } });
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: 'Failed' });
    }
  });

  app.post('/api/clinical-entries', async (req, res) => {
    try {
      const entry = await prisma.clinicalEntry.create({ data: sanitizeData(req.body) });
      res.status(201).json(entry);
    } catch (error) {
      res.status(500).json({ error: 'Failed' });
    }
  });

  app.delete('/api/clinical-entries/:id', async (req, res) => {
    try {
      await prisma.clinicalEntry.delete({ where: { id: req.params.id } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed' });
    }
  });

  // --- ABC Records ---
  app.get('/api/abc-records', async (req, res) => {
    try {
      const records = await prisma.aBCRecord.findMany();
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: 'Failed' });
    }
  });

  app.post('/api/abc-records', async (req, res) => {
    try {
      const record = await prisma.aBCRecord.create({ data: sanitizeData(req.body) });
      res.status(201).json(record);
    } catch (error) {
      res.status(500).json({ error: 'Failed' });
    }
  });

  app.patch('/api/abc-records/:id', async (req, res) => {
    try {
      const record = await prisma.aBCRecord.update({
        where: { id: req.params.id },
        data: sanitizeData(req.body)
      });
      res.json(record);
    } catch (error) {
      res.status(500).json({ error: 'Failed' });
    }
  });

  app.delete('/api/abc-records/:id', async (req, res) => {
    try {
      await prisma.aBCRecord.delete({ where: { id: req.params.id } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed' });
    }
  });

  // --- Inventory: Housekeeping ---
  app.post('/api/inventory/housekeeping', async (req, res) => {
    try {
      const item = await prisma.housekeepingSupply.create({ data: sanitizeData(req.body) });
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: 'Failed' });
    }
  });

  app.patch('/api/inventory/housekeeping/:id', async (req, res) => {
    try {
      const item = await prisma.housekeepingSupply.update({
        where: { id: req.params.id },
        data: sanitizeData(req.body)
      });
      res.json(item);
    } catch (error) {
       res.status(500).json({ error: 'Failed' });
    }
  });

  app.delete('/api/inventory/housekeeping/:id', async (req, res) => {
    try {
      await prisma.housekeepingSupply.delete({ where: { id: req.params.id } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed' });
    }
  });

  // --- Medicine Usage ---
  app.get('/api/medicine-usages', async (req, res) => {
    try {
      const usages = await prisma.medicineUsage.findMany({ orderBy: { createdAt: 'desc' } });
      res.json(usages);
    } catch (error) {
      res.status(500).json({ error: 'Failed' });
    }
  });

  // --- Stats Endpoint for Dashboard ---
  app.get('/api/stats', async (req, res) => {
    try {
      const [
        totalCases,
        criticalCases,
        totalDonations,
        recentCases,
        lowStockMeds
      ] = await Promise.all([
        prisma.case.count(),
        prisma.case.count({ where: { status: 'critical' } }),
        prisma.donation.aggregate({ _sum: { amount: true } }),
        prisma.case.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.medicine.count({
          where: {
            quantity: { lte: prisma.medicine.fields.minStockLevel }
          }
        })
      ]);

      res.json({
        totalCases,
        criticalCount: criticalCases,
        totalDonations: totalDonations._sum.amount || 0,
        recentActivities: recentCases,
        lowStockMedsCount: lowStockMeds
      });
    } catch (error) {
      console.error('Stats error:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });
  // --- Global Search Endpoint ---
  app.get('/api/search', async (req, res) => {
    try {
      const query = String(req.query.q || '').trim();
      if (!query) {
        return res.json({ cases: [], wildlife: [], animals: [] });
      }

      // Perform parallel search across multiple tables
      const [cases, wildlife, animals] = await Promise.all([
        prisma.case.findMany({
          where: {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
              { location: { contains: query, mode: 'insensitive' } },
            ],
          },
          take: 10, // Limit results for efficiency
        }),
        prisma.wildlifeCase.findMany({
          where: {
            OR: [
              { caseNumber: { contains: query, mode: 'insensitive' } },
              { animal: { contains: query, mode: 'insensitive' } },
              { location: { contains: query, mode: 'insensitive' } },
              { complainantName: { contains: query, mode: 'insensitive' } },
            ],
          },
          take: 10,
        }),
        prisma.animal.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { species: { contains: query, mode: 'insensitive' } },
              { breed: { contains: query, mode: 'insensitive' } },
            ],
          },
          take: 10,
        }),
      ]);

      res.json({ cases, wildlife, animals });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Search failed' });
    }
  });
  app.post('/api/medicine-usages', async (req, res) => {
    try {
      const { medicineId, quantity, ...rest } = req.body;
      const deduction = parseFloat(quantity) || 0;

      // Use a transaction to ensure both operations succeed or fail together
      const [usage] = await prisma.$transaction([
        prisma.medicineUsage.create({ 
          data: { 
            medicineId, 
            quantity: String(quantity), 
            ...sanitizeData(rest),
            dateTime: new Date().toISOString()
          } 
        }),
        prisma.medicine.update({
          where: { id: medicineId },
          data: {
            quantity: {
              decrement: deduction
            }
          }
        })
      ]);

      res.status(201).json(usage);
    } catch (error) {
      console.error('Usage Error:', error);
      res.status(500).json({ error: 'Failed to record usage or update stock' });
    }
  });

  app.delete('/api/medicine-usages/:id', async (req, res) => {
    try {
      await prisma.medicineUsage.delete({ where: { id: req.params.id } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed' });
    }
  });

  app.post('/api/inventory/medicines', async (req, res) => {
    try {
      const med = await prisma.medicine.create({ data: sanitizeData(req.body) });
      res.status(201).json(med);
    } catch (error) {
      sendError(res, error, 'Failed to create medicine');
    }
  });

  app.patch('/api/inventory/medicines/:id', async (req, res) => {
    try {
      const med = await prisma.medicine.update({
        where: { id: req.params.id },
        data: sanitizeData(req.body)
      });
      res.json(med);
    } catch (error) {
      sendError(res, error, 'Failed to update medicine');
    }
  });

  app.delete('/api/inventory/medicines/:id', async (req, res) => {
    try {
      await prisma.medicine.delete({ where: { id: req.params.id } });
      res.status(204).send();
    } catch (error) {
      sendError(res, error, 'Failed to delete medicine');
    }
  });

  // --- Donations ---
  app.post('/api/donations', async (req, res) => {
    try {
      const donation = await prisma.donation.create({ data: sanitizeData(req.body) });
      res.status(201).json(donation);
    } catch (error) {
      sendError(res, error, 'Failed to create donation');
    }
  });

  // --- Adoptions ---
  app.post('/api/adoptions/applications', async (req, res) => {
    try {
      const appRecord = await prisma.adoptionApplication.create({ data: sanitizeData(req.body) });
      res.status(201).json(appRecord);
    } catch (error) {
      sendError(res, error, 'Failed to create adoption application');
    }
  });

  // --- Declarations ---
  app.get('/api/declarations', async (req, res) => {
    try {
      const decls = await prisma.declaration.findMany({ orderBy: { createdAt: 'desc' } });
      res.json(decls);
    } catch (error) {
      sendError(res, error, 'Failed to fetch declarations');
    }
  });

  app.post('/api/declarations', async (req, res) => {
    try {
      const decl = await prisma.declaration.create({ data: sanitizeData(req.body) });
      res.status(201).json(decl);
    } catch (error) {
      sendError(res, error, 'Failed to create declaration');
    }
  });

  app.delete('/api/declarations/:id', async (req, res) => {
    try {
      await prisma.declaration.delete({ where: { id: req.params.id } });
      res.status(204).send();
    } catch (error) {
      sendError(res, error, 'Failed to delete declaration');
    }
  });

  app.get('/api/adoptions', async (req, res) => {
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

  app.post('/api/adoptions', async (req, res) => {
    try {
      const adoption = await prisma.adoption.create({ data: sanitizeData(req.body) });
      res.status(201).json(adoption);
    } catch (error) {
      sendError(res, error, 'Failed to create adoption');
    }
  });

  app.delete('/api/adoptions/:id', async (req, res) => {
    try {
      await prisma.adoption.delete({ where: { id: req.params.id } });
      res.status(204).send();
    } catch (error) {
      sendError(res, error, 'Failed to delete adoption');
    }
  });

  // --- Inventory: General Items ---
  app.get('/api/inventory/items', async (req, res) => {
    try {
      const items = await prisma.inventoryItem.findMany({ orderBy: { name: 'asc' } });
      res.json(items);
    } catch (error) {
      sendError(res, error, 'Failed to fetch inventory items');
    }
  });

  app.post('/api/inventory/items', async (req, res) => {
    try {
      const item = await prisma.inventoryItem.create({ data: sanitizeData(req.body) });
      res.status(201).json(item);
    } catch (error) {
      sendError(res, error, 'Failed to create inventory item');
    }
  });

  app.patch('/api/inventory/items/:id', async (req, res) => {
    try {
      const item = await prisma.inventoryItem.update({
        where: { id: req.params.id },
        data: sanitizeData(req.body)
      });
      res.json(item);
    } catch (error) {
      sendError(res, error, 'Failed to update inventory item');
    }
  });

  app.delete('/api/inventory/items/:id', async (req, res) => {
    try {
      await prisma.inventoryItem.delete({ where: { id: req.params.id } });
      res.status(204).send();
    } catch (error) {
      sendError(res, error, 'Failed to delete inventory item');
    }
  });

  // --- User Profiles ---
  app.get('/api/users', async (req, res) => {
    try {
      const users = await prisma.user.findMany({ orderBy: { fullName: 'asc' } });
      res.json(users);
    } catch (error) {
      sendError(res, error, 'Failed to fetch users');
    }
  });

  // --- Cases with Pagination & Filtering ---
  app.get('/api/cases', async (req, res) => {
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

      // Year/Month filtering is tricky since createdAt is a DateTime
      // We'll use start/end date ranges if year or month is specified
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
      console.error('Fetch cases error:', error);
      res.status(500).json({ error: 'Failed to fetch cases' });
    }
  });

  // --- Export Endpoint (All cases, no pagination) ---
  app.get('/api/cases/export', async (req, res) => {
    try {
      const cases = await prisma.case.findMany({
        include: { reporter: true, clinicalEntries: true },
        orderBy: { createdAt: 'desc' }
      });
      res.json(cases);
    } catch (error) {
      res.status(500).json({ error: 'Failed to export cases' });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[${new Date().toISOString()}] Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
