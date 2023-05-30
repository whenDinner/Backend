import { CACHE_MANAGER, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import AccountEntity from 'src/entities/account.entity';
import CalendarEntity from 'src/entities/calendar.entity';
import OutgoEntity from 'src/entities/outgo.entity';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class CronService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
    @InjectRepository(CalendarEntity)
    private calendarRepository: Repository<CalendarEntity>,
    @InjectRepository(OutgoEntity)
    private outgoRepository: Repository<OutgoEntity>,
    private configService: ConfigService
  ) {};
  
  @Cron(CronExpression.EVERY_MINUTE)
  async resetOutgo() {
    const alluser = await this.accountRepository.find();
    
    const calendar = await this.calendarRepository.findOne({
      where: {
        date: MoreThan(new Date()),
      },
      order: {
        date: 'ASC',
      },
    });

    if (!calendar) return

    alluser.map(async(user: AccountEntity, index: number) => {
      const userData = await this.outgoRepository.createQueryBuilder('outgo')
        .leftJoinAndSelect('outgo.user_uuid', 'user')
        .where('outgo.user_uuid = :user', { user: user.uuid })
        .andWhere('outgo.outgoDate = :outgoDate', { outgoDate: calendar.date })
        .getOne();

      if (!userData) {
        await this.outgoRepository.insert({ user_uuid: user.uuid, user_id: user.login, outgoDate: calendar.date })
      }
    })
  }
}
