import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AccountEntity from 'src/entities/account.entity';
import OutgoEntity from 'src/entities/outgo.entity';
import { RedisModule } from 'src/utils/redis';
import { OutgoService } from './outgo.service';
import { OutgoController } from './outgo.controller';
import CalendarEntity from 'src/entities/calendar.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountEntity, CalendarEntity, OutgoEntity]),
    MulterModule.register({}),
    RedisModule,
  ],
  exports: [TypeOrmModule],
  controllers: [OutgoController],
  providers: [OutgoService]
})
export class OutgoModule {}
