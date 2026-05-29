import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { hashToken } from '../utils/security.js';
const generateAccessToken = (payload) => {
    const options = {
        expiresIn: env.jwt.accessExpiry,
    };
    return jwt.sign(payload, env.jwt.accessSecret, {
        ...options,
    });
};
const generateRefreshToken = (payload) => {
    const options = {
        expiresIn: env.jwt.refreshExpiry,
    };
    return jwt.sign(payload, env.jwt.refreshSecret, {
        ...options,
    });
};
export const authService = {
    async register(data) {
        const existing = await prisma.user.findUnique({ where: { email: data.email } });
        if (existing) {
            throw ApiError.conflict('Email already in use');
        }
        const hashedPassword = await bcrypt.hash(data.password, 12);
        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role || 'EMPLOYEE',
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
            },
        });
        return user;
    },
    async login(email, password) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.isActive) {
            throw ApiError.unauthorized('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw ApiError.unauthorized('Invalid credentials');
        }
        const accessToken = generateAccessToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        const refreshToken = generateRefreshToken({ id: user.id });
        const refreshTokenHash = hashToken(refreshToken);
        // Store refresh token in DB
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await prisma.refreshToken.create({
            data: {
                tokenHash: refreshTokenHash,
                userId: user.id,
                expiresAt,
            },
        });
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                avatar: user.avatar,
            },
        };
    },
    async refreshTokens(currentRefreshToken) {
        try {
            const decoded = jwt.verify(currentRefreshToken, env.jwt.refreshSecret);
            const tokenHash = hashToken(currentRefreshToken);
            const storedToken = await prisma.refreshToken.findUnique({
                where: { tokenHash },
                include: { user: true },
            });
            if (!storedToken || storedToken.expiresAt < new Date()) {
                if (storedToken) {
                    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
                }
                throw ApiError.unauthorized('Invalid or expired refresh token');
            }
            // Delete old token
            await prisma.refreshToken.delete({ where: { id: storedToken.id } });
            const user = storedToken.user;
            const accessToken = generateAccessToken({
                id: user.id,
                email: user.email,
                role: user.role,
            });
            const newRefreshToken = generateRefreshToken({ id: decoded.id });
            const newRefreshTokenHash = hashToken(newRefreshToken);
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);
            await prisma.refreshToken.create({
                data: {
                    tokenHash: newRefreshTokenHash,
                    userId: user.id,
                    expiresAt,
                },
            });
            return { accessToken, refreshToken: newRefreshToken };
        }
        catch (error) {
            if (error instanceof ApiError)
                throw error;
            throw ApiError.unauthorized('Invalid refresh token');
        }
    },
    async logout(refreshToken) {
        const tokenHash = hashToken(refreshToken);
        await prisma.refreshToken.deleteMany({
            where: { tokenHash },
        });
    },
    async logoutAll(userId) {
        await prisma.refreshToken.deleteMany({
            where: { userId },
        });
    },
};
//# sourceMappingURL=auth.service.js.map