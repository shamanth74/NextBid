// validations/auction.ts

import { z } from "zod";

export const AuctionSchema = z.object({
  clerkUserId: z.string(),
  title: z.string().min(3, "Title is too short"),
  description: z.string().optional(),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid start time",
  }),
  endTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid end time",
  }),
  startingPrice: z.number().positive("Starting price must be positive"),
});

export type AuctionInput = z.infer<typeof AuctionSchema>;
