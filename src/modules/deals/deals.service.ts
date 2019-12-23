import {
	Injectable,
	NotFoundException,
	ForbiddenException
} from '@nestjs/common'
import { getMongoRepository } from 'typeorm'
import * as geolib from 'geolib'

import { CreateDealDto } from './dto/create-deal.dto'
import { DealEntity } from './deal.entity'
import { ServiceType, ItemType } from './enum/deal.enum'
import { UserEntity } from '../../modules/users/user.entity'

const from = {
	latitude: 10.783,
	longitude: 106.692
}
const to = {
	latitude: 10.807,
	longitude: 106.709
}

console.log(
	'You are ',
	geolib.getDistance(from, to),
	`meters away from ${from}`
)

export type Deal = any

@Injectable()
export class DealsService {
	// TODO:
	async findAll(query): Promise<Deal[] | undefined> {
		// console.log(query)
		const { dealType, serviceType, itemType, offset, limit } = query

		const pipelineArray = []

		if (offset) {
			if (offset < 1) {
				throw new ForbiddenException('The offset must be greater than 0')
			} else {
				pipelineArray.push({
					$skip: +offset
				})
			}
		}

		if (limit) {
			if (limit < 1) {
				throw new ForbiddenException('The limit must be greater than 0')
			} else {
				pipelineArray.push({
					$limit: +limit
				})
			}
		}

		const connections = [
			{
				$lookup: {
					from: 'connections',
					localField: '_id',
					foreignField: 'dealId',
					as: 'connections'
				}
			},
			{
				$addFields: {
					connections: {
						$size: '$connections'
					}
				}
			}
		]

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
			},
			{
				$unwind: {
					path: '$createdBy',
					preserveNullAndEmptyArrays: true
				}
			}
		]

		pipelineArray.push(...connections, ...createdBy)

		// console.log(dealType)

		if (dealType) {
			pipelineArray.push({ $match: { dealType } })
		}

		if (serviceType) {
			pipelineArray.push({ $match: { serviceType } })
		}

		if (itemType) {
			pipelineArray.push({ $match: { itemType } })
		}

		return await getMongoRepository(DealEntity)
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

	// TODO:
	async insert(createDealDto: CreateDealDto, req: any) {
		// console.log(createDealDto, file, req.user._id)
		try {
			const { user } = req
			const { _id } = user
			const {
				dealType,
				serviceType,
				itemType,
				location,
				destination,
				duration,
				payment
			} = createDealDto

			let convertCreateDealDto
			let newDeal

			if (
				(createDealDto.serviceType === ServiceType.FoodDelivery &&
					createDealDto.itemType === ItemType.None) ||
				(createDealDto.serviceType !== ServiceType.FoodDelivery &&
					createDealDto.itemType !== ItemType.None)
			) {
				throw new ForbiddenException('Service type and Item type is incorrect.')
			}

			// if (file && file.size > 1024 * 1024 * 2) {
			// 	throw new ForbiddenException('The thumbnail is too large to upload')
			// }

			// console.log(createDealDto)

			if (createDealDto.items === 'Anything') {
				convertCreateDealDto = {
					dealType,
					serviceType,
					itemType,
					location: JSON.parse(location.toString()),
					destination: JSON.parse(destination.toString()),
					duration,
					payment
				}

				newDeal = await getMongoRepository(DealEntity).save(
					new DealEntity(convertCreateDealDto)
				)
			} else {
				// console.log(file)

				// if (!file) {
				// 	throw new ForbiddenException('Thumbnail not found.')
				// }

				// const thumbnail = await uploadFile(file)

				convertCreateDealDto = {
					...createDealDto,
					// thumbnail,
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
			}

			const createdBy = await getMongoRepository(UserEntity).findOne({
				where: {
					_id: newDeal.createdBy
				},
				select: ['_id', 'name', 'avatar']
			})

			newDeal.createdBy = createdBy

			return newDeal
		} catch (error) {
			throw new Error(error)
		}
	}

	async findByUserId(req: any, query: any): Promise<Deal[] | undefined> {
		const { user } = req
		const { _id } = user

		const { dealType } = query

		console.log(_id)

		const pipelineArray = []

		if (_id) {
			pipelineArray.push({ $match: { createdBy: _id } })
		}

		if (dealType) {
			pipelineArray.push({ $match: { dealType } })
		}

		const connections = [
			{
				$lookup: {
					from: 'connections',
					localField: '_id',
					foreignField: 'dealId',
					as: 'connections'
				}
			},
			{
				$addFields: {
					connections: {
						$size: '$connections'
					}
				}
			}
		]

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
			},
			{
				$unwind: {
					path: '$createdBy',
					preserveNullAndEmptyArrays: true
				}
			}
		]

		pipelineArray.push(...connections, ...createdBy)

		return await getMongoRepository(DealEntity)
			.aggregate(pipelineArray)
			.toArray()
	}
}
