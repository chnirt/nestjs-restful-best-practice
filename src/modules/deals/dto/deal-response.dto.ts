import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsEnum, IsOptional } from 'class-validator'

import { ItemType, ServiceType, PaymentType, DealType } from '../enum/deal.enum'
import { Position } from '../entity/position.entity'

export class DealResponseDto {
	@ApiModelProperty({
		enum: ['Request', 'Offer'],
		example: 'Request',
		description: 'The deal type of the Deal'
	})
	@IsEnum(DealType)
	@IsNotEmpty()
	readonly dealType: DealType

	@ApiModelProperty({
		enum: [
			'FoodDelivery',
			'Pickup',
			'PharmacyPurchase',
			'Queue',
			'OverseasPurchase',
			'Others'
		],
		example: 'FoodDelivery',
		description: 'The service type of the Deal'
	})
	@IsEnum(ServiceType)
	@IsNotEmpty()
	readonly serviceType: ServiceType

	@ApiModelProperty({
		enum: ['None', 'Meal', 'Drinks', 'Desserts', 'Snacks'],
		example: 'Meal',
		description: 'The item type of the Deal'
	})
	@IsEnum(ItemType)
	@IsNotEmpty()
	readonly itemType: ItemType

	@ApiModelProperty({
		example: 'Nui xào bò lúc lắc',
		required: false,
		description: 'The items of the Deal'
	})
	@IsOptional()
	readonly items: string

	@ApiModelProperty({
		example: 'Noodle beef cube',
		required: false,
		description: 'The description of the Deal'
	})
	@IsOptional()
	readonly description: string

	@ApiModelProperty({
		example: 'Tâm Ký',
		required: false,
		description: 'The shopName of the Deal'
	})
	@IsOptional()
	readonly shopName: string

	@ApiModelProperty({
		example: 'https://xxx.xxx',
		required: false,
		description: 'The thumbnail of the Deal'
	})
	@IsOptional()
	thumbnail: string

	@ApiModelPropertyOptional({
		example: {
			latitude: 10.780230999999999,
			longitude: 106.6645121
		},
		description: 'The location of the Deal'
	})
	@IsNotEmpty()
	readonly location: Position

	@ApiModelPropertyOptional({
		example: {
			latitude: 10.780230999999999,
			longitude: 106.6645121
		},
		description: 'The destination of the Deal'
	})
	@IsNotEmpty() // I have no preference auto get location device
	readonly destination: Position

	@ApiModelProperty({
		example: +new Date() + 60 * 60 * 30,
		description: 'The expiredAtt of the Deal'
	})
	@IsNotEmpty() // 30m 1h 1h30 2h
	readonly expiredAt: number

	@ApiModelProperty({
		enum: ['Chewpay', 'Cod'],
		description: 'The payment of the Deal'
	})
	@IsEnum(PaymentType)
	@IsNotEmpty()
	readonly payment: PaymentType

	@ApiModelProperty({
		example: 10,
		description: 'The connections of the Deal'
	})
	@IsNotEmpty()
	readonly connections: number

	@ApiModelProperty({
		example: +new Date(),
		description: 'The createdAt of the Deal'
	})
	@IsNotEmpty()
	readonly createdAt: number

	@ApiModelProperty({
		example: +new Date(),
		description: 'The updatedAt of the Deal'
	})
	@IsNotEmpty()
	readonly updatedAt: number
}
