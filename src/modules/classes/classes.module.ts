import { Module } from '@nestjs/common';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';

@Module({
  controllers: [ClassesController],
  providers: [ClassesService]
})
export class ClassesModule {}
