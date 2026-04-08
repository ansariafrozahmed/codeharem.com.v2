import pool from "../config/db";
import { hashPassword, comparePassword } from "../utils/hash";
import { AppError } from "../middlewares/errorHandler";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

interface AdminTokens {
  accessToken: string;
  refreshToken: string;
}

interface Admin {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

function generateAdminAccessToken(adminId: string): string {
  return jwt.sign({ adminId, role: "admin" }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  } as jwt.SignOptions);
}

function generateAdminRefreshToken(adminId: string): string {
  return jwt.sign({ adminId, role: "admin" }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  } as jwt.SignOptions);
}

export function verifyAdminAccessToken(token: string): { adminId: string; role: string } {
  const payload = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as {
    adminId: string;
    role: string;
  };
  if (payload.role !== "admin") throw new Error("Not an admin token");
  return payload;
}

export class AdminService {
  async login(email: string, password: string): Promise<AdminTokens> {
    const result = await pool.query(
      "SELECT id, password FROM admins WHERE email = $1",
      [email]
    );
    const admin = result.rows[0];

    if (!admin) {
      throw new AppError(401, "Invalid email or password");
    }

    const valid = await comparePassword(password, admin.password);
    if (!valid) {
      throw new AppError(401, "Invalid email or password");
    }

    const accessToken = generateAdminAccessToken(admin.id);
    const refreshToken = generateAdminRefreshToken(admin.id);

    return { accessToken, refreshToken };
  }

  async getMe(adminId: string): Promise<Admin> {
    const result = await pool.query(
      "SELECT id, email, name, created_at, updated_at FROM admins WHERE id = $1",
      [adminId]
    );
    const admin = result.rows[0];

    if (!admin) {
      throw new AppError(404, "Admin not found");
    }

    return admin;
  }

  async list(): Promise<Admin[]> {
    const result = await pool.query(
      "SELECT id, email, name, created_at, updated_at FROM admins ORDER BY created_at DESC"
    );
    return result.rows;
  }

  async seed(): Promise<void> {
    const existing = await pool.query("SELECT id FROM admins LIMIT 1");
    if (existing.rows.length > 0) return;

    const hashedPassword = await hashPassword("admin@123");
    await pool.query(
      "INSERT INTO admins (email, name, password) VALUES ($1, $2, $3)",
      ["admin@codeharem.com", "Admin", hashedPassword]
    );
    console.log("Admin seeded: admin@codeharem.com / admin@123");
  }
}

export const adminService = new AdminService();
