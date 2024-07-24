import { INestApplication, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppApiTags } from './common/interfaces/openapi';
import AppLogger from './common/logger/logger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.enableVersioning({ type: VersioningType.URI });
  app.useLogger(app.get(AppLogger));

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const configService = app.get<ConfigService>(ConfigService);
  const appName = configService.get('appName');
  const appVersion = configService.get('version');
  const appHost = configService.get('host');
  const appPort = configService.get('port');
  const prodUrl = configService.get('prodUrl');

  const initSwagger = (app: INestApplication, serverUrl: string) => {
    const config = new DocumentBuilder()
      .setTitle(appName)
      .setDescription(appName)
      .setVersion(appVersion)
      .addServer(serverUrl, 'Development Server')

      .addBearerAuth();

    for (const ApiTagName in AppApiTags) {
      config.addTag(ApiTagName, AppApiTags[ApiTagName].description);
    }
    const document = SwaggerModule.createDocument(app, config.build());

    SwaggerModule.setup('/api-docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  };

  // Global filter to catch all HttpExceptions
  const logger = app.get(AppLogger);
  // app.useGlobalFilters(new HttpExceptionFilter(logger));

  const port = configService.get('port');
  logger.log(`Starting [${configService.get('appName')}] on port=[${port}]`);

  initSwagger(app, appHost);
  await app.listen(appPort);
}
bootstrap();
