import {
	Injectable,
	ForbiddenException,
	NotFoundException
} from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { getMongoRepository } from 'typeorm'
import * as speakeasy from 'speakeasy'
import { Validator } from 'class-validator'

import { UserEntity } from './user.entity'
import { hashPassword } from '../../utils'
import { UpdateUserDto } from './dto/update-user.dto'
import { ReplaceUserDto } from './dto/replace-user.dto'

import { uploadFile } from '../../shared'

import { SPEAKEASY_SECRET, SPEAKEASY_STEP } from '../../environments'
import { OtpResponseDto } from './dto/otp-response.dto'

const validator = new Validator()
export type User = any

@Injectable()
export class UsersService {
	async insert(createUserDto: CreateUserDto): Promise<User | undefined> {
		const { email } = createUserDto

		const existedUser = await getMongoRepository(UserEntity).findOne({ email })

		if (existedUser) {
			throw new ForbiddenException('Email already existed.')
		}

		const newUser = await getMongoRepository(UserEntity).save(
			new UserEntity({
				...createUserDto,
				password: await hashPassword(createUserDto.password)
			})
		)

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

	async deleteOne(_id: string): Promise<boolean | undefined> {
		const foundUser = await getMongoRepository(UserEntity).findOne({ _id })

		if (!foundUser) {
			throw new NotFoundException('User not found.')
		}

		return (await getMongoRepository(UserEntity).delete(foundUser))
			? true
			: false
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
		const foundUser = await getMongoRepository(UserEntity).findOne({ _id })

		if (!foundUser) {
			throw new NotFoundException('User not found.')
		}

		foundUser.avatar = await uploadFile(file)

		const updateUser = await getMongoRepository(UserEntity).save(foundUser)

		return updateUser ? true : false
	}

	async otp(_id: string, phone: string): Promise<OtpResponseDto | undefined> {
		validator.isMobilePhone(phone, 'en-SG')

		const foundUser = await getMongoRepository(UserEntity).findOne({
			where: {
				_id,
				verified: false
			}
		})

		if (!foundUser) {
			throw new NotFoundException('User not found.')
		}

		const token = await speakeasy.totp({
			secret: SPEAKEASY_SECRET!,
			encoding: 'base32',
			// digits: SPEAKEASY_DIGITS!
			step: SPEAKEASY_STEP! // 30s
			// window: 1 // pre 30s cur 30s nxt 30s
		})

		const remaining =
			SPEAKEASY_STEP - Math.floor((+new Date() / 1000.0) % SPEAKEASY_STEP) + 's'

		foundUser.phone = phone

		await getMongoRepository(UserEntity).save(foundUser)

		return {
			otp: +token,
			remaining
		}
	}

	async verify(_id: string, otp: string) {
		const foundUser = await getMongoRepository(UserEntity).findOne({
			where: {
				_id,
				verified: false
			}
		})

		if (!foundUser) {
			throw new NotFoundException('User not found.')
		}

		// console.log(otp)

		const verified = await speakeasy.totp.verify({
			secret: SPEAKEASY_SECRET!,
			encoding: 'base32',
			token: otp,
			step: SPEAKEASY_STEP!, // 30s
			window: 1
		})

		// console.log(verified)

		if (verified) {
			foundUser.verified = true

			return await getMongoRepository(UserEntity).save(foundUser)
		}

		throw new ForbiddenException('Otp is incorrect.')
	}
}
