import { Controller, Delete, Get, Post, Put, Req, Res } from '@nestjs/common';
import { QrcodeService } from './qrcode.service';

@Controller('qrcode')
export class QrcodeController {
  constructor(private qrcodeService: QrcodeService) {};

  @Get('/get')
  getInfo(@Req() req, @Res() res) {
    return this.qrcodeService.get(req, res);
  }

  @Put('/create')
  createQR(@Req() req, @Res() res) {
    return this.qrcodeService.createQR(req, res);
  }

  @Delete('/delete')
  deleteQR(@Req() req, @Res() res) {
    return this.qrcodeService.deleteQR(req, res);
  }

  @Post('/getInfo')
  accessQR(@Req() req, @Res() res) {
    return this.qrcodeService.getInfo(req, res);
  }

  @Post('/access/drm')
  accessDrm(@Req() req, @Res() res) {
    return this.qrcodeService.accessDrm(req, res);
  }
}
