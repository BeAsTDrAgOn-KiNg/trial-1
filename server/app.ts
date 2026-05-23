import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';
import morgan from 'morgan';

// Route Imports
import authRoutes from './routes/auth.routes';
import animalRoutes from './routes/animal.routes';
import caseRoutes from './routes/case.routes';
import wildlifeRoutes from './routes/wildlife.routes';
import staffRoutes from './routes/staff.routes';
import inventoryRoutes from './routes/inventory.routes';
import medicalRoutes from './routes/medical.routes';
import donationRoutes from './routes/donation.routes';
import adoptionRoutes from './routes/adoption.routes';
import declarationRoutes from './routes/declaration.routes';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';
import createMiscRouter from './routes/misc.routes';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + '-' + Math.round(Math.random() * 1e9);

    cb(
      null,
      uniqueSuffix + path.extname(file.originalname)
    );
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
app.use('/api', medicalRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/adoptions', adoptionRoutes);
app.use('/api/declarations', declarationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// ADMIN ROUTES
app.use('/api/admin', adminRoutes);

app.use('/api', createMiscRouter(upload));

export default app;