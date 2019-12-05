import { ApiModelProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class PositionEntity {
	@ApiModelProperty({
		default: 10.780230999999999,
		example: 10.780230999999999,
		description: 'The latitude of the Position'
	})
	// @IsNotEmpty()
	latitude: number

	@ApiModelProperty({
		default: 106.6645121,
		example: 106.6645121,
		description: 'The longitude of the Position'
	})
	// @IsNotEmpty()
	longitude: number
}
