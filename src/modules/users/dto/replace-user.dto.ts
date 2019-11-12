import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class ReplaceUserDto {
  @ApiModelProperty({ description: 'The name of the User' })
  @Length(5, 20)
  @IsNotEmpty()
  readonly name: string;

  @ApiModelProperty({ description: 'The referralCode of the User' })
  @Length(8, 8)
  @IsNotEmpty()
  readonly referralCode: string;
}
