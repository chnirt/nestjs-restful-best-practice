import { ApiModelProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateAttendanceDto {
	@ApiModelProperty({
		default: 'xxxx-xxxx-xxxx-xxxx',
		example: 'xxxx-xxxx-xxxx-xxxx',
		description: 'The studentId of the Student'
	})
	@IsNotEmpty()
	readonly studentId: string

	@ApiModelProperty({
		default: true,
		example: true,
		description: 'The present of the Student'
	})
	@IsNotEmpty()
	readonly present: boolean
}
