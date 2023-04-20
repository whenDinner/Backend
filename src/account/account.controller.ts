import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(
    private accountService: AccountService
  ) {};

  @Post('/login')
  login(@Req() req, @Res() res) {
    return this.accountService.login(req, res);
  }
}
