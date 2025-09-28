import { Redis } from 'ioredis';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';

import redisConfig from 'src/config/redis.config';
import { CacheService } from './cache.service';
import { ModuleTokens } from 'src/common/enums';

@Global()
@Module({
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {
  static forRoot(): DynamicModule {
    return {
      module: CacheModule,
      imports: [ConfigModule.forFeature(redisConfig)],
      providers: [
        {
          provide: ModuleTokens.RedisClient,
          inject: [redisConfig.KEY],
          useFactory: (config: ConfigType<typeof redisConfig>) => {
            return new Redis(config.port, config.host, {
              username: config.user,
              password: config.password,
            });
          },
        },
      ],
      exports: [ModuleTokens.RedisClient],
    };
  }
}
