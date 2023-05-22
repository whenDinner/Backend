import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import AccountEntity from 'src/entities/account.entity';
import PostsEntity from 'src/entities/community/posts.entity';
import CommentsEntity from 'src/entities/community/comments.entity';
import { RedisModule } from 'src/utils/redis';
import DateEntity from 'src/entities/calendar.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountEntity, PostsEntity, CommentsEntity, DateEntity]), 
    RedisModule
  ],
  exports: [TypeOrmModule],
  controllers: [CommunityController],
  providers: [CommunityService]
})
export class CommunityModule {}
