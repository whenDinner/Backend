import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AccountEntity from 'src/entities/account.entity';
import OutgoEntity from 'src/entities/outgo.entity';
import { RedisModule } from 'src/utils/redis';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountEntity, OutgoEntity]),
    RedisModule
  ],
  exports: [TypeOrmModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
