import { Module } from '@nestjs/common'
import { DealsController } from './deals.controller'
import { DealsService } from './deals.service'

@Module({
	controllers: [DealsController],
	providers: [DealsService],
	exports: [DealsService]
})
export class DealsModule {}
