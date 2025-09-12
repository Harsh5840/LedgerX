import dotenv from "dotenv";
dotenv.config();

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not set");
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set");

export const JWT_SECRET = process.env.JWT_SECRET;