import { Router } from "express";
import {
  handleCreateAccount,
  handleDeleteAccount,
  handleGetAccounts,
} from "../controllers/accountController";

const router: Router = Router();

router.post("/", handleCreateAccount);          // POST /api/accounts
router.get("/:userId", handleGetAccounts);      // GET /api/accounts/:userId
router.delete("/:id", handleDeleteAccount);     // DELETE /api/accounts/:id

export default router;
