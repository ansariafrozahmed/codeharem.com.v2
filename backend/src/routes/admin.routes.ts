import { Router } from "express";
import { adminController } from "../controllers/admin.controller";
import { authenticateAdmin } from "../middlewares/adminAuth";

const router: Router = Router();

router.post("/auth/login", (req, res, next) => adminController.login(req, res, next));
router.post("/auth/logout", (req, res) => adminController.logout(req, res));
router.get("/auth/me", authenticateAdmin, (req, res, next) => adminController.me(req, res, next));
router.get("/admins", authenticateAdmin, (req, res, next) => adminController.list(req, res, next));

export default router;
