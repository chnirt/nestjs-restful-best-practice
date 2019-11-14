import {
	Injectable,
	ForbiddenException,
	NotFoundException
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { getMongoRepository } from 'typeorm'
import speakeasy from 'speakeasy'

import { UserEntity } from './user.entity'
import { hashPassword } from '../../utils'
import { UpdateUserDto } from './dto/update-user.dto'
import { ReplaceUserDto } from './dto/replace-user.dto'

import { uploadFile, sendMail } from '../../shared'

export type User = any

const TOTP_STEP: number = 20
@Injectable()
export class UsersService {
	async create(
		input: CreateUserDto,
		req: any
	): Promise<UserEntity | undefined> {
		const { email } = input

		const existedUser = await getMongoRepository(UserEntity).findOne({ email })

		if (existedUser) {
			throw new ForbiddenException('Email already existed.')
		}

		const newUser = await getMongoRepository(UserEntity).save(
			new UserEntity({
				...input,
				password: await hashPassword(input.password)
			})
		)

		const token = await speakeasy.totp({
			secret: 'OTP_KEY',
			encoding: 'base32',
			digits: 6,
			step: TOTP_STEP // 30s
			// window: 1 // pre 30s cur 30s nxt 30s
		})

		// const remaining = TOTP_STEP - Math.floor((+new Date() / 1000.0) % TOTP_STEP)

		const _id = ''

		await sendMail(newUser, req, token, _id)

		return newUser
	}

	async findAll(): Promise<User[] | undefined> {
		return getMongoRepository(UserEntity).find()
	}

	async findOne(_id: string): Promise<User | undefined> {
		const foundUser = await getMongoRepository(UserEntity).findOne({ _id })

		if (!foundUser) {
			throw new NotFoundException('User not found.')
		}

		return foundUser
	}

	async findOneAndReplace(
		_id: string,
		replaceUserDto: ReplaceUserDto
	): Promise<User | undefined> {
		const foundUser = await getMongoRepository(UserEntity).findOne({ _id })

		if (!foundUser) {
			throw new NotFoundException('User not found.')
		}

		const updateUser = await getMongoRepository(UserEntity).save(
			new UserEntity({
				...foundUser,
				...replaceUserDto
			})
		)

		return updateUser
	}

	async findOneAndUpdate(
		_id: string,
		updateUserDto: UpdateUserDto
	): Promise<User | undefined> {
		const foundUser = await getMongoRepository(UserEntity).findOne({ _id })

		if (!foundUser) {
			throw new NotFoundException('User not found.')
		}

		const updateUser = await getMongoRepository(UserEntity).save(
			new UserEntity({
				...foundUser,
				...updateUserDto
			})
		)

		return updateUser
	}

	async deleteOne(_id: string): Promise<User | undefined> {
		const foundUser = await getMongoRepository(UserEntity).findOne({ _id })

		if (!foundUser) {
			throw new NotFoundException('User not found.')
		}

		return await getMongoRepository(UserEntity).delete(foundUser)
	}

	async findOneWithEmail(email: string): Promise<User | undefined> {
		const foundUser = await getMongoRepository(UserEntity).findOne({ email })

		if (!foundUser) {
			throw new NotFoundException('User not found.')
		}

		return foundUser
	}

	async updateAvatar(_id: string, file: any): Promise<boolean | undefined> {
		// console.log(_id, file)
		const user = await getMongoRepository(UserEntity).findOne({ _id })

		user.avatar = await uploadFile(file)

		const updateUser = await getMongoRepository(UserEntity).save(user)

		return updateUser ? true : false
	}
}
