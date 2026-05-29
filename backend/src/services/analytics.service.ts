import prisma from '../config/database.js';
import redis from '../config/redis.js';
import { logger } from '../config/logger.js';

const CACHE_TTL = 60; // 60 seconds

const cacheGet = async <T>(key: string): Promise<T | null> => {
  try {
    const value = await redis.get(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch (error) {
    logger.warn('Redis cache read failed. Continuing without cache.', {
      key,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
};

const cacheSet = async (key: string, value: unknown) => {
  try {
    await redis.setex(key, CACHE_TTL, JSON.stringify(value));
  } catch (error) {
    logger.warn('Redis cache write failed. Continuing without cache.', {
      key,
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const analyticsService = {
  async getDashboardStats(userId?: string) {
    const cacheKey = userId ? `dashboard:${userId}` : 'dashboard:global';
    const cached = await cacheGet<{
      tasksByStatus: Array<{ status: string; count: number }>;
      tasksByPriority: Array<{ priority: string; count: number }>;
      overdueTasks: number;
      totalTasks: number;
      completedTasks: number;
      completionRate: number;
      recentActivity: unknown[];
    }>(cacheKey);
    if (cached) return cached;

    const [
      tasksByStatus,
      tasksByPriority,
      overdueTasks,
      totalTasks,
      completedTasks,
      recentActivity,
    ] = await Promise.all([
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
    const cached = await cacheGet<Array<{ user: unknown; taskCount: number }>>(cacheKey);
    if (cached) return cached;

    const [totalPerUser, donePerUser] = await Promise.all([
      prisma.task.groupBy({
        by: ['assigneeId'],
        _count: { id: true },
        where: { isDeleted: false, assigneeId: { not: null } },
      }),
      prisma.task.groupBy({
        by: ['assigneeId'],
        _count: { id: true },
        where: { isDeleted: false, status: 'DONE', assigneeId: { not: null } },
      }),
    ]);

    const userIds = totalPerUser.map((r) => r.assigneeId!).filter(Boolean);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, firstName: true, lastName: true, avatar: true },
    });

    const data = totalPerUser.map((total) => {
      const done = donePerUser.find((d) => d.assigneeId === total.assigneeId);
      return {
        user: users.find((u) => u.id === total.assigneeId),
        totalTasks: total._count.id,
        completedTasks: done?._count.id || 0,
      };
    });

    await cacheSet(cacheKey, data);
    return data;
  },

  async getProjectCompletion() {
    const cacheKey = 'analytics:projectCompletion';
    const cached = await cacheGet<Array<{
      id: string;
      name: string;
      color: string | null;
      totalTasks: number;
      completedTasks: number;
      completionPercentage: number;
    }>>(cacheKey);
    if (cached) return cached;

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
    const cached = await cacheGet<Array<{ date: string; count: number }>>(cacheKey);
    if (cached) return cached;

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

    const dayMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dayMap[d.toISOString().split('T')[0]] = 0;
    }

    completedByDay.forEach((t) => {
      const day = t.updatedAt.toISOString().split('T')[0];
      if (dayMap[day] !== undefined) dayMap[day]++;
    });

    const data = Object.entries(dayMap).map(([date, count]) => ({ date, count }));

    await cacheSet(cacheKey, data);
    return data;
  },

  async clearCache(userId?: string) {
    try {
      const keys = await redis.keys('dashboard:*');
      const analyticsKeys = await redis.keys('analytics:*');
      const allKeys = [...keys, ...analyticsKeys];
      
      if (allKeys.length > 0) {
        await redis.del(...allKeys);
      }
      logger.info('Analytics cache cleared', { userId, keysCleared: allKeys.length });
    } catch (error) {
      logger.warn('Failed to clear analytics cache', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },
}
