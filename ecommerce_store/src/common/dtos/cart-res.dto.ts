import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from './user-res.dto';
import { ProductResponseDto } from './product-res.dto';

export class CartItemResponseDto {
  @Expose()
  id: number;

  @Expose()
  quantity: number;

  @Expose()
  @Type(() => UserResponseDto)
  user?: UserResponseDto;

  @Expose()
  @Type(() => ProductResponseDto)
  product?: ProductResponseDto;
}
