import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authService } from '../services/auth.service.js';
import { env } from '../config/env.js';
import { CookieOptions } from 'express';

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.cookie.secure,
  sameSite: env.cookie.secure ? 'none' : 'lax',
  domain: env.cookie.domain,
  path: '/',
};

const extractToken = (value: unknown): string | undefined => {
  if (Array.isArray(value)) return value[0];
  if (typeof value === 'string') return value;
  return undefined;
};

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user,
    });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.cookie('accessToken', result.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', result.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: result.user,
    });
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const refreshToken =
      extractToken(req.cookies?.refreshToken) ||
      extractToken(req.body?.refreshToken);

    if (!refreshToken) {
      res.status(401).json({ success: false, message: 'Refresh token required' });
      return;
    }

    const tokens = await authService.refreshTokens(refreshToken);

    res.cookie('accessToken', tokens.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: 'Tokens refreshed',
    });
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = extractToken(req.cookies?.refreshToken);
    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);

    res.json({ success: true, message: 'Logged out' });
  }),

  logoutAll: asyncHandler(async (req: Request, res: Response) => {
    await authService.logoutAll(req.user!.id);
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    res.json({ success: true, message: 'Logged out from all devices' });
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    res.json({
      success: true,
      data: req.user,
    });
  }),
};
