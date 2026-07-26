import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { IncomingMessage } from 'http';
import { LoggerModule } from 'nestjs-pino';
import { CORRELATION_ID_HEADER } from 'src/middlewares/correlation-id.middleware';
@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isDev = config.get('NODE_ENV') === 'development';
        return {
          pinoHttp: {
            level: isDev ? 'debug' : 'info',
            transport: isDev
              ? {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                    translateTime: 'SYS:standard',
                    ignore: 'pid,hostname',
                  },
                }
              : undefined,
            genReqId: (req, res) => {
              const isExisting = req.headers[CORRELATION_ID_HEADER];
              const requestId = isExisting ?? randomUUID();
              req.headers[CORRELATION_ID_HEADER] = requestId;
              res.setHeader(CORRELATION_ID_HEADER, requestId);
              return requestId;
            },
            redact: {
              paths: [
                'req.headers.authorization',
                'req.headers.cookies',
                'req.headers["set-cookie"]',
                'req.body.password',
              ],
              censor: '[REDACTED]',
            },
            customProps: (req: IncomingMessage) => ({
              userId: (req as IncomingMessage & { user?: { id: string } })?.user
                ?.id,
            }),
          },
        };
      },
    }),
  ],
  exports: [LoggerModule],
})
export class PinoLoggerModule {}
