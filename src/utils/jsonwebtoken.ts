import { sign, verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UserToken } from './interfaces';

class jsonwebtoken {
  static sign(user: UserToken, configService: ConfigService) {
    return sign(user, configService.get<string>('JWT_SECRET'), {
      expiresIn: '7d',
    });
  }

  static verify(token: string, configService: ConfigService) {
    try {
      const decode = verify(token, configService.get<string>('JWT_SECRET')) as UserToken;
      return {
        success: true,
        message: '',
        data: decode
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }
}

export default jsonwebtoken;
