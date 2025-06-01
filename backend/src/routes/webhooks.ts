import express from 'express';
import { PrismaClient } from '@prisma/client';
import bodyParser from 'body-parser';
import { Request, Response } from 'express';

const router = express.Router();
const prisma = new PrismaClient();


router.post('/clerk', bodyParser.json(), async (req: Request, res: Response): Promise<void> =>  {
  const event = req.body;

  if (event.type === 'user.created') {
    const user = event.data;

    try {
      await prisma.user.upsert({
        where: { clerkUserId: user.id },
        update: {}, // no update for now
        create: {
          clerkUserId: user.id,
          name: user.first_name + ' ' + user.last_name,
          email: user.email_addresses[0].email_address,
          roles: [], 
        },
      });

        res.status(200).json({ message: 'User created in DB.' });
        return;
    } catch (err) {
      console.error('Error creating user:', err);
        res.status(500).json({ message: 'Error creating user.' });
    }
  }

  res.status(200).json({ message: 'Webhook received.' });
});

export default router;
