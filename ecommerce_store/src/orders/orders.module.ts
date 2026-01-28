import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './order-item.entity';
import { UsersModule } from 'src/users/users.module';
import { CartModule } from 'src/cart/cart.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Order,OrderItem]),
    UsersModule,
    CartModule,
    ProductsModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService,TypeOrmModule]
})
export class OrdersModule {}
