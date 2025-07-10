import express, { Router, Request, Response } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router: Router = express.Router();

function signToken(user: any) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );
}

// ==============================
// 🟢 GOOGLE AUTH ROUTES
// ==============================

// Step 1: Redirect user to Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Step 2: Google redirects to callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req: Request, res: Response) => {
    const user = req.user as any;
    const token = signToken(user);
    res.redirect(`${process.env.FRONTEND_URL}/oauth?token=${token}`);
  }
);

// ==============================
// 🟣 GITHUB AUTH ROUTES
// ==============================

// Step 1: Redirect user to GitHub OAuth
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

// Step 2: GitHub redirects to callback
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: "/login" }),
  (req: Request, res: Response) => {
    const user = req.user as any;
    const token = signToken(user);
    res.redirect(`${process.env.FRONTEND_URL}/oauth?token=${token}`);
  }
);

// ==============================
// 🚪 LOGOUT (optional since JWT is stateless)
// ==============================
router.get("/logout", (_req: Request, res: Response) => {
  res.redirect(`${process.env.FRONTEND_URL}/login`);
});

export default router;
