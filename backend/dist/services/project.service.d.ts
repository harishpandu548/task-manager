import { Role } from '@prisma/client';
export declare const projectService: {
    getAll(userId: string, userRole: Role): Promise<({
        _count: {
            tasks: number;
            members: number;
        };
        members: ({
            user: {
                id: string;
                firstName: string;
                lastName: string;
                avatar: string | null;
            };
        } & {
            id: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
            userId: string;
            projectId: string;
        })[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        color: string | null;
        isArchived: boolean;
        createdById: string;
        managerId: string | null;
    })[]>;
    getById(id: string): Promise<{
        _count: {
            tasks: number;
            members: number;
        };
        tasks: ({
            assignee: {
                id: string;
                firstName: string;
                lastName: string;
                avatar: string | null;
            } | null;
        } & {
            status: import(".prisma/client").$Enums.TaskStatus;
            priority: import(".prisma/client").$Enums.TaskPriority;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
            dueDate: Date | null;
            projectId: string;
            assigneeId: string | null;
            position: number;
            createdById: string;
            isDeleted: boolean;
            deletedAt: Date | null;
        })[];
        members: ({
            user: {
                id: string;
                firstName: string;
                lastName: string;
                email: string;
                avatar: string | null;
                role: import(".prisma/client").$Enums.Role;
            };
        } & {
            id: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
            userId: string;
            projectId: string;
        })[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        color: string | null;
        isArchived: boolean;
        createdById: string;
        managerId: string | null;
    }>;
    create(data: {
        name: string;
        description?: string;
        color?: string;
    }, userId: string): Promise<{
        _count: {
            tasks: number;
            members: number;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        color: string | null;
        isArchived: boolean;
        createdById: string;
        managerId: string | null;
    }>;
    update(id: string, data: {
        name?: string;
        description?: string;
        color?: string;
        isArchived?: boolean;
    }): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        color: string | null;
        isArchived: boolean;
        createdById: string;
        managerId: string | null;
    }>;
    addMember(projectId: string, userId: string, role?: Role): Promise<{
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
        };
    } & {
        id: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        userId: string;
        projectId: string;
    }>;
    removeMember(projectId: string, userId: string): Promise<void>;
    delete(id: string): Promise<void>;
};
//# sourceMappingURL=project.service.d.ts.map