import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../db";
import { sendError } from "../utils";

const router = Router();

/**
 * GET /api/users
 * Get all users
 */
router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        fullName: "asc",
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    res.json(users);
  } catch (error) {
    sendError(res, error, "Failed to fetch users");
  }
});

/**
 * POST /api/users
 * Create a new user
 */
router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      role,
    } = req.body;

    // Basic validation
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({
        error: "Full name, email, password and role are required",
      });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        error: "A user with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        phone: phone || null,
        role,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    sendError(res, error, "Failed to create user");
  }
});

/**
 * PUT /api/users/:id
 * Update an existing user
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      fullName,
      email,
      password,
      phone,
      role,
    } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Check email uniqueness if email is being changed
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (emailExists) {
        return res.status(409).json({
          error: "A user with this email already exists",
        });
      }
    }

    const updateData: {
      fullName?: string;
      email?: string;
      phone?: string | null;
      role?: string;
      password?: string;
    } = {};

    if (fullName !== undefined) {
      updateData.fullName = fullName;
    }

    if (email !== undefined) {
      updateData.email = email;
    }

    if (phone !== undefined) {
      updateData.phone = phone || null;
    }

    if (role !== undefined) {
      updateData.role = role;
    }

    // Password is optional during update
    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    sendError(res, error, "Failed to update user");
  }
});

/**
 * DELETE /api/users/:id
 * Delete a user
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });

    res.status(204).send();
  } catch (error) {
    sendError(res, error, "Failed to delete user");
  }
});

export default router;