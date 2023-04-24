import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountController } from './account/account.controller';
import { AccountService } from './account/account.service';
import { OutgoController } from './outgo/outgo.controller';
import { OutgoService } from './outgo/outgo.service';
import { AccountModule } from './account/account.module';
import { OutgoModule } from './outgo/outgo.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigurationModule } from './configuration/configuration.module';
import { RedisModule } from './utils/redis';
import { QrcodeController } from './qrcode/qrcode.controller';
import { QrcodeService } from './qrcode/qrcode.service';
import { QrcodeModule } from './qrcode/qrcode.module';
import AccountEntity from './entities/account.entity';
import OutgoEntity from './entities/outgo.entity';
import QRUnitEntity from './entities/QRUnit.entity';

@Module({
  imports: [TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      type: "mysql",
      host: configService.get('DATABASE_HOST'),
      port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_SCHEMA'),
        entities: [AccountEntity, OutgoEntity, QRUnitEntity],
        synchronize: configService.get<boolean>('TYPEORM_SYBCHRONIZE')
    })
  }),
  AccountModule, 
  OutgoModule,
  ConfigurationModule,
  RedisModule,
  QrcodeModule
],
  controllers: [AppController, AccountController, OutgoController, QrcodeController],
  providers: [AppService, AccountService, OutgoService, QrcodeService],
})
export class AppModule {}
