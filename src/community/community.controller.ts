import { Controller, Delete, Get, Post, Req, Res } from '@nestjs/common';
import { CommunityService } from './community.service';

@Controller('community')
export class CommunityController {
  constructor(private communityService: CommunityService) {};

  @Get('/get/posts')
  getPosts(@Req() request, @Res() response) {
    return this.communityService.getPosts(request, response);
  }

  @Get('/get/post')
  getPost(@Req() request, @Res() response) {
    return this.communityService.getPost(request, response);
  }

  @Get('/search/posts')
  searchPosts(@Req() request, @Res() response) {
    return this.communityService.searchPosts(request, response);
  }

  @Post('/post/insert')
  insertPost(@Req() request, @Res() response) {
    return this.communityService.insertPost(request, response);
  }

  @Post('/post/update')
  updatePost(@Req() req, @Res() response) {
    return this.communityService.updatePost(req, response);
  }

  @Delete('/post/delete')
  deletePost(@Req() request, @Res() response) {
    return this.communityService.deletePost(request, response);
  }

  @Post('/comment/insert')
  insertComment(@Req() req, @Res() res) {
    return this.communityService.postComment(req, res);
  }
  
  @Post('/comment/reply')
  replyComment(@Req() req, @Res() res) {
    return this.communityService.replyComment(req, res);
  }

  @Delete('/comment/delete')
  deleteComment(@Req() req, @Res() res) {
    return this.communityService.deleteComment(req, res);
  }
}
