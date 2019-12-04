import { ApiModelProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty } from 'class-validator'
import { DealType, ServiceType, ItemType } from '../enum/deal.enum'

export class FilterDealDto {
	@ApiModelProperty({
		enum: ['Request', 'Offer'],
		example: 'Meal',
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
		example: 'Delivery',
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
}
