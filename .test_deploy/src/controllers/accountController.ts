import { Request, Response } from "express";
import {
  createAccount,
  getUserAccounts,
  getAccountById,
  deleteAccount,
  updateAccountName,
} from "../services/accountService";

// ✅ User or Admin creating their own account
export const handleCreateAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, type } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const account = await createAccount(userId, name, type);
    res.status(201).json({ success: true, account });
  } catch (error) {
    console.error("Failed to create account:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// ✅ Authenticated user fetching their own accounts
export const handleGetUserAccountsSelf = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const accounts = await getUserAccounts(userId);
    res.status(200).json({ success: true, accounts });
  } catch (error) {
    console.error("Failed to get user's own accounts:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// ✅ Admin fetching any user's accounts
export const handleGetUserAccountsByAdmin = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const accounts = await getUserAccounts(userId as string);
    res.status(200).json({ success: true, accounts });
  } catch (error) {
    console.error("Failed to get user accounts by admin:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const handleGetAccountById = async (req: Request, res: Response) => {
  try {
    const { accountId } = req.params;
    const account = await getAccountById(accountId as string);
    if (!account) {
      return res.status(404).json({ success: false, error: "Account not found" });
    }
    res.status(200).json({ success: true, account });
  } catch (error) {
    console.error("Failed to get account by ID:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const handleDeleteAccount = async (req: Request, res: Response) => {
  try {
    const { accountId } = req.params;
    await deleteAccount(accountId as string );
    res.status(200).json({ success: true, message: "Account deleted" });
  } catch (error) {
    console.error("Failed to delete account:", error); 
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const handleUpdateAccountName = async (req: Request, res: Response) => {
  try {
    const { accountId } = req.params;
    const { name } = req.body;
    const account = await updateAccountName(accountId as string, name);
    res.status(200).json({ success: true, account });
  } catch (error) {
    console.error("Failed to update account name:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
