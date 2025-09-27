import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserRdo {
  @Expose()
  @ApiProperty({
    description: 'Идентификатор пользователя',
    example: '55a477df-bf7e-4470-a23e-ea374bdb8618',
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Admin',
  })
  name: string;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  @Expose()
  email: string;
}