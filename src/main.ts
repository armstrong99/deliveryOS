import { config } from 'dotenv';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
// import { join } from 'path';
// import { readFileSync } from 'fs';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
config();

async function bootstrap() {

  let app: NestExpressApplication;

  app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  (global as typeof global & { app: any }).app = app;

  const PORT = process.env.PORT || 1720;

//   const config = new DocumentBuilder()
//   .setTitle('DeliveryOS API')
//   .setDescription('Senior Backend Engineer - Ndukwe Armstrong')
//   .setVersion('1.0')
//   .addTag('deliveryOS')
//   .build();
// const document = SwaggerModule.createDocument(app, config);
// SwaggerModule.setup('api', app, document);

  await app.listen(PORT, () => {
    console.log('server is listening on port 🔥', PORT);
  });
}

bootstrap();
