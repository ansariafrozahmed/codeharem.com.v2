import { Router } from "express";
import {
  getPublicProfile,
  updateProfile,
  changePassword,
  sendVerificationCode,
  verifyEmail,
} from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth";

const router: Router = Router();

// Public route
router.get("/profile/:username", getPublicProfile);

// Protected routes
router.patch("/profile", authenticate, updateProfile);
router.post("/change-password", authenticate, changePassword);
router.post("/send-verification", authenticate, sendVerificationCode);
router.post("/verify-email", authenticate, verifyEmail);

export default router;
