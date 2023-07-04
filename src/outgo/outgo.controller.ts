import { Controller, Get, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
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

  @Get('/get/calendar')
  getCalendar(@Req() req, @Res() res) {
    return this.outgoService.getCalendar(req, res);
  }
}
