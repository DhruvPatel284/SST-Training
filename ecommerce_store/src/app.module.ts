import { Module , ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
import { CartModule } from './cart/cart.module';
import { ProductsModule } from './products/products.module';
import { Address } from './users/address.entity';
import { Product } from './products/product.entity';
import { Order } from './orders/order.entity';
import { OrderItem } from './orders/order-item.entity';
import { Cart } from './cart/cart.entity';
import { APP_PIPE, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User,Address,Product,Order,OrderItem,Cart],
      synchronize: true,
    }),
    UsersModule, 
    AuthModule, 
    OrdersModule, 
    CartModule, 
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}