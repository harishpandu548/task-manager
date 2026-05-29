import { NotificationType, Prisma } from '@prisma/client';
export declare const notificationService: {
    create(data: {
        type: NotificationType;
        title: string;
        message: string;
        userId: string;
        data?: Prisma.InputJsonValue;
    }): Promise<{
        message: string;
        type: import(".prisma/client").$Enums.NotificationType;
        data: Prisma.JsonValue | null;
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        taskId: string | null;
        isRead: boolean;
    }>;
    getByUser(userId: string, page?: number, limit?: number): Promise<{
        notifications: {
            message: string;
            type: import(".prisma/client").$Enums.NotificationType;
            data: Prisma.JsonValue | null;
            id: string;
            createdAt: Date;
            userId: string;
            title: string;
            taskId: string | null;
            isRead: boolean;
        }[];
        total: number;
        unreadCount: number;
        page: number;
        limit: number;
    }>;
    markAsRead(id: string, userId: string): Promise<Prisma.BatchPayload>;
    markAllAsRead(userId: string): Promise<Prisma.BatchPayload>;
};
//# sourceMappingURL=notification.service.d.ts.map