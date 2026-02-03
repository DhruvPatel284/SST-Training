import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import SQLiteStore from 'connect-sqlite3';
import methodOverride from 'method-override';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';


const SQLiteStoreSession = SQLiteStore(session);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(methodOverride('_method'));

 // ===== View Engine =====
  app.setViewEngine('ejs');
  app.setBaseViewsDir(join(process.cwd(), 'views'));
  app.use(
    session({
      name: 'sid',
      store: new SQLiteStoreSession({
        db: 'sessions.sqlite',
        dir: './',
      }),
      secret: 'secret-key', 
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 2, 
      },
    }),
  );
   // ===== Static Files (optional) =====
  app.useStaticAssets(join(__dirname, '..', 'public'));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
