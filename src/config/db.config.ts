import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { registerAs } from '@nestjs/config';

import { ConfigNameSpaces } from 'src/common/enums';
import { validateConfig } from 'src/common/utils';

export class DatabaseConfig {
  @IsString()
  @IsNotEmpty()
  host: string;

  @IsNotEmpty()
  @IsNumber()
  port: number;

  @IsString()
  @IsNotEmpty()
  databaseUsername: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  database: string;
}

export default registerAs(ConfigNameSpaces.Database, () =>
  validateConfig(DatabaseConfig, ({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    databaseUsername: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
  })),
);