import { RequestHandler, Router } from "express";
import { registerUser, loginUser, getUser, getAllUser } from "../controllers/userController";
import { authenticateJWT } from "../middleware/authMiddleware";

const router: Router = Router();

// Public routes
router.post("/register", registerUser as RequestHandler);  // POST /api/users/register
router.post("/login", loginUser as RequestHandler);        // POST /api/users/login
router.get("/me", authenticateJWT as RequestHandler, getUser as RequestHandler);  // GET /api/users/me
router.get("/all", authenticateJWT as RequestHandler, getAllUser as RequestHandler);  // GET /api/users/all
export default router;
