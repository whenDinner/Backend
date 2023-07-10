import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'src/utils/redis';
import { QrcodeController } from './qrcode.controller';
import { QrcodeService } from './qrcode.service';
import AccountEntity from 'src/entities/account.entity';
import QRCodeEntity from 'src/entities/quickResponse/qrCode.entity';
import CalendarEntity from 'src/entities/calendar.entity';
import QrCodeWriteEntity from 'src/entities/quickResponse/qrCode.write.entity';
import QrCodeOutgoEntity from 'src/entities/quickResponse/qrCode.outgo.entity';
import QrCodePlaceEntity from 'src/entities/quickResponse/qrCode.place.entity';
import OutgoEntity from 'src/entities/outgo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity, QRCodeEntity, QrCodeWriteEntity, QrCodeOutgoEntity, QrCodePlaceEntity, CalendarEntity, OutgoEntity]),
    RedisModule
  ],
  exports: [TypeOrmModule],
  controllers: [QrcodeController],
  providers: [QrcodeService]
})
export class QrcodeModule {}
