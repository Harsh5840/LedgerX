import express, { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router:Router = express.Router();

// 🔐 Generate JWT Token
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

// Step 1: Redirect to Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Step 2: Google redirects back to your backend
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    const token = signToken(req.user);

    // redirect back to frontend with token as query param
    res.redirect(`${process.env.FRONTEND_URL}/oauth?token=${token}`);
  }
);

// ==============================
// 🟣 GITHUB AUTH ROUTES
// ==============================

// Step 1: Redirect to GitHub
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

// Step 2: GitHub redirects back to your backend
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    const token = signToken(req.user);

    // redirect back to frontend with token as query param
    res.redirect(`${process.env.FRONTEND_URL}/oauth?token=${token}`);
  }
);

// ==============================
// 🚪 LOGOUT
// ==============================

router.get("/logout", (_req, res) => {
  // Just redirect — token is managed on frontend
  res.redirect(`${process.env.FRONTEND_URL}/login`);
});

export default router;
