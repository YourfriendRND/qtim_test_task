import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import commonConfig from './config/common.config';
import dbConfig from './config/db.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import jwtConfig from './config/jwt.config';
import { SessionModule } from './modules/sessions/session.module';
import { ArticleModule } from './modules/articles/article.module';
import redisConfig from './config/redis.config';
import { CacheModule } from './modules/cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig, commonConfig, jwtConfig, redisConfig],
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
        entities: [__dirname + '/../**/*.entity.js'],
        migrations: [__dirname + '/../migrations/*.js'],
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    SessionModule,
    ArticleModule,
    CacheModule
  ],
  controllers: [],
  providers: [ConfigService],
})
export class AppModule {}
