// src/routes/users.ts

import express, { Request, Response } from "express";
import {prisma} from "../lib/prisma";

const router = express.Router();

router.get("/check-role", async (req: Request, res: Response): Promise<void> => {
  const { clerkUserId } = req.query;

  if (!clerkUserId || typeof clerkUserId !== "string") {
    res.status(400).json({ error: "Missing or invalid clerkUserId" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      res.status(404).json({ hasRole: false, message: "User not found" });
      return;
    }

    const hasRole = user.roles.length > 0;
    res.json({ hasRole, roles: user.roles });
  } catch (err) {
    console.error("Error checking role:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/assign-role", async (req: Request, res: Response): Promise<void> => {
  const { clerkUserId, role } = req.body;

  if (!clerkUserId || typeof clerkUserId !== "string" || !role || typeof role !== "string") {
    res.status(400).json({ error: "Missing or invalid clerkUserId or role" });
    return;
  }

  try {
    const user = await prisma.user.update({
      where: { clerkUserId },
      data: {
        roles: {
          set: [role], // replaces entire array with one role
        },
      },
    });

    res.status(200).json({ success: true, message: "Role assigned", user });
  } catch (err) {
    console.error("Error assigning role:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


export default router;
