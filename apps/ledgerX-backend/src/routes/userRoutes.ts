import { RequestHandler, Router } from "express";
import { registerUser, loginUser } from "../controllers/userController";

const router: Router = Router();

// Public routes
router.post("/register", registerUser as RequestHandler);  // POST /api/users/register
router.post("/login", loginUser as RequestHandler);        // POST /api/users/login

export default router;
