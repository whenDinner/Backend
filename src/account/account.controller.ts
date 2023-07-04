import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(
    private accountService: AccountService
  ) {};

  @Get('/callback')
  callback(@Req() req, @Res() res) {
    return this.accountService.callback(req, res);
  }

  @Get('/verify')
  getVerifyUser(@Req() req, @Res() res) {
    return this.accountService.getVerifyUser(req, res);
  }

  @Get('/getLogin')
  getLogin(@Res() res) {
    return this.accountService.getLogin(res);
  }

  @Get('/get/users')
  getUsers(@Req() req, @Res() res) {
    return this.accountService.getUsers(req, res);
  }

  @Get('/get/user')
  getUser(@Req() req, @Res() res) {
    return this.accountService.getUser(req, res);
  }

  @Post('/update/user')
  updateUser(@Req() req, @Res() res) {
    return this.accountService.updateUser(req, res);
  }
}
