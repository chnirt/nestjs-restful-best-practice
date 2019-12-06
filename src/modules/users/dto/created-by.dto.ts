import { ApiModelProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreatedByDto {
  @ApiModelProperty({
    example: 'xxxx-xxxx-xxxx-xxxx',
    description: 'The _id of the CreatedBy'
  })
  @IsNotEmpty()
  readonly _id: string

  @ApiModelProperty({
    example: 'xxxxxxxxxx',
    description: 'The name of the CreatedBy'
  })
  @IsNotEmpty()
  readonly name: string

  @ApiModelProperty({
    example: 'https://xxx.xxx',
    description: 'The avatar of the CreatedBy'
  })
  @IsNotEmpty()
  readonly avatar: string
}
