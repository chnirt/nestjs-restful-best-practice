import { Injectable, ForbiddenException } from '@nestjs/common'
import { CreateAddressDto } from './dto/create-address.dto'
import { AddressEntity } from './address.entity'
import { getMongoRepository } from 'typeorm'

export type Address = any

@Injectable()
export class AddressesService {
	async findAll(query: any, req: any): Promise<Address[]> {
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

		const match = [
			{
				$match: {
					createdBy: _id
				}
			},
			{
				$project: {
					createdBy: 0,
					createdAt: 0,
					updatedAt: 0
				}
			}
		]

		pipelineArray.push(...match)

		return await getMongoRepository(AddressEntity)
			.aggregate(pipelineArray)
			.toArray()
	}

	async insert(createAddressDto: CreateAddressDto, req: any): Promise<boolean> {
		const { user } = req
		const { _id } = user
		const { addressType } = createAddressDto

		if (addressType !== 'Others') {
			const foundAddress = await getMongoRepository(AddressEntity).findOne({
				addressType,
				createdBy: _id
			})

			if (foundAddress) {
				throw new ForbiddenException(
					`Address at ${addressType} already existed`
				)
			}
		}

		const newAddress = await getMongoRepository(AddressEntity).save(
			new AddressEntity({ ...createAddressDto, createdBy: _id })
		)

		return newAddress && true
	}
}
