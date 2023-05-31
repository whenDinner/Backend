import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Cache } from 'cache-manager';
import e, { Request, Response } from 'express';
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

  async userSet(type: 0 | 1 | 2, user: AccountEntity, token: oidcToken) {
    try {
      if (!user) {
        await this.accountRepository.insert({
          login: token.data.login,
          type: token.data.type
        })
      } 
      if (type == 0 || type == 1) {
        await this.accountRepository.update({ login: token.data.login }, {
          student_id: token.data.classInfo.grade.toString() + token.data.classInfo.class.toString() + (token.data.classInfo.number < 10 ? '0' + token.data.classInfo.number.toString() : token.data.classInfo.number.toString()),
          nickname: token.data.nickname ? token.data.nickname : '유저 ' + Math.floor(Math.random() * 4 + 3).toString(),
          grade: token.data.classInfo.grade,
          class: token.data.classInfo.class,
          number: token.data.classInfo.number,
          roomNumber: token.data.dormitory.room ? token.data.dormitory.room : null,
          gender: token.data.gender,
          fullname: token.data.fullname,
          type: token.data.type
        })
      } else {
        await this.accountRepository.update({ login: token.data.login }, {
          nickname: token.data.nickname ? token.data.nickname : '유저 ' + Math.floor(Math.random() * 4 + 3).toString(),
          fullname: token.data.fullname,
          type: token.data.type,
        })
      }
      return true
    } catch (err) {
      return false
    }
  }

  async getUser(req: Request, res: Response) {
    const { id_token, state } = req.query;
    if (!this.cacheManager.get(state.toString())) 
      return res.status(400).json({
        success: false,
        message: 'invalid state'
      })
    
    const pubkey = await axios(this.configService.get<string>('GBSW_PUBKEY_URL')).then((res) => res.data)
    const nonce = await this.cacheManager.get<string>(state.toString())
    
    await this.cacheManager.del(state.toString())
    
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

      this.userSet(verified.data.type, user, verified)

      const whenDinnerToken = jwt.sign(verified.data, this.configService.get<string>('JWT_SECRET'));
      return res.status(200).json({
        success: true,
        type: verified.data.type,
        token: whenDinnerToken
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Server Error',
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
      
      const user = await this.accountRepository.findOne({
        where: {
          login: token.login,
          type: token.type
        }
      })

      if (!user) throw new Error();
      else {
        const formattedUser = {
        ...user,
        student_id: user.type >= 1 ? null : user.student_id,
          grade: user.type >= 1 ? null : user.grade,
          class: user.type >= 1 ? null : user.class,
          number: user.type >= 1 ? null : user.number,
          roomNumber: user.type >= 1 ? null : user.roomNumber,
          gender: user.type === 2 ? null : user.gender,
        }
        
        return res.status(200).json({
          success: true,
          user: formattedUser
        })
      }

      

    } catch(err) {
      return res.status(401).json({
        success: false,
        message: '비정상적인 토큰 입니다.'
      })
    }
  }
}
