import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { ConnectionOptions } from 'bullmq';

/**
 * ioredis@6 does not parse `url` arguments (it silently falls back to the
 * default host `localhost`), and on Windows `localhost` resolves to `::1`
 * first, where the WSL relay (wslrelay.exe) accepts connections on port 6379
 * and then resets them. Parse REDIS_URL ourselves and pass an explicit
 * host/port so connections always reach the configured address.
 */
function parseRedisConnection(redisUrl: string): ConnectionOptions {
  const url = new URL(redisUrl);
  const connection: ConnectionOptions = {
    host: url.hostname || '127.0.0.1',
    port: url.port ? Number.parseInt(url.port, 10) : 6379,
  };
  if (url.username) connection.username = decodeURIComponent(url.username);
  if (url.password) connection.password = decodeURIComponent(url.password);
  if (url.protocol === 'rediss:') connection.tls = {};
  return connection;
}

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: parseRedisConnection(
          config.get<string>('redisUrl') ?? 'redis://127.0.0.1:6379',
        ),
      }),
    }),
  ],
  exports: [BullModule],
})
export class JobsModule {}
