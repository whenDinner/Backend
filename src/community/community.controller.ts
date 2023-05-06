import { Controller, Post, Req, Res } from '@nestjs/common';
import { CommunityService } from './community.service';

@Controller('community')
export class CommunityController {
  constructor(private communityService: CommunityService) {};

  @Post('/comment/post')
  postComment(@Req() req, @Res() res) {
    return this.communityService.postComment(req, res);
  }

  @Post('/comment/reply')
  replyComment(@Req() request, @Res() response) {
    return this.communityService.replyComment(request, response);
  }

  @Post('/post/insert')
  insertPost(@Req() request, @Res() response) {
    return this.communityService.insertPost(request, response);
  }

  @Post('/post/delete')
  deletePost(@Req() request, @Res() response) {
    return this.communityService;
  }
}
