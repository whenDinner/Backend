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
  
  async getPosts(req: Request, res: Response) {
    const { offset, limit } = req.query

    try {
      if (!offset) throw new Error('offset is required')
      if (!limit) throw new Error('limit is required')
      if (isNaN(parseInt(limit.toString()))) throw new Error('invaild limit')
      if (isNaN(parseInt(offset.toString()))) throw new Error('invaild offset')
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      })
    }

    try {
      const posts = await this.postsRepository.find({
        where: {
          status: 1
        },
        order: {
          id: 'desc'
        },
        take: parseInt(limit.toString()),
        skip: parseInt(offset.toString())
      })

      return res.status(200).json({
        success: true,
        posts
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Server Error'
      })
    }
  }

  async getPost(req: Request, res: Response) {
    const { id } = req.query;
    
    const post = await this.postsRepository.findOne({
      where: { id: parseInt(id.toString()) }
    })

    const comments = await this.commentsRepository.find({
      where: { target: parseInt(id.toString()) },
      order: { id: 'desc' }
    })

    try {
      if (!id) throw new Error('id is required')
      if (isNaN(parseInt(id.toString()))) throw new Error('invaild id')
      if (!post) throw new Error('invaild post')
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      })
    }

    try {
      return res.status(200).json({
        success: true,
        post, comments
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Server Error'
      })
    }
  }

  async insertPost(req: Request, res: Response) {
    const { title, content, type } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const verify = jsonwebtoken.verify(token, this.configService.get('JWT_SECRET'))

    const user = await this.accountRepository.findOne({
      where: { login: verify.data.login }
    })

    try {
      if (!token) throw new Error('you should token check ( login )')
      if (!title) throw new Error('title is required')
      if (!content) throw new Error('content is required')
      if (!type) throw new Error('type is required')
      if (!verify.success) throw new Error('invaild token')
      if (!user) throw new Error('invaild token')
      if (type == '공지') { 
        if (user.type !== 2) throw new Error('공지사항은 관리자만 쓸 수 있습니다.')
      }

    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      })
    }

    try {
      await this.postsRepository.insert({ title, content, type, user_id: user.login, user_uuid: user.uuid })
      return res.status(200).json({ success: true })
    } catch (err) {
      return res.status(500).json({ 
        success: false,
        message: 'Server Error' 
      })
    }
  }

  async updatePost(req: Request, res: Response) {
    const { title, content, id } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const verify = jsonwebtoken.verify(token, this.configService.get('JWT_SECRET'))

    const user = await this.accountRepository.findOne({
      where: { login: verify.data.login }
    })

    const post = await this.postsRepository.findOne({
      where: { id }
    })

    try {
      if (!id) throw new Error('id is required')
      if (!token) throw new Error('you should token check ( login )')
      if (!title) throw new Error('title is required')
      if (!content) throw new Error('content is required')
      if (!verify.success) throw new Error('invaild token')
      if (!user) throw new Error('invaild token')
      if (!post) throw new Error('invaild post')
      if (post.user_uuid !== user.uuid) throw new Error('invaild post')
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      })
    }

    try {
      post.title = title;
      post.content = content;
      await this.postsRepository.save(post);
      
      return res.status(200).json({ success: true })
    } catch (err) {
      return res.status(500).json({ 
        success: false,
        message: 'Server Error' 
      })
    }
  }

  async deletePost(req: Request, res: Response) {
    const { id } = req.body
    const token = req.headers.authorization.split(' ')[1];
    const verify = jsonwebtoken.verify(token, this.configService.get('JWT_SECRET'))

    const user = await this.accountRepository.findOne({
      where: { login: verify.data.login }
    })

    const post = await this.postsRepository.findOne({
      where: { id }
    })

    try {
      if (!id) throw new Error('id is required')
      if (!token) throw new Error('you should token check ( login )')
      if (!verify.success) throw new Error('invaild token')
      if (!user) throw new Error('invaild token')
      if (!post) throw new Error('invaild post')
      if (post.user_uuid !== user.uuid) throw new Error('invaild post')
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      })
    }

    try {
      post.status = 0
      await this.postsRepository.save(post);
      
      return res.status(200).json({ success: true })
    } catch (err) {
      return res.status(500).json({ 
        success: false,
        message: 'Server Error' 
      })
    }
  }
 
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
      if (!postId) throw new Error('postId is required')
      if (!post) throw new Error('That post doesn\'t exist.')
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
      if (!commentId) throw new Error('postId is required')
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
