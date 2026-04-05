import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { blogService } from "../services/blog.service";

const listQuerySchema = z.object({
  category: z.string().optional(),
  tag: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(50).optional(),
});

export async function listPublishedBlogs(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const options = listQuerySchema.parse(req.query);
    const result = await blogService.listPublished(options);
    res.json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ message: err.issues[0].message });
      return;
    }
    next(err);
  }
}

export async function getBlog(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const blog = await blogService.getBySlug(req.params.slug as string);
    res.json(blog);
  } catch (err) {
    next(err);
  }
}

export async function incrementBlogViews(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await blogService.incrementViews(req.params.slug as string);
    res.json({ message: "Views incremented" });
  } catch (err) {
    next(err);
  }
}
