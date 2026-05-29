import prisma from '../config/database.js';
export const notificationService = {
    async create(data) {
        return prisma.notification.create({ data });
    },
    async getByUser(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [notifications, total, unreadCount] = await Promise.all([
            prisma.notification.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.notification.count({ where: { userId } }),
            prisma.notification.count({ where: { userId, isRead: false } }),
        ]);
        return { notifications, total, unreadCount, page, limit };
    },
    async markAsRead(id, userId) {
        return prisma.notification.updateMany({
            where: { id, userId },
            data: { isRead: true },
        });
    },
    async markAllAsRead(userId) {
        return prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
    },
};
//# sourceMappingURL=notification.service.js.map