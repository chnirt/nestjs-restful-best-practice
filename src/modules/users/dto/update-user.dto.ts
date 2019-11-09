import { ApiModelProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class UpdateUserDto {
  @ApiModelProperty()
  @Length(5, 20)
  name: string;

  @ApiModelProperty()
  @Length(8, 8)
  referralCode: string;
}
