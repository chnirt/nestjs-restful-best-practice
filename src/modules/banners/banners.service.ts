import { Injectable, ForbiddenException } from '@nestjs/common';
import { getMongoRepository } from 'typeorm';
import { BannerEntity } from './banner.entity';
import { CreateBannerDto } from './dto/create-banner.dto';

export type Banner = any

@Injectable()
export class BannersService {
  async findAll(query): Promise<Banner[] | undefined> {
    // console.log(query)
    const { offset, limit } = query

    if (offset < 1) {
      throw new ForbiddenException('The offset must be greater than 0')
    }

    if (limit < 1) {
      throw new ForbiddenException('The offset must be greater than 0')
    }

    return getMongoRepository(BannerEntity).find({
      skip: +offset | 0,
      take: +limit | 100,
    })
  }

  async insert(createBannerDto: CreateBannerDto) {
    const newAddress = await getMongoRepository(BannerEntity).save(
      new BannerEntity({ ...createBannerDto })
    )

    return newAddress
  }
}
