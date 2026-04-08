import { Request, Response, NextFunction } from "express";
import { adminService } from "../services/admin.service";
import { AdminRequest } from "../middlewares/adminAuth";
import { env } from "../config/env";

const ADMIN_REFRESH_COOKIE = "admin_refresh_token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export class AdminController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
      }

      const tokens = await adminService.login(email, password);

      res.cookie(ADMIN_REFRESH_COOKIE, tokens.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: COOKIE_MAX_AGE,
        path: "/",
      });

      res.json({ accessToken: tokens.accessToken });
    } catch (err) {
      next(err);
    }
  }

  async logout(_req: Request, res: Response) {
    res.clearCookie(ADMIN_REFRESH_COOKIE, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    res.json({ message: "Logged out" });
  }

  async me(req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const admin = await adminService.getMe(req.adminId!);
      res.json(admin);
    } catch (err) {
      next(err);
    }
  }

  async list(_req: AdminRequest, res: Response, next: NextFunction) {
    try {
      const admins = await adminService.list();
      res.json({ admins });
    } catch (err) {
      next(err);
    }
  }
}

export const adminController = new AdminController();
