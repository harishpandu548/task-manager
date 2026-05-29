import prisma from '../config/database.js';
export const activityLogService = {
    async log(data) {
        return prisma.activityLog.create({ data });
    },
    async getByTask(taskId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [logs, total] = await Promise.all([
            prisma.activityLog.findMany({
                where: { taskId },
                include: {
                    user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.activityLog.count({ where: { taskId } }),
        ]);
        return { logs, total, page, limit };
    },
    async getByUser(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [logs, total] = await Promise.all([
            prisma.activityLog.findMany({
                where: { userId },
                include: {
                    task: { select: { id: true, title: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.activityLog.count({ where: { userId } }),
        ]);
        return { logs, total, page, limit };
    },
    async getRecent(limit = 10) {
        return prisma.activityLog.findMany({
            include: {
                user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
                task: { select: { id: true, title: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    },
};
//# sourceMappingURL=activityLog.service.js.map