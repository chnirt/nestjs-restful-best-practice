import { ApiModelProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, Min, Max, IsNumber, IsBoolean } from 'class-validator'

export class ReplaceBannerDto {

	@ApiModelProperty({
		default: 'Enjoy Chewapp for Free',
		example: 'Enjoy Chewapp for Free',
		description: 'The title of the Banner'
	})
	@IsNotEmpty()
	readonly title: string

	@ApiModelProperty({
		default: 'https://xxxxxxxxx',
		example: 'https://xxxxxxxxx',
		description: 'The imageUrl of the Banner'
	})
	@IsNotEmpty()
	readonly imageUrl: string

	@ApiModelProperty({
		default: 1,
		example: 1,
		description: 'The position of the Banner'
	})
	@Max(20)
	@Min(1)
	@IsNumber()
	@IsNotEmpty()
	readonly position: number

	@ApiModelProperty({
		default: '<h1>Hello</h1>',
		example: '<h1>Hello</h1>',
		description: 'The detail of the Banner'
	})
	@IsOptional()
	readonly detail: string

	@ApiModelProperty({
		default: false,
		example: false,
		description: 'The published of the Banner'
	})
	@IsBoolean()
	@IsNotEmpty()
	readonly published: boolean
}
