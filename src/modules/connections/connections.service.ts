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

		if (offset < 1) {
			throw new ForbiddenException('The offset must be greater than 0')
		}

		if (limit < 1) {
			throw new ForbiddenException('The offset must be greater than 0')
		}

		const connections = await getMongoRepository(ConnectionEntity).find({
			connectedBy: _id
		})

		return connections
	}

	async insert(dealId: string, req: any): Promise<Connection> {
		const { user } = req
		const { _id } = user

		const foundDeal = await getMongoRepository(DealEntity).findOne({
			_id: dealId,
		})

		if (!foundDeal) {
			throw new ForbiddenException('Deal not found')
		}

		const foundAddress = await getMongoRepository(ConnectionEntity).findOne({
			dealId,
			connectedBy: _id
		})

		if (foundAddress) {
			throw new ForbiddenException('Connection already existed')
		}

		const newConnection = await getMongoRepository(ConnectionEntity).save(
			new ConnectionEntity({ dealId, connectedBy: _id })
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
