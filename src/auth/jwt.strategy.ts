import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ACCESS_TOKEN_SECRET } from '../environments'
import { getMongoRepository } from 'typeorm'
import { UserEntity } from '../modules/users/user.entity'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: ACCESS_TOKEN_SECRET!
		})
	}

	async validate(payload: any) {
		try {
			const { sub } = payload

			const user = await getMongoRepository(UserEntity).findOne({ _id: sub })

			const { password, ...result } = user

			return result
		} catch (err) {
			throw new UnauthorizedException('Email or password is incorrect.')
		}
	}
}
