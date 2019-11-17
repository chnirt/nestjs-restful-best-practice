import { ApiModelProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsEmail, IsMobilePhone } from 'class-validator'

export class OtpUserDto {
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
}
