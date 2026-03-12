import pool from "../config/db";
import { hashPassword, comparePassword } from "../utils/hash";
import { sendVerificationEmail } from "../utils/mailer";
import { AppError } from "../middlewares/errorHandler";

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export class UserService {
  async updateProfile(userId: string, data: { name?: string }) {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${idx++}`);
      values.push(data.name);
    }

    if (fields.length === 0) {
      throw new AppError(400, "No fields to update");
    }

    fields.push(`updated_at = now()`);
    values.push(userId);

    const result = await pool.query(
      `UPDATE users SET ${fields.join(", ")} WHERE id = $${idx} RETURNING id, email, name, avatar, provider, is_verified, created_at`,
      values
    );

    if (result.rows.length === 0) {
      throw new AppError(404, "User not found");
    }

    return result.rows[0];
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const result = await pool.query("SELECT password, provider FROM users WHERE id = $1", [userId]);
    const user = result.rows[0];

    if (!user) {
      throw new AppError(404, "User not found");
    }

    if (user.provider !== "EMAIL" || !user.password) {
      throw new AppError(400, "Cannot change password for OAuth accounts");
    }

    const valid = await comparePassword(currentPassword, user.password);
    if (!valid) {
      throw new AppError(401, "Current password is incorrect");
    }

    const hashed = await hashPassword(newPassword);
    await pool.query("UPDATE users SET password = $1, updated_at = now() WHERE id = $2", [hashed, userId]);
  }

  async sendVerificationCode(userId: string) {
    const userResult = await pool.query("SELECT email, is_verified FROM users WHERE id = $1", [userId]);
    const user = userResult.rows[0];

    if (!user) {
      throw new AppError(404, "User not found");
    }

    if (user.is_verified) {
      throw new AppError(400, "Email already verified");
    }

    // Delete old codes for this user
    await pool.query("DELETE FROM verification_codes WHERE user_id = $1", [userId]);

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await pool.query(
      "INSERT INTO verification_codes (user_id, code, expires_at) VALUES ($1, $2, $3)",
      [userId, code, expiresAt]
    );

    await sendVerificationEmail(user.email, code);
  }

  async verifyEmail(userId: string, code: string) {
    const result = await pool.query(
      "SELECT id, expires_at FROM verification_codes WHERE user_id = $1 AND code = $2",
      [userId, code]
    );
    const record = result.rows[0];

    if (!record) {
      throw new AppError(400, "Invalid verification code");
    }

    if (new Date(record.expires_at) < new Date()) {
      await pool.query("DELETE FROM verification_codes WHERE id = $1", [record.id]);
      throw new AppError(400, "Verification code has expired");
    }

    // Mark user as verified and clean up
    await pool.query("UPDATE users SET is_verified = true, updated_at = now() WHERE id = $1", [userId]);
    await pool.query("DELETE FROM verification_codes WHERE user_id = $1", [userId]);
  }
}

export const userService = new UserService();
