import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
  private readonly users: User[];

  constructor() {
    this.users = [
      {
        userId: 1,
        username: 'chnirt',
        password: '0',
      },
      {
        userId: 2,
        username: 'tin',
        password: '0',
      },
      {
        userId: 3,
        username: 'dien',
        password: '0',
      },
    ];
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}
