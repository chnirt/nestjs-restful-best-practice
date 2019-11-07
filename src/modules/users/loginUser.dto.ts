import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiModelProperty()
  @IsNotEmpty()
  username: string;

  @ApiModelProperty()
  @IsNotEmpty()
  password: string;
}
