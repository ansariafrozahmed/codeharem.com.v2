import { env } from "../config/env";
import { GoogleUserInfo, GitHubUserInfo, GitHubEmail } from "../types";
import { AppError } from "../middlewares/errorHandler";

export class OAuthService {
  // ─── Google ───

  getGoogleAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      redirect_uri: env.GOOGLE_REDIRECT_URI,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }

  async getGoogleUser(code: string): Promise<GoogleUserInfo> {
    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = (await tokenRes.json()) as { access_token?: string };
    if (!tokenData.access_token) {
      throw new AppError(400, "Failed to get Google access token");
    }

    // Get user info
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const user = (await userRes.json()) as GoogleUserInfo;
    if (!user.email) {
      throw new AppError(400, "Failed to get Google user info");
    }

    return user;
  }

  // ─── GitHub ───

  getGitHubAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID,
      redirect_uri: env.GITHUB_REDIRECT_URI,
      scope: "user:email",
    });
    return `https://github.com/login/oauth/authorize?${params}`;
  }

  async getGitHubUser(code: string): Promise<GitHubUserInfo & { email: string }> {
    // Exchange code for token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: env.GITHUB_REDIRECT_URI,
      }),
    });

    const tokenData = (await tokenRes.json()) as { access_token?: string };
    if (!tokenData.access_token) {
      throw new AppError(400, "Failed to get GitHub access token");
    }

    const accessToken = tokenData.access_token;

    // Get user info
    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const user = (await userRes.json()) as GitHubUserInfo;

    // Get email if not public
    let email = user.email;
    if (!email) {
      const emailRes = await fetch("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const emails = (await emailRes.json()) as GitHubEmail[];
      const primary = emails.find((e) => e.primary && e.verified);
      email = primary?.email || null;
    }

    if (!email) {
      throw new AppError(400, "GitHub account has no verified email");
    }

    return { ...user, email };
  }
}

export const oauthService = new OAuthService();
