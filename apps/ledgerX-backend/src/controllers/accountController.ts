import { Request, Response } from "express";
import {
  createAccount,
  getAccountsByUser,
  deleteAccountById,
} from "../services/accountService";

export const handleCreateAccount = async (req: Request, res: Response) => {
  try {
    const { userId, name, type } = req.body;
    const account = await createAccount(userId, name, type);
    res.status(201).json({ success: true, account });
  } catch (error) {
    console.error("Failed to create account:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const handleGetAccounts = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const accounts = await getAccountsByUser(userId);
    res.status(200).json({ success: true, accounts });
  } catch (error) {
    console.error("Failed to fetch accounts:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const handleDeleteAccount = async (req: Request, res: Response) => {
  try {
    const accountId = req.params.id;
    await deleteAccountById(accountId);
    res.status(200).json({ success: true, message: "Account deleted" });
  } catch (error) {
    console.error("Failed to delete account:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
