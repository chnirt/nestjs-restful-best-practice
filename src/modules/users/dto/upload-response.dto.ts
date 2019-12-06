import { ApiModelProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class UploadResponseDto {
  @ApiModelProperty({
    example: 'https://xxx.xxx',
    description: 'The path of the UploadResponse'
  })
  @IsNotEmpty()
  readonly url: string
}
