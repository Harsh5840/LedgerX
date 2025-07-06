import { RequestHandler, Router } from "express";
import {
  handleCreateAccount,
  handleGetUserAccounts,
  handleGetAccountById,
  handleDeleteAccount,
  handleUpdateAccountName,
} from "../controllers/accountController";

import { authenticateJWT } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";

const router:Router = Router();

// 🔐 Apply JWT auth to all account routes
router.use(authenticateJWT as RequestHandler);

// 📦 Accounts CRUD routes (for ADMIN + USER roles)
const allowedRoles = requireRole("ADMIN", "USER");

router.post("/", allowedRoles as RequestHandler, handleCreateAccount);  // POST /api/accounts
router.get("/user/:userId", allowedRoles as RequestHandler, handleGetUserAccounts);  // GET /api/accounts/user/:userId
router.get("/:accountId", allowedRoles as RequestHandler, handleGetAccountById as RequestHandler);  // GET /api/accounts/:accountId
router.delete("/:accountId", allowedRoles as RequestHandler, handleDeleteAccount);   // DELETE /api/accounts/:accountId
router.put("/:accountId", allowedRoles as RequestHandler, handleUpdateAccountName);  // PUT /api/accounts/:accountId

export default router;
