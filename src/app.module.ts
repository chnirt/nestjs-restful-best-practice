import { Module, CacheModule, OnModuleInit } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { TerminusModule } from '@nestjs/terminus'

import { AppController } from './app.controller'
import { AppService } from './app.service'

import { CacheService, TypeormService } from './config'
import { UsersModule } from './modules/users/users.module'
import { AuthModule } from './auth/auth.module'
import { TerminusOptionsService } from './terminus-options.service'
import { EventsModule } from './modules/events/events.module'
import { EventsGateway } from './modules/events/events.gateway'
import { STATIC } from './environments'
import { DealsModule } from './modules/deals/deals.module'
import { BiddersModule } from './modules/bidders/bidders.module'
import { AddressesModule } from './modules/addresses/addresses.module'
import { ConnectionsModule } from './modules/connections/connections.module'
import { BannersModule } from './modules/banners/banners.module'
import { ClassesModule } from './modules/classes/classes.module'
import { StudentsModule } from './modules/students/students.module'
import { AttendanceModule } from './modules/attendance/attendance.module'
import { ChatsModule } from './modules/chats/chats.module'
import { ChatsGateway } from './modules/chats/chats.gateway'

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useClass: TypeormService
		}),
		CacheModule.registerAsync({
			useClass: CacheService
		}),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', STATIC)
		}),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', '.well-known/acme-challenge')
		}),
		TerminusModule.forRootAsync({
			useClass: TerminusOptionsService
		}),
		AuthModule,
		UsersModule,
		AddressesModule,
		DealsModule,
		ConnectionsModule,
		EventsModule,
		BiddersModule,
		BannersModule,
		ClassesModule,
		StudentsModule,
		AttendanceModule,
		ChatsModule
	],
	controllers: [AppController],
	providers: [AppService, EventsGateway, ChatsGateway]
})
export class AppModule implements OnModuleInit {
	onModuleInit() {
		console.log('The module has been initialized.')
	}
}
