import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { Hero } from './hero.entity';
import { HeroesService } from './heroes.service';

@Crud({
  model: {
    type: Hero,
  },
  params: {
    _id: {
      field: '_id',
      type: 'uuid',
      primary: true,
    },
  },
  // routes: {
  //   only: ['getManyBase'],
  //   getManyBase: {
  //     decorators: [UseGuards(HeroAuthGuard)],
  //   },
  // },
})
@Controller('heroes')
export class HeroesController {
  constructor(public service: HeroesService) {}
}
