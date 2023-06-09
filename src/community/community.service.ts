import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import AccountEntity from 'src/entities/account.entity';
import CommentsEntity from 'src/entities/community/comments.entity';
import PostsEntity from 'src/entities/community/posts.entity';
import { IsNull, Like, Repository } from 'typeorm';
import jsonwebtoken from 'src/utils/jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { validType } from 'src/utils/typeChecks';
import { PostType } from 'src/utils/interfaces';

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
    const { offset, limit, type } = req.query;
    const validPostTypes: PostType[] = 
      ['공지', '분실물', '게시글', '건의사항', '익명 게시판'];
    try {
      if (!offset) throw new Error('offset is required')
      if (!limit) throw new Error('limit is required')
      if (!type) throw new Error('type is required')
      if (isNaN(parseInt(limit.toString())) || parseInt(limit.toString()) <= 0) throw new Error('invalid limit')
      if (isNaN(parseInt(offset.toString())) || parseInt(offset.toString()) < 0) throw new Error('invalid offset')
      if (!validType(type, validPostTypes)) throw new Error('invalid type')
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      })
    }

    const take = parseInt(limit.toString());
    const skip = parseInt(limit.toString()) * parseInt(offset.toString());

    try {
      const posts = await this.postsRepository.find({
        where: {
          status: 1,
          type
        },
        order: {
          id: 'desc'
        },
        relations: ['author'],
        take,
        skip
      })

      const posts_cnt = await this.postsRepository.count({
        where: {
          status: 1,
          type
        },
        order: {
          id: 'desc'
        }
      })

      const formattedPosts = posts.map((post: any) => {
        const { author, ...rest } = post;
        return {
          ...rest,
          author: {
            uuid: type !== "익명 게시판" ? author.uuid : "익명",
            login: type !== "익명 게시판" ? author.login : "익명"
          },
        };
      });

      return res.status(200).json({
        success: true,
        posts: formattedPosts,
        posts_cnt
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Server Error'
      })
    }
  }

  async getCategoryInfo(req: Request, res: Response) {
    const token = req.headers.authorization.split(' ')[1];
    const verify = jsonwebtoken.verify(token, this.configService.get('JWT_SECRET'))

    const user = await this.accountRepository.findOne({
      where: {
        login: verify.data.login
      }
    })

    try {
      if (!token || !verify.success || !user) throw ({ status: 401, message: '비정상적인 토큰 입니다.' })
    } catch(err) {
      return res.status(err.status).json({
        success: false,
        message: err.message
      })
    }

    const info = []

    const noticeCount = await this.postsRepository.count({
      where: {
        type: '공지',
        status: 1
      }
    })

    const postCount = await this.postsRepository.count({
      where: {
        type: '게시글',
        status: 1
      }
    })

    const alterationCount = await this.postsRepository.count({
      where: {
        type: "분실물",
        status: 1
      }
    }) 

    const SuggestionCount = await this.postsRepository.count({
      where: {
        type: "건의사항",
        status: 1
      }
    }) 

    const AnonymousCount = await this.postsRepository.count({
      where: {
        type: "익명 게시판",
        status: 1
      }
    }) 

    info.push({
      label: "공지사항",
      value: "공지",
      count: noticeCount
    })

    info.push({
      label: "게시글",
      value: "게시글",
      count: postCount
    })

    info.push({
      label: "분실물",
      value: "분실물",
      count: alterationCount
    })

    info.push({
      label: "건의사항",
      value: "건의사항",
      count: SuggestionCount
    })

    info.push({
      label: "익명 게시판",
      value: "익명 게시판",
      count: AnonymousCount
    })

    return res.status(201).json({
      success: true,
      info
    })
  }

  async searchPosts(req: Request, res: Response) {
    const { offset, limit, type, search } = req.query;
    const validPostTypes: PostType[] = 
      ['공지', '분실물', '게시글', '건의사항', '익명 게시판'];
    try {
      if (!search) throw new Error('search is required')
      if (!offset) throw new Error('offset is required')
      if (!limit) throw new Error('limit is required')
      if (!type) throw new Error('type is required')
      if (isNaN(parseInt(limit.toString())) || parseInt(limit.toString()) <= 0) throw new Error('invalid limit')
      if (isNaN(parseInt(offset.toString())) || parseInt(offset.toString()) < 0) throw new Error('invalid offset')
      if (!validType(type, validPostTypes)) throw new Error('invalid type')
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      })
    }

    try {
      const posts = await this.postsRepository.find({
        where: [
          {
            title: Like(`%${search.toString()}%`),
            status: 1,
            type,
          },
          {
            content: Like(`%${search.toString()}%`),
            status: 1,
            type
          }
        ],
        order: {
          id: 'desc'
        },
        relations: ['author'],
        take: parseInt(limit.toString()),
        skip: (parseInt(offset.toString())) * parseInt(limit.toString())
      })

      const posts_cnt = await this.postsRepository.count({
        where: [
          {
            title: Like(`%${search.toString()}%`),
            status: 1,
            type,
          },
          {
            content: Like(`%${search.toString()}%`),
            status: 1,
            type
          }
        ],
        order: {
          id: 'desc'
        },
        relations: ['author']
      })

      const formattedPosts = posts.map((post: any) => {
        const { author, ...rest } = post;
        return {
          ...rest,
          author: {
            uuid: type !== "익명 게시판" ? author.uuid : "익명",
            login: type !== "익명 게시판" ? author.login : "익명"
          },
        };
      });

      return res.status(200).json({
        success: true,
        posts: formattedPosts,
        posts_cnt
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
      where: { id: parseInt(id.toString()) },
      relations: ['author']
    })

    const comments = await this.commentsRepository.find({
      where: { target: parseInt(id.toString()), parent_id: IsNull() },
      order: { id: 'desc' },
      relations: ['author', 'parent_id', 'childrens', 'childrens.author', 'childrens.childrens', 'childrens.childrens.author']
    })

    try {
      if (!id) throw new Error('id is required')
      if (isNaN(parseInt(id.toString()))) throw new Error('invalid id')
      if (!post) throw new Error('invalid post')
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      })
    }

    const author = post.author as any;
    const { ...postData } = post;
    
    const formattedPost = {
      ...postData,
      author: {
        uuid: post.type !== "익명 게시판" ? author.uuid : "익명",
        login: post.type !== "익명 게시판" ? author.login : "익명"
      }
    };

    function processReplies(replies: any) {
      const replyArr = [];
    
      for (const reply of replies) {
        replyArr.push({
          comment: reply.comment,
          id: reply.id,
          target: reply.target,
          type: reply.type,
          author: reply.author.uuid,
          user_id: reply.author.login,
          createdAt: reply.createdAt,
          childrens: reply.childrens ? processReplies(reply.childrens) : [], // 재귀 사용
        });
      }
    
      return replyArr;
    }
    
    
    const formattedComments = comments.map((comment: CommentsEntity | any) => {
      const { ...rest } = comment;
      return {
        ...rest,
        uuid: comment.author.uuid,
        login: comment.author.login,
        childrens: comment.childrens ? processReplies(comment.childrens) : []
      };
    });

    try {
      return res.status(200).json({
        success: true,
        post: formattedPost, 
        comments: post.type === "익명 게시판" ? "공지사항, 익명게시판에는 댓글을 달 수 없습니다." : formattedComments
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
      if (!token) throw ({ status: 400, message: 'you should token check ( login )' })
      if (!title) throw ({ status: 400, message: 'title is required' })
      if (!content) throw ({ status: 400, message: 'content is required'})
      if (!type) throw ({ status: 400, message: 'type is required'})
      if (!verify.success || !user) throw ({ status: 400, message: 'invalid token'})
      if (type == '공지') { 
        if (user.type !== 2) throw ({ status: 401, message: '공지사항은 관리자만 쓸 수 있습니다.'})
      }
    } catch (err) {
      return res.status(err.status).json({
        success: false,
        message: err.message
      })
    }

    try {
      await this.postsRepository.insert({ title, content, type, author: user.uuid })
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
      where: { id },
      relations: ['author']
    })

    const author = (post.author as any).uuid;
    const { ...postData } = post;
    
    const formattedPost = {
      ...postData,
      author
    };

    try {
      if (!id) throw ({ status: 400, message: 'id is required'})
      if (!token) throw ({ status: 400, message: 'you should token check ( login )'})
      if (!title) throw ({ status: 400, message: 'title is required'})
      if (!content) throw ({ status: 400, message: 'content is required'})
      if (!verify.success || !user) throw ({ status: 400, message: 'invalid token'})
      if (!post) throw ({ status: 400, message: 'invalid post'})
      if (formattedPost.author !== user.uuid) throw ({ status: 400, message: 'You do not have permission.'})
    } catch (err) {
      return res.status(err.status).json({
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
      where: { id },
      relations: ['author']
    })

    const author = (post.author as any).uuid;
    const { ...postData } = post;
    
    const formattedPost = {
      ...postData,
      author
    };

    try {
      if (!id) throw ({ status: 400, message:'id is required' })
      if (!token) throw({ status: 400, message: 'you should token check ( login )'})
      if (!verify.success || !user) throw ({ status: 400, message: 'invalid token'})
      if (!post) throw ({ status: 400, message: 'invalid post'})
      if (formattedPost.author !== user.uuid) throw ({ status: 401, message: 'You do not have permission.' })
    } catch (err) {
      return res.status(err.status).json({
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
    const { id, comment } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const verify = jsonwebtoken.verify(token, this.configService.get('JWT_SECRET'))

    const user = await this.accountRepository.findOne({
      where: { login: verify.data.login }
    })
    
    const post = await this.postsRepository.findOne({
      where: { id }
    })

    try {
      if (!token || !verify.success || !user) throw ({ status: 400, message: 'invalid token'})
      if (!id) throw ({ status: 400, message: 'id is required'})
      if (!comment) throw ({ status: 400, message: 'comment is null'})
      if (!post) throw ({ status: 400, message: 'That post doesn\'t exist.'})
      else {
        if (post.type === "익명 게시판" || post.type === "공지") throw ({ status: 400, message: '공지사항, 익명게시판에는 댓글을 달 수 없습니다.' })
      }
    } catch(err) {
      return res.status(err.status).json({
        success: false,
        message: err.message
      }) 
    }
    
    try {
      await this.commentsRepository.insert({ target: id, comment, type: 'N', author: user.uuid })
      
      return res.status(201).json({
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
    const { id, comment } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const verify = jsonwebtoken.verify(token, this.configService.get('JWT_SECRET'))
    
    const user = await this.accountRepository.findOne({
      where: { login: verify.data.login }
    })

    const commentData = await this.commentsRepository.findOne({
      where: { id }
    })

    try {
      if (!token) throw ({ status: 400, message: 'you should token check ( login )'})
      if (!id) throw ({ status: 400, message: 'id is required'})
      if (!commentData) throw ({ status: 400, message: 'That comment doesn\'t exist.'})
      if (!comment) throw ({ status: 400, message: 'comment is null'})
      if (!verify.success || !user) throw ({ status: 400, message: 'invalid token'})
    } catch(err) {
      return res.status(err.status).json({
        success: false,
        message: err.message
      }) 
    }
    
    try {
      await this.commentsRepository.insert({ target: commentData.target, parent_id: id, comment, type: 'R', author: user.uuid })
      
      return res.status(201).json({
        success: true
      })
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Server Error'
      })
    }
  }

  async deleteComment(req: Request, res: Response) {
    const { id } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const verify = jsonwebtoken.verify(token, this.configService.get('JWT_SECRET'))
    
    const user = await this.accountRepository.findOne({
      where: { login: verify.data.login }
    })

    const commentData = await this.commentsRepository.findOne({
      where: { id },
      relations: ['author']
    })

    const author = (commentData.author as any).uuid;
    const { ...data } = commentData;
    
    const formattedComment = {
      ...data,
      author
    };    

    try {
      if (!id) throw ({ status: 400, message: 'id is required'})
      if (!commentData) throw ({ status: 400, message: 'That comment doesn\'t exist.'})
      if (!token || !verify.success || !user) throw ({ status: 400, message: 'invalid token'})
      if (formattedComment.author === user.uuid) throw ({ status: 401, message: 'You do not have permission.' })
    } catch(err) {
      return res.status(400).json({
        success: false,
        message: err.message
      }) 
    }

    try {
      await this.commentsRepository.delete({ id })

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
