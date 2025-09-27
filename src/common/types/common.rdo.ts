import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CommonRdo {
  @ApiProperty({
    description: 'Сообщение для пользователя',
    example: 'Сообщение об успешном выполнении операции',
  })
  @Expose()
  message: string;
}