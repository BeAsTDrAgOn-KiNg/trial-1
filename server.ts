import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Example API route for animals
  app.get('/api/animals', async (req, res) => {
    try {
      const animals = await prisma.animal.findMany({
        orderBy: { createdAt: 'desc' }
      });
      res.json(animals);
    } catch (error) {
      console.error('Error fetching animals:', error);
      res.status(500).json({ error: 'Failed to fetch animals' });
    }
  });

  app.get('/api/wildlife', async (req, res) => {
    try {
      const cases = await prisma.wildlifeCase.findMany({
        orderBy: { createdAt: 'desc' }
      });
      res.json(cases);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch wildlife cases' });
    }
  });

  app.get('/api/staff', async (req, res) => {
    try {
      const staff = await prisma.staffMember.findMany({
        orderBy: { name: 'asc' }
      });
      res.json(staff);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch staff' });
    }
  });

  app.get('/api/inventory/medicines', async (req, res) => {
    try {
      const medicines = await prisma.medicine.findMany({
        orderBy: { name: 'asc' }
      });
      res.json(medicines);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch medicines' });
    }
  });

  app.get('/api/inventory/housekeeping', async (req, res) => {
    try {
      const items = await prisma.housekeepingSupply.findMany({
        orderBy: { name: 'asc' }
      });
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch housekeeping' });
    }
  });

  app.get('/api/donations', async (req, res) => {
    try {
      const donations = await prisma.donation.findMany({
        orderBy: { createdAt: 'desc' }
      });
      res.json(donations);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch donations' });
    }
  });

  app.get('/api/adoptions/applications', async (req, res) => {
    try {
      const apps = await prisma.adoptionApplication.findMany({
        orderBy: { createdAt: 'desc' }
      });
      res.json(apps);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch applications' });
    }
  });

  // Example API route for cases
  app.get('/api/cases', async (req, res) => {
    try {
      const cases = await prisma.case.findMany({
        include: { reporter: true },
        orderBy: { createdAt: 'desc' }
      });
      res.json(cases);
    } catch (error) {
      console.error('Error fetching cases:', error);
      res.status(500).json({ error: 'Failed to fetch cases' });
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
