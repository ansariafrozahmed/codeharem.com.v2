import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import componentRoutes from "./component.routes";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/components", componentRoutes);

export default router;
