import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class TotpDto {
  @ApiModelProperty({ description: 'The secret of the Totp' })
  @IsNotEmpty()
  readonly secret: string;

  @ApiModelProperty({ description: 'The token of the Totp' })
  @Length(6, 6)
  @IsNotEmpty()
  readonly token: string;
}
