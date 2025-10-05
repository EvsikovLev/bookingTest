import { IBooking } from './booking.interface';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { EventEntity } from '../event';
import { UserEntity } from '../user';

@Entity({ name: 'booking' })
@Index(['event', 'user'], { unique: true })
export class BookingEntity implements IBooking {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => EventEntity, (event) => event.bookings)
  @JoinColumn({ name: 'event_id' })
  event: EventEntity;

  @ManyToOne(() => UserEntity, (user) => user.bookings)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
