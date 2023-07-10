import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import AccountEntity from 'src/entities/account.entity';
import OutgoEntity from 'src/entities/outgo.entity';
import { ScheduleModule } from '@nestjs/schedule';
import CalendarEntity from 'src/entities/calendar.entity';
import QrCodeOutgoEntity from 'src/entities/quickResponse/qrCode.outgo.entity';
import QrCodePlaceEntity from 'src/entities/quickResponse/qrCode.place.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountEntity, OutgoEntity, CalendarEntity, QrCodeOutgoEntity, QrCodePlaceEntity]),
    ScheduleModule.forRoot()
  ],
  exports: [TypeOrmModule],
  providers: [CronService]
})
export class CronModule {}
