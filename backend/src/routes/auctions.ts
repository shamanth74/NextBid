// routes/auction.ts

import express, { Request, Response } from "express";
import { AuctionSchema } from "../validations/auctions";
import { prisma } from "../lib/prisma";

const router = express.Router();

router.post("/place-ad", async (req: Request, res: Response) : Promise<void> => {
  try {
    // 1. Validate input
    const parsed = AuctionSchema.safeParse(req.body);

    if (!parsed.success) {
       res.status(400).json({ error: parsed.error.format() });
       return;
    }

    const {
      clerkUserId,
      title,
      description,
      startTime,
      endTime,
      startingPrice,
    } = parsed.data;

    // 2. Check if user is a seller
    const seller = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!seller || !seller.roles.includes("seller")) {
       res.status(403).json({ error: "Only sellers can place ads." });
       return;
    }

    // 3. Create auction
    const newAuction = await prisma.auction.create({
      data: {
        sellerId:seller.id,
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        startingPrice,
        status: "active",
      },
    });

    res.status(201).json({ success: true, auction: newAuction });
  } catch (err) {
    console.error("Error placing ad:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Only display ads of particular seller 
router.get("/get-ads",async(req:Request,res:Response):Promise<void>=>{
    try{
        const {clerkUserId}=req.body;
    if (!clerkUserId) {
      res.status(400).json({ error: "Missing clerkUserId" });
      return;
    }
    const seller = await prisma.user.findUnique({
      where: { clerkUserId },
    });
    if(!seller || !seller.roles.includes("seller")){
        res.status(403).json({error:"Invalid or unauthorized userId"});
        return;
    }
    const auctions=await prisma.auction.findMany({
        where: { sellerId:seller.id },
    });
    res.status(200).json({ success: true, auctions });
    }catch(err){
        console.error("Error fetching ads:", err);
    res.status(500).json({ error: "Internal server error" });
    }
    

})



export default router;
