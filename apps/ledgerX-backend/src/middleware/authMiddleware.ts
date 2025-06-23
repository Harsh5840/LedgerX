import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET!);
    req.user = decoded as { id: string; role: 'USER' | 'ADMIN' | 'AUDITOR'; email?: string };
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
}
