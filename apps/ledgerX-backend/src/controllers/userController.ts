import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@ledgerX/db";
import { Role } from "@ledgerX/db";
import { JWT_SECRET as JWT } from "../config/env";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "User already exists" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role: role ?? Role.USER,
        password: hashedPassword,
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT as string,
      { expiresIn: "7d" }
    );

    // Return token and user info
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};


export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    console.log("🔑 Valid:", valid);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT as string, { expiresIn: "7d" });

    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Login failedddds" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  console.log("🔑 User:", user);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  console.log("hiiiiiiiiii");
  res.json( { user: { id: user.id, email: user.email, role: user.role } });
};

export const getAllUser = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
};