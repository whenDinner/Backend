import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { QrcodeService } from './qrcode.service';

@Controller('qrcode')
export class QrcodeController {
  constructor(private qrcodeService: QrcodeService) {};

  @Get('/get')
  get(@Req() req, @Res() res) {
    return this.qrcodeService.get(req, res);
  }

  @Post('/verify')
  verify(@Req() req, @Res() res) {
    return this.qrcodeService.verify(req, res);
  }
}
