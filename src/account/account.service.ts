import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Cache } from 'cache-manager';
import { Request, Response } from 'express';
import AccountEntity from 'src/entities/account.entity';
import OutgoEntity from 'src/entities/outgo.entity';
import getRandom from 'src/utils/getRandom';
import { Repository } from 'typeorm';
import jwt from 'src/utils/jsonwebtoken'
import { verify } from 'jsonwebtoken'
import { UserToken, oidcToken } from 'src/utils/interfaces';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
    @InjectRepository(OutgoEntity)
    private outgoRepository: Repository<OutgoEntity>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private configService: ConfigService
  ) {};

  async getUser(req: Request, res: Response) {
    const { id_token, state } = req.query;
    if (!this.cacheManager.get(state.toString())) 
      return res.status(400).json({
        success: false,
        message: 'invaild state'
      })
    
    const pubkey = await axios(this.configService.get<string>('GBSW_PUBKEY_URL')).then((res) => res.data)
    const nonce = await this.cacheManager.get<string>(state.toString())

    this.cacheManager.del(state.toString())

    try {
      const verified = verify(id_token.toString(), pubkey, {
        algorithms: ['ES256'],
        audience: this.configService.get('GBSW_CLIENT_ID'),
        issuer: this.configService.get('GBSW_ISSUER'),
        nonce: nonce
      }) as oidcToken

      const user = await this.accountRepository.findOne({
        where: {
          login: verified.data.login
        }
      })

      if (!user) {
        await this.accountRepository.insert({
          login: verified.data.login,
          nickname: verified.data.nickname,
          student_id: verified.data.classInfo.grade.toString() + verified.data.classInfo.class.toString() + (verified.data.classInfo.number < 10 ? '0' + verified.data.classInfo.number.toString() : verified.data.classInfo.number.toString()),
          grade: verified.data.classInfo.grade,
          class: verified.data.classInfo.class,
          number: verified.data.classInfo.number,
          roomNumber: verified.data.dormitory.room,
          fullname: verified.data.fullname,
          gender: verified.data.gender,
          type: verified.data.type,
        })
      } else {
        user.grade = verified.data.classInfo.grade;
        user.class = verified.data.classInfo.class;
        user.number = verified.data.classInfo.number;
        user.fullname = verified.data.fullname;
        user.gender = verified.data.gender;
        user.roomNumber = verified.data.dormitory.room;
        user.nickname = verified.data.nickname;
        user.type = verified.data.type;
        user.student_id = verified.data.classInfo.grade.toString() + verified.data.classInfo.class.toString() + (verified.data.classInfo.number < 10 ? '0' + verified.data.classInfo.number.toString() : verified.data.classInfo.number.toString());
        await this.accountRepository.save(user);
      }
      
      const whenDinnerToken = jwt.sign(verified.data, this.configService.get<string>('JWT_SECRET'));
      
      return res.status(200).json({
        success: true,
        token: whenDinnerToken
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Server Error'
      })
    }
  }

  async getLogin(res: Response) {
    const nonce = getRandom('all', 32);
    
    const state = getRandom('all', 32);
    
    await this.cacheManager.set(state, nonce);
    setInterval(async() => await this.cacheManager.del(state), 60 * 1000);

    return res.status(200).json({
      success: true, 
      data: 'https://center.gbsw.hs.kr/login' +
        `?client_id=${this.configService.get('GBSW_CLIENT_ID')}` +
        `&redirect_uri=${this.configService.get('GBSW_REDIRECT_URI')}` +
        `&scope=${this.configService.get('GBSW_SCOPES')}` +
        `&state=${state}` +
        `&nonce=${nonce}` +
        `&response_type=id_token`
      });
  }

  async getVerifyUser(req: Request, res: Response) {
    const auth = req.headers.authorization.split(' ')[1];

    try {
      const token = verify(auth, this.configService.get('JWT_SECRET')) as UserToken;
      
      return res.status(200).json({
        success: true,
        token
      })
    } catch(err) {
      return res.status(401).json({
        success: false,
        message: '비정상적인 토큰 입니다.'
      })
    }
  }
}
