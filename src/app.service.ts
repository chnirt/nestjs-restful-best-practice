import { Injectable } from '@nestjs/common'
import speakeasy = require('speakeasy')

const TOTP_STEP: number = 20
@Injectable()
export class AppService {
	getHello() {
		return 'Hello World!'
	}

	async generateTotpToken() {
		const token = await speakeasy.totp({
			secret: 'OTP_KEY',
			encoding: 'base32',
			digits: 6,
			step: TOTP_STEP // 30s
			// window: 1 // pre 30s cur 30s nxt 30s
		})

		const remaining = TOTP_STEP - Math.floor((+new Date() / 1000.0) % TOTP_STEP)

		return {
			token,
			remaining
		}
	}

	async verifyTotp(token: string) {
		const verified = await speakeasy.totp.verify({
			token,
			secret: 'OTP_KEY',
			encoding: 'base32',
			step: TOTP_STEP, // 30s
			window: 1
		})

		return verified
	}
}
