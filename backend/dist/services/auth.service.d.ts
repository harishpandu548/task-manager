import { Role } from '@prisma/client';
export declare const authService: {
    register(data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role?: Role;
    }): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
    }>;
    login(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.Role;
            avatar: string | null;
        };
    }>;
    refreshTokens(currentRefreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(refreshToken: string): Promise<void>;
    logoutAll(userId: string): Promise<void>;
};
//# sourceMappingURL=auth.service.d.ts.map