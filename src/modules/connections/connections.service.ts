import { Injectable, ForbiddenException } from '@nestjs/common'
import { getMongoRepository } from 'typeorm'
import { ConnectionEntity } from './connection.entity'
import { UserEntity } from '../../modules/users/user.entity'
import { DealEntity } from '../../modules/deals/deal.entity'

export type Connection = any

@Injectable()
export class ConnectionsService {
	async findAll(query: any, req: any): Promise<Connection[]> {
		const { offset, limit } = query
		const { user } = req
		const { _id } = user

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

		const deal = [
			{
				$lookup: {
					from: 'deals',
					localField: 'deal',
					foreignField: '_id',
					as: 'deal'
				}
			},
			{
				$project: {
					'deal.serviceType': 0,
					'deal.itemType': 0,
					'deal.description': 0,
					'deal.shopName': 0,
					'deal.location': 0,
					'deal.destination': 0,
					'deal.payment': 0,
					'deal.expiredAt': 0,
					'deal.createdAt': 0,
					'deal.updatedAt': 0
				}
			},
			{
				$unwind: {
					path: '$deal',
					preserveNullAndEmptyArrays: true
				}
			}
		]

		const match = [
			{
				$match: {
					$or: [{ connectedBy: _id }, { 'deal.createdBy': _id }]
				}
			}
		]

		const dealCreatedBy = [
			{
				$lookup: {
					from: 'users',
					localField: 'deal.createdBy',
					foreignField: '_id',
					as: 'deal.createdBy'
				}
			},
			{
				$project: {
					'deal.createdBy.email': 0,
					'deal.createdBy.password': 0,
					'deal.createdBy.referralCode': 0,
					'deal.createdBy.verified': 0,
					'deal.createdBy.createdAt': 0,
					'deal.createdBy.updatedAt': 0,
					'deal.createdBy.phone': 0
				}
			},
			{
				$unwind: {
					path: '$deal.createdBy',
					preserveNullAndEmptyArrays: true
				}
			}
		]

		const createdBy = [
			{
				$lookup: {
					from: 'users',
					localField: 'connectedBy',
					foreignField: '_id',
					as: 'connectedBy'
				}
			},
			{
				$project: {
					'connectedBy.email': 0,
					'connectedBy.password': 0,
					'connectedBy.referralCode': 0,
					'connectedBy.verified': 0,
					'connectedBy.createdAt': 0,
					'connectedBy.updatedAt': 0,
					'connectedBy.phone': 0
				}
			},
			{
				$unwind: {
					path: '$connectedBy',
					preserveNullAndEmptyArrays: true
				}
			}
		]

		pipelineArray.push(...deal, ...match, ...dealCreatedBy, ...createdBy)

		return await getMongoRepository(ConnectionEntity)
			.aggregate(pipelineArray)
			.toArray()
	}

	async insert(deal: string, req: any): Promise<Connection> {
		const { user } = req
		const { _id } = user

		const foundDeal = await getMongoRepository(DealEntity).findOne({
			_id: deal
		})

		if (!foundDeal) {
			throw new ForbiddenException('Deal not found')
		}

		const foundAddress = await getMongoRepository(ConnectionEntity).findOne({
			deal,
			connectedBy: _id
		})

		if (foundAddress) {
			throw new ForbiddenException('Connection already existed')
		}

		const newConnection = await getMongoRepository(ConnectionEntity).save(
			new ConnectionEntity({ deal, connectedBy: _id })
		)

		const connectedBy = await getMongoRepository(UserEntity).findOne({
			where: {
				_id: newConnection.connectedBy
			},
			select: ['_id', 'name', 'avatar']
		})

		newConnection.connectedBy = connectedBy

		return newConnection
	}
}
