import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './order-item.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Order,OrderItem])
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService,TypeOrmModule]
})
export class OrdersModule {}
