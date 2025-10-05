import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { BookingEntity } from '../../database/entities';
import { CreateReserveDTO } from './dto/create.reserve.dto';
import { UserService } from '../user/user.service';
import { EventService } from '../event/event.service';

@Injectable()
export class BookingService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly eventService: EventService,
  ) {}

  /**
   * Основной метод, позволяющий забронировать место для одного человека на одно событие
   * Сначала проверяет возможность бронирования, потом создает запись на основе CreateReserveDTO
   */
  public async reserve(data: CreateReserveDTO): Promise<BookingEntity> {
    return this.dataSource.transaction(async (em) => {
      await this.validateReservation(em, data);

      const bookingEntity = em.create(BookingEntity, {
        user: { id: data.userId },
        event: { id: data.eventId },
      });

      return em.save(BookingEntity, bookingEntity);
    });
  }

  /**
   * Вспомогательный метод проверок. Принимает entity manager и CreateReserveDTO
   */
  private async validateReservation(
    em: EntityManager,
    data: CreateReserveDTO,
  ): Promise<void> {
    const { userId, eventId } = data;
    const [isUserExists, isEventExists] = await Promise.all([
      this.userService.checkExists(em, userId),
      this.eventService.checkExists(em, eventId),
    ]);

    if (!isUserExists) {
      throw new BadRequestException(`User with id ${userId} does not exist`);
    }
    if (!isEventExists) {
      throw new BadRequestException(`Event with id ${eventId} does not exist`);
    }

    const eventEntity = await this.eventService.getByIdForUpdate(em, eventId);
    const bookingCount = await em.count(BookingEntity, {
      where: { event: { id: eventId } },
    });

    if (bookingCount >= eventEntity.totalSeats)
      throw new BadRequestException(
        `There are no available seats for event: ${eventId}`,
      );
  }
}
