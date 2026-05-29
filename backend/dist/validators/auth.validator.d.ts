import { z } from 'zod';
export declare const loginSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
        password: string;
    }, {
        email: string;
        password: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        email: string;
        password: string;
    };
}, {
    body: {
        email: string;
        password: string;
    };
}>;
export declare const registerSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
        firstName: z.ZodString;
        lastName: z.ZodString;
        role: z.ZodOptional<z.ZodEnum<["ADMIN", "MANAGER", "EMPLOYEE"]>>;
    }, "strip", z.ZodTypeAny, {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role?: "ADMIN" | "MANAGER" | "EMPLOYEE" | undefined;
    }, {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role?: "ADMIN" | "MANAGER" | "EMPLOYEE" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role?: "ADMIN" | "MANAGER" | "EMPLOYEE" | undefined;
    };
}, {
    body: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role?: "ADMIN" | "MANAGER" | "EMPLOYEE" | undefined;
    };
}>;
export declare const refreshTokenSchema: z.ZodObject<{
    body: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        refreshToken: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        refreshToken?: string | undefined;
    }, {
        refreshToken?: string | undefined;
    }>>>;
}, "strip", z.ZodTypeAny, {
    body: {
        refreshToken?: string | undefined;
    };
}, {
    body?: {
        refreshToken?: string | undefined;
    } | undefined;
}>;
//# sourceMappingURL=auth.validator.d.ts.map