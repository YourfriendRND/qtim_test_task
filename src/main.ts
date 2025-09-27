import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CommonConfig } from './config/common.config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ 
    transform: true, 
    whitelist: true 
  }));

  const port = app
    .get(ConfigService)
    .get<CommonConfig>('common').port;
  
  await app.listen(port);
}

bootstrap();
