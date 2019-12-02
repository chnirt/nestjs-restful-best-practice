import {
	Injectable,
	NotFoundException,
	ForbiddenException
} from '@nestjs/common'
import { getMongoRepository } from 'typeorm'

import { CreateDealDto } from './dto/create-deal.dto'
import { DealEntity } from './deal.entity'
import { uploadFile } from '../../shared'
import { ServiceType, ItemType } from './enum/deal.enum'

export type Deal = any

@Injectable()
export class DealsService {
	async findAll(query): Promise<Deal[] | undefined> {
		// console.log(query)
		const { offset, limit } = query

		const pipelineArray = []

		if (offset) {
			if (offset < 1) {
				throw new ForbiddenException('The offset must be greater than 0')
			} else {
				pipelineArray.push({ $skip: +offset })
			}
		}

		if (limit) {
			if (limit < 1) {
				throw new ForbiddenException('The limit must be greater than 0')
			} else {
				pipelineArray.push({ $limit: +limit })
			}
		}

		const createdBy = [
			{
				$lookup: {
					from: 'users',
					localField: 'createdBy',
					foreignField: '_id',
					as: 'createdBy'
				}
			},
			{
				$project: {
					'createdBy.email': 0,
					'createdBy.password': 0,
					'createdBy.referralCode': 0,
					'createdBy.verified': 0,
					'createdBy.createdAt': 0,
					'createdBy.updatedAt': 0,
					'createdBy.phone': 0
				}
			}
		]

		pipelineArray.push(...createdBy)

		return getMongoRepository(DealEntity)
			.aggregate(pipelineArray)
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
		const {
			dealType,
			serviceType,
			itemType,
			location,
			duration,
			payment
		} = createDealDto

		let convertCreateDealDto
		let newDeal

		if (
			createDealDto.serviceType === ServiceType.FoodDelivery &&
			createDealDto.itemType === ItemType.None
		) {
			throw new ForbiddenException('Service type and Item type is incorrect.')
		}

		if (file && file.size > 1024 * 1024 * 2) {
			throw new ForbiddenException('The import file is too large to upload')
		}

		if (createDealDto.itemType === ItemType.Anything) {
			convertCreateDealDto = {
				dealType,
				serviceType,
				itemType,
				location,
				duration,
				payment
			}

			newDeal = await getMongoRepository(DealEntity).save(
				new DealEntity(convertCreateDealDto)
			)

			return newDeal
		} else {
			const thumbnail = await uploadFile(file)

			convertCreateDealDto = {
				...createDealDto,
				thumbnail,
				expiredAt: +new Date() + 1000 * createDealDto.duration,
				createdBy: _id
			}

			delete convertCreateDealDto.duration

			if (createDealDto.serviceType !== ServiceType.FoodDelivery) {
				delete convertCreateDealDto.itemType
			}

			newDeal = await getMongoRepository(DealEntity).save(
				new DealEntity(convertCreateDealDto)
			)

			return newDeal
		}
	}

	async update() {
		return ''
	}
}
