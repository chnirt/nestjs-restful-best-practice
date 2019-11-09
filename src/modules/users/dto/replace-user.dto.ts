import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class ReplaceUserDto {
  @ApiModelProperty()
  @Length(5, 20)
  @IsNotEmpty()
  name: string;

  @ApiModelProperty()
  @Length(8, 8)
  @IsNotEmpty()
  referralCode: string;
}
