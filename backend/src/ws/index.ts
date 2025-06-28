// backend/src/ws.ts
import WebSocket from "ws";
import { IncomingMessage } from "http";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface BidMessage {
  type: "NEW_BID";
  auctionId: string;
  bidderId: string;
  bidAmount: number;
}

const auctionRooms: Record<string, Set<WebSocket>> = {};

export function setupWebSocketServer(server: any) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", async (ws: WebSocket, req: IncomingMessage) => {
    console.log("🔗 New WebSocket connection");

    ws.on("message", async (data) => {
      try {
        const message: BidMessage = JSON.parse(data.toString());

        if (message.type === "NEW_BID") {
          const { auctionId, bidderId, bidAmount } = message;

          // 1. Validate bidder is a buyer
          const bidder = await prisma.user.findUnique({
            where: { clerkUserId: bidderId },
          });

          if (!bidder || !bidder.roles.includes("buyer")) {
            ws.send(JSON.stringify({ type: "ERROR", message: "Unauthorized bidder" }));
            return;
          }

          // 2. Save bid
          await prisma.bid.create({
            data: {
              auctionId,
              bidderId: bidder.id,
              bidAmount,
            },
          });

          // 3. Broadcast to all sockets in this auction room
          const room = auctionRooms[auctionId] || new Set();
          room.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: "BID_UPDATE",
                auctionId,
                bidAmount,
              }));
            }
          });

          // 4. Add this socket to the room if not already
          if (!auctionRooms[auctionId]) {
            auctionRooms[auctionId] = new Set();
          }
          auctionRooms[auctionId].add(ws);
        }
      } catch (err) {
        console.error("❌ Error handling message:", err);
      }
    });

    ws.on("close", () => {
      // Optional: remove ws from all auctionRooms
      for (const room of Object.values(auctionRooms)) {
        room.delete(ws);
      }
    });
  });
}
