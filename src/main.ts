import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import chalk from 'chalk';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as express from 'express';
import { AppModule } from './app.module';

import {
  ValidationPipe,
  LoggerMiddleware,
  TimeoutInterceptor,
  LoggingInterceptor,
  HttpExceptionFilter,
} from './common';
import { MyLogger } from './config';

import { NODE_ENV, DOMAIN, PORT } from './environments';
import { ExpressAdapter } from '@nestjs/platform-express';

declare const module: any;

async function bootstrap() {
  try {
    const httpsOptions = {
      key: fs.readFileSync('ssl/private.key'),
      cert: fs.readFileSync('ssl/certificate.crt'),
      ca: fs.readFileSync('ssl/ca_bundle.crt'),
      rejectUnauthorized: false,
    };

    const server = express();

    const app = await NestFactory.create(
      AppModule,
      // {
      //   httpsOptions,
      //   logger: new MyLogger(),
      //   cors: true,
      // },
      new ExpressAdapter(server),
    );

    app.enableCors();

    app.use(helmet());
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 10000, // limit each IP to 10000 requests per windowMs
      }),
    );

    // // adapter for e2e testing
    const httpAdapter = app.getHttpAdapter();

    // loggerMiddleware
    // tslint:disable-next-line:no-unused-expression
    NODE_ENV !== 'testing' && app.use(LoggerMiddleware);

    // interceptors
    app.useGlobalInterceptors(new LoggingInterceptor());
    app.useGlobalInterceptors(new TimeoutInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());

    // global nest setup
    app.useGlobalPipes(new ValidationPipe());

    // Starts listening to shutdown hooks
    app.enableShutdownHooks();

    const options = new DocumentBuilder()
      .setTitle('Nestjs Restful Best Practice')
      .setDescription('built NestJS, TypeORM, MongoDB')
      .setVersion('1.0')
      .addTag('chnirt', 'developer')
      .setContactEmail('trinhchinchin@mail.com')
      .setExternalDoc('For more information', 'http://swagger.io')
      .addBearerAuth('Authorization', 'header')
      .setBasePath('/api')
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);

    // app.setGlobalPrefix('api');

    await app.init();

    http.createServer(server).listen(PORT!);
    https.createServer(httpsOptions, server).listen(443);

    // hot module replacement
    if (module.hot) {
      module.hot.accept();
      module.hot.dispose(() => app.close());
    }

    NODE_ENV !== 'production'
      ? Logger.log(
          `🚀  Server ready at https://${DOMAIN!}:${chalk
            .hex('#87e8de')
            .bold(`${PORT!}`)}`,
          'Bootstrap',
        )
      : Logger.log(
          `🚀  Server is listening on port ${chalk
            .hex('#87e8de')
            .bold(`${PORT!}`)}`,
          'Bootstrap',
        );
  } catch (error) {
    // logger.error(error)
    Logger.error(`❌  Error starting server, ${error}`, '', 'Bootstrap', false);
    process.exit();
  }
}
bootstrap().catch(e => {
  throw e;
});
