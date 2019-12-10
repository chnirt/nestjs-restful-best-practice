import { ApiModelProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class ReplaceStudentDto {
	@ApiModelProperty({
		default: 'xxxx-xxxx-xxxx-xxxx',
		example: 'xxxx-xxxx-xxxx-xxxx',
		description: 'The classId of the Student'
	})
	@IsNotEmpty()
	readonly classId: string

	@ApiModelProperty({
		default: 1,
		example: 1,
		description: 'The stt of the Student'
	})
	@IsNotEmpty()
	readonly stt: number

	@ApiModelProperty({
		default: 'Trần Thế Anh',
		example: 'Trần Thế Anh',
		description: 'The fullName of the Student'
	})
	@IsNotEmpty()
	readonly fullName: string
}
