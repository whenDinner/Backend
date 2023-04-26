import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(
    private accountService: AccountService
  ) {};

  @Get('/callback')
  getUser(@Req() req, @Res() res) {
    return this.accountService.getUser(req, res);
  }

  @Get('/verify')
  getVerifyUser(@Req() req, @Res() res) {
    return this.accountService.getVerifyUser(req, res);
  }

  @Get('/getLogin')
  getLogin(@Res() res) {
    return this.accountService.getLogin(res);
  }
}
