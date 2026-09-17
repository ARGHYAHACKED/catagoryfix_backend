import { Controller, Get } from '@nestjs/common';
import { prisma } from '@catalogfix/database';
import IORedis from 'ioredis';
import { loadConfig } from '@catalogfix/config';

@Controller('health')
export class HealthController {
  @Get()
  async health() {
    return { status: 'ok' };
  }

  @Get('live')
  live() {
    return { status: 'live' };
  }

  @Get('ready')
  async ready() {
    const config = loadConfig();
    await prisma.$queryRaw`SELECT 1`;
    const redis = new IORedis(config.REDIS_URL);
    try {
      await redis.ping();
    } finally {
      redis.disconnect();
    }
    return { status: 'ready' };
  }
}
