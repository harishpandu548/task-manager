import { z } from 'zod';
export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
    }),
});
export const registerSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE']).optional(),
    }),
});
export const refreshTokenSchema = z.object({
    body: z
        .object({
        refreshToken: z.string().min(10).optional(),
    })
        .optional()
        .default({}),
});
//# sourceMappingURL=auth.validator.js.map