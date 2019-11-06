import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import chalk from 'chalk';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

import {
  ValidationPipe,
  LoggerMiddleware,
  TimeoutInterceptor,
  LoggingInterceptor,
} from './common';
import { MyLogger } from './config';

import { NODE_ENV, DOMAIN, PORT, RATE_LIMIT_MAX, STATIC } from './environments';

declare const module: any;

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      logger: new MyLogger(),
      cors: true,
    });

    // // adapter for e2e testing
    const httpAdapter = app.getHttpAdapter();

    // loggerMiddleware
    // tslint:disable-next-line:no-unused-expression
    NODE_ENV !== 'testing' && app.use(LoggerMiddleware);

    // interceptors
    app.useGlobalInterceptors(new LoggingInterceptor());
    app.useGlobalInterceptors(new TimeoutInterceptor());

    // global nest setup
    app.useGlobalPipes(new ValidationPipe());

    app.enableShutdownHooks();

    const options = new DocumentBuilder()
      .setTitle('Nestjs Restful Best Practice')
      .setDescription('built Nestjs, TypeORM, Mongodb')
      .setVersion('1.0')
      .addTag('chnirt')
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);

    await app.listen(PORT);

    // hot module replacement
    if (module.hot) {
      module.hot.accept();
      module.hot.dispose(() => app.close());
    }

    NODE_ENV !== 'production'
      ? Logger.log(
          `🚀  Server ready at http://${DOMAIN!}:${chalk
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
