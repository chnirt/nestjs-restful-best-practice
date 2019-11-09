import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { getMongoRepository } from 'typeorm';

import { UserEntity } from './user.entity';
import { hashPassword } from '../../utils';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReplaceUserDto } from './dto/replace-user.dto';

export type User = any;

@Injectable()
export class UsersService {
  private readonly users: User[];

  constructor() {
    this.users = [
      {
        userId: 1,
        email: 'chin@gmail.com',
        password: '0',
      },
      {
        userId: 2,
        email: 'tin@gmail.com',
        password: '0',
      },
      {
        userId: 3,
        email: 'dien@gmail.com',
        password: '0',
      },
    ];
  }

  async create(input: CreateUserDto): Promise<UserEntity | undefined> {
    const { email } = input;

    const existedUser = await getMongoRepository(UserEntity).findOne({ email });

    if (existedUser) {
      throw new ForbiddenException('Email already existed.');
    }

    const newUser = await getMongoRepository(UserEntity).save(
      new UserEntity({
        ...input,
        password: await hashPassword(input.password),
      }),
    );

    return newUser;
  }

  async findAll(): Promise<User[] | undefined> {
    return getMongoRepository(UserEntity).find();
  }

  async findOne(_id: string): Promise<User | undefined> {
    const foundUser = await getMongoRepository(UserEntity).findOne({ _id });

    if (!foundUser) {
      throw new NotFoundException('User not found.');
    }

    return foundUser;
  }

  async findOneAndReplace(
    _id: string,
    replaceUserDto: ReplaceUserDto,
  ): Promise<User | undefined> {
    const foundUser = await getMongoRepository(UserEntity).findOne({ _id });

    if (!foundUser) {
      throw new NotFoundException('User not found.');
    }

    const updateUser = await getMongoRepository(UserEntity).save(
      new UserEntity({
        ...foundUser,
        ...replaceUserDto,
      }),
    );

    return updateUser;
  }

  async findOneAndUpdate(
    _id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | undefined> {
    const foundUser = await getMongoRepository(UserEntity).findOne({ _id });

    if (!foundUser) {
      throw new NotFoundException('User not found.');
    }

    const updateUser = await getMongoRepository(UserEntity).save(
      new UserEntity({
        ...foundUser,
        ...updateUserDto,
      }),
    );

    return updateUser;
  }

  async deleteOne(_id: string): Promise<User | undefined> {
    const foundUser = await getMongoRepository(UserEntity).findOne({ _id });

    if (!foundUser) {
      throw new NotFoundException('User not found.');
    }

    return await getMongoRepository(UserEntity).delete(foundUser);
  }

  async findOneWithEmail(email: string): Promise<User | undefined> {
    const foundUser = await getMongoRepository(UserEntity).findOne({ email });

    if (!foundUser) {
      throw new NotFoundException('User not found.');
    }

    return foundUser;
  }
}
