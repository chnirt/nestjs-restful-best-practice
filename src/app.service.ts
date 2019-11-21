import { Injectable } from '@nestjs/common'
import speakeasy = require('speakeasy')
import { TotpDto } from './modules/users/dto/totp.dto'

const TOTP_STEP: number = 20
@Injectable()
export class AppService {
	getHello() {
		return 'Hello World!'
	}
}
