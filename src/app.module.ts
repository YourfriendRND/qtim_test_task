import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import commonConfig from './config/common.config';
import dbConfig from './config/db.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig, commonConfig],
      envFilePath: './.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.databaseUsername'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        autoLoadEntities: false,
        migrationsRun: false,
        synchronize: false,
        logging: false,
        entities: [join(__dirname, '/../**/*.entity{.ts,.js}')],
        migrations: [join(__dirname, '/../src/migrations/*{.ts,.js}')],
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [ConfigService],
})
export class AppModule {}
