import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';

import { ConfigNameSpaces } from 'src/common/enums';
import { validateConfig } from 'src/common/utils';
import { IsCorrectTime } from 'src/common/decorators';

export class JwtConfig {
  @IsString()
  secret: string;

  @IsString()
  @IsCorrectTime()
  expiresIn: string;

  @IsString()
  refreshSecret: string;

  @IsString()
  @IsCorrectTime()
  refreshExpiresIn: string;
}

export default registerAs(ConfigNameSpaces.Jwt, () => {
  return validateConfig(JwtConfig, {
    secret: process.env.APPLICATION_JWT_SECRET,
    expiresIn: process.env.APPLICATION_JWT_EXPIRES_IN,
    refreshSecret: process.env.APPLICATION_JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.APPLICATION_JWT_REFRESH_EXPIRES_IN,
  });
});