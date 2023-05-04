import { Controller, Post, Req, Res } from '@nestjs/common';
import { CommunityService } from './community.service';

@Controller('community')
export class CommunityController {
  constructor(private communityService: CommunityService) {};

  @Post('/comment')
  postComment(@Req() req, @Res() res) {
    
  }
}
