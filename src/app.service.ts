import { Injectable } from '@nestjs/common'
import speakeasy = require('speakeasy')
import { TotpDto } from './modules/users/dto/totp.dto'

const TOTP_STEP: number = 20
@Injectable()
export class AppService {
	getHello() {
		return 'Hello World!'
	}

	// async generateTotpToken() {
	// 	const token = await speakeasy.totp({
	// 		secret: 'OTP_KEY',
	// 		encoding: 'base32',
	// 		digits: 6,
	// 		step: TOTP_STEP // 30s
	// 		// window: 1 // pre 30s cur 30s nxt 30s
	// 	})

	// 	const remaining = TOTP_STEP - Math.floor((+new Date() / 1000.0) % TOTP_STEP)

	// 	return {
	// 		token,
	// 		remaining
	// 	}
	// }

	// async verifyTotp(token: string) {
	// 	const verified = await speakeasy.totp.verify({
	// 		token,
	// 		secret: 'OTP_KEY',
	// 		encoding: 'base32',
	// 		step: TOTP_STEP // 30s
	// 		// window: 0
	// 	})

	// 	return verified
	// }

	async getTotpSecret() {
		const options = {
			issuer: `Pony Foo`,
			name: `Pony Foo ()`,
			length: 64
		}

		const { base32, otpauth_url } = await speakeasy.generateSecret(options)
		return { secret: base32 }
	}

	async generateTotpSecret(secret) {
		const token = await speakeasy.totp({
			secret,
			encoding: 'base32'
		})

		return {
			token
		}
	}

	async verifyTotp(totp: TotpDto) {
		const { secret, token } = totp
		const verified = await speakeasy.totp.verify({
			encoding: 'base32',
			...totp,
			window: 0
		})

		return verified
	}
}
