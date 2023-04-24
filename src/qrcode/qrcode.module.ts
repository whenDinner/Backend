import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'src/utils/redis';
import { QrcodeController } from './qrcode.controller';
import { QrcodeService } from './qrcode.service';
import QRUnitEntity from 'src/entities/QRUnit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QRUnitEntity]),
    RedisModule
  ],
  exports: [TypeOrmModule],
  controllers: [QrcodeController],
  providers: [QrcodeService]
})
export class QrcodeModule {}
