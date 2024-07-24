import { NestFactory } from '@nestjs/core';
import { INestApplication, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { AppApiTags } from './common/interfaces/openapi';
import AppLogger from './common/logger/logger.config';
import * as hbs from 'hbs';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
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
  const appName = configService.get<string>('appName');
  const appVersion = configService.get<string>('version');
  const appHost = configService.get<string>('host');
  const appPort = configService.get<number>('port');
  const prodUrl = configService.get<string>('prodUrl');

  const initSwagger = (app: INestApplication, serverUrl: string): void => {
    const config = new DocumentBuilder()
      .setTitle(appName)
      .setDescription(appName)
      .setVersion(appVersion)
      .addServer(serverUrl, 'Development Server')
      .addServer(prodUrl, 'Production Server')
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

  const port = configService.get<number>('port');
  logger.log(`Starting [${configService.get('appName')}] on port=[${port}]`);

  app.setViewEngine('hbs');
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  hbs.registerPartials(join(__dirname, '..', 'views/partials'));

  initSwagger(app, appHost);
  await app.listen(appPort);
}

bootstrap();
