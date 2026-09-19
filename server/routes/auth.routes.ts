import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../db';
import { sendError } from '../utils';
import { issueAuthToken } from '../auth/token';

const router = Router();

router.post('/register', async (req, res) => {
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

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (user.isActive === false) {
      return res.status(403).json({ error: 'This account has been deactivated. Please contact an administrator.' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const { password: _, ...userWithoutPassword } = user;
    const token = issueAuthToken(user.id, user.role);
    res.json({ ...userWithoutPassword, token });
  } catch (error) {
    sendError(res, error, 'Login failed');
  }
});

export default router;
