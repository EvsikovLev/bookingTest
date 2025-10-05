import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/modules/app.module';
import { CreateReserveDTO } from '../src/modules/booking/dto/create.reserve.dto';
import { DataSource, Repository } from 'typeorm';
import {
  BookingEntity,
  EventEntity,
  UserEntity,
} from '../src/database/entities';

describe('Booking (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let userRepository: Repository<UserEntity>;
  let eventRepository: Repository<EventEntity>;
  let bookingRepository: Repository<BookingEntity>;

  let user1: UserEntity;
  let event1: EventEntity;

  let user2: UserEntity;
  let event2: EventEntity;
  let booking: BookingEntity;

  async function clearAllTables(): Promise<void> {
    const entities = [BookingEntity, UserEntity, EventEntity];
    const deletePromises: Array<any> = [];

    for (const entity of entities) {
      deletePromises.push(
        dataSource
          .createQueryBuilder()
          .delete()
          .from(entity)
          .where('id IS NOT NULL')
          .execute(),
      );
    }

    await Promise.all(deletePromises);
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    dataSource = moduleFixture.get<DataSource>(DataSource);

    userRepository = dataSource.getRepository(UserEntity);
    eventRepository = dataSource.getRepository(EventEntity);
    bookingRepository = dataSource.getRepository(BookingEntity);

    app.setGlobalPrefix('api');

    await app.init();
    await clearAllTables();

    user1 = userRepository.create({
      username: 'Test User',
    });

    user2 = userRepository.create({
      username: 'Test User2',
    });

    event1 = eventRepository.create({
      name: 'Test Event',
      totalSeats: 42,
    });

    event2 = eventRepository.create({
      name: 'Test Event2',
      totalSeats: 1,
    });

    await Promise.all([
      eventRepository.save(event1),
      eventRepository.save(event2),
      userRepository.save(user1),
      userRepository.save(user2),
    ]);

    booking = bookingRepository.create({
      event: { id: event2.id },
      user: { id: user2.id },
    });

    await bookingRepository.save(booking);
  });

  afterAll(async () => {
    await clearAllTables();
    await app.close();
  });

  it('create reserve status 201', async () => {
    return request(app.getHttpServer())
      .post('/api/bookings/reserve')
      .set('Accept', 'application/json')
      .send(<CreateReserveDTO>{ userId: user1.id, eventId: event1.id })
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        expect(res.body).toMatchObject({
          event: { id: event1.id },
          user: { id: user1.id },
        });
      });
  });

  it('create reserve status 400', async () => {
    return request(app.getHttpServer())
      .post('/api/bookings/reserve')
      .set('Accept', 'application/json')
      .send(<CreateReserveDTO>{ userId: user2.id, eventId: event2.id })
      .expect(HttpStatus.BAD_REQUEST);
  });
});
