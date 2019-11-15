import { Injectable, NotFoundException } from '@nestjs/common';
import { getMongoRepository } from 'typeorm';

import { CreateDealDto } from './dto/create-deal.dto';
import { DealEntity } from './deal.entity';
import { uploadFile } from '../../shared';

export type Deal = any

@Injectable()
export class DealsService {
  async findAll(): Promise<Deal[] | undefined> {
    return getMongoRepository(DealEntity).find()
  }

  async findOne(_id: string): Promise<Deal | undefined> {
    const foundDeal = await getMongoRepository(DealEntity).findOne({ _id })

    if (!foundDeal) {
      throw new NotFoundException('Deal not found')
    }

    return foundDeal
  }

  async insert(createDealDto: CreateDealDto, file: any, req: any) {
    // console.log(createDealDto, file, req.user._id)
    const { dealType } = createDealDto

    const option = dealType === 'Request'
      ? { requester: req.user._id }
      : { offerer: req.user._id }

    const thumbnail = await uploadFile(file)

    const convertCreateDealDto = {
      ...createDealDto,
      thumbnail,
      expiredAt: +new Date() + 1000 * createDealDto.duration,
      ...option
    }
    delete convertCreateDealDto.duration

    const newDeal = await getMongoRepository(DealEntity).save(convertCreateDealDto)

    return newDeal
  }

  async update() {
    return ''
  }
}
