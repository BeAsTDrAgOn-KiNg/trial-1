import { Request, Response, NextFunction } from "express";
import { prisma } from "../db";

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.query.userId as string | undefined;

    if (!userId) {
      return res.status(401).json({
        error: "User ID is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: "User not found",
      });
    }

    if (user.role !== "Admin") {
      return res.status(403).json({
        error: "Admin access required",
      });
    }

    next();
  } catch (error) {
    console.error("Admin authorization error:", error);

    return res.status(500).json({
      error: "Failed to verify user permissions",
    });
  }
};