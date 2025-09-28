import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CommonConfig } from './config/common.config';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ 
    transform: true, 
    whitelist: true 
  }));

  const port = app
    .get(ConfigService)
    .get<CommonConfig>('common').port;

  const config = new DocumentBuilder()
    .setTitle('Application API docs')
    .setDescription('open api documentation')
    .setVersion('1.0')
    .addTag('qtim_test_task')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(port);
}

bootstrap();
