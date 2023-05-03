import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import QRUnitEntity from 'src/entities/QRUnit.entity';
import AccountEntity from 'src/entities/account.entity';
import { toString, toBuffer, toDataURL } from 'qrcode';
import { Repository } from 'typeorm';
import QRIterEntity from 'src/entities/QRIter.entity';
import jsonwebtoken from 'src/utils/jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QrcodeService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
    @InjectRepository(QRUnitEntity)
    private qrUnitRepository: Repository<QRUnitEntity>,
    @InjectRepository(QRIterEntity)
    private qrIterRepository: Repository<QRIterEntity>,
    @Inject(CACHE_MANAGER)
    private configService: ConfigService
  ) {};

  async get(req: Request, res: Response) {
    const { data, type, dataType } = req.query
    if (!data || !type || !dataType) 
      return res.status(400).json({ 
        success: false,
        message: 'required query'
      })
    else {
      try {
        const qrData = await this.qrUnitRepository.findOne({
          where: {
            data: data.toString(),
            type: type.toString(),
          }
        })

        if (!qrData) 
          return res.status(400).json({
            success: false,
            message: 'invaild QR Code'
          })

        switch(dataType.toString().toLowerCase()) {
          case "tobuffer":
            return res.status(200).json({
              success: true,
              data: await toBuffer(qrData.data)
            })
          case "todataurl":
            return res.status(200).json({
              success: true,
              data: await toDataURL(qrData.data)
            })
          case "tostring":
            return res.status(200).json({
              success: true,
              data: await toString(qrData.data)
            })
          default:
            return res.status(400).json({
              success: false,
              message: 'invaild data type'
            })
        }
      } catch(err) {
        return res.status(500).json({
          success: false,
          message: 'Server Error'
        })
      }
    }
  }

  async verify(req: Request, res: Response) {
    const auth = req.headers.authorization.split(' ')[1];
    const { data, type } = req.body;
    console.log(auth, data, type)
    if (!auth || !type || !data)
      return res.status(400).json({ 
        success: false,
        message: 'required data'
      })

    try {
      const user = jsonwebtoken.verify(auth, this.configService.get('JWT_SECRET'));
      if (!user.success) 
        return res.status(401).json({
          success: false,
          message: 'invaild token'
        })

      const qrData = await this.qrUnitRepository.findOne({
        where: {
          data: data,
          type: type,
        }
      })

      if (!qrData) 
        return res.status(400).json({
          success: false,
          message: 'invaild QR Data'
        })
      else {
        const date = new Date()
        date.setHours(0, 0, 0, 0);

        const qrIter = await this.qrIterRepository.findOne({
          where: { 
            student_id: user.data.student_id,
            student_name: user.data.fullname,
            data: qrData.data,
            type: qrData.type,
            createdAt: date 
          } 
        });

        if (!qrIter) {
          await this.qrIterRepository.insert({
            student_id: user.data.student_id,
            student_name: user.data.fullname,
            status: true,
            data: qrData.data,
            type: qrData.type,
            createdAt: date
          })
        } else {
          qrIter.status = !qrIter.status
          await this.qrIterRepository.save(qrIter);
        }

        return res.status(200).json({
          success: true,
          message: '정상적으로 처리 되었습니다.'
        })
      }
    } catch(err) {
      return res.status(500).json({
        success: false,
        message: 'Server Error'
      })
    }
  }
}
