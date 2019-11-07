import { Test, TestingModule } from '@nestjs/testing';
import { HeroesController } from './heroes.controller';

describe('Heroes Controller', () => {
  let controller: HeroesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HeroesController],
    }).compile();

    controller = module.get<HeroesController>(HeroesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
