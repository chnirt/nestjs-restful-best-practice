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
      throw new NotFoundException('Deal not found.')
    }

    return foundDeal
  }

  async insert(createDealDto: CreateDealDto, file: any, req: any) {
    // console.log(createDealDto, file, req.user._id)
    const { dealType } = createDealDto

    const thumbnail = await uploadFile(file)
    // const thumbnail = ''
    const option = dealType === 'Request'
      ? { requester: req.user._id }
      : { offerer: req.user._id }

    const newDeal = await getMongoRepository(DealEntity).save(
      new DealEntity({ ...createDealDto, ...option })
    )

    return newDeal
  }

  async update() {
    return ''
  }
}
