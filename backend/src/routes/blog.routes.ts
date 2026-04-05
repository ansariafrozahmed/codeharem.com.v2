import { Router } from "express";
import {
  listPublishedBlogs,
  getBlog,
  incrementBlogViews,
} from "../controllers/blog.controller";

const router: Router = Router();

// Public routes
router.get("/", listPublishedBlogs);
router.get("/:slug", getBlog);
router.post("/:slug/views", incrementBlogViews);

export default router;
