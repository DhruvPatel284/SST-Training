import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../common/dtos/user-response.dto';
import { PostShortResponseDto } from '../../common/dtos/post-short-response.dto';

export class CreateCommentResDto {
  @Expose()
  id: number;

  @Expose()
  comment: string;

  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @Expose()
  @Type(() => PostShortResponseDto)
  post: PostShortResponseDto;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
