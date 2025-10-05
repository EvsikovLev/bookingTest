import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

/**
 * Документация будет доступна на /api/docs
 * */
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Booking System API')
    .setDescription('API для сервиса бронирования')
    .setVersion('1.0')
    .addTag('bookings')
    .addTag('events')
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}
