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
import OutgoEntity from 'src/entities/outgo.entity';

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
    @InjectRepository(OutgoEntity)
    private outgoRepository: Repository<OutgoEntity>,
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

  async getPlace(req: Request, res: Response) {
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
    } catch (err) {
      return res.status(err.status).json({
        success: false,
        message: err.message
      })
    }

    const take = parseInt(limit.toString());
    const skip = parseInt(limit.toString()) * parseInt(offset.toString());

    const codes = await this.qrCodeRepository.find({
      where:{
        action: 'PLACE'
      },
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

    let count = 0;

    switch (QR.action) {
      case "OUTGO":
        count = await this.qrCodeOutgoRepository
          .createQueryBuilder('QuickResponse')
          .leftJoinAndSelect('QuickResponse.author', 'user')
          .where('qr_uuid = :uuid', { uuid: QR.uuid })
          .orWhere('qr_uuid = "-1"')
          .getCount()
          break;
      case "PLACE":
        count = await this.qrCodePlaceRepository
          .createQueryBuilder('QuickResponse')
          .leftJoinAndSelect('QuickResponse.author', 'user')
          .where('qr_uuid = :uuid', { uuid: QR.uuid })
          .getCount()
          break;
      case "WRITE":
        count = await this.qrCodeWriteRepository
          .createQueryBuilder('QuickResponse')
          .leftJoinAndSelect('QuickResponse.author', 'user')
          .where('qr_uuid = :uuid', { uuid: QR.uuid })
          .getCount()
          break;
    }

    return res.status(200).json({
      success: true,
      message: '',
      QuickResponse: {
        uuid: QR.uuid,
        name: QR.name,
        action: QR.action,
        createdAt: QR.createAt,
        count
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
      where: { uuid, action: 'OUTGO' }
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

    const user_qr = await this.qrCodeOutgoRepository
      .createQueryBuilder('qrCodeOutgo')
      .leftJoinAndSelect('qrCodeOutgo.author', 'user')
      .where('author = :uuid AND qr_uuid = "-1"', { uuid: user.uuid })
      .orWhere('author = :uuid AND qr_uuid = :QR', { uuid: user.uuid, QR: QR.uuid })
      .getOne()

    if (!user_qr) {
      const data = await this.outgoRepository
        .createQueryBuilder('outgoEntity')
        .where('outgoEntity.author = :uuid', { uuid: user.uuid })
        .getOne()

      if (data && (data.sat_pm || data.sun || data.sun_am || data.sun_pm) && user.type < 1) {
        await this.qrCodeOutgoRepository.insert({ 
          qr_uuid: QR.uuid, 
          author: user.uuid, 
          user_id: user.login 
        })
      } else return res.status(401).json({
        success: false,
        message: '외출 요청을 하지 않으셔서 외출을 허가 할 수 없습니다.'
      })
    } else {
      await this.qrCodeOutgoRepository.delete({
        author: user.uuid
      })
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
        uuid,
        action: 'PLACE'
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
    
    const qrUser = await this.qrCodePlaceRepository
      .createQueryBuilder('quickResponse')
      .where('quickResponse.qr_uuid = :uuid', { uuid: QR.uuid })
      .andWhere('quickResponse.author = :author', { author: user.uuid })
      .andWhere('quickResponse.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
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
        uuid,
        action: 'WRITE'
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

    await this.qrCodeWriteRepository.insert({
      qr_uuid: QR.uuid,
      author: user.uuid,
      user_id: user.login
    })

    return res.status(200).json({
      success: true
    })
  }

  async getAccess(req: Request, res: Response) {
    const { uuid, limit, offset } = req.query;
    const token = req.headers.authorization.split(' ')[1];
    const verify = jsonwebtoken.verify(token, this.configService.get('JWT_SECRET'))

    const QR = await this.qrCodeRepository.findOne({
      where: {
        uuid: uuid.toString()
      }
    })

    const user = await this.accountRepository.findOne({
      where: {
        login: verify.data.login
      }
    })

    try {
      if (!uuid) throw ({ status: 400, message: 'uuid를 입력해주세요.' })
      if (!limit) throw ({ status: 400, message: 'limit을 입력해주세요.' })
      if (!offset) throw ({ status: 400, message: 'offset을 입력해주세요.' })
      if (!QR) throw ({ status: 400, message: '존재하지 않는 Quick Response 코드 입니다.' })
      if (!token || !verify.success || !user || user.type == 1) throw ({ status: 401, message: '데이터를 열람할 권한이 없습니다.' })
    } catch (err) {
      return res.status(err.status).json({
        success: false,
        message: err.message
      })
    }

    let users = undefined;
    let users_cnt = undefined;

    switch (QR.action) {
      case "OUTGO":
        users = await this.qrCodeOutgoRepository
          .createQueryBuilder('QuickResponse')
          .leftJoinAndSelect('QuickResponse.author', 'user')
          .where('qr_uuid = :uuid', { uuid: QR.uuid })
          .orWhere('qr_uuid = "-1"')
          .limit(parseInt(limit.toString()))
          .offset(parseInt(offset.toString()))
          .orderBy('QuickResponse.createdAt', 'DESC')
          .getMany()

        users_cnt = await this.qrCodeOutgoRepository
          .createQueryBuilder('QuickResponse')
          .leftJoinAndSelect('QuickResponse.author', 'user')
          .where('qr_uuid = :uuid', { uuid: QR.uuid })
          .orWhere('qr_uuid = "-1"')
          .getCount()
          break;
      case "PLACE":
        users = await this.qrCodePlaceRepository
          .createQueryBuilder('QuickResponse')
          .leftJoinAndSelect('QuickResponse.author', 'user')
          .where('qr_uuid = :uuid', { uuid: QR.uuid })
          .limit(parseInt(limit.toString()))
          .offset(parseInt(offset.toString()))
          .orderBy('QuickResponse.createdAt', 'DESC')
          .getMany()

        users_cnt = await this.qrCodePlaceRepository
          .createQueryBuilder('QuickResponse')
          .leftJoinAndSelect('QuickResponse.author', 'user')
          .where('qr_uuid = :uuid', { uuid: QR.uuid })
          .getCount()
          break;
      case "WRITE":
        const date = new Date();
        users = await this.qrCodeWriteRepository
          .createQueryBuilder('QuickResponse')
          .leftJoinAndSelect('QuickResponse.author', 'user')
          .where('qr_uuid = :uuid', { uuid: QR.uuid })
          .limit(parseInt(limit.toString()))
          .offset(parseInt(offset.toString()))
          .orderBy('QuickResponse.createdAt', 'DESC')
          .getMany()

        users_cnt = await this.qrCodeWriteRepository
          .createQueryBuilder('QuickResponse')
          .leftJoinAndSelect('QuickResponse.author', 'user')
          .where('qr_uuid = :uuid', { uuid: QR.uuid })
          .getCount()
          break;
    }

    return res.status(200).json({
      success: true,
      users,
      users_cnt
    })
  }

  async clearAccess(req: Request, res: Response) {
    const { uuid, action } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const verify = jsonwebtoken.verify(token, this.configService.get('JWT_SECRET'))

    const QR = await this.qrCodeRepository.findOne({
      where: {
        uuid,
        action
      }
    })

    const user = await this.accountRepository.findOne({
      where: {
        login: verify.data.login
      }
    })

    try {
      if (!uuid) throw ({ status: 400, message: 'uuid를 입력해주세요.' })
      if (!QR) throw ({ status: 400, message: '존재하지 않는 Quick Response 코드 입니다.' })
      if (!token || !verify.success || !user || user.type !== 2) throw ({ status: 401, message: '데이터를 삭제할 권한이 없습니다.' })
    } catch (err) {
      return res.status(err.status).json({
        success: false,
        message: err.message
      })
    }
    
    try {
      switch (QR.action) {
        case "OUTGO":
          await this.qrCodeOutgoRepository
            .createQueryBuilder('qrCodeOutgoEntity')
            .delete()
            .where('qrCodeOutgoEntity.qr_uuid = :uuid', { uuid: QR.uuid })
            .orWhere('qrCodeOutgoEntity.qr_uuid = "-1"')
            .execute()
          break;
        case "PLACE":
          await this.qrCodePlaceRepository
            .createQueryBuilder('qrCodePlaceEntity')
            .delete()
            .where('qrCodePlaceEntity.qr_uuid = :uuid', { uuid: QR.uuid })
            .execute()
          break;
        case "WRITE":
          await this.qrCodeWriteRepository
            .createQueryBuilder('qrCodeWriteEntity')
            .delete()
            .where('qrCodeWriteEntity.qr_uuid = :uuid', { uuid: QR.uuid })
            .execute()
          break;
      }

      return res.status(200).json({
        success: true
      })
    } catch(err) {
      return res.status(500).json({
        success: false,
        message: 'Server Error'
      })
    }
  }
}
