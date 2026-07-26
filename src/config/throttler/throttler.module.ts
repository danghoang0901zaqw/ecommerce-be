import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { THROTTLER_CONFIG } from './throttler.config';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
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
