import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import componentRoutes from "./component.routes";
import blogRoutes from "./blog.routes";
import adminRoutes from "./admin.routes";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/components", componentRoutes);
router.use("/blogs", blogRoutes);
router.use("/admin", adminRoutes);

export default router;
