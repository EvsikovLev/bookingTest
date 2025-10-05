import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserEntity } from '../../database/entities';

@Injectable()
export class UserService {
  constructor() {}

  /**
   * Проверка существования записи пользователя в базе данных по userId
   * */
  public async checkExists(
    em: EntityManager,
    userId: number,
  ): Promise<boolean> {
    return em.exists(UserEntity, { where: { id: userId } });
  }
}
