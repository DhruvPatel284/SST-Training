import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import SQLiteStore from 'connect-sqlite3';

const SQLiteStoreSession = SQLiteStore(session);


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
