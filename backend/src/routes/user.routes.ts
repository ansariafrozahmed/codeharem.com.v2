import { Router } from "express";
import {
  updateProfile,
  changePassword,
  sendVerificationCode,
  verifyEmail,
} from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth";

const router = Router();

// All routes are protected
router.use(authenticate);

router.patch("/profile", updateProfile);
router.post("/change-password", changePassword);
router.post("/send-verification", sendVerificationCode);
router.post("/verify-email", verifyEmail);

export default router;
