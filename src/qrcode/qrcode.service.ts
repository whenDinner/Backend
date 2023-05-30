import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import AccountEntity from 'src/entities/account.entity';
import { toString, toBuffer, toDataURL } from 'qrcode';
import { Repository } from 'typeorm';
import jsonwebtoken from 'src/utils/jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import QRCodeEntity from 'src/entities/quickResponse/qrCode.entity';
import QrCodeUserEntity from 'src/entities/quickResponse/qrCode.user.entity';

@Injectable()
export class QrcodeService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
    @InjectRepository(QRCodeEntity)
    private qrCodeRepository: Repository<QRCodeEntity>,
    @InjectRepository(QrCodeUserEntity)
    private qrCodeUserRepository: Repository<QrCodeUserEntity>,
    @Inject(CACHE_MANAGER)
    private configService: ConfigService
  ) {};

  async get(req: Request, res: Response) {
    const { name, dataType } = req.query;
    const QR = await this.qrCodeRepository.findOne({
      where: {
        name: name.toString()
      }
    })

    try {
      if (!name) throw ({ status: 400, message: 'Quick Response 코드의 이름을 입력해주세요.' })
      if (!dataType) throw ({ status: 400, message: 'Quick Response코드의 데이터 타입을 입력해주세요.' })
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
          data: await toBuffer(QR.href)
        })
      case "todataurl":
        return res.status(200).json({
          success: true,
          data: await toDataURL(QR.href)
        })
      case "tostring":
        return res.status(200).json({
          success: true,
          data: await toString(QR.href)
        })
      default:
        return res.status(400).json({
          success: false,
          message: 'Quick Response코드의 데이터 타입이 올바르지 않습니다.'
        })
    }
  }

  async accessQR(req: Request, res: Response) {
    const name = req.body.name

    const token = req.headers.authorization.split(' ')[1];
    const verify = jsonwebtoken.verify(token, this.configService.get('JWT_SECRET'));

    const user = await this.accountRepository.findOne({
      where: { login: verify.data.login }
    })

    try {
      if (!name) throw ({ status: 400, message: 'name을 입력해주세요.' })
      if (!token || !verify || !user) throw ({ status: 400, message: 'invalid token' })
    } catch(err) {
      return res.status(err.status).json({
        success: false,
        message: err.message
      })
    }
  }
}
