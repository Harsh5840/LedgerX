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

const router: Router = Router();

router.use(authenticateJWT as RequestHandler); // Apply JWT authentication middleware to all routes

router.post("/", requireRole('ADMIN', 'USER') as RequestHandler, handleCreateAccount);  // POST /api/accounts
router.get("/user/:userId", requireRole('ADMIN', 'USER')  as RequestHandler, handleGetUserAccounts);  // GET /api/accounts/user/:userId
router.get("/:accountId", requireRole('ADMIN', 'USER') as RequestHandler, handleGetAccountById as RequestHandler);  // GET /api/accounts/:accountId
router.delete("/:accountId", requireRole('ADMIN', 'USER') as RequestHandler, handleDeleteAccount as RequestHandler);        // DELETE /api/accounts/:accountId
router.put("/:accountId", requireRole('ADMIN', 'USER') as RequestHandler, handleUpdateAccountName as RequestHandler);       // PUT /api/accounts/:accountId

export default router;
