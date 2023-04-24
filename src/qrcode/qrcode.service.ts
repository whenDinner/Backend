import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import QRUnitEntity from 'src/entities/QRUnit.entity';
import AccountEntity from 'src/entities/account.entity';
import { toString, toBuffer, toDataURL } from 'qrcode';
import { Repository } from 'typeorm';

@Injectable()
export class QrcodeService {
  constructor(
    @InjectRepository(QRUnitEntity)
    private qrUnitRepository: Repository<QRUnitEntity>
  ) {};

  async get(req: Request, res: Response) {
    const { type, dataType } = req.query
    if (!type || !dataType) return res.status(400).json({ success: false })
    else {
      try {
        const qrData = await this.qrUnitRepository.findOneByOrFail({
          type: type.toString(),
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
              message: 'invaild image type'
            })
        }
      } catch(err) {
        return res.status(500).json({
          success: false,
          message: 'Server Error' + err
        })
      }
    }
  }

  async verify(req: Request, res: Response) {
    const auth = req.headers.authorization.split(' ')[1];
    const { data } = req.body;

    
  }
}
