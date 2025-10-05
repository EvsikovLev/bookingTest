import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReserveDTO {
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @ApiProperty({ description: 'ID пользователя', example: 1 })
  eventId: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  @ApiProperty({ description: 'ID события', example: 1 })
  userId: number;
}
