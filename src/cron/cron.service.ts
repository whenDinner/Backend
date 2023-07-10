import { CACHE_MANAGER, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import AccountEntity from 'src/entities/account.entity';
import CalendarEntity from 'src/entities/calendar.entity';
import OutgoEntity from 'src/entities/outgo.entity';
import QrCodeOutgoEntity from 'src/entities/quickResponse/qrCode.outgo.entity';
import QrCodePlaceEntity from 'src/entities/quickResponse/qrCode.place.entity';
import { LessThanOrEqual, MoreThan, Repository } from 'typeorm';

@Injectable()
export class CronService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
    @InjectRepository(CalendarEntity)
    private calendarRepository: Repository<CalendarEntity>,
    @InjectRepository(OutgoEntity)
    private outgoRepository: Repository<OutgoEntity>,
    @InjectRepository(QrCodePlaceEntity)
    private qrCodePlaceRepository: Repository<QrCodePlaceEntity>,
    @InjectRepository(QrCodeOutgoEntity)
    private qrCodeOutgoRepository: Repository<QrCodeOutgoEntity>,
    private configService: ConfigService
  ) {};

  @Cron(CronExpression.EVERY_MINUTE)
  async pushOutgo2() {
    const today = new Date();
    const alluser = await this.accountRepository.find();
    
    const calendar = await this.calendarRepository.findOne({
      where: {
        date: LessThanOrEqual(today)
      },
      order: {
        date: 'DESC',
      },
    });

    const nextCalendar = await this.calendarRepository.findOne({
      where: {
        date: MoreThan(today),
      },
      order: {
        date: 'ASC',
      },
    });

    if (!calendar) return
    
    alluser.map(async(user: AccountEntity) => {
      const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

      const lessUserData = await this.outgoRepository.createQueryBuilder('outgo')
        .leftJoinAndSelect('outgo.author', 'user')
        .where('outgo.author = :user', { user: user.uuid })
        .andWhere('outgo.outgoDate = :outgoDate', { outgoDate: calendar.date })
        .getOne()

      const moreUserData = await this.outgoRepository.createQueryBuilder('outgo')
        .leftJoinAndSelect('outgo.author', 'user')
        .where('outgo.author = :user', { user: user.uuid })
        .andWhere('outgo.outgoDate = :outgoDate', { outgoDate: nextCalendar.date })
        .getOne()
        
      const dayOfWeek = daysOfWeek[today.getDay()];
      
      if (!moreUserData && user.rh === 1 && user.type === 0) await this.outgoRepository.insert({ author: user.uuid, user_id: user.login, outgoDate: nextCalendar.date })
      
      if (user.type === 0 && dayOfWeek === "일") {
        if (lessUserData) {
          if (user.gs >= 2) await this.qrCodeOutgoRepository.insert({ qr_uuid: '-1', author: user.uuid, user_id: user.login })
        } else {
          if (user.rh === 2) await this.qrCodeOutgoRepository.insert({ qr_uuid: '-1', author: user.uuid, user_id: user.login })
        }
      }
    })
  }

  @Cron('0 10 22 * * *')
  async deletePlace() {
    await this.qrCodePlaceRepository
      .createQueryBuilder('qrCodePlaceEntity')
      .delete()
      .execute()
  }

  @Cron('1 0 0 * * 1')
  async deleteOutgo() {
    await this.qrCodeOutgoRepository
      .createQueryBuilder('qrCodeOutgoEntity')
      .delete()
      .where('qrCodeOutgoEntity.qr_uuid = "-1"')
      .execute()
    
  }
}
