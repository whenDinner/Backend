import { sign, verify } from 'jsonwebtoken';
import { UserToken, oidcTokenData } from './interfaces';

class jsonwebtoken {
  static sign(user: oidcTokenData, secret: string) {
    return sign({
      login: user.login,
      gender: user.gender,
      type: user.type,
    }, secret, {
      expiresIn: '7d',
    });
  }

  static verify(token: string, secret: string) {
    try {
      const decode = verify(token, secret) as UserToken;
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
