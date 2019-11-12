import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @ApiModelProperty({ description: 'The name of the User' })
  @Length(5, 20)
  @IsNotEmpty()
  readonly name: string;

  @ApiModelProperty({ description: 'The email of the User' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiModelProperty({ description: 'The password of the User' })
  @IsNotEmpty()
  readonly password: string;

  @ApiModelProperty({ description: 'The referralCode of the User' })
  @Length(8, 8)
  @IsNotEmpty()
  readonly referralCode: string;
}
