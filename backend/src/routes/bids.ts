import express, { Request, Response } from "express";
import { prisma } from "../lib/prisma";

const router = express.Router();



router.post("/active-ads", async (req: Request, res: Response): Promise<void> => {
  try {
    const { clerkUserId } = req.body;

    if (!clerkUserId || typeof clerkUserId !== "string") {
      res.status(400).json({ error: "Invalid user" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user || !user.roles.includes("buyer")) {
      res.status(403).json({ error: "Unauthorized user" });
      return;
    }

    const auctions = await prisma.auction.findMany({
      where: {
        status: "active",
        endTime: {
          gt: new Date(), // Optional: skip expired auctions
        },
      },
    });

    res.status(200).json({ success: true, auctions });
  } catch (err) {
    console.error("Error fetching active ads:", err);
    res.status(500).json({ error: "Server error" });
  }
});


export default router;