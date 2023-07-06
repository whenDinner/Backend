import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import AccountEntity from 'src/entities/account.entity';
import { toString, toBuffer, toDataURL } from 'qrcode';
import { Like, Repository } from 'typeorm';
import jsonwebtoken from 'src/utils/jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import QRCodeEntity from 'src/entities/quickResponse/qrCode.entity';
import CalendarEntity from 'src/entities/calendar.entity';
import QrCodeWriteEntity from 'src/entities/quickResponse/qrCode.write.entity';
import QrCodeOutgoEntity from 'src/entities/quickResponse/qrCode.outgo.entity';
import QrCodePlaceEntity from 'src/entities/quickResponse/qrCode.place.entity';
import moment from 'moment';

@Injectable()
export class QrcodeService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
    @InjectRepository(QRCodeEntity)
    private qrCodeRepository: Repository<QRCodeEntity>,
    @InjectRepository(QrCodeWriteEntity)
    private qrCodeWriteRepository: Repository<QrCodeWriteEntity>,
    @InjectRepository(QrCodeOutgoEntity)
    private qrCodeOutgoRepository: Repository<QrCodeOutgoEntity>,
    @InjectRepository(QrCodePlaceEntity)
    private qrCodePlaceRepository: Repository<QrCodePlaceEntity>,
    @InjectRepository(CalendarEntity)
    private calendarRepository: Repository<CalendarEntity>,
    private configService: ConfigService
  ) {};

  async get(req: Request, res: Response) {
    const { uuid, dataType } = req.query;
    const token = req.headers.authorization.split(' ')[1];
    const verify = jsonwebtoken.verify(token, this.configService.get('JWT_SECRET'))

    const user = await this.accountRepository.findOne({
      where: {
        login: verify.data.login,
        type: verify.data.type
      }
    })

    const QR = await this.qrCodeRepository.findOne({
      where: {
        uuid: uuid.toString()
      }
    })

    try {
      if (!uuid) throw ({ status: 400, message: 'Quick Response 코드의 이름을 입력해주세요.' })
      if (!dataType) throw ({ status: 400, message: 'Quick Response코드의 데이터 타입을 입력해주세요.' })
      if (!token || !verify.success || !user) throw ({ status: 400, message: '비 정상적인 토큰 입니다.' })
      if (!QR) throw ({ status: 400, message: '존재하지 않는 Quick Response 코드 입니다.' })
    } catch (err) {
      return res.status(err.status).json({
        success: false,
        message: err.message
      })
    }

    switch(dataType.toString().toLowerCase()) {
      case "tobuffer":
        return res.status(200).json({
          success: true,
          data: await toBuffer(`${QR.action}_${QR.uuid}`)
        })
      case "todataurl":
        return res.status(200).json({
          success: true,
          data: await toDataURL(`${QR.action}_${QR.uuid}`)
        })
      case "tostring":
        return res.status(200).json({
          success: true,
          data: await toString(`${QR.action}_${QR.uuid}`)
        })
      default:
        return res.status(400).json({
          success: false,
          message: 'Quick Response코드의 데이터 타입이 올바르지 않습니다.'
        })
    }
  }

  async getImage(req: Request, res: Response) {

  }

  async searchCodes(req: Request, res: Response) {
    const { limit, offset, name } = req.query
    const token = req.headers.authorization.split(' ')[1];
    const verify = jsonwebtoken.verify(token, this.configService.get('JWT_SECRET'))

    const user = await this.accountRepository.findOne({
      where: {
        login: verify.data.login,
        type: verify.data.type
      }
    })

    try {
      if (!token || !verify.success || !user) throw ({ status: 400, message: '비 정상적인 토큰 입니다.' })
      else {
        if (user.type !== 2) throw ({ status: 401, message: '권한이 없습니다.' })
      }
    } catch (err) {
      return res.status(err.status).json({
        success: false,
        message: err.message
      })
    }

    const take = parseInt(limit.toString());
    const skip = parseInt(limit.toString()) * parseInt(offset.toString());

    const codes = await this.qrCodeRepository.find({
      where: {
        name: Like(`%${name}%`)
      },
      order: {
        createAt: 'desc'
      },
      take,
      skip
    })

    const codes_cnt = await this.qrCodeRepository.count({
      where: {
        name: Like(`%${name}%`)
      },
      order: {
        createAt: 'desc'
      }
    })

    return res.status(200).json({
      success: true,
      codes,
      codes_cnt
    })
  }

  async getCodes(req: Request, res: Response) {
    const { limit, offset } = req.query
    const token = req.headers.authorization.split(' ')[1];
    const verify = jsonwebtoken.verify(token, this.configService.get('JWT_SECRET'))

    const user = await this.accountRepository.findOne({
      where: {
        login: verify.data.login,
        type: verify.data.type
      }
    })

    try {
      if (!token || !verify.success || !user) throw ({ status: 400, message: '비 정상적인 토큰 입니다.' })
      else {
        if (user.type !== 2) throw ({ status: 401, message: '권한이 없습니다.' })
      }
    } catch (err) {
      return res.status(err.status).json({
        success: false,
        message: err.message
      })
    }

    const take = parseInt(limit.toString());
    const skip = parseInt(limit.toString()) * parseInt(offset.toString());

    const codes = await this.qrCodeRepository.find({
      order: {
        createAt: 'desc'
      },
      take,
      skip
    })

    const codes_cnt = await this.qrCodeRepository.count({
      order: {
        createAt: 'desc'
      }
    })

    return res.status(200).json({
      success: true,
      codes,
      codes_cnt
    })
  }

  async getInfo(req: Request, res: Response) {
    const uuid = req.body.uuid;
    const token = req.headers.authorization.split(' ')[1];
    const verify = jsonwebtoken.verify(token, this.configService.get('JWT_SECRET'));

    const user = await this.accountRepository.findOne({
      where: { login: verify.data.login }
    })
    
    const QR = await this.qrCodeRepository.findOne({
      where: {
        uuid
      }
    })

    try {
      if (!uuid) throw ({ status: 400, message: 'name을 입력해주세요.' })
      else {
        if (!QR) throw({ status: 400, message: '존재하지 않는 Quick Response 코드 입니다.' })
      }
      if (!token || !verify || !user) throw ({ status: 400, message: 'invalid token' })
    } catch(err) {
      return res.status(err.status).json({
        success: false,
        message: err.message
      })
    }

    return res.status(200).json({
      success: true,
      message: '',
      QuickResponse: {
        uuid: QR.uuid,
        name: QR.name,
        action: QR.action,
        createdAt: QR.createAt
      }
    })
  }

  async createQR(req: Request, res: Response) {
    const { name, action } = req.body;

    const token = req.headers.authorization.split(' ')[1];
    const verify = jsonwebtoken.verify(token, this.configService.get('JWT_SECRET'))

    const user = await this.accountRepository.findOne({
      where: {
        login: verify.data.login,
        type: verify.data.type
      }
    })
    
    const QR = await this.qrCodeRepository.findOne({
      where: {
        name
      }
    })

    try {
      if (!name) throw ({ status: 400, message: 'name을 입력해주세요.' })
      if (!action) throw ({ status: 400, message: 'action을 입력해주세요.' })
      if (QR) throw ({ status: 400, message: '이미 있는 Quick Response 코드 입니다.' })
      if (!token || !verify.success || !user) throw ({ status: 400, message: 'invalid token' })
    } catch(err) {
      return res.status(err.status).json({
        success: false,
        message: err.message
      })
    }

    const insertQr = await this.qrCodeRepository.insert({
      name,
      action
    })

    return res.status(201).json({
      success: true,
      uuid: insertQr.identifiers[0].uuid
    })
  }

  async deleteQR(req: Request, res: Response) {
    const uuid = req.body.id;
    const token = req.headers.authorization.split(' ')[1];
    const verify = jsonwebtoken.verify(token, this.configService.get('JWT_SECRET'));

    const user = await this.accountRepository.findOne({
      where: { login: verify.data.login }
    })
    
    const QR = await this.qrCodeRepository.findOne({
      where: {
        uuid
      }
    })

    try {
      if (!uuid) throw ({ status: 400, message: 'id을 입력해주세요.' })
      else {
        if (!QR) throw({ status: 400, message: '존재하지 않는 Quick Response 코드 입니다.' })
      }
      if (!token || !verify || !user) throw ({ status: 400, message: 'invalid token' })
    } catch(err) {
      return res.status(err.status).json({
        success: false,
        message: err.message
      })
    }

    await this.qrCodeRepository.delete({ uuid: QR.uuid })

    return res.status(200).json({
      success: true
    })
  }

  async accessOutgo(req: Request, res: Response) {
    const uuid = req.body.uuid;
    const token = req.headers.authorization.split(' ')[1];
    const verify = jsonwebtoken.verify(token, this.configService.get('JWT_SECRET'));

    const user = await this.accountRepository.findOne({
      where: { login: verify.data.login }
    })
    
    const QR = await this.qrCodeRepository.findOne({
      where: {
        uuid
      }
    })

    const startDate = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    

    const calendar = await this.calendarRepository
      .createQueryBuilder('calendar')
      .where('calendar.date BETWEEN :startDate AND :nextWeek', { startDate, nextWeek })
      .orderBy('calendar.date', 'ASC')
      .getOne();

    try {
      if (!uuid) throw ({ status: 400, message: 'name을 입력해주세요.' })
      else {
        if (!QR) throw({ status: 400, message: '존재하지 않는 Quick Response 코드 입니다.' })
      }
      if (!calendar) throw ({ status: 400, message: 'outgo를 실시하는 날이 아닙니다.' })
      if (!token || !verify.success || !user) throw ({ status: 400, message: 'invalid token' })
    } catch(err) {
      return res.status(err.status).json({
        success: false,
        message: err.message
      })
    }

    const qrUser = await this.qrCodeOutgoRepository
      .createQueryBuilder('qrCodeOutgo')
      .leftJoinAndSelect('qrCodeOutgo.author', 'user')
      .where('qrCodeOutgo.author = :user', { user: user.uuid })
      .orderBy('qrCodeOutgo.createdAt', 'DESC')
      .getOne()

    if (!qrUser) {
      await this.qrCodeOutgoRepository.insert({
        qr_uuid: QR.uuid ? QR.uuid : null,
        author: user.uuid,
        user_id: user.login
      })

      await this.accountRepository.update({ uuid: user.uuid }, { isOuting: true })
    } else {
      await this.qrCodeOutgoRepository.delete({
        qr_uuid: QR.uuid ? QR.uuid : null,
        author: user.uuid,
        user_id: user.login
      })

      await this.accountRepository.update({ uuid: user.uuid }, { isOuting: false })
    }

    return res.status(200).json({
      success: true
    })
  }

  async accessPlace(req: Request, res: Response) {
    const uuid = req.body.uuid;
    const token = req.headers.authorization.split(' ')[1];
    const verify = jsonwebtoken.verify(token, this.configService.get('JWT_SECRET'));

    const user = await this.accountRepository.findOne({
      where: { login: verify.data.login }
    })
    
    const QR = await this.qrCodeRepository.findOne({
      where: {
        uuid
      }
    })

    try {
      if (!uuid) throw ({ status: 400, message: 'uuid를 입력해주세요.' })
      else {
        if (!QR) throw({ status: 400, message: '존재하지 않는 Quick Response 코드 입니다.' })
      }
      if (!token || !verify || !user) throw ({ status: 400, message: 'invalid token' })
    } catch(err) {
      return res.status(err.status).json({
        success: false,
        message: err.message
      })
    }

    const qrUser = await this.qrCodePlaceRepository
      .createQueryBuilder('quickResponse')
      .where('quickResponse.qr_uuid = :uuid', { uuid: QR.uuid })
      .andWhere('quickResponse.author = :author', { author: user.uuid })
      .getOne()
    
    if (!qrUser) {
      await this.qrCodePlaceRepository.insert({
        qr_uuid: QR.uuid,
        author: user.uuid,
        user_id: user.login
      })
    } else {
      await this.qrCodePlaceRepository.delete({
        qr_uuid: QR.uuid,
        author: user.uuid,
        user_id: user.login
      })
    }

    return res.status(200).json({
      success: true
    })
  }

  async accessWrite(req: Request, res: Response) {
    const uuid = req.body.uuid;
    const token = req.headers.authorization.split(' ')[1];
    const verify = jsonwebtoken.verify(token, this.configService.get('JWT_SECRET'));

    const user = await this.accountRepository.findOne({
      where: { login: verify.data.login }
    })
    
    const QR = await this.qrCodeRepository.findOne({
      where: {
        uuid
      }
    })

    try {
      if (!uuid) throw ({ status: 400, message: 'name을 입력해주세요.' })
      else {
        if (!QR) throw({ status: 400, message: '존재하지 않는 Quick Response 코드 입니다.' })
      }
      if (!token || !verify.success || !user) throw ({ status: 400, message: 'invalid token' })
    } catch(err) {
      return res.status(err.status).json({
        success: false,
        message: err.message
      })
    }

    const date = new Date();

    const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0); // 오늘의 00시 00분 00초
    const endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59); // 오늘의 23시 59분 59초
    
    const qrUser = await this.qrCodeWriteRepository
      .createQueryBuilder('quickResponse')
      .where('quickResponse.qr_uuid = :uuid', { uuid: QR.uuid })
      .andWhere('quickResponse.author = :author', { author: user.uuid })
      .andWhere('quickResponse.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getOne()

    if (!qrUser) {
      await this.qrCodeWriteRepository.insert({
        qr_uuid: QR.uuid,
        author: user.uuid,
        user_id: user.login
      })
    } else {
      await this.qrCodeWriteRepository.delete({
        qr_uuid: QR.uuid,
        author: user.uuid,
        user_id: user.login
      })
    }

    return res.status(200).json({
      success: true
    })
  }
}
