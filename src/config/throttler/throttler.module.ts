import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import throttlerConfig, { THROTTLER_CONFIG } from './throttler.config';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule.forFeature(throttlerConfig)],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const context = config.getOrThrow<{ ttl: number; limit: number }>(
          THROTTLER_CONFIG,
        );
        return {
          throttlers: [
            {
              name: 'default',
              ttl: context.ttl,
              limit: context.limit,
            },
          ],
        };
      },
    }),
  ],
  exports: [ThrottlerModule],
})
export class AppThrottlerModule {}
