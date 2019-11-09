import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { uuidv4 } from '../../utils';
import { Exclude, plainToClass } from 'class-transformer';

@Entity({
  name: 'users',
  orderBy: {
    createdAt: 'ASC',
  },
})
export class UserEntity {
  @ObjectIdColumn()
  _id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  referralCode: string;

  @Column()
  createdAt: number;
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
