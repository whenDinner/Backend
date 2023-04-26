import { sign, verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UserToken, oidcTokenData } from './interfaces';

class jsonwebtoken {
  static sign(user: oidcTokenData, secret: string) {
    return sign({
      login: user.login,
      nickname: user.nickname,
      student_id: user.classInfo.grade.toString() + user.classInfo.class.toString() + (user.classInfo.number < 10 ? '0' + user.classInfo.number.toString() : user.classInfo.number.toString()),
      grade: user.classInfo.grade,
      class: user.classInfo.class,
      number: user.classInfo.number,
      roomNumber: user.dormitory.room,
      fullname: user.fullname,
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
