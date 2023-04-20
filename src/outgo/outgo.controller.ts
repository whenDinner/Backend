import { Controller } from '@nestjs/common';
import { OutgoService } from './outgo.service';

@Controller('outgo')
export class OutgoController {
  constructor(
    private outgoService: OutgoService
  ) {};
}
