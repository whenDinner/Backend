import { Controller, Delete, Get, Post, Put, Req, Res } from '@nestjs/common';
import { QrcodeService } from './qrcode.service';

@Controller('qrcode')
export class QrcodeController {
  constructor(private qrcodeService: QrcodeService) {};

  @Get('/get')
  getInfo(@Req() req, @Res() res) {
    return this.qrcodeService.get(req, res);
  }

  @Get('/getImage')
  getImage(@Req() req, @Res() res) {
    return this.qrcodeService.getImage(req, res);
  }

  @Get('/get/codes')
  getCodes(@Req() req, @Res() res) {
    return this.qrcodeService.getCodes(req, res);
  }

  @Get('/get/place')
  getPlace(@Req() req, @Res() res) {
    return this.qrcodeService.getPlace(req, res);
  }

  @Get('/search/codes')
  searchCodes(@Req() req, @Res() res) {
    return this.qrcodeService.searchCodes(req, res);
  }

  @Put('/create')
  createQR(@Req() req, @Res() res) {
    return this.qrcodeService.createQR(req, res);
  }

  @Delete('/delete')
  deleteQR(@Req() req, @Res() res) {
    return this.qrcodeService.deleteQR(req, res);
  }

  @Get('/getInfo')
  accessQR(@Req() req, @Res() res) {
    return this.qrcodeService.getInfo(req, res);
  }

  @Get('/access/get')
  accessGet(@Req() req, @Res() res) {
    return this.qrcodeService.getAccess(req, res); 
  }

  @Delete('/access/clear')
  accessClear(@Req() req, @Res() res) {
    return this.qrcodeService.clearAccess(req, res);
  }

  @Post('/access/PLACE')
  assDrm(@Req() req, @Res() res) {
    return this.qrcodeService.accessPlace(req, res);
  }

  @Post('/access/OUTGO')
  accessOutgo(@Req() req, @Res() res) {
    return this.qrcodeService.accessOutgo(req, res);
  }

  @Post('/access/WRITE')
  accessWrite(@Req() req, @Res() res) {
    return this.qrcodeService.accessWrite(req, res);
  }
}
