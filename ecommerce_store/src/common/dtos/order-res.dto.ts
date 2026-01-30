import { Expose, Type } from 'class-transformer';
import { OrderStatus } from 'src/orders/order.entity';
import { AddressResponseDto } from './address-res.dto';
import { OrderItemsResponseDto } from './order-items-res.dto';
import { UserResponseDto } from './user-res.dto';

export class OrderResponseDto {
  @Expose()
  id: number;

  @Expose()
  total_amount:number;

  @Expose()
  status: OrderStatus;

  @Expose()
  order_date:Date;

  @Expose()
  user:UserResponseDto;

  @Expose()
  @Type(() => AddressResponseDto)
  address: AddressResponseDto;

  @Expose()
  @Type(() => OrderItemsResponseDto)
  order_items:OrderItemsResponseDto;
}
