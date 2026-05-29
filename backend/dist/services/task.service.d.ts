import { Prisma, Role, TaskPriority, TaskStatus } from '@prisma/client';
type Actor = {
    id: string;
    role: Role;
};
type TaskFilters = {
    status?: TaskStatus;
    priority?: TaskPriority;
    projectId?: string;
    assigneeId?: string;
    search?: string;
    dueDateFrom?: string;
    dueDateTo?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
};
export declare const taskService: {
    getAll(filters: TaskFilters): Promise<{
        tasks: ({
            project: {
                name: string;
                id: string;
                color: string | null;
            };
            _count: {
                comments: number;
            };
            createdBy: {
                id: string;
                firstName: string;
                lastName: string;
            };
            assignee: {
                id: string;
                firstName: string;
                lastName: string;
                email: string;
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
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getById(id: string): Promise<{
        project: {
            name: string;
            id: string;
            color: string | null;
        };
        comments: ({
            user: {
                id: string;
                firstName: string;
                lastName: string;
                avatar: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            content: string;
            taskId: string;
        })[];
        activityLogs: ({
            user: {
                id: string;
                firstName: string;
                lastName: string;
                avatar: string | null;
            } | null;
        } & {
            details: Prisma.JsonValue | null;
            id: string;
            createdAt: Date;
            userId: string | null;
            projectId: string | null;
            taskId: string | null;
            action: string;
            entityType: string;
            entityId: string;
        })[];
        _count: {
            comments: number;
        };
        createdBy: {
            id: string;
            firstName: string;
            lastName: string;
        };
        assignee: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
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
    }>;
    create(data: {
        title: string;
        description?: string;
        priority?: TaskPriority;
        status?: TaskStatus;
        dueDate?: string | null;
        projectId: string;
        assigneeId?: string | null;
        actor: Actor;
    }): Promise<{
        project: {
            name: string;
            id: string;
            color: string | null;
        };
        _count: {
            comments: number;
        };
        createdBy: {
            id: string;
            firstName: string;
            lastName: string;
        };
        assignee: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
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
    }>;
    update(id: string, data: {
        title?: string;
        description?: string;
        priority?: TaskPriority;
        status?: TaskStatus;
        dueDate?: string | null;
        assigneeId?: string | null;
        position?: number;
    }, actor: Actor): Promise<{
        project: {
            name: string;
            id: string;
            color: string | null;
        };
        _count: {
            comments: number;
        };
        createdBy: {
            id: string;
            firstName: string;
            lastName: string;
        };
        assignee: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
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
    }>;
    assignTask(id: string, assigneeId: string, actor: Actor): Promise<{
        project: {
            name: string;
            id: string;
            color: string | null;
        };
        _count: {
            comments: number;
        };
        createdBy: {
            id: string;
            firstName: string;
            lastName: string;
        };
        assignee: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
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
    }>;
    changeStatus(id: string, status: TaskStatus, actor: Actor): Promise<{
        project: {
            name: string;
            id: string;
            color: string | null;
        };
        _count: {
            comments: number;
        };
        createdBy: {
            id: string;
            firstName: string;
            lastName: string;
        };
        assignee: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
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
    }>;
    softDelete(id: string, userId: string): Promise<{
        id: string;
    }>;
    getByProject(projectId: string): Promise<({
        _count: {
            comments: number;
        };
        createdBy: {
            id: string;
            firstName: string;
            lastName: string;
        };
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
    })[]>;
    getMyTasks(userId: string, filters?: {
        status?: TaskStatus;
        priority?: TaskPriority;
        projectId?: string;
        search?: string;
        dueDateFrom?: string;
        dueDateTo?: string;
    }): Promise<({
        project: {
            name: string;
            id: string;
            color: string | null;
        };
        _count: {
            comments: number;
        };
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
    })[]>;
};
export {};
//# sourceMappingURL=task.service.d.ts.map