import pool from "../config/db";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { AppError } from "../middlewares/errorHandler";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface OAuthInput {
  email: string;
  name: string | null;
  avatar: string | null;
  provider: "EMAIL" | "GOOGLE" | "GITHUB";
  providerId: string;
}

export class AuthService {
  async register(input: RegisterInput): Promise<AuthTokens> {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [input.email]);
    if (existing.rows.length > 0) {
      throw new AppError(409, "Email already registered");
    }

    const hashedPassword = await hashPassword(input.password);
    const result = await pool.query(
      "INSERT INTO users (email, name, password, provider) VALUES ($1, $2, $3, 'EMAIL') RETURNING id",
      [input.email, input.name, hashedPassword]
    );

    return this.generateTokens(result.rows[0].id);
  }

  async login(input: LoginInput): Promise<AuthTokens> {
    const result = await pool.query("SELECT id, password FROM users WHERE email = $1", [input.email]);
    const user = result.rows[0];

    if (!user || !user.password) {
      throw new AppError(401, "Invalid email or password");
    }

    const valid = await comparePassword(input.password, user.password);
    if (!valid) {
      throw new AppError(401, "Invalid email or password");
    }

    return this.generateTokens(user.id);
  }

  async oauthLogin(input: OAuthInput): Promise<AuthTokens> {
    const result = await pool.query("SELECT id, provider FROM users WHERE email = $1", [input.email]);
    let userId: string;

    if (result.rows.length > 0) {
      const user = result.rows[0];
      userId = user.id;

      if (user.provider === "EMAIL") {
        await pool.query(
          "UPDATE users SET provider = $1, provider_id = $2, avatar = COALESCE($3, avatar), is_verified = true, updated_at = now() WHERE id = $4",
          [input.provider, input.providerId, input.avatar, userId]
        );
      }
    } else {
      const insertResult = await pool.query(
        "INSERT INTO users (email, name, avatar, provider, provider_id, is_verified) VALUES ($1, $2, $3, $4, $5, true) RETURNING id",
        [input.email, input.name, input.avatar, input.provider, input.providerId]
      );
      userId = insertResult.rows[0].id;
    }

    return this.generateTokens(userId);
  }

  async refresh(token: string): Promise<AuthTokens> {
    const payload = verifyRefreshToken(token);

    const result = await pool.query(
      "SELECT id, user_id, expires_at FROM refresh_tokens WHERE token = $1",
      [token]
    );
    const storedToken = result.rows[0];

    if (!storedToken || new Date(storedToken.expires_at) < new Date()) {
      throw new AppError(401, "Invalid or expired refresh token");
    }

    // Delete old refresh token (rotation)
    await pool.query("DELETE FROM refresh_tokens WHERE id = $1", [storedToken.id]);

    return this.generateTokens(payload.userId);
  }

  async logout(token: string): Promise<void> {
    await pool.query("DELETE FROM refresh_tokens WHERE token = $1", [token]);
  }

  async getMe(userId: string) {
    const result = await pool.query(
      "SELECT id, email, name, avatar, provider, is_verified, created_at FROM users WHERE id = $1",
      [userId]
    );
    const user = result.rows[0];

    if (!user) {
      throw new AppError(404, "User not found");
    }

    return user;
  }

  private async generateTokens(userId: string): Promise<AuthTokens> {
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await pool.query(
      "INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES ($1, $2, $3)",
      [refreshToken, userId, expiresAt]
    );

    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
