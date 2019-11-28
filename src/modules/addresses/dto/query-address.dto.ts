import { ApiModelProperty } from '@nestjs/swagger';

class QueryFilterDto {
  @ApiModelProperty({
    type: String,
    example: 'age',
  })
  readonly field: string;

  @ApiModelProperty({
    type: String,
    example: 'gt',
  })
  readonly comparator: string;

  @ApiModelProperty({
    type: Object,
    example: 25,
  })
  readonly value: any;
}
