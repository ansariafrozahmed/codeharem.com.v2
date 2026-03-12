import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { authService } from "../services/auth.service";
import { oauthService } from "../services/oauth.service";
import { setRefreshTokenCookie, clearRefreshTokenCookie } from "../utils/cookies";
import { AuthRequest } from "../types";
import { env } from "../config/env";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const data = registerSchema.parse(req.body);
    const tokens = await authService.register(data);
    setRefreshTokenCookie(res, tokens.refreshToken);
    res.status(201).json({ accessToken: tokens.accessToken });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ message: err.issues[0].message });
      return;
    }
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const data = loginSchema.parse(req.body);
    const tokens = await authService.login(data);
    setRefreshTokenCookie(res, tokens.refreshToken);
    res.json({ accessToken: tokens.accessToken });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ message: err.issues[0].message });
      return;
    }
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.refresh_token;
    if (!token) {
      res.status(401).json({ message: "Refresh token required" });
      return;
    }

    const tokens = await authService.refresh(token);
    setRefreshTokenCookie(res, tokens.refreshToken);
    res.json({ accessToken: tokens.accessToken });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.refresh_token;
    if (token) {
      await authService.logout(token);
    }
    clearRefreshTokenCookie(res);
    res.json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await authService.getMe(req.userId!);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

// ─── OAuth: Google ───

export function googleRedirect(_req: Request, res: Response) {
  res.redirect(oauthService.getGoogleAuthUrl());
}

export async function googleCallback(req: Request, res: Response) {
  try {
    const code = req.query.code as string;
    if (!code) {
      res.redirect(`${env.CLIENT_URL}/login?error=Authorization+code+missing`);
      return;
    }

    const googleUser = await oauthService.getGoogleUser(code);
    const tokens = await authService.oauthLogin({
      email: googleUser.email,
      name: googleUser.name,
      avatar: googleUser.picture,
      provider: "GOOGLE",
      providerId: googleUser.id,
    });

    setRefreshTokenCookie(res, tokens.refreshToken);
    res.redirect(`${env.CLIENT_URL}/auth/callback?token=${tokens.accessToken}`);
  } catch (err) {
    console.error("Google OAuth error:", err);
    const message = err instanceof Error ? err.message : "Google login failed";
    res.redirect(`${env.CLIENT_URL}/login?error=${encodeURIComponent(message)}`);
  }
}

// ─── OAuth: GitHub ───

export function githubRedirect(_req: Request, res: Response) {
  res.redirect(oauthService.getGitHubAuthUrl());
}

export async function githubCallback(req: Request, res: Response) {
  try {
    const code = req.query.code as string;
    if (!code) {
      res.redirect(`${env.CLIENT_URL}/login?error=Authorization+code+missing`);
      return;
    }

    const githubUser = await oauthService.getGitHubUser(code);
    const tokens = await authService.oauthLogin({
      email: githubUser.email,
      name: githubUser.name || githubUser.login,
      avatar: githubUser.avatar_url,
      provider: "GITHUB",
      providerId: String(githubUser.id),
    });

    setRefreshTokenCookie(res, tokens.refreshToken);
    res.redirect(`${env.CLIENT_URL}/auth/callback?token=${tokens.accessToken}`);
  } catch (err) {
    console.error("GitHub OAuth error:", err);
    const message = err instanceof Error ? err.message : "GitHub login failed";
    res.redirect(`${env.CLIENT_URL}/login?error=${encodeURIComponent(message)}`);
  }
}
