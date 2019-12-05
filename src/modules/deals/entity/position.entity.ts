import { ApiModelProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Column } from 'typeorm'

export class Position {
	@ApiModelProperty({
		default: 10.780230999999999,
		example: 10.780230999999999,
		description: 'The latitude of the Position',
		type: Number
	})
	@Column()
	@IsNotEmpty()
	latitude: number

	@ApiModelProperty({
		default: 106.6645121,
		example: 106.6645121,
		description: 'The longitude of the Position',
		type: Number
	})
	@Column()
	@IsNotEmpty()
	longitude: number
}
