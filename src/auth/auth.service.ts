import { Injectable } from '@nestjs/common'
import { UsersService } from '../modules/users/users.service'
import { JwtService } from '@nestjs/jwt'
import { comparePassword } from '../utils'
import { UserEntity } from '../modules/users/user.entity'

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService
	) {}

	async validateUser(username: string, pass: string): Promise<UserEntity> {
		const user = await this.usersService.findOneWithEmail(username)

		if (user && (await comparePassword(pass, user.password))) {
			const { password, ...result } = user

			return result
		}

		return null
	}

	async login(user: UserEntity) {
		const payload = { sub: user._id, name: user.name }
		const expiresIn = 3600

		return {
			access_token: this.jwtService.sign(payload, {
				expiresIn
			}),
			expiresIn
		}
	}
}
