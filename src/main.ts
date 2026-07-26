import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { setupApp } from './bootstrap/setup-app';
import { APP_CONFIG } from './config/app/app.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));

  app.use(cookieParser());

  const config = app.get(ConfigService);
  const logger = app.get(Logger);

  setupApp(app, logger, config);

  const appCfg = config.getOrThrow<{ port: number }>(APP_CONFIG);
  const port = appCfg.port;
  await app.listen(port);
  logger.log(`Application is running on port:${port}`);
}
void bootstrap().catch((err) => {
  console.log(`bootstrap failed: ${err}`);
  process.exit(1);
});
