import { ApiModelProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsEnum, IsOptional } from 'class-validator'

import { AddressType } from '../enum/address.enum'
import { Position } from '../../deals/entity/position.entity'

export class CreateAddressDto {
	@ApiModelProperty({
		enum: ['Home', 'Workplace', 'Others'],
		example: 'Home',
		description: 'The addressType of the Address'
	})
	@IsEnum(AddressType)
	@IsNotEmpty()
	readonly addressType: AddressType

	@ApiModelProperty({
		default: 'Viva coffee',
		example: 'Viva coffee',
		description: 'The name of the Address'
	})
	@IsOptional()
	readonly name: string

	@ApiModelProperty({
		default: {
			latitude: 10.780230999999999,
			longitude: 106.6645121
		},
		example: {
			latitude: 10.780230999999999,
			longitude: 106.6645121
		},
		description: 'The location of the Address'
	})
	@IsNotEmpty()
	readonly location: Position

	@ApiModelProperty({
		default: 69,
		example: 69,
		description: 'The unitNumber of the Address'
	})
	@IsNotEmpty() // 30m 1h 1h30 2h
	readonly unitNumber: number

	@ApiModelProperty({
		default: 'Đối diện BigC',
		example: 'Đối diện BigC',
		description: 'The remarks of the Address'
	})
	@IsOptional()
	readonly remarks: string
}
