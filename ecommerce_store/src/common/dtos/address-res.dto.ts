import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from './user-res.dto';

export class AddressResponseDto {
  @Expose()
  id: number;

  @Expose()
  address: string;

  @Expose()
  district: string;

  @Expose()
  state: string;

  @Expose()
  pincode: string;

  @Expose()
  @Type(() => UserResponseDto)
  user:UserResponseDto
}
