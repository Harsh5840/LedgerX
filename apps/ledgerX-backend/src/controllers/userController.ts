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
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json( { user: { id: user.id, email: user.email, role: user.role } });
};

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        accounts: true,
        transactions: true,
        _count: {
          select: {
            accounts: true,
            transactions: true
          }
        }
      }
    });

    // Enhance user data with computed fields for admin view
    const enhancedUsers = users.map((user: any) => {
      const totalVolume = user.transactions.reduce((sum: number, tx: any) => sum + Math.abs(tx.amount), 0);
      const avgRiskScore = user.transactions.length > 0 
        ? user.transactions.reduce((sum: number, tx: any) => sum + (tx.riskScore || 0), 0) / user.transactions.length 
        : 0;

      return {
        id: user.id,
        name: user.name || 'Unknown User',
        email: user.email,
        role: user.role,
        status: 'active', // Default status - could be enhanced with actual status logic
        riskScore: Math.round(avgRiskScore),
        totalVolume: Math.round(totalVolume),
        totalTransactions: user._count.transactions,
        accountsCount: user._count.accounts,
        kycStatus: 'verified', // Default - could be enhanced with actual KYC logic
        joinDate: user.createdAt.toISOString().split('T')[0],
        lastLogin: user.updatedAt.toISOString().split('T')[0],
        location: 'N/A', // Could be enhanced with actual location data
        avatar: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    });

    res.json(enhancedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};