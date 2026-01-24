import { Expose } from 'class-transformer';

export class PostShortResponseDto {
  @Expose()
  id: number;

  @Expose()
  content: string;
}
