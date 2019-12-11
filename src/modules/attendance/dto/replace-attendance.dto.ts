import { ApiModelProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class ReplaceAttendanceDto {
	@ApiModelProperty({
		default: true,
		example: true,
		description: 'The present of the Student'
	})
	@IsNotEmpty()
	readonly present: boolean
}
