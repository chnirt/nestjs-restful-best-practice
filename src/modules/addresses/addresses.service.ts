import { Injectable, ForbiddenException } from '@nestjs/common'
import { CreateAddressDto } from './dto/create-address.dto'
import { AddressEntity } from './address.entity'
import { getMongoRepository } from 'typeorm'

export type Address = any

@Injectable()
export class AddressesService {
	async findAll(query): Promise<Address[] | undefined> {
		// console.log(query)
		const { offset, limit } = query

		if (offset < 1) {
			throw new ForbiddenException('The offset must be greater than 0')
		}

		if (limit < 1) {
			throw new ForbiddenException('The offset must be greater than 0')
		}

		return getMongoRepository(AddressEntity)
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
			])
			.toArray()
	}

	async insert(createAddressDto: CreateAddressDto, req: any) {
		console.log(req)
		const { user } = req
		const { _id } = user
		// if(createAddressDto.addressType === AddressType.Home) {

		// }

		const newAddress = await getMongoRepository(AddressEntity).save(
			new AddressEntity({ ...createAddressDto, createdBy: _id })
		)

		return newAddress
	}
}
