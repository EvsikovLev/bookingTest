import { Injectable, BadRequestException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { EventEntity } from '../../database/entities';

@Injectable()
export class EventService {
  constructor() {}

  /**
   * Проверка существования записи события по eventId
   * */
  public async checkExists(
    manager: EntityManager,
    eventId: number,
  ): Promise<boolean> {
    return manager.exists(EventEntity, { where: { id: eventId } });
  }

  /**
   * Получение записи события по eventId для бронирования места
   * */
  public async getByIdForUpdate(
    em: EntityManager,
    eventId: number,
  ): Promise<EventEntity> {
    const event = await em.findOne(EventEntity, {
      where: { id: eventId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!event) {
      throw new BadRequestException(`Event with id ${eventId} does not exist`);
    }

    return event;
  }
}
