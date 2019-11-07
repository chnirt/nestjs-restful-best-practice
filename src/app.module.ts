import { Module, CacheModule, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TerminusModule } from '@nestjs/terminus';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CacheService, TypeormService } from './config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { TerminusOptionsService } from './terminus-options.service';
import { EventsModule } from './modules/events/events.module';
import { EventsGateway } from './modules/events/events.gateway';
import { HeroesModule } from './modules/heroes/heroes.module';

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
    TerminusModule.forRootAsync({
      useClass: TerminusOptionsService,
    }),
    UsersModule,
    AuthModule,
    EventsModule,
    HeroesModule,
  ],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    console.log(`The module has been initialized.`);
  }
}
