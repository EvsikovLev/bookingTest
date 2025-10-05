import { Body, Controller, Post } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateReserveDTO } from './dto/create.reserve.dto';
import { IBooking } from '../../database/entities';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('reserve')
  async reserve(@Body() data: CreateReserveDTO): Promise<IBooking> {
    return this.bookingService.reserve(data);
  }
}
