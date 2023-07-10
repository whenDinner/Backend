import { Controller, Delete, Get, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { OutgoService } from './outgo.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('outgo')
export class OutgoController {
  constructor(
    private readonly outgoService: OutgoService
  ) {};

  @Post('/set')
  setOutgo(@Req() request, @Res() response) {
    return this.outgoService.setOutgo(request, response);
  }

  @Post('/update/calendar')
  @UseInterceptors(FileInterceptor('file'))
  updateCalendar(@Req() req, @Res() res, @UploadedFile() file: Express.Multer.File) {
    return this.outgoService.updateCalendar(req, res, file);
  }

  @Post('/set/rh')
  updateRh(@Req() req, @Res() res) {
    return this.outgoService.updateRh(req, res);
  }

  @Get('/get/calendars')
  getCalendars(@Req() req, @Res() res) {
    return this.outgoService.getCalendars(req, res);
  }

  @Get('/get/calendar')
  getCalendar(@Req() req, @Res() res) {
    return this.outgoService.getCalendar(req, res);
  }

  @Delete('/clear/calendar')
  clearCalendar(@Req() req, @Res() res) {
    return this.outgoService.clearCalendar(req, res);
  }
}
