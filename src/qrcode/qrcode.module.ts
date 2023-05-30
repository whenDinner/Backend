import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'src/utils/redis';
import { QrcodeController } from './qrcode.controller';
import { QrcodeService } from './qrcode.service';
import AccountEntity from 'src/entities/account.entity';
import QRCodeEntity from 'src/entities/quickResponse/qrCode.entity';
import QrCodeUserEntity from 'src/entities/quickResponse/qrCode.user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity, QRCodeEntity, QrCodeUserEntity]),
    RedisModule
  ],
  exports: [TypeOrmModule],
  controllers: [QrcodeController],
  providers: [QrcodeService]
})
export class QrcodeModule {}
