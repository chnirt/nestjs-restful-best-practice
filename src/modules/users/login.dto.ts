import { ApiModelProperty } from '@nestjs/swagger';

export class Login {
  @ApiModelProperty()
  username: string;

  @ApiModelProperty()
  password: string;
}
