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
  // --- Auth ---
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { full_name, email, phone, role, password } = req.body;
      const user = await prisma.user.create({
        data: { fullName: full_name, email, phone, role }
      });
      // In a real app we would hash passwords, but keeping it simple for now
      res.status(201).json(user);
    } catch (error: any) {
      if (error.code === 'P2002') return res.status(400).json({ error: 'Email already exists' });
      res.status(500).json({ error: 'Registration failed' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      // Simple logic for the demo environment
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
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
      const entry = await prisma.clinicalEntry.create({ data: req.body });
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
      const record = await prisma.aBCRecord.create({ data: req.body });
      res.status(201).json(record);
    } catch (error) {
      res.status(500).json({ error: 'Failed' });
    }
  });

  app.patch('/api/abc-records/:id', async (req, res) => {
    try {
      const record = await prisma.aBCRecord.update({
        where: { id: req.params.id },
        data: req.body
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
      const item = await prisma.housekeepingSupply.create({ data: req.body });
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: 'Failed' });
    }
  });

  app.patch('/api/inventory/housekeeping/:id', async (req, res) => {
    try {
      const item = await prisma.housekeepingSupply.update({
        where: { id: req.params.id },
        data: req.body
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

  app.post('/api/medicine-usages', async (req, res) => {
    try {
      const usage = await prisma.medicineUsage.create({ data: req.body });
      res.status(201).json(usage);
    } catch (error) {
      res.status(500).json({ error: 'Failed' });
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

  // --- Declarations ---
  app.get('/api/declarations', async (req, res) => {
    try {
      const decls = await prisma.declaration.findMany({ orderBy: { createdAt: 'desc' } });
      res.json(decls);
    } catch (error) {
      res.status(500).json({ error: 'Failed' });
    }
  });

  app.post('/api/declarations', async (req, res) => {
    try {
      const decl = await prisma.declaration.create({ data: req.body });
      res.status(201).json(decl);
    } catch (error) {
      res.status(500).json({ error: 'Failed' });
    }
  });

  app.delete('/api/declarations/:id', async (req, res) => {
    try {
      await prisma.declaration.delete({ where: { id: req.params.id } });
      res.status(204).send();
    } catch (error) {
       res.status(500).json({ error: 'Failed' });
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
      res.status(500).json({ error: 'Failed' });
    }
  });

  app.post('/api/adoptions', async (req, res) => {
    try {
      const adoption = await prisma.adoption.create({ data: req.body });
      res.status(201).json(adoption);
    } catch (error) {
      res.status(500).json({ error: 'Failed' });
    }
  });

  app.delete('/api/adoptions/:id', async (req, res) => {
    try {
      await prisma.adoption.delete({ where: { id: req.params.id } });
      res.status(204).send();
    } catch (error) {
       res.status(500).json({ error: 'Failed' });
    }
  });

  // --- Inventory: General Items ---
  app.get('/api/inventory/items', async (req, res) => {
    try {
      const items = await prisma.inventoryItem.findMany({ orderBy: { name: 'asc' } });
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: 'Failed' });
    }
  });

  app.post('/api/inventory/items', async (req, res) => {
    try {
      const item = await prisma.inventoryItem.create({ data: req.body });
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: 'Failed' });
    }
  });

  app.patch('/api/inventory/items/:id', async (req, res) => {
    try {
      const item = await prisma.inventoryItem.update({
        where: { id: req.params.id },
        data: req.body
      });
      res.json(item);
    } catch (error) {
       res.status(500).json({ error: 'Failed' });
    }
  });

  app.delete('/api/inventory/items/:id', async (req, res) => {
    try {
      await prisma.inventoryItem.delete({ where: { id: req.params.id } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed' });
    }
  });

  // --- User Profiles ---
  app.get('/api/users', async (req, res) => {
    try {
      const users = await prisma.user.findMany({ orderBy: { fullName: 'asc' } });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Failed' });
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
