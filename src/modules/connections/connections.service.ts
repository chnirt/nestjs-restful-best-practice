import { Injectable, ForbiddenException } from '@nestjs/common'
import { getMongoRepository } from 'typeorm'
import { ConnectionEntity } from './connection.entity'

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

	async insert(dealId: string, req: any): Promise<boolean> {
		const { user } = req
		const { _id } = user

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

		return newConnection && true
	}
}
