import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { QrcodeService } from './qrcode.service';

@Controller('qrcode')
export class QrcodeController {
  constructor(private qrcodeService: QrcodeService) {};

  @Get('/getInfo')
  getInfo(@Req() req, @Res() res) {
    return this.qrcodeService.get(req, res);
  }

  @Post('/create/QR')
  createQR(@Req() req, @Res() res) {

  }

  @Post('/delete/QR')
  deleteQR(@Req() req, @Res() res) {
     
  }

  @Post('/access/QR')
  accessQR(@Req() req, @Res() res) {
    
  }

  @Post('/access/bus')
  accessBus(@Req() req, @Res() res) {
    
  }

  @Post('/access/drm')
  accessDrm(@Req() req, @Res() res) {
    
  }
}
