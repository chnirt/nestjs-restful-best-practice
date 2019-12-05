import { ApiModelProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class Position {
  @ApiModelProperty({
    default: {
      latitude: '10.780230999999999',
      longitude: '106.6645121'
    },
    example: {
      latitude: '10.780230999999999',
      longitude: '106.6645121'
    },
    description: 'The latitude of the Position'
  })
  @IsNotEmpty()
  readonly latitude: string

  @ApiModelProperty({
    default: {
      latitude: '10.780230999999999',
      longitude: '106.6645121'
    },
    example: {
      latitude: '10.780230999999999',
      longitude: '106.6645121'
    },
    description: 'The longitude of the Position'
  })
  @IsNotEmpty()
  readonly longitude: string
}
