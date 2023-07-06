import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { extname } from 'path';
import AccountEntity from 'src/entities/account.entity';
import CalendarEntity from 'src/entities/calendar.entity';
import OutgoEntity from 'src/entities/outgo.entity';
import jsonwebtoken from 'src/utils/jsonwebtoken';
import { validType } from 'src/utils/typeChecks';
import { MoreThan, Repository } from 'typeorm';
import { read, utils } from 'xlsx';
import * as momenttz from 'moment-timezone';
import * as moment from 'moment'

@Injectable()
export class OutgoService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
    @InjectRepository(OutgoEntity)
    private outgoRepository: Repository<OutgoEntity>,
    @InjectRepository(CalendarEntity)
    private calendarRepository: Repository<CalendarEntity>,
    private readonly configService: ConfigService
  ) {};

  async updateCalendar(req: Request, res: Response, file: Express.Multer.File) {
    const fileExtName = extname(file.originalname);
    if (
      !fileExtName.includes('xlsx') && 
      !fileExtName.includes('excel')
    ) 
      return res.status(400).json({ success: false, message: 'check your xlsx Type' })

    const workbook = read(file.buffer, { type: 'buffer', cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const excelData = utils.sheet_to_json(worksheet) as { date: Date, type: "잔류" | "귀가" }[];
    const token = req.headers.authorization.split(' ')[1];
    const verify = jsonwebtoken.verify(token, this.configService.get('JWT_SECRET'));

    const user = await this.accountRepository.findOne({
      where: { login: verify.data.login }
    })

    try {
      if (!file) throw ({ status: 400, message: 'xlsx Error: required xlsx' })
      if (!workbook) throw ({ status: 400, message: 'xlsx Error: you not buffer?' })
      if (!excelData[0]) throw ({ status: 400, message: 'xlsx Error: date, type Error' })
      if (!token || !verify.success || !user) throw ({ status: 400, message: 'invalid token' })
    } catch(err) {
      return res.status(err.status).json({
        success: false,
        message: err.message
      })
    }
    
    for (const data of excelData) {
      if (!data || !data.date || !data.type) {
        return res.status(400).json({
          success: false,
          message: 'xlsx Error: date, type Error'
        })
      };
      const dataDate = momenttz(data.date).tz('Asia/Seoul').toDate()
      const Datea = new Date(moment(dataDate).add({ days: 1 }).format('YYYY-MM-DDT00:00:00.000Z'))
      const xlsxData = await this.calendarRepository.findOne({
        where: {
          date: Datea
        }
      })
      
      if (!xlsxData) {
        await this.calendarRepository.insert({
          date: Datea,
          type: data.type
        })
      } else {
        await this.calendarRepository.update({ date: Datea }, {
          type: data.type
        })
      }
    }
    
    return res.status(200).json({
      success: true
    })
  }

  async setOutgo(req: Request, res: Response) {
    const { dotw, type, reason } = req.body;

    const token = req.headers.authorization.split(' ')[1];
    const verify = jsonwebtoken.verify(token, this.configService.get('JWT_SECRET'));

    const validDotwType = ['금', '토', '일']
    const validOutgoType = ['오전외출', '오후외출', '외출', '외박']

    const user = await this.accountRepository.findOne({
      where: { login: verify.data.login }
    })

    try {
      if (!type) throw ({ status: 400, message: 'required type' })
      if (!token || !verify.success || !user) throw ({ status: 400, message: 'invalid token' })
      if (!validType(dotw, validDotwType)) throw ({ status: 400, message: 'invalid dotwType' })
      if (!validType(type, validOutgoType)) throw ({ status: 400, message: 'invalid outgoType' })
      if (user.gs === 3 || user.rh == 2) throw ({ status: 400, message: '귀가하는 학생들은 외출/외박을 신청할 수 없습니다.' })
      if ((dotw === '금' || dotw === '토') && type !== '외박') throw ({ status: 400, message: '금요일, 토요일 외박 이외엔 다른것 선택 불가' });
      if (dotw === '토' && type === '오전외출') throw ({ status: 400, message: '토요일엔 오전외출 불가' });
      if (dotw === '일' && type === '외박') throw ({ status: 400, message: '일요일엔 외박 불가' })
    } catch(err) {
      return res.status(err.status).json({
        success: false,
        message: err.message
      })
    }

    try {
      const calendar = await this.calendarRepository.findOne({
        where: {
          date: MoreThan(new Date()),
        },
        order: {
          date: 'ASC',
        },
      });

      if (!calendar) throw({ status: 500, message: '더이상의 잔류, 귀가 표가 없습니다. 관리자에게 문의해주세요' })
      
      if (type.includes('외출'))
        await this.accountRepository.update({ login: verify.data.login }, { gs: 2 })
      else {
        await this.accountRepository.update({ login: verify.data.login }, { gs: 3 })
      }

      const userAnswer = await this.outgoRepository.findOne({
        where: {
          outgoDate: calendar.date,
          user_id: user.uuid
        }
      })

      if (userAnswer) {
        await this.outgoRepository.update({user_id: userAnswer.user_id}, {
          fri_out: dotw === "금" ? true : false,
          sat_pm: dotw === "토" && (type === "오후외출" || type === "외박") ? true : false,
          sun_am: dotw === "일" && type === "오전외출" ? true : false,
          sun_pm: dotw === "일" && type === "오후외출" ? true : false,
          sun: dotw === "일" && type === "외출" ? true : false,
          reason
        })
      } else {
        await this.outgoRepository.insert({
          user_id: user.uuid,
          fri_out: dotw === "금" ? true : false,
          sat_pm: dotw === "토" && (type === "오후외출" || type === "외박") ? true : false,
          sun_am: dotw === "일" && type === "오전외출" ? true : false,
          sun_pm: dotw === "일" && type === "오후외출" ? true : false,
          sun: dotw === "일" && type === "외출" ? true : false,
          reason
        })
      }

      return res.status(200).json({
        success: true
      })
    } catch(err) {
      return res.status(err.status).json({
        success: false,
        message: err.message
      })
    }
  }

  async getCalendars(req: Request, res: Response) {
    const calendar = await this.calendarRepository.find({
      order: {
        date: 'desc'
      }
    });

    return res.status(200).json({
      success: true,
      calendar
    })
  }

  async getCalendar(req: Request, res: Response) {
    const { uuid } = req.query;
    const calendar = await this.calendarRepository.findOne({
      where: {
        uuid: uuid.toString()
      },
      order: {
        date: 'desc'
      }
    });

    if (!calendar) return res.status(401).json({
      success: false,
      message: '검색하신 잔류, 귀가 리스트 데이터는 없습니다.'
    })

    return res.status(200).json({
      success: true,
      calendar
    })
  }

  async clearCalendar(req: Request, res: Response) {
    const token = req.headers.authorization.split(' ')[1];
    const verify = jsonwebtoken.verify(token, this.configService.get('JWT_SECRET'))

    const user = await this.accountRepository.findOne({
      where: {
        login: verify.data.login,
        type: verify.data.type
      }
    })

    const calendars = await this.calendarRepository.find()

    try {
      if (!calendars) throw ({ status: 401, message: '리스트에 데이터가 없습니다.' })
      if (!token || !verify || !user) throw ({ status: 400, message: '비 정상적인 토큰 입니다.' })
      else { 
        if (user.type !== 2) throw ({ status: 401, message: '권한이 없습니다.' })
      }
    } catch(err) {
      return res.status(err.status).json({
        success: false,
        message: err.message
      })
    }

    try {
      for (const calendar of calendars) {
        await this.calendarRepository.delete({
          uuid: calendar.uuid
        })
      }

      return res.status(200).json({
        success: true
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Server Error'
      })
    }
  }
}
