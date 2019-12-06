import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({
			usernameField: 'email',
			passwordField: 'password'
		})
	}

	async validate(username: string, password: string): Promise<any> {
		try {
			const user = await this.authService.validateUser(username, password)

			if (!user) {
				throw new UnauthorizedException('Email or password is incorrect.')
			}

			return user
		} catch (err) {
			throw new UnauthorizedException('Email or password is incorrect.')
		}
	}
}
