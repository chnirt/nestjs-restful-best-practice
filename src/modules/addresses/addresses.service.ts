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

		if (offset < 1) {
			throw new ForbiddenException('The offset must be greater than 0')
		}

		if (limit < 1) {
			throw new ForbiddenException('The offset must be greater than 0')
		}

		const addresses = await getMongoRepository(AddressEntity).find({
			createdBy: _id
		})

		return addresses
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
