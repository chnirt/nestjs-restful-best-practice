import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { uuidv4 } from '../../utils';
import { Exclude, plainToClass } from 'class-transformer';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity({
  name: 'users',
  orderBy: {
    createdAt: 'ASC',
  },
})
export class UserEntity {
  @ApiModelProperty({ description: 'The _id of the User' })
  @ObjectIdColumn()
  _id: string;

  // basic

  @ApiModelProperty({ description: 'The name of the User' })
  @Column()
  name: string;

  @ApiModelProperty({ description: 'The email of the User' })
  @Column()
  email: string;

  @ApiModelProperty({ description: 'The password of the User' })
  @Exclude()
  @Column()
  password: string;

  @ApiModelProperty({ description: 'The referralCode of the User' })
  @Column()
  referralCode: string;

  @ApiModelProperty({ description: 'The createdAt of the User' })
  @Column()
  createdAt: number;
  @ApiModelProperty({ description: 'The updatedAt of the User' })
  @Column()
  updatedAt: number;

  constructor(partial: Partial<UserEntity>) {
    if (partial) {
      Object.assign(this, partial);
      this._id = this._id || uuidv4();
      this.createdAt = this.createdAt || +new Date();
      this.updatedAt = +new Date();
    }
  }
}
