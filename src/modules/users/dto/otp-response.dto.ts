import { ApiModelProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class OtpResponseDto {
  @ApiModelProperty({
    default: '678900',
    example: '678900',
    description: 'The otp of the OtpResponseDto'
  })
  @IsNotEmpty()
  readonly otp: string

  @ApiModelProperty({
    default: 60,
    example: 60,
    description: 'The remaining of the OtpResponseDto'
  })
  @IsNotEmpty()
  readonly remaining: number
}
