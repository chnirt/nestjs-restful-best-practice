import { ApiModelProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsEnum, IsOptional } from 'class-validator'

import { ConnectionType } from '../enum/connection.enum'
import { Position } from '../../deals/entity/position.entity'

export class CreateConnectionDto {
	@ApiModelProperty({
		default: 'xxxx-xxxx-xxxx-xxxx',
		example: 'xxxx-xxxx-xxxx-xxxx',
		description: 'The deal of the Connection'
	})
	@IsOptional()
	readonly deal: string

	@ApiModelProperty({
		default: {
			latitude: 10.780230999999999,
			longitude: 106.6645121
		},
		example: {
			latitude: 10.780230999999999,
			longitude: 106.6645121
		},
		description: 'The location of the Connection'
	})
	@IsNotEmpty()
	readonly location: Position

	@ApiModelProperty({
		default: 69,
		example: 69,
		description: 'The unitNumber of the Connection'
	})
	@IsNotEmpty() // 30m 1h 1h30 2h
	readonly unitNumber: number

	@ApiModelProperty({
		default: 'Đối diện BigC',
		example: 'Đối diện BigC',
		description: 'The remarks of the Connection'
	})
	@IsOptional()
	readonly remarks: string
}
