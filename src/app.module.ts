import { Module, CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CacheService, TypeormService } from './config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './modules/events/events.module';
import { EventsGateway } from './modules/events/events.gateway';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeormService,
    }),
    CacheModule.registerAsync({
      useClass: CacheService,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
    UsersModule,
    AuthModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}
