import { ApiError } from '../utils/ApiError.js';
import { logger } from '../config/logger.js';
import { ZodError } from 'zod';
import { env } from '../config/env.js';
export const errorHandler = (err, _req, res, _next) => {
    // Zod validation errors
    if (err instanceof ZodError) {
        const details = err.errors.map((e) => ({
            path: e.path.join('.'),
            message: e.message,
        }));
        res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: details,
        });
        return;
    }
    // Custom API errors
    if (err instanceof ApiError) {
        const responseBody = {
            success: false,
            message: err.message,
        };
        if (err.details !== undefined) {
            responseBody.details = err.details;
        }
        res.status(err.statusCode).json({
            ...responseBody,
        });
        return;
    }
    // Prisma known request errors
    if (err.constructor.name === 'PrismaClientKnownRequestError') {
        const prismaErr = err;
        if (prismaErr.code === 'P2002') {
            res.status(409).json({
                success: false,
                message: 'A record with this value already exists',
                details: prismaErr.meta?.target,
            });
            return;
        }
        if (prismaErr.code === 'P2025') {
            res.status(404).json({
                success: false,
                message: 'Record not found',
            });
            return;
        }
    }
    // Unknown errors
    logger.error('Unhandled error:', {
        message: err.message,
        stack: err.stack,
    });
    res.status(500).json({
        success: false,
        message: env.nodeEnv === 'development' ? err.message : 'Internal Server Error',
        ...(env.nodeEnv === 'development' && { stack: err.stack }),
    });
};
//# sourceMappingURL=errorHandler.js.map