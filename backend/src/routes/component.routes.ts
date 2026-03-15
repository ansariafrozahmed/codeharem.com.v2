import { Router } from "express";
import {
  createComponent,
  getComponent,
  updateComponent,
  deleteComponent,
  listPublished,
  listMyComponents,
  incrementViews,
} from "../controllers/component.controller";
import { authenticate } from "../middlewares/auth";

const router: Router = Router();

// Public routes
router.get("/", listPublished);

// Protected routes (before /:slug to avoid conflicts)
router.post("/", authenticate, createComponent);
router.get("/mine", authenticate, listMyComponents);

// Param routes
router.get("/:slug", getComponent);
router.post("/:slug/views", incrementViews);
router.patch("/:slug", authenticate, updateComponent);
router.delete("/:slug", authenticate, deleteComponent);

export default router;
