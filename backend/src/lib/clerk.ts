import { Request, Response, NextFunction } from 'express';
import { clerkClient } from '@clerk/clerk-sdk-node';

export interface AuthenticatedRequest extends Request {
  clerkUser?: {
    id: string;
    email: string;
    firstName: string;
  };
}

export async function clerkAuthMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Missing Authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify the session token and retrieve session information
    const session = await clerkClient.sessions.verifySession(token);

    if (!session || !session.userId) {
      return res.status(401).json({ error: 'Invalid session token' });
    }

    // Retrieve user information using the userId from the session
    const user = await clerkClient.users.getUser(session.userId);

    req.clerkUser = {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      firstName: user.firstName || '',
    };

    next();
  } catch (error) {
    console.error('Clerk authentication error:', error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
