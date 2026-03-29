import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { userService } from "../services/user.service";
import { componentService } from "../services/component.service";
import { AuthRequest } from "../types";

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").optional(),
  username: z.string().min(3).max(30).optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

const verifyCodeSchema = z.object({
  code: z.string().length(6, "Code must be 6 digits"),
});

export async function getPublicProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const username = req.params.username as string;
    const profile = await userService.getPublicProfile(username);

    // Get user's published components
    const components = await componentService.listByUser(profile.id, "published");

    res.json({ ...profile, components });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = updateProfileSchema.parse(req.body);
    const user = await userService.updateProfile(req.userId!, data);
    res.json(user);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ message: err.issues[0].message });
      return;
    }
    next(err);
  }
}

export async function changePassword(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = changePasswordSchema.parse(req.body);
    await userService.changePassword(req.userId!, data.currentPassword, data.newPassword);
    res.json({ message: "Password updated" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ message: err.issues[0].message });
      return;
    }
    next(err);
  }
}

export async function sendVerificationCode(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await userService.sendVerificationCode(req.userId!);
    res.json({ message: "Verification code sent" });
  } catch (err) {
    next(err);
  }
}

export async function verifyEmail(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = verifyCodeSchema.parse(req.body);
    await userService.verifyEmail(req.userId!, data.code);
    res.json({ message: "Email verified" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ message: err.issues[0].message });
      return;
    }
    next(err);
  }
}
