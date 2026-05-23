import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET ALL USERS
 */
router.get('/profiles', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(users);
  } catch (error) {
    console.error('GET USERS ERROR:', error);
    res.status(500).json({
      error: 'Failed to fetch profiles'
    });
  }
});

/**
 * GET SINGLE USER
 */
router.get('/profiles/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'Profile not found'
      });
    }

    res.json(user);
  } catch (error) {
    console.error('GET USER ERROR:', error);
    res.status(500).json({
      error: 'Failed to fetch profile'
    });
  }
});

/**
 * CREATE USER
 */
router.post('/profiles', async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      role
    } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        error: 'Full name, email and password are required'
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'Email already exists'
      });
    }

    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password,
        phone,
        role
      }
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('CREATE USER ERROR:', error);
    res.status(500).json({
      error: 'Failed to create profile'
    });
  }
});

/**
 * UPDATE USER
 */
router.put('/profiles/:id', async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      role
    } = req.body;

    const updatedUser = await prisma.user.update({
      where: {
        id: req.params.id
      },
      data: {
        fullName,
        email,
        phone,
        role
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('UPDATE USER ERROR:', error);
    res.status(500).json({
      error: 'Failed to update profile'
    });
  }
});

/**
 * DELETE USER
 */
router.delete('/profiles/:id', async (req, res) => {
  try {
    await prisma.user.delete({
      where: {
        id: req.params.id
      }
    });

    res.json({
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    console.error('DELETE USER ERROR:', error);
    res.status(500).json({
      error: 'Failed to delete profile'
    });
  }
});

export default router;