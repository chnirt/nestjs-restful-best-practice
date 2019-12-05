import { ApiModelProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateClassDto {
	@ApiModelProperty({
		default: '11A1',
		example: '11A1',
		description: 'The name of the Class'
	})
	@IsNotEmpty()
	readonly name: string

	@ApiModelProperty({
		default: 'TVK',
		example: 'TVK',
		description: 'The school of the Class'
	})
	@IsNotEmpty()
	readonly school: string
}
