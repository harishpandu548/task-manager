import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import prisma from '../config/database.js';
export const authenticate = async (req, _res, next) => {
    try {
        const token = req.cookies?.accessToken ||
            req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            throw ApiError.unauthorized('Access token required');
        }
        const decoded = jwt.verify(token, env.jwt.accessSecret);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                role: true,
                firstName: true,
                lastName: true,
                isActive: true,
            },
        });
        if (!user || !user.isActive) {
            throw ApiError.unauthorized('User not found or inactive');
        }
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
        };
        next();
    }
    catch (error) {
        if (error instanceof ApiError) {
            next(error);
            return;
        }
        if (error instanceof jwt.TokenExpiredError) {
            next(ApiError.unauthorized('Token expired'));
            return;
        }
        next(ApiError.unauthorized('Invalid token'));
    }
};
//# sourceMappingURL=auth.middleware.js.map