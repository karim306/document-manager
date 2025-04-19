import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  // Serve static files
  app.use('/storage', express.static(join(__dirname, '..', 'storage')));
  
  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000`);
}
bootstrap();