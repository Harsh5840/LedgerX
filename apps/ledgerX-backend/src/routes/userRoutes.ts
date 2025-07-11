import { RequestHandler, Router } from "express";
import { registerUser, loginUser, getUser } from "../controllers/userController";
import { authenticateJWT } from "../middleware/authMiddleware";

const router: Router = Router();

// Public routes
router.post("/register", registerUser as RequestHandler);  // POST /api/users/register
router.post("/login", loginUser as RequestHandler);        // POST /api/users/login
router.get("/me", authenticateJWT as RequestHandler, getUser as RequestHandler);  // GET /api/users/me

export default router;
