import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { EventModule } from '../event/event.module';
import { UserModule } from '../user/user.module';
import { BookingService } from './booking.service';

@Module({
  imports: [UserModule, EventModule],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
