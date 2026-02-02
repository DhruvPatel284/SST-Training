import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../../common/dtos/user-response.dto';

export class CreatePostResDto {
  @Expose()
  id: number;

  @Expose()
  content: string;

  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
