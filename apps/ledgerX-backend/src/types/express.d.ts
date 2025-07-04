
import 'express';

declare module 'express' {
  interface Request {
    user?: {
      id: string;
      role: 'USER' | 'ADMIN' | 'AUDITOR';
      [key: string]: any;  
      email?: string;
    };
  }
}

