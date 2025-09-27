import { registerAs } from '@nestjs/config';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { ConfigNameSpaces, Environments } from 'src/common/enums';
import { validateConfig } from 'src/common/utils';

export class CommonConfig {
    @IsNotEmpty()
    @IsNumber()
    @Min(3000)
    @Max(65535)
    port: number;
  
    @IsString()
    @IsNotEmpty()
    @IsEnum(Environments)
    environment: string;
}

export default registerAs(ConfigNameSpaces.Common, () => {
    return validateConfig(CommonConfig, {
      environment: process.env.NODE_ENV ?? Environments.Local,
      port: parseInt(process.env.PORT, 10),
    });
  });
