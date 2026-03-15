import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { componentService } from "../services/component.service";
import { AuthRequest } from "../types";

const createSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  styling: z.enum(["css", "tailwind"]),
  htmlCode: z.string().default(""),
  cssCode: z.string().default(""),
  jsCode: z.string().default(""),
  headContent: z.string().default(""),
  externalCss: z.array(z.string()).default([]),
  externalJs: z.array(z.string()).default([]),
  status: z.enum(["draft", "published"]).default("draft"),
});

const updateSchema = createSchema.partial();

const listQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(50).optional(),
});

export async function createComponent(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = createSchema.parse(req.body);
    const component = await componentService.create(req.userId!, data);
    res.status(201).json(component);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ message: err.issues[0].message });
      return;
    }
    next(err);
  }
}

export async function getComponent(req: Request, res: Response, next: NextFunction) {
  try {
    const component = await componentService.getBySlug(req.params.slug as string);
    res.json(component);
  } catch (err) {
    next(err);
  }
}

export async function updateComponent(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = updateSchema.parse(req.body);
    const component = await componentService.update(req.params.slug as string, req.userId!, data);
    res.json(component);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ message: err.issues[0].message });
      return;
    }
    next(err);
  }
}

export async function deleteComponent(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await componentService.delete(req.params.slug as string, req.userId!);
    res.json({ message: "Component deleted" });
  } catch (err) {
    next(err);
  }
}

export async function listPublished(req: Request, res: Response, next: NextFunction) {
  try {
    const options = listQuerySchema.parse(req.query);
    const result = await componentService.listPublished(options);
    res.json(result);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ message: err.issues[0].message });
      return;
    }
    next(err);
  }
}

export async function listMyComponents(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const status = req.query.status as "draft" | "published" | undefined;
    const components = await componentService.listByUser(req.userId!, status);
    res.json(components);
  } catch (err) {
    next(err);
  }
}

export async function incrementViews(req: Request, res: Response, next: NextFunction) {
  try {
    await componentService.incrementViews(req.params.slug as string);
    res.json({ message: "Views incremented" });
  } catch (err) {
    next(err);
  }
}
