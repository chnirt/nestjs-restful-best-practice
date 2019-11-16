import { Module } from '@nestjs/common';
import { BiddersService } from './bidders.service';
import { BiddersController } from './bidders.controller';

@Module({
  providers: [BiddersService],
  controllers: [BiddersController]
})
export class BiddersModule {}
