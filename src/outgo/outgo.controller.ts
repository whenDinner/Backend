import { Controller, Post, Req, Res } from '@nestjs/common';
import { OutgoService } from './outgo.service';

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
  updateCalendar(@Req() req, @Res() res) {
    return this.outgoService.updateCalendar(req, res);
  }
}
