import { RequestHandler, Router } from "express";
import {
  handleCreateAccount,
  handleGetUserAccounts,
  handleGetAccountById,
  handleDeleteAccount,
  handleUpdateAccountName,
} from "../controllers/accountController";

const router: Router = Router();

router.post("/", handleCreateAccount);                    // POST /api/accounts
router.get("/user/:userId", handleGetUserAccounts);       // GET /api/accounts/user/:userId
router.get("/:accountId", handleGetAccountById as RequestHandler);  // GET /api/accounts/:accountId
router.delete("/:accountId", handleDeleteAccount);        // DELETE /api/accounts/:accountId
router.put("/:accountId", handleUpdateAccountName);       // PUT /api/accounts/:accountId

export default router;
