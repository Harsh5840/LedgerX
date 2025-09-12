// types/express/index.d.ts

export {};

declare global {
  namespace Express {
    interface User {
      id: string;
      role: "USER" | "ADMIN" | "AUDITOR";
      email?: string;
      [key: string]: any;
    }

    interface Request {
      user?: User;
    }
  }
}
