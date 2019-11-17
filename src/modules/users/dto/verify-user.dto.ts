import { ApiModelProperty } from '@nestjs/swagger'
import { IsNotEmpty, Length, IsEmail, IsMobilePhone } from 'class-validator'

export class VerifyUserDto {
	@ApiModelProperty({
		default: 'trinhchin.innos@gmail.com',
		example: 'trinhchin.innos@gmail.com',
		description: 'The email of the User'
	})
	@IsEmail()
	@IsNotEmpty()
	readonly email: string

	@ApiModelProperty({
		default: '+6595555972',
		example: '+6595555972',
		description: 'The phone of the User'
	})
	// @IsMobilePhone('vi-VN')
	@IsMobilePhone('en-SG')
	@IsNotEmpty()
	readonly phone: string

	@ApiModelProperty({
		default: '123456',
		example: '123456',
		description: 'The otp of the User'
	})
	// @Length(6, 6)
	@IsNotEmpty()
	readonly otp: string
}
