import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { join } from 'path';
import { ConfigService, ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('PG_USER'),
  password: configService.get('PG_PASSWORD'),
  database: configService.get('PG_DATABASE'),
  synchronize: false,
  logging: false,
  entities: [join(__dirname, '/../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '/../src/migrations/*{.ts,.js}')],
  cache: false,
});
