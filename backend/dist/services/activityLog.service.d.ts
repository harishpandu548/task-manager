import { Prisma } from '@prisma/client';
export declare const activityLogService: {
    log(data: {
        action: string;
        entityType: string;
        entityId: string;
        userId: string;
        taskId?: string;
        details?: Prisma.InputJsonValue;
    }): Promise<{
        details: Prisma.JsonValue | null;
        id: string;
        createdAt: Date;
        userId: string | null;
        projectId: string | null;
        taskId: string | null;
        action: string;
        entityType: string;
        entityId: string;
    }>;
    getByTask(taskId: string, page?: number, limit?: number): Promise<{
        logs: ({
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
        total: number;
        page: number;
        limit: number;
    }>;
    getByUser(userId: string, page?: number, limit?: number): Promise<{
        logs: ({
            task: {
                id: string;
                title: string;
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
        total: number;
        page: number;
        limit: number;
    }>;
    getRecent(limit?: number): Promise<({
        user: {
            id: string;
            firstName: string;
            lastName: string;
            avatar: string | null;
        } | null;
        task: {
            id: string;
            title: string;
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
    })[]>;
};
//# sourceMappingURL=activityLog.service.d.ts.map