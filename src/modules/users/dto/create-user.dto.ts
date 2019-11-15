import { ApiModelProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsEmail, Length } from 'class-validator'

export class CreateUserDto {
	@ApiModelProperty({
		example: 'trinhchin',
		description: 'The name of the User'
	})
	@Length(5, 20)
	@IsNotEmpty()
	readonly name: string

	@ApiModelProperty({
		example: 'trinhchin.innos@gmail.com',
		description: 'The email of the User'
	})
	@IsEmail()
	@IsNotEmpty()
	readonly email: string

	@ApiModelProperty({
		example: '0',
		description: 'The password of the User'
	})
	@IsNotEmpty()
	readonly password: string

	@ApiModelProperty({
		example: '12341234',
		description: 'The referralCode of the User'
	})
	@Length(8, 8)
	@IsNotEmpty()
	readonly referralCode: string
}
