import { Queue } from 'bullmq';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { isRedisReachable } from '../utils/redisAvailability.js';

import Redis from 'ioredis';

const connection = new Redis(env.redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

let taskQueue: Queue | null = null;
let notificationQueue: Queue | null = null;

const getQueues = () => {
  if (!taskQueue) {
    taskQueue = new Queue('task-jobs', { connection });
  }

  if (!notificationQueue) {
    notificationQueue = new Queue('notification-jobs', { connection });
  }

  return { taskQueue, notificationQueue };
};

// ─── Schedule Jobs ────────────────────────────────────────

export async function scheduleRecurringJobs() {
  const redisAvailable = await isRedisReachable(env.redisUrl);
  if (!redisAvailable) {
    logger.warn('Redis is unavailable. Skipping recurring BullMQ schedulers.');
    return;
  }

  const { taskQueue, notificationQueue } = getQueues();

  // Daily overdue tasks check — runs every day at 9:00 AM
  await taskQueue.upsertJobScheduler(
    'check-overdue-tasks',
    { pattern: '0 9 * * *' },
    {
      name: 'check-overdue-tasks',
      data: {},
    }
  );

  // Auto-escalate CRITICAL tasks — runs every hour
  await taskQueue.upsertJobScheduler(
    'escalate-critical-tasks',
    { pattern: '0 * * * *' },
    {
      name: 'escalate-critical-tasks',
      data: {},
    }
  );

  // Due date reminders — runs every hour to check for tasks due in 24h
  await notificationQueue.upsertJobScheduler(
    'due-date-reminders',
    { pattern: '0 * * * *' },
    {
      name: 'due-date-reminders',
      data: {},
    }
  );
}

// Schedule a one-off reminder for a specific task
export async function scheduleDueDateReminder(taskId: string, dueDate: Date) {
  const reminderTime = new Date(dueDate.getTime() - 24 * 60 * 60 * 1000); // 24h before
  if (reminderTime > new Date()) {
    const redisAvailable = await isRedisReachable(env.redisUrl);
    if (!redisAvailable) {
      logger.warn('Redis is unavailable. Skipping due-date reminder scheduling.');
      return;
    }

    const { notificationQueue } = getQueues();

    await notificationQueue.add(
      'task-due-reminder',
      { taskId },
      { delay: reminderTime.getTime() - Date.now() }
    );
  }
}
