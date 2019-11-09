import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @ApiModelProperty()
  @Length(5, 20)
  @IsNotEmpty()
  name: string;

  @ApiModelProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiModelProperty()
  @IsNotEmpty()
  password: string;

  @ApiModelProperty()
  @Length(8, 8)
  @IsNotEmpty()
  referralCode: string;
}
