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
        entities: [],
        synchronize: configService.get<boolean>('TYPEORM_SYBCHRONIZE')
    })
  }),
  AccountModule, 
  OutgoModule,
  ConfigurationModule,
  RedisModule
],
  controllers: [AppController, AccountController, OutgoController],
  providers: [AppService, AccountService, OutgoService],
})
export class AppModule {}
