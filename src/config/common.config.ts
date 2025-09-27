import { registerAs } from '@nestjs/config';
import {
  IsEnum,
  IsNumber,
  IsString,
} from 'class-validator';

import { ConfigNameSpaces, Environments } from 'src/common/enums';
import { validateConfig } from 'src/common/utils';

export class CommonConfig {
    @IsNumber()
    port: number;
  
    @IsString()
    @IsEnum(Environments)
    environment: string;

    @IsString()
    passwordSalt: string;
}

export default registerAs(ConfigNameSpaces.Common, () => {
    return validateConfig(CommonConfig, {
      environment: process.env.NODE_ENV ?? Environments.Local,
      port: parseInt(process.env.PORT, 10),
      passwordSalt: process.env.SALT
    });
  });
