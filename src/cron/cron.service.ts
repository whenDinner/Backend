import { CACHE_MANAGER, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import AccountEntity from 'src/entities/account.entity';
import CalendarEntity from 'src/entities/calendar.entity';
import OutgoEntity from 'src/entities/outgo.entity';
import { Between, Repository } from 'typeorm';

@Injectable()
export class CronService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
    @InjectRepository(CalendarEntity)
    private dateRepository: Repository<CalendarEntity>,
    @InjectRepository(OutgoEntity)
    private outgoRepository: Repository<OutgoEntity>,
    private configService: ConfigService
  ) {};
  
  @Cron(CronExpression.EVERY_MINUTE)
  async resetOutgo() {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const alluser = await this.accountRepository.find();
    
    const date = await this.dateRepository.findOne({
      where: {
        date: Between(today, nextWeek)
      },
      order: {
        date: 'desc'
      }
    })

    if (!date) return

    for(const user of alluser) {
      this.outgoRepository.insert({ user_id: user.login, student_id: user.student_id, type: 0, outgoDate: date.date })
    }
  }
}
