import { ApiModelProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class LoginResponseDto {
  @ApiModelProperty({
    example: 'xxxxxxxxxx',
    description: 'The accessToken of the LoginResponse'
  })
  @IsNotEmpty()
  readonly accessToken: string

  @ApiModelProperty({
    example: '30d',
    description: 'The expiresIn of the LoginResponse'
  })
  @IsNotEmpty()
  readonly expiresIn: string
}
