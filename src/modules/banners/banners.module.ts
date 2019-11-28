import { Module } from '@nestjs/common';
import { BannersController } from './banners.controller';
import { BannersService } from './banners.service';

@Module({
  controllers: [BannersController],
  providers: [BannersService]
})
export class BannersModule {}
