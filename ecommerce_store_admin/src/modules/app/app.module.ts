import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NestLensModule } from 'nestlens';

import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { RequestIdMiddleware } from 'src/common/middlewares/request-id.middleware';
import { ViewLocalsMiddleware } from 'src/common/middlewares/view-locals.middleware';

import databaseConfig from '../../common/config/database.config';
import passportConfig from '../../common/config/passport.config';
import { AppDataSource } from '../../data-source';
import { AuthModule } from '../auth/auth.module';
import { OauthAccessTokenModule } from '../oauth-access-token/oauth-access-token.module';
import { UsersModule } from '../users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from '../products/products.module';
import { OrdersModule } from '../orders/orders.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    NestLensModule.forRoot({
      enabled: process.env.NODE_ENV != 'production',
      storage: { driver: 'memory' }, // default
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, passportConfig],
    }),
     ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    AuthModule,
    UsersModule,
    OauthAccessTokenModule,
    ProductsModule,
    OrdersModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    AppService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ViewLocalsMiddleware)
      .exclude('/api/*path', '/assets/*path')
      .forRoutes('*');

    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
