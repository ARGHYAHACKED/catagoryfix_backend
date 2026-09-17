import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { loadConfig } from '@catalogfix/config';
import { createLogger } from '@catalogfix/logger';
import { AppModule } from './app.module';
import { ApiExceptionFilter } from './common/http-exception.filter';
import { SuccessEnvelopeInterceptor } from './common/success.interceptor';

async function bootstrap(): Promise<void> {
  const config = loadConfig();
  const logger = createLogger('api');
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    logger: ['error', 'warn', 'log'],
  });
  app.setGlobalPrefix(config.API_PREFIX.replace(/^\//, ''));
  app.use(helmet());
  app.use(cookieParser());
  const allowedOrigins = Array.from(
    new Set([
      config.WEB_URL,
      config.WEB_URL.includes('://www.')
        ? config.WEB_URL.replace('://www.', '://')
        : config.WEB_URL.replace('://', '://www.'),
    ]),
  );
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: false,
    }),
  );
  app.useGlobalFilters(new ApiExceptionFilter());
  app.useGlobalInterceptors(new SuccessEnvelopeInterceptor());

  const swagger = new DocumentBuilder()
    .setTitle('CatalogFix API')
    .setDescription('Catalog transformation API')
    .setVersion('1.0')
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swagger));

  await app.listen(config.API_PORT);
  logger.info({ port: config.API_PORT }, 'CatalogFix API listening');
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
