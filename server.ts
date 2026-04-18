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

  // --- Animals ---
  app.post('/api/animals', async (req, res) => {
    try {
      const animal = await prisma.animal.create({ data: req.body });
      res.status(201).json(animal);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create animal' });
    }
  });

  app.patch('/api/animals/:id', async (req, res) => {
    try {
      const animal = await prisma.animal.update({
        where: { id: req.params.id },
        data: req.body
      });
      res.json(animal);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update animal' });
    }
  });

  app.delete('/api/animals/:id', async (req, res) => {
    try {
      await prisma.animal.delete({ where: { id: req.params.id } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete animal' });
    }
  });

  // --- Cases ---
  app.post('/api/cases', async (req, res) => {
    try {
      const newCase = await prisma.case.create({ data: req.body });
      res.status(201).json(newCase);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create case' });
    }
  });

  app.patch('/api/cases/:id', async (req, res) => {
    try {
      const updatedCase = await prisma.case.update({
        where: { id: req.params.id },
        data: req.body
      });
      res.json(updatedCase);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update case' });
    }
  });

  app.delete('/api/cases/:id', async (req, res) => {
    try {
      await prisma.case.delete({ where: { id: req.params.id } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete case' });
    }
  });

  // --- Wildlife ---
  app.post('/api/wildlife', async (req, res) => {
    try {
      const newCase = await prisma.wildlifeCase.create({ data: req.body });
      res.status(201).json(newCase);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create wildlife case' });
    }
  });

  app.delete('/api/wildlife/:id', async (req, res) => {
    try {
      await prisma.wildlifeCase.delete({ where: { id: req.params.id } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete wildlife case' });
    }
  });

  // --- Staff ---
  app.post('/api/staff', async (req, res) => {
    try {
      const staff = await prisma.staffMember.create({ data: req.body });
      res.status(201).json(staff);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create staff member' });
    }
  });

  app.patch('/api/staff/:id', async (req, res) => {
    try {
      const staff = await prisma.staffMember.update({
        where: { id: req.params.id },
        data: req.body
      });
      res.json(staff);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update staff member' });
    }
  });

  app.delete('/api/staff/:id', async (req, res) => {
    try {
      await prisma.staffMember.delete({ where: { id: req.params.id } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete staff member' });
    }
  });

  // --- Inventory: Medicines ---
  app.post('/api/inventory/medicines', async (req, res) => {
    try {
      const med = await prisma.medicine.create({ data: req.body });
      res.status(201).json(med);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create medicine' });
    }
  });

  app.patch('/api/inventory/medicines/:id', async (req, res) => {
    try {
      const med = await prisma.medicine.update({
        where: { id: req.params.id },
        data: req.body
      });
      res.json(med);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update medicine' });
    }
  });

  app.delete('/api/inventory/medicines/:id', async (req, res) => {
    try {
      await prisma.medicine.delete({ where: { id: req.params.id } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete medicine' });
    }
  });

  // --- Donations ---
  app.post('/api/donations', async (req, res) => {
    try {
      const donation = await prisma.donation.create({ data: req.body });
      res.status(201).json(donation);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create donation' });
    }
  });

  // --- Adoptions ---
  app.post('/api/adoptions/applications', async (req, res) => {
    try {
      const appRecord = await prisma.adoptionApplication.create({ data: req.body });
      res.status(201).json(appRecord);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create adoption application' });
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
