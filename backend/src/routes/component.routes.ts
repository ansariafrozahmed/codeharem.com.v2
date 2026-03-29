import { Router } from "express";
import {
  createComponent,
  getComponent,
  updateComponent,
  deleteComponent,
  listPublished,
  listMyComponents,
  incrementViews,
  toggleLike,
  checkLiked,
  checkLikedBatch,
} from "../controllers/component.controller";
import { authenticate } from "../middlewares/auth";

const router: Router = Router();

// Public routes
router.get("/", listPublished);

// Protected routes (before /:slug to avoid conflicts)
router.post("/", authenticate, createComponent);
router.get("/mine", authenticate, listMyComponents);
router.post("/liked-batch", authenticate, checkLikedBatch);

// Param routes
router.get("/:slug", getComponent);
router.post("/:slug/views", incrementViews);
router.post("/:slug/like", authenticate, toggleLike);
router.get("/:slug/liked", authenticate, checkLiked);
router.patch("/:slug", authenticate, updateComponent);
router.delete("/:slug", authenticate, deleteComponent);

export default router;
