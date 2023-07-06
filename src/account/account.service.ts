import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Cache } from 'cache-manager';
import { Request, Response } from 'express';
import AccountEntity from 'src/entities/account.entity';
import OutgoEntity from 'src/entities/outgo.entity';
import getRandom from 'src/utils/getRandom';
import { Between, Like, Repository } from 'typeorm';
import jwt from 'src/utils/jsonwebtoken'
import { verify } from 'jsonwebtoken'
import { UserToken, oidcToken } from 'src/utils/interfaces';
import { splitStudentNumber, validType } from 'src/utils/typeChecks';

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
          roomNumber: parseInt(token.data.dormitory.room) ? parseInt(token.data.dormitory.room) : null,
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

  async callback(req: Request, res: Response) {
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

  async searchUsers(req: Request, res: Response) {
    const { search, limit, offset } = req.query;
    const auth = req.headers.authorization.split(' ')[1];
    const token = verify(auth, this.configService.get('JWT_SECRET')) as UserToken;
    const user = await this.accountRepository.findOne({
      where: {
        login: token.login,
        type: token.type
      }
    })

    const __user = await this.accountRepository.find({
      where:         
        { fullname: Like(`%${search}%`)},
      order: {
        roomNumber: 'ASC',
        createdAt: 'DESC',
      },
      take: parseInt(limit.toString()),
      skip: (parseInt(offset.toString())) * parseInt(limit.toString()),
    });

    const user_cnt = await this.accountRepository.count({
      where: [
        { fullname: Like(`%${search}%`)}
      ],
      order: {
        roomNumber: 'ASC',
        createdAt: 'DESC',
      },
    })

    try { 
      if (!search) throw ({ status: 400, message: '유저의 이름을 입력해주세요.' })
      if (!offset) throw ({status: 400, message: 'offset is required' })
      if (!limit) throw ({ status: 400, message: 'limit is required' })
      if (isNaN(parseInt(limit.toString())) || parseInt(limit.toString()) <= 0) throw ({ status: 400, message: 'invalid limit'})
      if (isNaN(parseInt(offset.toString())) || parseInt(offset.toString()) < 0) throw ({ status: 400, message: 'invalid offset'})
      if (!auth || !token || !user || user.type !== 2) throw({ status: 401, message: '비정상적인 토큰 입니다.' });
      else {
        return res.status(200).json({
          success: true,
          user: __user,
          user_cnt
        })
      }
    } catch(err) {
      return res.status(err.status).json({
        success: false,
        message: err.message
      })
    }
  }

  async getUser(req: Request, res: Response) {
    const { uuid } = req.query
    const auth = req.headers.authorization.split(' ')[1];
    const token = jwt.verify(auth, this.configService.get('JWT_SECRET'));

    const user = await this.accountRepository.findOne({
      where: {
        login: token.data.login,
        type: token.data.type
      }
    })
    
    const search = await this.accountRepository.findOne({
      where: {
        uuid: uuid.toString()
      }
    })

    const outgo = await this.outgoRepository
      .createQueryBuilder('outgo')
      .leftJoinAndSelect('outgo.author', 'user')
      .where('outgo.author = :user', { user: uuid.toString() })
      .getOne()

    try {
      if (!uuid) throw ({ status: 400, message: 'uuid를 입력해주세요.' })
      else {
        if (!search) throw ({ status: 400, message: '유저를 찾을 수 없습니다.' })
      }
      if (!auth || !token.success || !user) throw ({ status: 400, message: '' })
    } catch (err) {
      return res.status(err.status).json({
        success: false, 
        message: err.message
      })
    }

    return res.status(200).json({
      success: true,
      user: search,
      outgo
    })
  }

  async getUsers(req: Request, res: Response) {
    const { floor, gender, limit, offset } = req.query;
    const auth = req.headers.authorization.split(' ')[1];
    const token = verify(auth, this.configService.get('JWT_SECRET')) as UserToken;
      
    const user_ = await this.accountRepository.findOne({
      where: {
        login: token.login,
        type: token.type
      }
    })

    try {
      if (!offset) throw ({ status: 400, message: 'offset을 입력해주세요.' })
      else {
        if (isNaN(parseInt(offset.toString())) || parseInt(offset.toString()) < 0) throw ({ status: 400, message: '올바른 offset 값을 입력해주세요.' })
      }
      if (!limit) throw ({ status: 400, message: 'limit을 입력해주세요.' })
      else {
        if (isNaN(parseInt(limit.toString())) || parseInt(limit.toString()) <= 0) throw ({ status: 400, message: '올바른 limit 값을 입력해주세요.' })
      }
      if (!floor) throw ({ status: 400, message: 'floor를 입력해주세요.' })
      if (!gender) throw ({ status: 400, message: 'gender을 입력해주세요.' })
      else { 
        if (!validType<'M' | 'F'>(gender, ['M', 'F'])) throw ({ status: 400, message: '올바른 gender 값을 입력해주세요.' })
      }
      if (!auth || !token || !user_) throw ({ status: 400, message: '올바른 토큰이 아닙니다.' })
      if (isNaN(parseInt(floor.toString()))) throw ({ status: 400, message: '올바른 floor 값을 입력해주세요.' })
    } catch (err) {
      return res.status(err.status).json({
        success: false,
        message: err.message
      })
    }

    const roomPrefix = parseInt(floor.toString()) * 100;

    const roomNumber = Between(roomPrefix + 1, roomPrefix + 30)

    const user = await this.accountRepository.find({
      where: {
        gender,
        roomNumber,
      },
      order: {
        roomNumber: 'ASC',
        createdAt: 'DESC',
      },
      take: parseInt(limit.toString()),
      skip: (parseInt(offset.toString())) * parseInt(limit.toString()),
    });
    const user_cnt = await this.accountRepository.count({
      where: {
        gender,
        roomNumber,
      },
      order: {
        roomNumber: 'ASC',
        createdAt: 'DESC',
      },
    })
    return res.status(200).json({
      success: true,
      user,
      user_cnt
    })
  }

  async updateUser(req: Request, res: Response) {
    const { uuid } = req.query;
    const { fullname, student_id, gender, roomNumber, type } = req.body;

    const auth = req.headers.authorization.split(' ')[1];
    const token = jwt.verify(auth, this.configService.get('JWT_SECRET'));

    const user = await this.accountRepository.findOne({
      where: {
        login: token.data.login,
        type: token.data.type
      }
    })
    
    const search = await this.accountRepository.findOne({
      where: {
        uuid: uuid.toString()
      }
    })

    try {
      if (!uuid) throw ({ status: 400, message: 'uuid를 입력해주세요.' })
      else {
        if (!search) throw ({ status: 400, message: '유저를 찾을 수 없습니다.' })
      }
      if (!fullname) throw ({ status: 400, message: 'fullname을 입력해주세요.' })
      if (!student_id) throw ({ status: 400, message: 'student_id를 입력해주세요.' })
      if (!gender) throw ({ status: 400, message: 'gender을 선택해주세요.' })
      else {
        if (!validType<'M' | 'F'>(gender, ['M', 'F'])) throw ({ status: 400, message: '올바른 gender을 선택해주세요.' })
      }
      if (!roomNumber || isNaN(roomNumber)) throw ({ status: 400, message: '올바른 방 번호를 입력해주세요.' })
      if (!validType<0 | 1 | 2>(type, [0, 1, 2])) throw ({ status: 400, message: '올바른 학생권한을 선택해주세요.' })
      if (!auth || !token.success || !user) throw ({ status: 400, message: '' })
      else {
        if (user.type !== 2) throw ({ status: 401, message: '수정할 권한이 없습니다.' }) 
      }
    } catch (err) {
      return res.status(err.status).json({
        success: false, 
        message: err.message
      })
    }

    try {
      const stid = splitStudentNumber(student_id)
      this.accountRepository.update({ uuid: uuid.toString() }, {
        grade: stid.grade,
        class: stid.class,
        number: stid.class,
        roomNumber,
        fullname,
        gender,
        type
      })

      return res.status(200).json({
        success: true,
        message: '성공적으로 데이터를 변경했습니다.'
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Server Error'
      })
    }
  }
}
