import { ApiModelProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { UserEntity } from '../user.entity'

export class LoginResponseDto {
	@ApiModelProperty({
		example: UserEntity,
		description: 'The user of the LoginResponse'
	})
	@IsNotEmpty()
	readonly user: UserEntity

	@ApiModelProperty({
		example: 'xxxxxxxxxx',
		description: 'The accessToken of the LoginResponse'
	})
	@IsNotEmpty()
	readonly accessToken: string

	@ApiModelProperty({
		example: 60 * 60 * 24 * 30,
		description: 'The expiresIn of the LoginResponse'
	})
	@IsNotEmpty()
	readonly expiresIn: number
}
