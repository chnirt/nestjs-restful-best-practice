import { Injectable } from '@nestjs/common';
import speakeasy = require('speakeasy');
import { TotpDto } from './modules/users/dto/totp.dto';

@Injectable()
export class AppService {
  getHello() {
    return 'Hello World!';
  }

  async getTotpSecret() {
    const options = {
      length: 20,
    };

    const { base32, otpauth_url } = await speakeasy.generateSecret(options);
    return { secret: base32 };
  }

  async generateTotpSecret(secret) {
    const token = await speakeasy.totp({
      secret,
      encoding: 'base32',
    });

    return {
      token,
    };
  }

  async verifyTotp(totp: TotpDto) {
    const { secret, token } = totp;
    const verified = await speakeasy.totp.verify({
      encoding: 'base32',
      ...totp,
      window: 6,
    });

    return verified;
  }
}
