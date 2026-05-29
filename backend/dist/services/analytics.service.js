import prisma from '../config/database.js';
import redis from '../config/redis.js';
import { logger } from '../config/logger.js';
const CACHE_TTL = 60; // 60 seconds
const cacheGet = async (key) => {
    try {
        const value = await redis.get(key);
        return value ? JSON.parse(value) : null;
    }
    catch (error) {
        logger.warn('Redis cache read failed. Continuing without cache.', {
            key,
            error: error instanceof Error ? error.message : String(error),
        });
        return null;
    }
};
const cacheSet = async (key, value) => {
    try {
        await redis.setex(key, CACHE_TTL, JSON.stringify(value));
    }
    catch (error) {
        logger.warn('Redis cache write failed. Continuing without cache.', {
            key,
            error: error instanceof Error ? error.message : String(error),
        });
    }
};
export const analyticsService = {
    async getDashboardStats(userId) {
        const cacheKey = userId ? `dashboard:${userId}` : 'dashboard:global';
        const cached = await cacheGet(cacheKey);
        if (cached)
            return cached;
        const [tasksByStatus, tasksByPriority, overdueTasks, totalTasks, completedTasks, recentActivity,] = await Promise.all([
            prisma.task.groupBy({
                by: ['status'],
                _count: { status: true },
                where: { isDeleted: false, ...(userId && { assigneeId: userId }) },
            }),
            prisma.task.groupBy({
                by: ['priority'],
                _count: { priority: true },
                where: { isDeleted: false, ...(userId && { assigneeId: userId }) },
            }),
            prisma.task.count({
                where: {
                    isDeleted: false,
                    dueDate: { lt: new Date() },
                    status: { not: 'DONE' },
                    ...(userId && { assigneeId: userId }),
                },
            }),
            prisma.task.count({ where: { isDeleted: false, ...(userId && { assigneeId: userId }) } }),
            prisma.task.count({ where: { isDeleted: false, status: 'DONE', ...(userId && { assigneeId: userId }) } }),
            prisma.activityLog.findMany({
                include: {
                    user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
                    task: { select: { id: true, title: true } },
                },
                orderBy: { createdAt: 'desc' },
                take: 10,
            }),
        ]);
        const data = {
            tasksByStatus: tasksByStatus.map((g) => ({ status: g.status, count: g._count.status })),
            tasksByPriority: tasksByPriority.map((g) => ({ priority: g.priority, count: g._count.priority })),
            overdueTasks,
            totalTasks,
            completedTasks,
            completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
            recentActivity,
        };
        await cacheSet(cacheKey, data);
        return data;
    },
    async getTasksPerUser() {
        const cacheKey = 'analytics:tasksPerUser';
        const cached = await cacheGet(cacheKey);
        if (cached)
            return cached;
        const result = await prisma.task.groupBy({
            by: ['assigneeId'],
            _count: { id: true },
            where: { isDeleted: false, assigneeId: { not: null } },
        });
        const userIds = result.map((r) => r.assigneeId).filter(Boolean);
        const users = await prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, firstName: true, lastName: true, avatar: true },
        });
        const data = result.map((r) => ({
            user: users.find((u) => u.id === r.assigneeId),
            taskCount: r._count.id,
        }));
        await cacheSet(cacheKey, data);
        return data;
    },
    async getProjectCompletion() {
        const cacheKey = 'analytics:projectCompletion';
        const cached = await cacheGet(cacheKey);
        if (cached)
            return cached;
        const projects = await prisma.project.findMany({
            where: { isArchived: false },
            select: {
                id: true,
                name: true,
                color: true,
                _count: { select: { tasks: true } },
                tasks: {
                    select: { status: true },
                    where: { isDeleted: false },
                },
            },
        });
        const data = projects.map((p) => {
            const total = p.tasks.length;
            const done = p.tasks.filter((t) => t.status === 'DONE').length;
            return {
                id: p.id,
                name: p.name,
                color: p.color,
                totalTasks: total,
                completedTasks: done,
                completionPercentage: total > 0 ? Math.round((done / total) * 100) : 0,
            };
        });
        await cacheSet(cacheKey, data);
        return data;
    },
    async getWeeklyProductivity() {
        const cacheKey = 'analytics:weeklyProductivity';
        const cached = await cacheGet(cacheKey);
        if (cached)
            return cached;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const completedByDay = await prisma.task.findMany({
            where: {
                status: 'DONE',
                isDeleted: false,
                updatedAt: { gte: sevenDaysAgo },
            },
            select: { updatedAt: true },
        });
        const dayMap = {};
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dayMap[d.toISOString().split('T')[0]] = 0;
        }
        completedByDay.forEach((t) => {
            const day = t.updatedAt.toISOString().split('T')[0];
            if (dayMap[day] !== undefined)
                dayMap[day]++;
        });
        const data = Object.entries(dayMap).map(([date, count]) => ({ date, count }));
        await cacheSet(cacheKey, data);
        return data;
    },
};
//# sourceMappingURL=analytics.service.js.map