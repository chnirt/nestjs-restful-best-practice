import {
	Injectable,
	NotFoundException,
	ForbiddenException
} from '@nestjs/common'
import { getMongoRepository } from 'typeorm'

import { CreateDealDto } from './dto/create-deal.dto'
import { DealEntity } from './deal.entity'
import { uploadFile } from '../../shared'

export type Deal = any

@Injectable()
export class DealsService {
	async findAll(query): Promise<Deal[] | undefined> {
		// console.log(query)
		const { offset, limit } = query

		if (offset < 1) {
			throw new ForbiddenException('The offset must be greater than 0')
		}

		if (limit < 1) {
			throw new ForbiddenException('The offset must be greater than 0')
		}

		return getMongoRepository(DealEntity)
			.aggregate([
				{ $skip: +offset | 0 },
				{ $limit: +limit | 100 },
				{ $sort: { _id: -1 } },
				{
					$lookup: {
						from: 'users',
						localField: 'createdBy',
						foreignField: '_id',
						as: 'createdBy'
					}
				},
				{
					$project: { 'createdBy.password': 0 }
				}
			])
			.toArray()
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
		const { user } = req
		const { _id } = user

		if (file && file.size > 1024 * 1024 * 2) {
			throw new ForbiddenException('The import file is too large to upload')
		}

		const thumbnail = await uploadFile(file)

		const convertCreateDealDto = {
			...createDealDto,
			thumbnail,
			expiredAt: +new Date() + 1000 * createDealDto.duration,
			createdBy: _id
		}

		delete convertCreateDealDto.duration

		const newDeal = await getMongoRepository(DealEntity).save(
			new DealEntity(convertCreateDealDto)
		)

		return newDeal
	}

	async update() {
		return ''
	}
}
