import { Expose } from 'class-transformer';
import { ProductResponseDto } from './product-res.dto';

export class OrderItemsResponseDto {
  @Expose()
  id: number;

  @Expose()
  total_price:number;

  @Expose()
  quantity: number;

  @Expose()
  product:ProductResponseDto;
}