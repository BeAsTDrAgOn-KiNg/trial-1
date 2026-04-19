import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';
import morgan from 'morgan';

// Route Imports
import authRoutes from './server/routes/auth.routes';
import animalRoutes from './server/routes/animal.routes';
import caseRoutes from './server/routes/case.routes';
import wildlifeRoutes from './server/routes/wildlife.routes';
import staffRoutes from './server/routes/staff.routes';
import inventoryRoutes from './server/routes/inventory.routes';
import medicalRoutes from './server/routes/medical.routes';
import donationRoutes from './server/routes/donation.routes';
import adoptionRoutes from './server/routes/adoption.routes';
import declarationRoutes from './server/routes/declaration.routes';
import userRoutes from './server/routes/user.routes';
import createMiscRouter from './server/routes/misc.routes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

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

  // --- API Routes ---
  app.use('/api/auth', authRoutes);
  app.use('/api/animals', animalRoutes);
  app.use('/api/cases', caseRoutes);
  app.use('/api/wildlife', wildlifeRoutes);
  app.use('/api/staff', staffRoutes);
  app.use('/api/inventory', inventoryRoutes);
  app.use('/api', medicalRoutes); // Mounted at root prefix to match /api/clinical-entries and /api/medicine-usages
  app.use('/api/donations', donationRoutes);
  app.use('/api/adoptions', adoptionRoutes);
  app.use('/api/declarations', declarationRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api', createMiscRouter(upload)); // Health, Upload, Stats, Search

  // --- Vite / Static Middleware setup ---
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
    console.log(`[${new Date().toISOString()}] Port: ${PORT}, Mode: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
