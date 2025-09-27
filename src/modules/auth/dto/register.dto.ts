import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
    @ApiProperty({
        example: 'Семен Семенович',
        description: 'Имя пользователя',
      })
      @IsString()
      name: string;
    
      @ApiProperty({
        example: 'user@example.com',
        description: 'Email пользователя',
      })
      @IsEmail()
      @IsString()
      email: string;
    
      @ApiProperty({
        example: 'password',
        description: 'Пароль пользователя',
      })
      @IsString()
      password: string;
}