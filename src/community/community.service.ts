import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import AccountEntity from 'src/entities/account.entity';
import CommentsEntity from 'src/entities/community/comments.entity';
import PostsEntity from 'src/entities/community/posts.entity';
import { Repository } from 'typeorm';
import jsonwebtoken from 'src/utils/jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(PostsEntity)
    private postsRepository: Repository<PostsEntity>,
    @InjectRepository(CommentsEntity)
    private commentsRepository: Repository<CommentsEntity>,
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private configService: ConfigService
  ) {};

  async postComment(req: Request, res: Response) {
    const { postId, comment } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const verify = jsonwebtoken.verify(token, this.configService.get('JWT_SECRET'))

    const user = await this.accountRepository.findOne({
      where: { login: verify.data.login }
    })
    
    const post = await this.postsRepository.findOne({
      where: { id: postId }
    })

    try {
      if (!token) throw new Error('you should token check ( login )')
      if (!postId) throw new Error('postId is require')
      if (!post) throw new Error('That post doesn\'t exist.')
      if (!comment) throw new Error('comment is null')
      if (!verify.success) throw new Error('invaild token')
      if (!user) throw new Error('invaild token')
    } catch(err) {
      return res.status(400).json({
        success: false,
        message: err
      }) 
    }
    
    try {
      await this.commentsRepository.insert({ target: postId, comment, type: 'N', user_uuid: user.uuid, user_id: user.login })
      
      return res.status(200).json({
        success: true
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Server Error'
      })
    }
  }

  async replyComment(req: Request, res: Response) {
    const { commentId, comment } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const verify = jsonwebtoken.verify(token, this.configService.get('JWT_SECRET'))
    
    const user = await this.accountRepository.findOne({
      where: { login: verify.data.login }
    })

    const commentData = await this.commentsRepository.findOne({
      where: { id: commentId }
    })

    try {
      if (!token) throw new Error('you should token check ( login )')
      if (!commentId) throw new Error('postId is require')
      if (!commentData) throw new Error('That comment doesn\'t exist.')
      if (!comment) throw new Error('comment is null')
      if (!verify.success) throw new Error('invaild token')
      if (!user) throw new Error('invaild token')
    } catch(err) {
      return res.status(400).json({
        success: false,
        message: err.message
      }) 
    }
    
    try {
      await this.commentsRepository.insert({ target: commentId, comment, type: 'R', user_uuid: user.uuid, user_id: user.login })
      
      return res.status(200).json({
        success: true
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Server Error'
      })
    }
  }
}
