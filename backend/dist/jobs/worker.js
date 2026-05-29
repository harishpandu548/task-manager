import { Worker } from 'bullmq';
import { NotificationType, PrismaClient } from '@prisma/client';
import { logger } from '../config/logger.js';
import { env } from '../config/env.js';
import { isRedisReachable } from '../utils/redisAvailability.js';
const prisma = new PrismaClient();
const connection = {
    host: new URL(env.redisUrl).hostname || 'localhost',
    port: parseInt(new URL(env.redisUrl).port || '6379', 10),
};
let taskWorker = null;
let notificationWorker = null;
// ─── Job Handlers ───────────────────────────────────────────
async function handleOverdueTasks() {
    const overdueTasks = await prisma.task.findMany({
        where: {
            isDeleted: false,
            status: { not: 'DONE' },
            dueDate: { lt: new Date() },
        },
        include: {
            assignee: { select: { id: true, firstName: true } },
        },
    });
    logger.info(`Found ${overdueTasks.length} overdue tasks`);
    for (const task of overdueTasks) {
        if (task.assigneeId) {
            await prisma.notification.create({
                data: {
                    type: NotificationType.OVERDUE_ALERT,
                    title: 'Task Overdue',
                    message: `"${task.title}" is past its due date`,
                    userId: task.assigneeId,
                    data: { taskId: task.id },
                },
            });
        }
    }
}
async function handleCriticalEscalation() {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const criticalTasks = await prisma.task.findMany({
        where: {
            isDeleted: false,
            priority: 'CRITICAL',
            status: 'TODO',
            createdAt: { lte: twentyFourHoursAgo },
        },
        include: {
            project: {
                include: {
                    members: {
                        where: { role: { in: ['ADMIN', 'MANAGER'] } },
                        select: { userId: true },
                    },
                },
            },
        },
    });
    logger.info(`Found ${criticalTasks.length} critical tasks needing escalation`);
    for (const task of criticalTasks) {
        // Notify managers and admins
        const managerIds = task.project.members.map((m) => m.userId);
        for (const userId of managerIds) {
            await prisma.notification.create({
                data: {
                    type: 'CRITICAL_ESCALATION',
                    title: 'Critical Task Not Started',
                    message: `CRITICAL task "${task.title}" has not been started in 24 hours`,
                    userId,
                    data: { taskId: task.id, projectId: task.projectId },
                },
            });
        }
    }
}
async function handleDueDateReminders() {
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const tasksDueSoon = await prisma.task.findMany({
        where: {
            isDeleted: false,
            status: { not: 'DONE' },
            dueDate: { gte: now, lte: in24Hours },
        },
    });
    logger.info(`Found ${tasksDueSoon.length} tasks due in next 24 hours`);
    for (const task of tasksDueSoon) {
        if (task.assigneeId) {
            await prisma.notification.create({
                data: {
                    type: NotificationType.TASK_REMINDER,
                    title: 'Task Due Soon',
                    message: `"${task.title}" is due within 24 hours`,
                    userId: task.assigneeId,
                    data: { taskId: task.id },
                },
            });
        }
    }
}
async function handleSingleTaskReminder(taskId) {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task || task.isDeleted || task.status === 'DONE' || !task.assigneeId)
        return;
    await prisma.notification.create({
        data: {
            type: NotificationType.TASK_REMINDER,
            title: 'Task Due Tomorrow',
            message: `"${task.title}" is due tomorrow`,
            userId: task.assigneeId,
            data: { taskId: task.id },
        },
    });
}
async function bootstrapWorkers() {
    const reachable = await isRedisReachable(env.redisUrl);
    if (!reachable) {
        logger.error('Redis is not reachable on startup. Worker exited. Start Redis and run npm run worker again.');
        process.exit(1);
    }
    taskWorker = new Worker('task-jobs', async (job) => {
        logger.info(`Processing task job: ${job.name}`, { jobId: job.id });
        switch (job.name) {
            case 'check-overdue-tasks':
                await handleOverdueTasks();
                break;
            case 'escalate-critical-tasks':
                await handleCriticalEscalation();
                break;
            default:
                logger.warn(`Unknown task job: ${job.name}`);
        }
    }, { connection });
    notificationWorker = new Worker('notification-jobs', async (job) => {
        logger.info(`Processing notification job: ${job.name}`, { jobId: job.id });
        switch (job.name) {
            case 'due-date-reminders':
                await handleDueDateReminders();
                break;
            case 'task-due-reminder':
                await handleSingleTaskReminder(job.data.taskId);
                break;
            default:
                logger.warn(`Unknown notification job: ${job.name}`);
        }
    }, { connection });
    taskWorker.on('completed', (job) => {
        logger.info(`Task job completed: ${job.name}`, { jobId: job.id });
    });
    taskWorker.on('failed', (job, err) => {
        logger.error(`Task job failed: ${job?.name}`, { jobId: job?.id, error: err.message });
    });
    notificationWorker.on('completed', (job) => {
        logger.info(`Notification job completed: ${job.name}`, { jobId: job.id });
    });
    notificationWorker.on('failed', (job, err) => {
        logger.error(`Notification job failed: ${job?.name}`, { jobId: job?.id, error: err.message });
    });
    logger.info('Workers started');
}
bootstrapWorkers().catch((error) => {
    logger.error('Failed to bootstrap workers', {
        error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
});
//# sourceMappingURL=worker.js.map