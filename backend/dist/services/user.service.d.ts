import { Role } from '@prisma/client';
export declare const userService: {
    getAll(page?: number, limit?: number): Promise<{
        users: {
            isActive: boolean;
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            avatar: string | null;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getById(id: string): Promise<{
        isActive: boolean;
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        avatar: string | null;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        _count: {
            assignedTasks: number;
            createdTasks: number;
        };
    }>;
    create(data: {
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
    update(id: string, data: Partial<{
        firstName: string;
        lastName: string;
        role: Role;
        isActive: boolean;
    }>): Promise<{
        isActive: boolean;
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
    delete(id: string): Promise<void>;
};
//# sourceMappingURL=user.service.d.ts.map