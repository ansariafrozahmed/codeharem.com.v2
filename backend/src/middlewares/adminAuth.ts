import { Response, NextFunction } from "express";
import { verifyAdminAccessToken } from "../services/admin.service";
import { AuthRequest } from "../types";

export interface AdminRequest extends AuthRequest {
  adminId?: string;
}

export function authenticateAdmin(
  req: AdminRequest,
  res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Access token required" });
    return;
  }

  try {
    const token = header.split(" ")[1];
    const payload = verifyAdminAccessToken(token);
    req.adminId = payload.adminId;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired admin token" });
  }
}
