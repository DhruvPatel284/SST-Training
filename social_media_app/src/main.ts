import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import  cookieParser from 'cookie-parser';
import { join } from 'path';
import express from 'express';
import methodOverride from 'method-override';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(methodOverride('_method'));

  // ===== View Engine =====
  app.setViewEngine('ejs');
  app.setBaseViewsDir(join(process.cwd(), 'views'));

  //app.setBaseViewsDir(join(__dirname, '..', 'views'));

  // ===== Middleware =====
  app.use(cookieParser()); // for JWT cookies
  app.use(express.urlencoded({ extended: true })); // form data
  app.use(express.json());

  // ===== Static Files (optional) =====
  app.useStaticAssets(join(process.cwd(), 'public'));

  await app.listen(3000);
}
bootstrap();
