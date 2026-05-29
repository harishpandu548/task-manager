import Redis from 'ioredis';
import { env } from './env.js';
import { logger } from './logger.js';

export const redis = new Redis(env.redisUrl, {
  lazyConnect: true,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  connectTimeout: 3000,
  retryStrategy(times) {
    if (times > 3) {
      logger.warn('Redis unavailable after retry attempts; caching disabled until next command');
      return null;
    }

    const delay = Math.min(times * 250, 1500);
    return delay;
  },
});

redis.on('connect', () => {
  logger.info('Redis connected');
});

redis.on('error', (err) => {
  logger.error('Redis connection error', { error: err.message });
});

export default redis;
