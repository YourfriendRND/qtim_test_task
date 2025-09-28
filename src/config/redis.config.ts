import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { registerAs } from '@nestjs/config';
import { Transform } from 'class-transformer';

import { ConfigNameSpaces } from 'src/common/enums';
import { parseTimeToSeconds, validateConfig } from 'src/common/utils';
import { IsCorrectTime } from 'src/common/decorators';


export class RedisConfig {
  @IsNotEmpty()
  @IsString()
  host: string;

  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  port: number;

  @IsNotEmpty()
  @IsString()
  user: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsCorrectTime()
  _humanizeTtl: string; 

  ttl: number; 
}

export default registerAs(ConfigNameSpaces.Redis, () => {
    const validationResult =  validateConfig(RedisConfig, {
      host: process.env.REDIS_HOST || 'redis',
      port: process.env.REDIS_PORT || '6379',
      user: process.env.REDIS_USER,
      password: process.env.REDIS_PASSWORD,
      _humanizeTtl: process.env.REDIS_TTL || '1h'
    });

    validationResult.ttl = parseTimeToSeconds(validationResult._humanizeTtl);

    return validationResult;
});