import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class LoginUserDto {
  @ApiModelProperty({ description: 'The email of the User' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiModelProperty({ description: 'The password of the User' })
  @IsNotEmpty()
  readonly password: string;
}
