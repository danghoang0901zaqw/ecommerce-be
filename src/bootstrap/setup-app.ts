import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { APP_CONFIG } from '../config/app/app.config';

export const setupApp = (
  app: NestExpressApplication,
  logger: Logger,
  config: ConfigService,
) => {
  app.use(cookieParser());
  // CORS
  const appCfg = config.getOrThrow<{ corsOrigin: string[] }>(APP_CONFIG);
  const allowList = appCfg.corsOrigin;
  app.enableCors({
    origin: (requestOrigin: string, callback) => {
      if (!requestOrigin) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        callback(null, true);
        return;
      }
      if (allowList.includes(requestOrigin)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        callback(null, true);
        return;
      }
      logger.warn(
        `CORS: blocked request from origin "${requestOrigin}" (not in allow list)`,
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
};
