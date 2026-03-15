import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
  getMe,
  googleRedirect,
  googleCallback,
  githubRedirect,
  githubCallback,
} from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth";

const router: Router = Router();

// Email/Password
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", authenticate, getMe);

// Google OAuth
router.get("/google", googleRedirect);
router.get("/google/callback", googleCallback);

// GitHub OAuth
router.get("/github", githubRedirect);
router.get("/github/callback", githubCallback);

export default router;
